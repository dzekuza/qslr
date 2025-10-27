import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./ProductCatalog.module.css";

interface ProductSpecifications {
  power: string;
  type: string;
  color: string;
  dimensions: string;
}

interface Product {
  id: string;
  name: string;
  vendor: string;
  vendorCountry: string;
  rating: number;
  reviewCount: number;
  image: string;
  specifications: ProductSpecifications;
  availability: string;
  pricePerWatt: string;
  currency: string;
  unit: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.productCard}>
      {/* Vendor Info */}
      <div className={styles.vendorInfo}>
        <span className={styles.vendorName}>{product.vendor}</span>
        <span className={styles.countryBadge}>
          {product.vendorCountry}
        </span>
        <div className={styles.ratingContainer}>
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>

      {/* Product Image */}
      <div className="flex justify-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
      </div>

      {/* Product Name */}
      <h3 className={styles.productName}>
        {product.name}
      </h3>

      {/* Specifications */}
      <div className={styles.specifications}>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Power:</span> {product.specifications.power}
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Type:</span> {product.specifications.type}
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Colour:</span> {product.specifications.color}
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Dimensions (mm):</span> {product.specifications.dimensions}
        </div>
      </div>

      {/* Availability */}
      <div className={styles.availability}>
        <div className={styles.availabilityDot}></div>
        <span className={styles.availabilityText}>• {product.availability}</span>
      </div>

      {/* Price */}
      <div className={styles.priceContainer}>
        <span className={styles.priceText}>
          {product.pricePerWatt} /{product.unit}
        </span>
      </div>

      {/* Buy Button */}
      <button className={styles.buyButton}>
        <ShoppingCart className="h-4 w-4 mr-2" />
        Buy
      </button>
    </div>
  );
}
