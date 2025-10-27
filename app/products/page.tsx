import { PublicLayout } from "@/components/layout/public-layout";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";

// Sample data matching the Figma design
const sampleProducts = [
  {
    id: "1",
    name: "JA Solar JAM60D20-380/MB 360-380 1500V Silver Frame 35",
    price: "€241.10",
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "210W",
      type: "Bifacial, P-Type",
      color: "Silver frame",
      dimensions: "1052 x 1774 x 35",
    },
  },
  {
    id: "2",
    name: "JA Solar JAM60D20-380/MB 360-380 1500V Silver Frame 35",
    price: "€241.10",
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "210W",
      type: "Bifacial, P-Type",
      color: "Silver frame",
      dimensions: "1052 x 1774 x 35",
    },
  },
  {
    id: "3",
    name: "JA Solar JAM60D20-380/MB 360-380 1500V Silver Frame 35",
    price: "€241.10",
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: "210W",
      type: "Bifacial, P-Type",
      color: "Silver frame",
      dimensions: "1052 x 1774 x 35",
    },
  },
];

export default function ProductsPage() {
  return (
    <PublicLayout>
      <div className="bg-white pt-24">
        {/* Category Header */}
        <div className="bg-neutral-50 border-t border-b border-gray-200 py-8">
          <div className="bg-white/10 backdrop-blur-md mx-auto w-full max-w-7xl border border-white/20 px-4 rounded-lg">
            <h1 className="text-3xl font-medium text-black">Category</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md mx-auto w-full max-w-7xl border border-white/20 px-4 rounded-lg py-6">
          <div className="flex gap-7">
            {/* Left Sidebar - Filters */}
            <div className="w-64 flex-shrink-0">
              <ProductFilters />
            </div>

            {/* Right Content - Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
