import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Edit, Trash2, Package } from "lucide-react";
import Image from "next/image";

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

interface VendorProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function VendorProductCard({ product, onEdit, onDelete }: VendorProductCardProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "DRAFT":
        return "secondary";
      case "OUT_OF_STOCK":
        return "destructive";
      case "PENDING":
        return "outline";
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "DRAFT":
        return "text-gray-600";
      case "OUT_OF_STOCK":
        return "text-red-600";
      case "PENDING":
        return "text-yellow-600";
      case "REJECTED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStockColor = (stock: number, threshold: number) => {
    if (stock === 0) return "text-red-600";
    if (stock <= threshold) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              SKU: {product.sku}
            </p>
            <Badge variant={getStatusBadgeVariant(product.status)} className="text-xs">
              {product.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {/* Product Image */}
        <div className="mb-4">
          {product.thumbnail ? (
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Product Specifications */}
        <div className="space-y-2 mb-3">
          {product.wattage && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wattage:</span>
              <span className="font-medium">{product.wattage}W</span>
            </div>
          )}
          {product.panelType && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{product.panelType}</span>
            </div>
          )}
          {product.efficiency && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Efficiency:</span>
              <span className="font-medium">{product.efficiency}%</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.costPerItem && (
            <div className="text-xs text-muted-foreground">
              Cost: ${product.costPerItem.toFixed(2)}
            </div>
          )}
        </div>

        {/* Stock Information */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Stock:</span>
          <span className={`font-medium ${getStockColor(product.stock, product.lowStockThreshold)}`}>
            {product.stock} units
          </span>
        </div>
        {product.stock <= product.lowStockThreshold && product.stock > 0 && (
          <div className="text-xs text-yellow-600 mt-1">
            Low stock warning
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
