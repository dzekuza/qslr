import { PublicLayout } from "@/components/layout/public-layout";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      vendor: {
        include: {
          user: true,
        },
      },
      categories: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform database data to match component structure
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: `€${product.price.toFixed(2)}`,
    pricePerWatt: product.wattage
      ? `€${(product.price / product.wattage).toFixed(3)}/Wp`
      : undefined,
    availability: `${product.stock} pcs`,
    minOrderQuantity: "1 container",
    vendor: product.vendor.businessName || "Unknown Vendor",
    vendorCountry: "Poland",
    rating: product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0,
    reviewCount: product.reviews.length,
    responseTime: "<2h",
    image: product.thumbnail || product.images[0] ||
      "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
    specifications: {
      power: product.wattage ? `${product.wattage}W` : "N/A",
      type: product.panelType || "N/A",
      color: "Silver Frame",
      dimensions: product.dimensions || "N/A",
    },
  }));
}

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

export default async function ProductsPage() {
  // Fetch products from database
  let products;
  try {
    products = await getProducts();
    // Use fallback if no products found
    if (products.length === 0) {
      products = fallbackProducts;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    // Use fallback on error
    products = fallbackProducts;
  }

  return (
    <PublicLayout>
      <div className="bg-white mt-24">
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
                {products.map((product) => (
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
