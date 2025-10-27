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

        {/* Main Product Layout - Matching Figma Design */}
        <div className="bg-white box-border content-stretch flex gap-[28px] items-start p-[16px] relative size-full">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full max-w-7xl mx-auto">
            
            {/* Left Section - Product Info, Description, Details */}
            <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
              
              {/* Product Info Card */}
              <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[16px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[32px] text-black w-full">
                  {product.name}
                </p>
                <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full">
                  {/* Power Badge - Green */}
                  <div className="bg-[#00b56a] box-border content-stretch flex gap-[6px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
                    <div className="relative shrink-0 size-[16px]">
                      <img alt="" className="block max-w-none size-full" src="/assets/76ede529da07d1e31a85229e3153ff87a6d2cdfe.svg" />
                    </div>
                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-pre">
                      Power:<span className="text-[rgba(255,255,255,0.8)]">{` ${product.wattage || 'N/A'}W`}</span>
                    </p>
                  </div>
                  
                  {/* Type Badge - Gray */}
                  <div className="bg-[#ebebeb] box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0">
                    <div className="relative shrink-0 size-[16px]">
                      <img alt="" className="block max-w-none size-full" src="/assets/f90db6c737814d5a3e8aeb19b199986a961e2500.svg" />
                    </div>
                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#787878] text-[14px] whitespace-pre">
                      {product.panelType || 'N/A'}
                    </p>
                  </div>
                  
                  {/* Color Badge - Gray */}
                  <div className="bg-[#ebebeb] box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0">
                    <div className="relative shrink-0 size-[16px]">
                      <img alt="" className="block max-w-none size-full" src="/assets/e37e2f55d0b3b1ff471b6ae0293e708fd1d7c945.svg" />
                    </div>
                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#787878] text-[14px] whitespace-pre">
                      Silver frame
                    </p>
                  </div>
                  
                  {/* Dimensions Badge - Gray */}
                  <div className="bg-[#ebebeb] box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0">
                    <div className="relative shrink-0 size-[16px]">
                      <img alt="" className="block max-w-none size-full" src="/assets/2b8314611987c4a602a282b9d038bf48fe8bc6c7.svg" />
                    </div>
                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#787878] text-[14px] whitespace-pre">
                      {product.dimensions || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[24px] items-start leading-[20px] not-italic p-[24px] relative rounded-[16px] shrink-0 text-black w-full">
                <p className="font-semibold relative shrink-0 text-[16px] w-full">
                  Description
                </p>
                <p className="font-normal min-w-full relative shrink-0 text-[14px] w-full">
                  {product.description}
                </p>
              </div>

              {/* Details Section */}
              <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[24px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                <p className="font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-black w-full">
                  Full details list
                </p>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[rgba(29,29,31,0.5)]">
                      Inverter type
                    </p>
                    <p className="relative shrink-0 text-black">
                      {product.panelType || 'Microinverter'}
                    </p>
                  </div>
                  <div className="h-px bg-gray-200 w-full"></div>
                  
                  <div className="content-stretch flex font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[rgba(29,29,31,0.5)]">
                      Power output
                    </p>
                    <p className="relative shrink-0 text-black">
                      {product.wattage ? `${product.wattage}W` : 'N/A'}
                    </p>
                  </div>
                  <div className="h-px bg-gray-200 w-full"></div>
                  
                  <div className="content-stretch flex font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[rgba(29,29,31,0.5)]">
                      Efficiency
                    </p>
                    <p className="relative shrink-0 text-black">
                      {product.efficiency ? `${product.efficiency}%` : 'N/A'}
                    </p>
                  </div>
                  <div className="h-px bg-gray-200 w-full"></div>
                  
                  <div className="content-stretch flex font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[rgba(29,29,31,0.5)]">
                      Warranty
                    </p>
                    <p className="relative shrink-0 text-black">
                      {product.warranty ? `${product.warranty} years` : '25 years'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section - Image Gallery */}
            <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start justify-center min-h-px min-w-px relative rounded-[16px] shrink-0">
              {/* Main Image Container */}
              <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden px-[24px] py-[24px] relative rounded-[16px] shrink-0 w-full">
                <div className="h-[456px] relative shrink-0 w-[232px]">
                  <Image
                    src={product.thumbnail || product.images[0] || "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"}
                    alt={product.name}
                    width={232}
                    height={456}
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                  />
                </div>
              </div>
              
              {/* Thumbnails Container */}
              <div className="content-stretch flex gap-[8px] h-[84px] items-start relative shrink-0 w-full">
                {product.images.slice(0, 5).map((image, index) => (
                  <div key={index} className="basis-0 bg-neutral-50 box-border content-stretch flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px overflow-hidden px-[24px] py-[24px] relative rounded-[4px] shrink-0">
                    <div className="h-[40px] relative shrink-0 w-[40px]">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={40}
                        height={40}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Price, Delivery, Actions */}
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[300px]">
              {/* Price Container */}
              <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[10px] items-center justify-center not-italic overflow-hidden p-[24px] relative rounded-[16px] shrink-0 text-black w-full">
                <p className="font-bold leading-[normal] relative shrink-0 text-[24px] w-full">
                  €{product.price.toFixed(2)}
                </p>
                <p className="font-normal leading-[20px] relative shrink-0 text-[14px] w-full">
                  With VAT
                </p>
              </div>

              {/* Delivery Info */}
              <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[24px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                <p className="font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-black w-full">
                  Delivery
                </p>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[rgba(29,29,31,0.5)]">
                      Warehouse location
                    </p>
                    <p className="relative shrink-0 text-black">
                      {product.vendor.businessName}
                    </p>
                  </div>
                  <div className="content-stretch flex font-medium items-start justify-between leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[rgba(29,29,31,0.5)]">
                      Packing time
                    </p>
                    <p className="relative shrink-0 text-black">
                      2 days
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Container */}
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
                <div className="basis-0 bg-[#1d1d1f] box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-[24px] py-[16px] relative rounded-[8px] shrink-0">
                  <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-pre">
                    Add to cart
                  </p>
                </div>
                <div className="basis-0 bg-[#00b56a] box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-[24px] py-[16px] relative rounded-[8px] shrink-0">
                  <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-pre">
                    Buy now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
