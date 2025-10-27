"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Building2,
    Eye,
    MapPin,
    MoreVertical,
    Phone,
    Search,
    User,
    Warehouse,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Warehouse {
    id: string;
    vendorId: string;
    name: string;
    country: string;
    street: string;
    city: string;
    zipCode: string;
    apartment: string | null;
    contactName: string;
    email: string;
    phone: string;
    address: string | null;
    state: string | null;
    postalCode: string | null;
    isActive: boolean | null;
    cifPrice: number | null;
    cifCurrency: string | null;
    exwPrice: number | null;
    exwCurrency: string | null;
    fcaPrice: number | null;
    fcaCurrency: string | null;
    deliveryCountries: string[];
    createdAt: string;
    updatedAt: string;
    vendor: {
        id: string;
        businessName: string;
        businessEmail: string;
        businessPhone: string | null;
        status: string;
        user: {
            name: string | null;
            email: string;
        };
    };
}

interface WarehousesTableProps {
    warehouses: Warehouse[];
}

export function WarehousesTable({ warehouses }: WarehousesTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const getStatusBadge = (isActive: boolean | null) => {
        if (isActive === true) {
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                </Badge>
            );
        } else if (isActive === false) {
            return (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Inactive
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    Unknown
                </Badge>
            );
        }
    };

    const getVendorStatusBadge = (status: string) => {
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

    const formatAddress = (warehouse: Warehouse) => {
        const parts = [
            warehouse.street,
            warehouse.apartment,
            warehouse.city,
            warehouse.state,
            warehouse.zipCode,
            warehouse.country,
        ].filter(Boolean);
        return parts.join(", ");
    };

    const filteredWarehouses = warehouses.filter((warehouse) => {
        const matchesSearch =
            warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            warehouse.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            warehouse.country.toLowerCase().includes(
                searchQuery.toLowerCase(),
            ) ||
            warehouse.contactName.toLowerCase().includes(
                searchQuery.toLowerCase(),
            ) ||
            warehouse.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            warehouse.vendor.businessName.toLowerCase().includes(
                searchQuery.toLowerCase(),
            );

        const matchesStatus = statusFilter === "ALL" ||
            (statusFilter === "true" && warehouse.isActive === true) ||
            (statusFilter === "false" && warehouse.isActive === false);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-4">
            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search warehouses by name, city, country, contact, or vendor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Warehouses Table */}
            <div className="rounded-md border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Warehouse
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Vendor
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Location
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Contact
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Pricing
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Created
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarehouses.length === 0
                                ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No warehouses found
                                        </td>
                                    </tr>
                                )
                                : (
                                    filteredWarehouses.map((warehouse) => (
                                        <tr
                                            key={warehouse.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {warehouse.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ID:{" "}
                                                            {warehouse.id.slice(
                                                                -8,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">
                                                    {warehouse.vendor
                                                        .businessName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {warehouse.vendor.user
                                                        ?.name || "N/A"}
                                                </div>
                                                <div className="mt-1">
                                                    {getVendorStatusBadge(
                                                        warehouse.vendor.status,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {warehouse.city},
                                                            {" "}
                                                            {warehouse.country}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatAddress(
                                                                warehouse,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {warehouse
                                                                .contactName}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {warehouse.phone}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {warehouse.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(
                                                    warehouse.isActive,
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="space-y-1 text-sm">
                                                    {warehouse.cifPrice && (
                                                        <div>
                                                            CIF:{" "}
                                                            {warehouse.cifPrice}
                                                            {" "}
                                                            {warehouse
                                                                .cifCurrency}
                                                        </div>
                                                    )}
                                                    {warehouse.exwPrice && (
                                                        <div>
                                                            EXW:{" "}
                                                            {warehouse.exwPrice}
                                                            {" "}
                                                            {warehouse
                                                                .exwCurrency}
                                                        </div>
                                                    )}
                                                    {warehouse.fcaPrice && (
                                                        <div>
                                                            FCA:{" "}
                                                            {warehouse.fcaPrice}
                                                            {" "}
                                                            {warehouse
                                                                .fcaCurrency}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-sm">
                                                {new Date(
                                                    warehouse.createdAt,
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
                                                                Open menu
                                                            </span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.push(
                                                                    `/admin/warehouses/${warehouse.id}`,
                                                                )}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.push(
                                                                    `/admin/vendors/${warehouse.vendor.id}`,
                                                                )}
                                                        >
                                                            <Building2 className="mr-2 h-4 w-4" />
                                                            View Vendor
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
    );
}
