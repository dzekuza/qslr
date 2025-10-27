"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Ban,
    CheckCircle2,
    Eye,
    Filter,
    MoreVertical,
    Search,
    XCircle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Vendor {
    id: string;
    businessName: string;
    businessEmail: string;
    businessPhone: string | null;
    status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
    createdAt: string;
    approvedAt: string | null;
    user: {
        name: string | null;
        email: string;
    };
}

export default function VendorsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        if (session.user.role !== "ADMIN") {
            router.push("/unauthorized");
            return;
        }

        fetchVendors();
    }, [session, status, router]);

    const fetchVendors = async () => {
        try {
            const response = await fetch("/api/admin/vendors");
            if (response.ok) {
                const data = await response.json();
                setVendors(data);
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (vendorId: string, newStatus: string) => {
        try {
            const response = await fetch(
                `/api/admin/vendors/${vendorId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                },
            );

            if (response.ok) {
                fetchVendors(); // Refresh the list
            }
        } catch (error) {
            console.error("Error updating vendor status:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Approved
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                    </Badge>
                );
            case "SUSPENDED":
                return (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        Suspended
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Rejected
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const filteredVendors = vendors.filter((vendor) =>
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.businessEmail.toLowerCase().includes(
            searchQuery.toLowerCase(),
        ) ||
        vendor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Vendor Management" />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/admin">
                                    Admin
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Vendors</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Vendor Management
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage and approve vendor applications
                                </p>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search vendors by name, email, or business..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        {/* Vendors Table */}
                        <div className="rounded-md border">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Business Name
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Contact
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Phone
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Status
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Registered
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredVendors.length === 0
                                            ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="h-24 text-center text-muted-foreground"
                                                    >
                                                        No vendors found
                                                    </td>
                                                </tr>
                                            )
                                            : (
                                                filteredVendors.map((
                                                    vendor,
                                                ) => (
                                                    <tr
                                                        key={vendor.id}
                                                        className="border-b transition-colors hover:bg-muted/50"
                                                    >
                                                        <td className="p-4 align-middle">
                                                            <div className="font-medium">
                                                                {vendor
                                                                    .businessName}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {vendor
                                                                    .businessEmail}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="font-medium">
                                                                {vendor
                                                                    .user
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {vendor
                                                                    .user
                                                                    ?.email}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-sm">
                                                            {vendor
                                                                .businessPhone ||
                                                                "N/A"}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            {getStatusBadge(
                                                                vendor
                                                                    .status,
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-middle text-sm">
                                                            {new Date(
                                                                vendor
                                                                    .createdAt,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <span className="sr-only">
                                                                            Open
                                                                            menu
                                                                        </span>
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                vendor
                                                                                    .id,
                                                                                "APPROVED",
                                                                            )}
                                                                        disabled={vendor
                                                                            .status ===
                                                                            "APPROVED"}
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                vendor
                                                                                    .id,
                                                                                "REJECTED",
                                                                            )}
                                                                        disabled={vendor
                                                                            .status ===
                                                                            "REJECTED"}
                                                                    >
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Reject
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                vendor
                                                                                    .id,
                                                                                "SUSPENDED",
                                                                            )}
                                                                        disabled={vendor
                                                                            .status ===
                                                                            "SUSPENDED"}
                                                                    >
                                                                        <Ban className="mr-2 h-4 w-4" />
                                                                        Suspend
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            router
                                                                                .push(
                                                                                    `/admin/vendors/${vendor.id}`,
                                                                                )}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                        Details
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
