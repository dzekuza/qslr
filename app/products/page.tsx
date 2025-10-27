"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { FilterSummary } from "@/components/products/FilterSummary";
import { MobileFilters } from "@/components/products/MobileFilters";
import {
  FilterState,
  Product,
  useProductFilters,
} from "@/hooks/useProductFilters";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fallback product data if database is empty
const fallbackProducts = [
  {
    id: "1",
    name: "JA Solar JAM60S20 375/MR 365-390 1000V Silver Frame QC 4.10",
    price: "€25.88",
    pricePerWatt: "€0.069/Wp",
    availability: "806 pcs",
    minOrderQuantity: "1 container",
    vendor: "OFF 1v1SqEH7",
    vendorCountry: "Poland",
    rating: 4.8,
    reviewCount: 3,
    responseTime: "<2h",
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "375W",
      type: "Monofacial, P-Type",
      color: "Silver Frame",
      dimensions: "1052 x 1769 x 35",
    },
    detailedSpecs: {
      seriesName: "JAM60S20 365-390/MR",
      seriesPowerRange: "365-390",
      modelName: "JAM60S20 375/MR",
      warrantyYears: "12",
      primaryWarranty: "25, 84.8",
      voltageAtMaxPower: "34.5V",
      currentAtMaxPower: "10.87A",
      openCircuitVoltage: "41.45V",
      shortCircuitCurrent: "11.41A",
      panelEfficiency: "20.2%",
      temperatureCoefficientPmax: "-0.35%/°C",
      temperatureCoefficientVoc: "-0.272%/°C",
      temperatureCoefficientIsc: "0.044%/°C",
      maxSystemVoltage: "1000V",
      seriesFuseRating: "20A",
      cellNumber: "120",
      junctionBoxDiodes: "3",
      junctionBoxProtectionClass: "IP68",
      connectorType: "QC 4.10",
      cableCrosssection: "4mm²",
      cableLength: "1000mm",
      height: "1769mm",
      width: "1052mm",
      depth: "35mm",
      weight: "20.5kg",
    },
  },
  {
    id: "2",
    name: "JA Solar JAM60S20 380/MR 365-390 1000V Silver Frame QC 4.10",
    price: "€26.20",
    pricePerWatt: "€0.069/Wp",
    availability: "1200 pcs",
    minOrderQuantity: "1 container",
    vendor: "OFF 2v2SqEH8",
    vendorCountry: "Poland",
    rating: 4.9,
    reviewCount: 5,
    responseTime: "<1h",
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "380W",
      type: "Monofacial, P-Type",
      color: "Silver Frame",
      dimensions: "1052 x 1769 x 35",
    },
    detailedSpecs: {
      seriesName: "JAM60S20 365-390/MR",
      seriesPowerRange: "365-390",
      modelName: "JAM60S20 380/MR",
      warrantyYears: "12",
      primaryWarranty: "25, 84.8",
      voltageAtMaxPower: "35.2V",
      currentAtMaxPower: "10.80A",
      openCircuitVoltage: "42.1V",
      shortCircuitCurrent: "11.35A",
      panelEfficiency: "20.4%",
      temperatureCoefficientPmax: "-0.35%/°C",
      temperatureCoefficientVoc: "-0.272%/°C",
      temperatureCoefficientIsc: "0.044%/°C",
      maxSystemVoltage: "1000V",
      seriesFuseRating: "20A",
      cellNumber: "120",
      junctionBoxDiodes: "3",
      junctionBoxProtectionClass: "IP68",
      connectorType: "QC 4.10",
      cableCrosssection: "4mm²",
      cableLength: "1000mm",
      height: "1769mm",
      width: "1052mm",
      depth: "35mm",
      weight: "20.5kg",
    },
  },
  {
    id: "3",
    name: "JA Solar JAM60S20 365/MR 365-390 1000V Silver Frame QC 4.10",
    price: "€25.20",
    pricePerWatt: "€0.069/Wp",
    availability: "500 pcs",
    minOrderQuantity: "1 container",
    vendor: "OFF 3v3SqEH9",
    vendorCountry: "Poland",
    rating: 4.7,
    reviewCount: 2,
    responseTime: "<3h",
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "365W",
      type: "Monofacial, P-Type",
      color: "Silver Frame",
      dimensions: "1052 x 1769 x 35",
    },
    detailedSpecs: {
      seriesName: "JAM60S20 365-390/MR",
      seriesPowerRange: "365-390",
      modelName: "JAM60S20 365/MR",
      warrantyYears: "12",
      primaryWarranty: "25, 84.8",
      voltageAtMaxPower: "33.8V",
      currentAtMaxPower: "10.80A",
      openCircuitVoltage: "40.8V",
      shortCircuitCurrent: "11.35A",
      panelEfficiency: "19.8%",
      temperatureCoefficientPmax: "-0.35%/°C",
      temperatureCoefficientVoc: "-0.272%/°C",
      temperatureCoefficientIsc: "0.044%/°C",
      maxSystemVoltage: "1000V",
      seriesFuseRating: "20A",
      cellNumber: "120",
      junctionBoxDiodes: "3",
      junctionBoxProtectionClass: "IP68",
      connectorType: "QC 4.10",
      cableCrosssection: "4mm²",
      cableLength: "1000mm",
      height: "1769mm",
      width: "1052mm",
      depth: "35mm",
      weight: "20.5kg",
    },
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    filters,
    filteredProducts,
    activeFilterCount,
    handleCheckboxChange,
    handleRangeChange,
    removeFilter,
    clearAllFilters,
  } = useProductFilters(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          // If no products in database, use fallback data
          const convertedProducts: Product[] = fallbackProducts.map((
            product,
          ) => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price.replace("€", "")),
            wattage: parseInt(product.specifications.power.replace("W", "")),
            stock: parseInt(product.availability.replace(" pcs", "")),
            vendor: {
              businessName: product.vendor,
              country: product.vendorCountry,
            },
            categories: [{ name: "Solar Panels" }],
          }));
          setProducts(convertedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Use fallback data on error
        const convertedProducts: Product[] = fallbackProducts.map((
          product,
        ) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.replace("€", "")),
          wattage: parseInt(product.specifications.power.replace("W", "")),
          stock: parseInt(product.availability.replace(" pcs", "")),
          vendor: {
            businessName: product.vendor,
            country: product.vendorCountry,
          },
          categories: [{ name: "Solar Panels" }],
        }));
        setProducts(convertedProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md mx-auto w-full max-w-7xl border border-white/20 px-4 rounded-lg py-6">
          <div className="flex gap-7">
            {/* Left Sidebar - Filters (Desktop Only) */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <ProductFilters
                filters={filters}
                onCheckboxChange={handleCheckboxChange}
                onRangeChange={handleRangeChange}
                onClearAll={clearAllFilters}
              />
            </div>

            {/* Right Content - Product Grid */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Category
              </h2>

              {/* Mobile Filters Button */}
              <div className="md:hidden mb-4">
                <MobileFilters
                  activeFilterCount={activeFilterCount}
                  filters={filters}
                  onCheckboxChange={handleCheckboxChange}
                  onRangeChange={handleRangeChange}
                  onClearAll={clearAllFilters}
                />
              </div>

              {/* Filter Summary */}
              <FilterSummary
                activeFilters={filters}
                onRemoveFilter={removeFilter}
                onClearAll={clearAllFilters}
              />

              {loading
                ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading products...</div>
                  </div>
                )
                : filteredProducts.length === 0
                ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search className="h-8 w-8 text-gray-400" />
                      </EmptyMedia>
                      <EmptyTitle>No products found</EmptyTitle>
                      <EmptyDescription>
                        Try adjusting your filters to find more products.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                      >
                        Clear all filters
                      </Button>
                    </EmptyContent>
                  </Empty>
                )
                : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{
                          id: product.id,
                          name: product.name,
                          price: `€${product.price.toFixed(2)}`,
                          image:
                            "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
                          specifications: {
                            power: product.wattage
                              ? `${product.wattage}W`
                              : "N/A",
                            type: product.panelType || "N/A",
                            color: "Silver Frame",
                            dimensions: "N/A",
                          },
                        }}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
