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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Package, Plus } from "lucide-react";
import { VendorProductCard } from "@/components/products/VendorProductCard";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentUpload } from "@/components/ui/attachment-upload";
import { ImageUpload } from "@/components/ui/image-upload";

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
}

export default function VendorProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        price: "",
        compareAtPrice: "",
        costPerItem: "",
        stock: "",
        sku: "",
        status: "DRAFT",
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

        fetchProducts();
    }, [session, status, router]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/products");
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : "/api/products";
            const method = editingProduct ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    compareAtPrice: formData.compareAtPrice
                        ? parseFloat(formData.compareAtPrice)
                        : null,
                    costPerItem: formData.costPerItem
                        ? parseFloat(formData.costPerItem)
                        : null,
                    stock: parseInt(formData.stock),
                    lowStockThreshold: parseInt(formData.lowStockThreshold),
                    wattage: formData.wattage
                        ? parseInt(formData.wattage)
                        : null,
                    voltage: formData.voltage
                        ? parseInt(formData.voltage)
                        : null,
                    efficiency: formData.efficiency
                        ? parseFloat(formData.efficiency)
                        : null,
                    warranty: formData.warranty
                        ? parseInt(formData.warranty)
                        : null,
                    weight: formData.weight
                        ? parseFloat(formData.weight)
                        : null,
                    images: productImages,
                    thumbnail: productImages[0] || null,
                }),
            });

            if (!response.ok) throw new Error("Failed to save product");

            const productData = await response.json();
            
            // Upload attachments if any
            if (productAttachments.length > 0 && !editingProduct) {
                for (const attachment of productAttachments) {
                    if (attachment.filePath.startsWith('blob:')) {
                        // This is a new file that needs to be uploaded
                        const formData = new FormData();
                        const response = await fetch(attachment.filePath);
                        const blob = await response.blob();
                        formData.append('file', blob, attachment.originalName);
                        formData.append('fileType', attachment.fileType);
                        formData.append('description', attachment.description || '');
                        
                        await fetch(`/api/products/${productData.id}/attachments`, {
                            method: 'POST',
                            body: formData,
                        });
                    }
                }
            }

            setDialogOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            shortDescription: product.shortDescription || "",
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice?.toString() || "",
            costPerItem: product.costPerItem?.toString() || "",
            stock: product.stock.toString(),
            sku: product.sku,
            status: product.status,
            wattage: product.wattage?.toString() || "",
            voltage: product.voltage?.toString() || "",
            panelType: product.panelType || "",
            efficiency: product.efficiency?.toString() || "",
            warranty: product.warranty?.toString() || "",
            dimensions: product.dimensions || "",
            weight: product.weight?.toString() || "",
            lowStockThreshold: product.lowStockThreshold.toString(),
        });
        setProductImages(product.images || []);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete product");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            shortDescription: "",
            price: "",
            compareAtPrice: "",
            costPerItem: "",
            stock: "",
            sku: "",
            status: "DRAFT",
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
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
                            <h1 className="text-3xl font-bold">Products</h1>
                            <p className="text-muted-foreground">
                                Manage your product inventory
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
                                    Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingProduct
                                            ? "Edit Product"
                                            : "Add New Product"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Enter the product details below. All
                                        fields marked with * are required.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 mb-4">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">
                                                Basic Information
                                            </h3>

                                            <div className="space-y-2 mt-0">
                                                <Label htmlFor="name">
                                                    Product Name *
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            "name",
                                                            e.target.value,
                                                        )}
                                                    placeholder="e.g., Solar Panel 400W Monocrystalline"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="shortDescription">
                                                    Short Description
                                                </Label>
                                                <Input
                                                    id="shortDescription"
                                                    value={formData
                                                        .shortDescription}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            "shortDescription",
                                                            e.target.value,
                                                        )}
                                                    placeholder="Brief description for product cards"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">
                                                    Full Description *
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            "description",
                                                            e.target.value,
                                                        )}
                                                    rows={4}
                                                    placeholder="Detailed product description including features, benefits, and specifications"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200">
                                        </div>

                                        {/* Pricing & Inventory */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">
                                                Pricing & Inventory
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="price">
                                                        Price ($) *
                                                    </Label>
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
                                                        placeholder="299.99"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="compareAtPrice">
                                                        Compare At Price ($)
                                                    </Label>
                                                    <Input
                                                        id="compareAtPrice"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData
                                                            .compareAtPrice}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "compareAtPrice",
                                                                e.target.value,
                                                            )}
                                                        placeholder="399.99"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="costPerItem">
                                                        Cost Per Item ($)
                                                    </Label>
                                                    <Input
                                                        id="costPerItem"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData
                                                            .costPerItem}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "costPerItem",
                                                                e.target.value,
                                                            )}
                                                        placeholder="200.00"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="stock">
                                                        Stock Quantity *
                                                    </Label>
                                                    <Input
                                                        id="stock"
                                                        type="number"
                                                        value={formData.stock}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "stock",
                                                                e.target.value,
                                                            )}
                                                        placeholder="100"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lowStockThreshold">
                                                        Low Stock Threshold
                                                    </Label>
                                                    <Input
                                                        id="lowStockThreshold"
                                                        type="number"
                                                        value={formData
                                                            .lowStockThreshold}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "lowStockThreshold",
                                                                e.target.value,
                                                            )}
                                                        placeholder="10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="sku">
                                                        SKU
                                                    </Label>
                                                    <Input
                                                        id="sku"
                                                        value={formData.sku}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "sku",
                                                                e.target.value,
                                                            )}
                                                        placeholder="SP-400W-MONO-001"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200">
                                        </div>

                                        {/* Solar Panel Specifications */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">
                                                Solar Panel Specifications
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="wattage">
                                                        Wattage (W)
                                                    </Label>
                                                    <Input
                                                        id="wattage"
                                                        type="number"
                                                        value={formData.wattage}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "wattage",
                                                                e.target.value,
                                                            )}
                                                        placeholder="400"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="voltage">
                                                        Voltage (V)
                                                    </Label>
                                                    <Input
                                                        id="voltage"
                                                        type="number"
                                                        value={formData.voltage}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "voltage",
                                                                e.target.value,
                                                            )}
                                                        placeholder="24"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="panelType">
                                                        Panel Type
                                                    </Label>
                                                    <Input
                                                        id="panelType"
                                                        value={formData
                                                            .panelType}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "panelType",
                                                                e.target.value,
                                                            )}
                                                        placeholder="Monocrystalline"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="efficiency">
                                                        Efficiency (%)
                                                    </Label>
                                                    <Input
                                                        id="efficiency"
                                                        type="number"
                                                        step="0.1"
                                                        value={formData
                                                            .efficiency}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "efficiency",
                                                                e.target.value,
                                                            )}
                                                        placeholder="22.5"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="warranty">
                                                        Warranty (Years)
                                                    </Label>
                                                    <Input
                                                        id="warranty"
                                                        type="number"
                                                        value={formData
                                                            .warranty}
                                                        onChange={(e) =>
                                                            handleFormChange(
                                                                "warranty",
                                                                e.target.value,
                                                            )}
                                                        placeholder="25"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="weight">
                                                        Weight (kg)
                                                    </Label>
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
                                                        placeholder="22.5"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dimensions">
                                                    Dimensions
                                                </Label>
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
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200">
                                        </div>

                                        {/* Product Images */}
                                        <div className="space-y-2">
                                            <Label>Product Images</Label>
                                            <ImageUpload
                                                images={productImages}
                                                onImagesChange={setProductImages}
                                                maxImages={10}
                                            />
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200">
                                        </div>

                                        {/* Product Attachments */}
                                        <div className="space-y-2">
                                            <AttachmentUpload
                                                attachments={productAttachments}
                                                onAttachmentsChange={setProductAttachments}
                                                maxFiles={5}
                                            />
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200">
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-2">
                                            <Label htmlFor="status">
                                                Status
                                            </Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) =>
                                                    handleFormChange(
                                                        "status",
                                                        value,
                                                    )}
                                            >
                                                <SelectTrigger id="status">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">
                                                        Draft
                                                    </SelectItem>
                                                    <SelectItem value="PENDING">
                                                        Pending Review
                                                    </SelectItem>
                                                    <SelectItem value="ACTIVE">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="OUT_OF_STOCK">
                                                        Out of Stock
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                            {editingProduct
                                                ? "Update"
                                                : "Create"} Product
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {products.length === 0
                        ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>
                                    No products yet. Add your first product to
                                    get started.
                                </p>
                            </div>
                        )
                        : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <VendorProductCard
                                        key={product.id}
                                        product={product}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
