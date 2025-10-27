import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout/public-layout";
import LogoLoop from "@/components/LogoLoop";
import { ArrowRight, Heart, Search, ShoppingCart, Star } from "lucide-react";

// Logo data for the animated logo loop
const partnerLogos = [
  { src: "/download.svg", alt: "SolarTech" },
  { src: "/download.svg", alt: "GreenEnergy" },
  { src: "/download.svg", alt: "SunPower" },
  { src: "/download.svg", alt: "EcoSolar" },
  { src: "/download.svg", alt: "RenewablePro" },
  { src: "/download.svg", alt: "CleanTech" },
];

// Sample products data
const featuredProducts = [
  {
    id: 1,
    name: "Monocrystalline Solar Panel 400W",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/assets/abb1eff66765117b99567e2acf16610e5cee5265.png",
    vendor: "SolarTech Pro",
    badge: "Best Seller",
    badgeColor: "bg-green-500",
  },
  {
    id: 2,
    name: "String Inverter 5kW",
    price: 899.99,
    originalPrice: 1099.99,
    rating: 4.6,
    reviews: 89,
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    vendor: "PowerMax Solutions",
    badge: "New",
    badgeColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Lithium Battery 10kWh",
    price: 2499.99,
    originalPrice: 2999.99,
    rating: 4.9,
    reviews: 67,
    image: "/assets/abb1eff66765117b99567e2acf16610e5cee5265.png",
    vendor: "EnergyStore",
    badge: "Limited",
    badgeColor: "bg-red-500",
  },
  {
    id: 4,
    name: "Mounting System Kit",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 156,
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    vendor: "MountPro",
    badge: "Sale",
    badgeColor: "bg-orange-500",
  },
  {
    id: 5,
    name: "Micro Inverter 800W",
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.5,
    reviews: 92,
    image: "/assets/abb1eff66765117b99567e2acf16610e5cee5265.png",
    vendor: "MicroPower",
    badge: "Popular",
    badgeColor: "bg-purple-500",
  },
  {
    id: 6,
    name: "Monitoring System",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.4,
    reviews: 78,
    image: "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    vendor: "SmartMonitor",
    badge: "Smart",
    badgeColor: "bg-indigo-500",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-white py-16 pt-32 px-4 md:px-8 lg:px-16 xl:px-24 rounded-lg">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16 mb-10">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-black leading-tight max-w-4xl">
              Solar panels for daily usage
            </h1>

            {/* Right Side Content */}
            <div className="flex flex-col items-end gap-4 max-w-xs">
              <p className="text-lg md:text-xl text-black text-right font-medium">
                Best way to buy products you love
              </p>
              <button className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Shop all now
              </button>
            </div>
          </div>

          {/* Product Categories */}
          <div className="flex gap-3 pb-4 overflow-x-auto scrollbar-hide">
            {/* Solar Panels Card */}
            <Link
              href="/products?category=solar-panels"
              className="bg-neutral-50 rounded-lg p-4 flex flex-col items-center justify-end min-w-[190px] h-auto flex-shrink-0 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Image
                src="/assets/abb1eff66765117b99567e2acf16610e5cee5265.png"
                alt="Solar Panel"
                width={80}
                height={80}
                className="w-[80px] mb-2 object-cover"
              />
              <p className="text-sm font-medium text-black text-center">
                Solar panels
              </p>
            </Link>

            {/* Inverters Cards */}
            {Array.from(
              { length: 6 },
              (_, i) => (
                <Link
                  key={i}
                  href="/products?category=inverters"
                  className="bg-neutral-50 rounded-lg p-4 flex flex-col items-center justify-end min-w-[190px] flex-shrink-0 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <Image
                    src="/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"
                    alt="Inverter"
                    width={80}
                    height={80}
                    className="w-[80px] mb-2 object-cover"
                  />
                  <p className="text-sm font-medium text-black text-center">
                    Inverters
                  </p>
                </Link>
              ),
            )}

            {/* Final Solar Panels Card */}
            <Link
              href="/products?category=solar-panels"
              className="bg-neutral-50 rounded-lg p-4 flex flex-col items-center justify-end min-w-[190px] h-auto flex-shrink-0 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Image
                src="/assets/abb1eff66765117b99567e2acf16610e5cee5265.png"
                alt="Solar Panel"
                width={80}
                height={80}
                className="w-[80px] mb-2 object-cover"
              />
              <p className="text-sm font-medium text-black text-center">
                Solar panels
              </p>
            </Link>

            {/* Empty Card */}
            <Link
              href="/products?category=inverters"
              className="bg-neutral-50 rounded-lg p-4 flex flex-col items-center justify-end min-w-[190px] flex-shrink-0 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Image
                src="/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"
                alt="Inverter"
                width={80}
                height={80}
                className="w-[80px] mb-2 object-cover"
              />
              <p className="text-sm font-medium text-black text-center">
                Inverters
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="bg-white py-16 px-4 md:px-8 lg:px-16 xl:px-24 rounded-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-7 items-start">
            {/* Category Card */}
            <div className="bg-neutral-50 rounded-lg p-5 flex flex-col items-center justify-end w-full lg:w-auto lg:min-w-[320px]">
              <h2 className="text-2xl font-semibold text-black mb-2">
                Solar panels
              </h2>
              <p className="text-base text-black mb-4">
                Best way to buy products you love
              </p>
              <div className="w-full max-w-[280px] h-[280px]">
                <Image
                  src="/assets/abb1eff66765117b99567e2acf16610e5cee5265.png"
                  alt="Solar Panel Category"
                  width={280}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Slider */}
            <div className="flex gap-4 overflow-x-auto flex-1">
              {/* Product Card 1 */}
              <div className="bg-neutral-50 rounded-lg p-5 flex flex-col items-center justify-end max-w-[300px] h-[390px] flex-shrink-0">
                <div className="w-[120px] h-[236px] mb-2">
                  <Image
                    src="/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"
                    alt="Product"
                    width={120}
                    height={236}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-black mb-1">Category</p>
                <p className="text-xl font-semibold text-black mb-2 text-center">
                  This is product name maybe longer
                </p>
                <p className="text-base font-medium text-black">€241.10</p>
              </div>

              {/* Product Card 2 */}
              <div className="bg-neutral-50 rounded-lg p-5 flex flex-col items-center justify-end max-w-[300px] h-[390px] flex-shrink-0">
                <div className="w-[120px] h-[236px] mb-2">
                  <Image
                    src="/assets/abb1eff66765117b99567e2acf16610e5cee5265.png"
                    alt="Product"
                    width={120}
                    height={236}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-black mb-1">Category</p>
                <p className="text-xl font-semibold text-black mb-2 text-center">
                  This is product name maybe longer
                </p>
                <p className="text-base font-medium text-black">€241.10</p>
              </div>

              {/* Product Card 3 */}
              <div className="bg-neutral-50 rounded-lg p-5 flex flex-col items-center justify-end max-w-[300px] h-[390px] flex-shrink-0">
                <div className="w-[120px] h-[236px] mb-2">
                  <Image
                    src="/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"
                    alt="Product"
                    width={120}
                    height={236}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-black mb-1">Category</p>
                <p className="text-xl font-semibold text-black mb-2 text-center">
                  This is product name maybe longer
                </p>
                <p className="text-base font-medium text-black">€241.10</p>
              </div>

              {/* Product Card 4 */}
              <div className="bg-neutral-50 rounded-lg p-5 flex flex-col items-center justify-end max-w-[300px] h-[390px] flex-shrink-0">
                <div className="w-[120px] h-[236px] mb-2">
                  <Image
                    src="/assets/abb1eff66765117b99567e2acf16610e5cee5265.png"
                    alt="Product"
                    width={120}
                    height={236}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-black mb-1">Category</p>
                <p className="text-xl font-semibold text-black mb-2 text-center">
                  This is product name maybe longer
                </p>
                <p className="text-base font-medium text-black">€241.10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our top-rated solar panels, inverters, and accessories
              from trusted vendors
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge */}
                  <div
                    className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white ${product.badgeColor}`}
                  >
                    {product.badge}
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground">
                      {product.vendor}
                    </p>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) * 100,
                      )}% OFF
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold transition-colors">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Products Button */}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
