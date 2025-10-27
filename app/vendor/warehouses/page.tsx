"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Warehouse {
    id: string;
    name: string;
    address?: string;
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    zipCode: string;
    country: string;
    contactName: string;
    email: string;
    phone: string;
    apartment?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function VendorWarehousesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
        null,
    );

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        zipCode: "",
        country: "US",
        contactName: "",
        email: "",
        phone: "",
        apartment: "",
        isActive: true,
    });

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
            router.push("/unauthorized");
            return;
        }

        fetchWarehouses();
    }, [session, status, router]);

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/warehouses");
            if (!response.ok) throw new Error("Failed to fetch warehouses");
            const data = await response.json();
            setWarehouses(data);
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingWarehouse
                ? `/api/warehouses/${editingWarehouse.id}`
                : "/api/warehouses";
            const method = editingWarehouse ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to save warehouse");

            setDialogOpen(false);
            resetForm();
            fetchWarehouses();
        } catch (error) {
            console.error("Error saving warehouse:", error);
        }
    };

    const handleEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setFormData({
            name: warehouse.name,
            address: warehouse.address || "",
            street: warehouse.street || "",
            city: warehouse.city,
            state: warehouse.state || "",
            postalCode: warehouse.postalCode || "",
            zipCode: warehouse.zipCode || "",
            country: warehouse.country,
            contactName: warehouse.contactName || "",
            email: warehouse.email || "",
            phone: warehouse.phone || "",
            apartment: warehouse.apartment || "",
            isActive: warehouse.isActive,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this warehouse?")) return;

        try {
            const response = await fetch(`/api/warehouses/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete warehouse");
            fetchWarehouses();
        } catch (error) {
            console.error("Error deleting warehouse:", error);
        }
    };

    const resetForm = () => {
        setEditingWarehouse(null);
        setFormData({
            name: "",
            address: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            zipCode: "",
            country: "US",
            contactName: "",
            email: "",
            phone: "",
            apartment: "",
            isActive: true,
        });
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Warehouses</h1>
                            <p className="text-muted-foreground">
                                Manage your warehouse locations
                            </p>
                        </div>
                        <Dialog
                            open={dialogOpen}
                            onOpenChange={(open) => {
                                setDialogOpen(open);
                                if (!open) resetForm();
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button onClick={() => setDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Warehouse
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingWarehouse
                                            ? "Edit Warehouse"
                                            : "Add New Warehouse"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Enter the warehouse details below
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address">
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: e.target.value,
                                                    })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="city">
                                                    City
                                                </Label>
                                                <Input
                                                    id="city"
                                                    value={formData.city}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            city:
                                                                e.target.value,
                                                        })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="state">
                                                    State
                                                </Label>
                                                <Input
                                                    id="state"
                                                    value={formData.state}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            state:
                                                                e.target.value,
                                                        })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="postalCode">
                                                    Postal Code
                                                </Label>
                                                <Input
                                                    id="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            postalCode:
                                                                e.target.value,
                                                        })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="country">
                                                    Country
                                                </Label>
                                                <Input
                                                    id="country"
                                                    value={formData.country}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            country:
                                                                e.target.value,
                                                        })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        isActive:
                                                            e.target.checked,
                                                    })}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="isActive">
                                                Active
                                            </Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {editingWarehouse
                                                ? "Update"
                                                : "Create"} Warehouse
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {warehouses.length === 0
                        ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    No warehouses yet. Add your first warehouse
                                    to get started.
                                </p>
                            </div>
                        )
                        : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {warehouses.map((warehouse) => (
                                        <TableRow key={warehouse.id}>
                                            <TableCell className="font-medium">
                                                {warehouse.name}
                                            </TableCell>
                                            <TableCell>
                                                {warehouse.city},{" "}
                                                {warehouse.state}{" "}
                                                {warehouse.postalCode}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={warehouse.isActive
                                                        ? "default"
                                                        : "secondary"}
                                                >
                                                    {warehouse.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(
                                                                warehouse,
                                                            )}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                warehouse.id,
                                                            )}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
