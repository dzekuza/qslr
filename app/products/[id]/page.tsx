import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Truck, 
  Shield, 
  CheckCircle, 
  Package, 
  Zap, 
  Ruler, 
  Weight,
  Award,
  MessageSquare,
  ArrowLeft,
  Heart,
  Share2
} from "lucide-react";
import { prisma } from "@/lib/prisma";

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
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
    });

    if (!product || product.status !== 'ACTIVE') {
      return null;
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const pricePerWatt = product.wattage 
    ? (product.price / product.wattage).toFixed(3)
    : null;

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/products" className="hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.thumbnail || product.images[0] || "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Additional Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.categories.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                    <span>({product.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>SKU: {product.sku}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    €{product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      €{product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {pricePerWatt && (
                  <p className="text-lg text-gray-600">
                    €{pricePerWatt}/Wp
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button size="lg" className="flex-1" disabled={product.stock === 0}>
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Vendor Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sold by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.vendor.businessName}</h3>
                      <p className="text-sm text-gray-600">{product.vendor.businessEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over €500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Warranty</p>
                    <p className="text-xs text-gray-600">{product.warranty || 25} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12 space-y-8">
            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.wattage && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Power Output</p>
                        <p className="text-sm text-gray-600">{product.wattage}W</p>
                      </div>
                    </div>
                  )}
                  {product.panelType && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Panel Type</p>
                        <p className="text-sm text-gray-600">{product.panelType}</p>
                      </div>
                    </div>
                  )}
                  {product.efficiency && (
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Efficiency</p>
                        <p className="text-sm text-gray-600">{product.efficiency}%</p>
                      </div>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center gap-3">
                      <Ruler className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Dimensions</p>
                        <p className="text-sm text-gray-600">{product.dimensions}</p>
                      </div>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-center gap-3">
                      <Weight className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Weight</p>
                        <p className="text-sm text-gray-600">{product.weight}kg</p>
                      </div>
                    </div>
                  )}
                  {product.voltage && (
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium">Voltage</p>
                        <p className="text-sm text-gray-600">{product.voltage}V</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {product.certification.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.certification.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Customer Reviews ({product.reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.user.name || 'Anonymous'}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
