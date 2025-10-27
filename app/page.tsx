import Link from "next/link";
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
    image: "/download.svg",
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
    image: "/download.svg",
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
    image: "/download.svg",
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
    image: "/download.svg",
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
    image: "/download.svg",
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
    image: "/download.svg",
    vendor: "SmartMonitor",
    badge: "Smart",
    badgeColor: "bg-indigo-500",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Video Hero Section */}
      <section
        id="hero-section"
        className="w-full h-[60vh] relative overflow-hidden border rounded-lg"
      >
        <div className="animate-slide-right animate-delay-300 absolute inset-0 rounded-none overflow-hidden bg-black">
          <video
            src="/sun_store_header.mp4"
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            style={{ display: "block" }}
          />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-5xl md:text-6xl mb-6 animate-element font-heading">
                Solar Panel Marketplace
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 animate-element animate-delay-200">
                Multi-vendor marketplace for solar panels and related products
              </p>

              {/* Search Field with Glass Background */}
              <div className="animate-element animate-delay-400 max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                  </div>
                  <div className="relative flex items-center p-2">
                    <div className="flex-1 flex items-center px-4 py-3">
                      <Search className="h-6 w-6 text-white/70 mr-3" />
                      <input
                        type="text"
                        placeholder="Search for solar panels, inverters, batteries..."
                        className="flex-1 bg-transparent text-white placeholder-white/60 text-lg font-medium outline-none"
                      />
                    </div>
                    <button className="ml-2 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors">
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Quick Search Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {[
                    "Solar Panels",
                    "Inverters",
                    "Batteries",
                    "Mounting Systems",
                    "Monitoring",
                  ].map((term, index) => (
                    <button
                      key={term}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 rounded-full text-sm font-medium transition-colors border border-white/20"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Partner Logos at Bottom */}
          <div className="absolute bottom-4 left-0 right-0 w-full z-10">
            <LogoLoop
              logos={partnerLogos}
              speed={60}
              direction="left"
              logoHeight={32}
              gap={24}
              pauseOnHover={true}
              fadeOut={false}
              className="opacity-80 [&_img]:brightness-0 [&_img]:invert"
              ariaLabel="Partner logos"
            />
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
                  <img
                    src={product.image}
                    alt={product.name}
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
