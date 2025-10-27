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
    Ban,
    CheckCircle2,
    Eye,
    MoreVertical,
    Package,
    Plus,
    Search,
    XCircle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { AttachmentUpload } from "@/components/ui/attachment-upload";
import { ImageUpload } from "@/components/ui/image-upload";
import { createProduct, updateProductStatus } from "@/lib/actions/admin";

interface Product {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    costPerItem: number | null;
    stock: number;
    lowStockThreshold: number;
    status: "DRAFT" | "PENDING" | "ACTIVE" | "REJECTED" | "OUT_OF_STOCK";
    wattage: number | null;
    voltage: number | null;
    panelType: string | null;
    efficiency: number | null;
    warranty: number | null;
    dimensions: string | null;
    weight: number | null;
    certification: string[];
    images: string[];
    thumbnail: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    vendor: {
        id: string;
        businessName: string;
        businessEmail: string;
        status: string;
        user: {
            name: string | null;
            email: string;
        };
    };
    categories: {
        id: string;
        name: string;
    }[];
}

interface Vendor {
    id: string;
    businessName: string;
    businessEmail: string;
    user: {
        name: string | null;
        email: string;
    };
}

interface ProductsTableProps {
    products: Product[];
    vendors: Vendor[];
}

export function ProductsTable({ products, vendors }: ProductsTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        price: "",
        compareAtPrice: "",
        costPerItem: "",
        stock: "",
        sku: "",
        status: "ACTIVE",
        vendorId: "",
        wattage: "",
        voltage: "",
        panelType: "",
        efficiency: "",
        warranty: "",
        dimensions: "",
        weight: "",
        lowStockThreshold: "10",
    });

    // Image state
    const [productImages, setProductImages] = useState<string[]>([]);

    // Attachment state
    const [productAttachments, setProductAttachments] = useState<any[]>([]);

    const handleStatusChange = async (productId: string, newStatus: string) => {
        setIsUpdating(productId);
        try {
            await updateProductStatus(productId, newStatus);
            // The page will revalidate automatically due to revalidatePath in the server action
        } catch (error) {
            console.error("Error updating product status:", error);
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                    </Badge>
                );
            case "DRAFT":
                return (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                        Draft
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Rejected
                    </Badge>
                );
            case "OUT_OF_STOCK":
                return (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        Out of Stock
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });
            formDataObj.append("images", JSON.stringify(productImages));
            formDataObj.append("thumbnail", productImages[0] || "");
            formDataObj.append("certification", JSON.stringify([]));

            const result = await createProduct(formDataObj);

            // Upload attachments if any
            if (productAttachments.length > 0 && result.product) {
                for (const attachment of productAttachments) {
                    if (attachment.filePath.startsWith("blob:")) {
                        // This is a new file that needs to be uploaded
                        const attachmentFormData = new FormData();
                        const response = await fetch(attachment.filePath);
                        const blob = await response.blob();
                        attachmentFormData.append(
                            "file",
                            blob,
                            attachment.originalName,
                        );
                        attachmentFormData.append(
                            "fileType",
                            attachment.fileType,
                        );
                        attachmentFormData.append(
                            "description",
                            attachment.description || "",
                        );

                        await fetch(
                            `/api/products/${result.product.id}/attachments`,
                            {
                                method: "POST",
                                body: attachmentFormData,
                            },
                        );
                    }
                }
            }

            // Reset form
            setFormData({
                name: "",
                description: "",
                shortDescription: "",
                price: "",
                compareAtPrice: "",
                costPerItem: "",
                stock: "",
                sku: "",
                status: "ACTIVE",
                vendorId: "",
                wattage: "",
                voltage: "",
                panelType: "",
                efficiency: "",
                warranty: "",
                dimensions: "",
                weight: "",
                lowStockThreshold: "10",
            });
            setProductImages([]);
            setProductAttachments([]);
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(
                searchQuery.toLowerCase(),
            ) ||
            product.vendor.businessName.toLowerCase().includes(
                searchQuery.toLowerCase(),
            );

        const matchesStatus = statusFilter === "ALL" ||
            product.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Product Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and approve products from all vendors
                    </p>
                </div>
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Create a new product and assign it to a vendor.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "name",
                                                e.target.value,
                                            )}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "sku",
                                                e.target.value,
                                            )}
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "description",
                                            e.target.value,
                                        )}
                                    placeholder="Enter product description"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shortDescription">
                                    Short Description
                                </Label>
                                <Input
                                    id="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "shortDescription",
                                            e.target.value,
                                        )}
                                    placeholder="Brief product summary"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "price",
                                                e.target.value,
                                            )}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="compareAtPrice">
                                        Compare At Price
                                    </Label>
                                    <Input
                                        id="compareAtPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.compareAtPrice}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "compareAtPrice",
                                                e.target.value,
                                            )}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="costPerItem">
                                        Cost Per Item
                                    </Label>
                                    <Input
                                        id="costPerItem"
                                        type="number"
                                        step="0.01"
                                        value={formData.costPerItem}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "costPerItem",
                                                e.target.value,
                                            )}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "stock",
                                                e.target.value,
                                            )}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lowStockThreshold">
                                        Low Stock Threshold
                                    </Label>
                                    <Input
                                        id="lowStockThreshold"
                                        type="number"
                                        value={formData.lowStockThreshold}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "lowStockThreshold",
                                                e.target.value,
                                            )}
                                        placeholder="10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) =>
                                            handleFormChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="PENDING">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="ACTIVE">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="REJECTED">
                                                Rejected
                                            </SelectItem>
                                            <SelectItem value="OUT_OF_STOCK">
                                                Out of Stock
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendorId">Vendor *</Label>
                                <Select
                                    value={formData.vendorId}
                                    onValueChange={(value) =>
                                        handleFormChange("vendorId", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.map((vendor) => (
                                            <SelectItem
                                                key={vendor.id}
                                                value={vendor.id}
                                            >
                                                {vendor.businessName}{" "}
                                                ({vendor.user?.name ||
                                                    vendor.user.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="wattage">Wattage (W)</Label>
                                    <Input
                                        id="wattage"
                                        type="number"
                                        value={formData.wattage}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "wattage",
                                                e.target.value,
                                            )}
                                        placeholder="e.g., 400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="voltage">Voltage (V)</Label>
                                    <Input
                                        id="voltage"
                                        type="number"
                                        value={formData.voltage}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "voltage",
                                                e.target.value,
                                            )}
                                        placeholder="e.g., 24"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="panelType">
                                        Panel Type
                                    </Label>
                                    <Input
                                        id="panelType"
                                        value={formData.panelType}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "panelType",
                                                e.target.value,
                                            )}
                                        placeholder="e.g., Monocrystalline"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="efficiency">
                                        Efficiency (%)
                                    </Label>
                                    <Input
                                        id="efficiency"
                                        type="number"
                                        step="0.01"
                                        value={formData.efficiency}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "efficiency",
                                                e.target.value,
                                            )}
                                        placeholder="e.g., 22.5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="warranty">
                                        Warranty (years)
                                    </Label>
                                    <Input
                                        id="warranty"
                                        type="number"
                                        value={formData.warranty}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "warranty",
                                                e.target.value,
                                            )}
                                        placeholder="e.g., 25"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) =>
                                            handleFormChange(
                                                "weight",
                                                e.target.value,
                                            )}
                                        placeholder="e.g., 22.5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dimensions">Dimensions</Label>
                                <Input
                                    id="dimensions"
                                    value={formData.dimensions}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "dimensions",
                                            e.target.value,
                                        )}
                                    placeholder="e.g., 2000 x 1000 x 40 mm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Product Images</Label>
                                <ImageUpload
                                    images={productImages}
                                    onImagesChange={setProductImages}
                                    maxImages={10}
                                />
                            </div>

                            <div className="space-y-2">
                                <AttachmentUpload
                                    attachments={productAttachments}
                                    onAttachmentsChange={setProductAttachments}
                                    maxFiles={5}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? "Creating..."
                                        : "Create Product"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products by name, SKU, description, or vendor..."
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
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">
                            Out of Stock
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Products Table */}
            <div className="rounded-md border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Product
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Vendor
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Price
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Stock
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Status
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
                            {filteredProducts.length === 0
                                ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No products found
                                        </td>
                                    </tr>
                                )
                                : (
                                    filteredProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    SKU: {product.sku}
                                                </div>
                                                {product.shortDescription && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {product
                                                            .shortDescription}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">
                                                    {product.vendor
                                                        .businessName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {product.vendor.user
                                                        ?.name || "N/A"}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">
                                                    ${product.price.toFixed(2)}
                                                </div>
                                                {product.compareAtPrice && (
                                                    <div className="text-sm text-muted-foreground">
                                                        <span className="line-through">
                                                            ${product
                                                                .compareAtPrice
                                                                .toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium">
                                                    {product.stock}
                                                </div>
                                                {product.stock <=
                                                        product
                                                            .lowStockThreshold &&
                                                    (
                                                        <div className="text-xs text-orange-600">
                                                            Low stock
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(product.status)}
                                            </td>
                                            <td className="p-4 align-middle text-sm">
                                                {new Date(
                                                    product.createdAt,
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
                                                            disabled={isUpdating ===
                                                                product.id}
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
                                                                handleStatusChange(
                                                                    product.id,
                                                                    "ACTIVE",
                                                                )}
                                                            disabled={product
                                                                        .status ===
                                                                    "ACTIVE" ||
                                                                isUpdating ===
                                                                    product.id}
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    product.id,
                                                                    "REJECTED",
                                                                )}
                                                            disabled={product
                                                                        .status ===
                                                                    "REJECTED" ||
                                                                isUpdating ===
                                                                    product.id}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    product.id,
                                                                    "OUT_OF_STOCK",
                                                                )}
                                                            disabled={product
                                                                        .status ===
                                                                    "OUT_OF_STOCK" ||
                                                                isUpdating ===
                                                                    product.id}
                                                        >
                                                            <Ban className="mr-2 h-4 w-4" />
                                                            Mark Out of Stock
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.push(
                                                                    `/admin/products/${product.id}`,
                                                                )}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
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
