import { PublicLayout } from "@/components/layout/public-layout";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCatalogHeader } from "@/components/products/ProductCatalogHeader";

// Sample data matching the image structure
const sampleProducts = [
  {
    id: "1",
    name: "JA Solar JAM60D20-380/MB 360-380 1500V Silver Frame 35...",
    vendor: "OFF juZM0rfz",
    vendorCountry: "PL",
    rating: 4.8,
    reviewCount: 3,
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "380 W",
      type: "Bifacial, P-Type",
      color: "Silver Frame",
      dimensions: "1052 x 1774 x 35"
    },
    availability: "720 pcs",
    pricePerWatt: "€0.069",
    currency: "EUR",
    unit: "Wp"
  },
  {
    id: "2",
    name: "JA Solar JAM60S21-365/MR 1000V Full Black MC4",
    vendor: "OFF bvfuCrsb",
    vendorCountry: "PL",
    rating: 4.8,
    reviewCount: 3,
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "365 W",
      type: "Monofacial, P-Type",
      color: "Full Black",
      dimensions: "1052 x 1769 x 35"
    },
    availability: "1612 - 1872 pcs",
    pricePerWatt: "€0.069",
    currency: "EUR",
    unit: "Wp"
  },
  {
    id: "3",
    name: "JA Solar JAM60S21-365/MR 1000V Full Black MC4",
    vendor: "OFF 1v1SqEH7",
    vendorCountry: "PL",
    rating: 4.8,
    reviewCount: 3,
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "365 W",
      type: "Monofacial, P-Type",
      color: "Full Black",
      dimensions: "1052 x 1769 x 35"
    },
    availability: "1612 - 1872 pcs",
    pricePerWatt: "€0.069",
    currency: "EUR",
    unit: "Wp"
  }
];

const categories = [
  { name: "Solar Cables", count: 69 },
  { name: "Connectors", count: 40 },
  { name: "Kits & Sets", count: 9 }
];

const availabilityOptions = [
  "Up to 1 week",
  "1-2 weeks", 
  "2 weeks - 1 month",
  "More than 1 month"
];

const quickFilters = [
  "Available now",
  "Secure wire transfer",
  "Delivery by sun.store",
  "Pay with PayPal",
  "Buy Now Pay Later",
  "Super Seller"
];

export default function ProductsPage() {
  return (
    <PublicLayout>
      <div className="bg-white py-8 px-4 md:px-8 lg:px-16 xl:px-24 rounded-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="w-80 flex-shrink-0">
              <ProductFilters 
                categories={categories}
                availabilityOptions={availabilityOptions}
                quickFilters={quickFilters}
              />
            </div>

            {/* Right Content - Product Listings */}
            <div className="flex-1">
              <ProductCatalogHeader 
                title="Solar Panels"
                resultCount={1586}
                currentPage={1}
                totalPages={50}
              />

              {/* Product Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {sampleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    ←
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    1 of 50
                  </span>
                  <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
