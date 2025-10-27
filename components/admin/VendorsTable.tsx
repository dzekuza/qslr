'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Ban, CheckCircle2, Eye, MoreVertical, Search, XCircle } from 'lucide-react';
import { updateVendorStatus } from '@/lib/actions/admin';

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

interface VendorsTableProps {
    vendors: Vendor[];
}

export function VendorsTable({ vendors: initialVendors }: VendorsTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [vendors, setVendors] = useState(initialVendors);

    const handleStatusChange = async (vendorId: string, newStatus: string) => {
        try {
            await updateVendorStatus(vendorId, newStatus);
            // Revalidate path is handled by the server action, but we can optimistically update or refetch if needed
            // For now, relying on revalidatePath in the server action
            setVendors(prevVendors =>
                prevVendors.map(vendor =>
                    vendor.id === vendorId ? { ...vendor, status: newStatus as Vendor['status'] } : vendor
                )
            );
        } catch (error) {
            console.error("Error updating vendor status:", error);
            // Optionally, revert optimistic update or show an error message
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

    return (
        <>
            {/* Search Section */}
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
        </>
    );
}