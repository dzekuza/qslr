import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/products/ProductCard";
import { H1, H2, H3, H4, Muted, P, Small } from "@/components/ui/typography";
import {
    ArrowLeft,
    Award,
    CheckCircle,
    Download,
    FileText,
    Heart,
    MessageSquare,
    Package,
    Plus,
    Ruler,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
    Weight,
    Zap,
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
                attachments: true,
            },
        });

        if (!product || product.status !== "ACTIVE") {
            return null;
        }

        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

async function getSimilarProducts(
    currentProductId: string,
    categories: any[],
    limit: number = 4,
) {
    try {
        const categoryIds = categories.map((cat) => cat.id);
        let similarProducts = [];

        // First try to find products with matching categories
        if (categoryIds.length > 0) {
            similarProducts = await prisma.product.findMany({
                where: {
                    id: { not: currentProductId },
                    status: "ACTIVE",
                    categories: {
                        some: {
                            id: { in: categoryIds },
                        },
                    },
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
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        // If no similar products found by category, get any other active products
        if (similarProducts.length === 0) {
            similarProducts = await prisma.product.findMany({
                where: {
                    id: { not: currentProductId },
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
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        // Transform to match ProductCard interface
        return similarProducts.map((product) => ({
            id: product.id,
            name: product.name,
            price: `€${product.price.toFixed(2)}`,
            image: product.thumbnail || product.images[0] ||
                "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png",
            specifications: {
                power: product.wattage ? `${product.wattage}W` : "N/A",
                type: product.panelType || "N/A",
                color: "Silver Frame",
                dimensions: product.dimensions || "N/A",
            },
        }));
    } catch (error) {
        console.error("Error fetching similar products:", error);
        return [];
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    // Fetch similar products based on categories
    const similarProducts = await getSimilarProducts(
        params.id,
        product.categories,
        4,
    );

    const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
        : 0;

    const pricePerWatt = product.wattage
        ? (product.price / product.wattage).toFixed(3)
        : null;

    return (
        <PublicLayout>
            <div className="">
                {/* Breadcrumb */}

                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link
                            href="/products"
                            className="hover:text-gray-900 flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Products
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900">
                            {product.name}
                        </span>
                    </div>
                </div>

                {/* Main Product Layout - Matching Figma Design */}
                <div className=" box-border content-stretch flex gap-[28px] items-start p-[16px] relative size-full">
                    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full max-w-7xl mx-auto">
                        {/* Left Section - Product Info, Description, Details */}
                        <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start justify-center min-h-px min-w-px relative shrink-0">
                            {/* Product Info Card */}
                            <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[16px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                                <H3 className="text-[32px] font-bold">
                                    {product.name}
                                </H3>
                                <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full">
                                    {/* Power Badge - Green */}
                                    <div className="bg-[#00b56a] box-border content-stretch flex gap-[6px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
                                        <div className="relative shrink-0 size-[16px]">
                                            <img
                                                alt=""
                                                className="block max-w-none size-full"
                                                src="/assets/76ede529da07d1e31a85229e3153ff87a6d2cdfe.svg"
                                            />
                                        </div>
                                        <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-pre">
                                            Power:<span className="text-[rgba(255,255,255,0.8)]">
                                                {` ${
                                                    product.wattage || "N/A"
                                                }W`}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Type Badge - Gray */}
                                    <div className="bg-[#ebebeb] box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0">
                                        <div className="relative shrink-0 size-[16px]">
                                            <img
                                                alt=""
                                                className="block max-w-none size-full"
                                                src="/assets/f90db6c737814d5a3e8aeb19b199986a961e2500.svg"
                                            />
                                        </div>
                                        <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#787878] text-[14px] whitespace-pre">
                                            {product.panelType || "N/A"}
                                        </p>
                                    </div>

                                    {/* Color Badge - Gray */}
                                    <div className="bg-[#ebebeb] box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0">
                                        <div className="relative shrink-0 size-[16px]">
                                            <img
                                                alt=""
                                                className="block max-w-none size-full"
                                                src="/assets/e37e2f55d0b3b1ff471b6ae0293e708fd1d7c945.svg"
                                            />
                                        </div>
                                        <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#787878] text-[14px] whitespace-pre">
                                            Silver frame
                                        </p>
                                    </div>

                                    {/* Dimensions Badge - Gray */}
                                    <div className="bg-[#ebebeb] box-border content-stretch flex gap-[6px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0">
                                        <div className="relative shrink-0 size-[16px]">
                                            <img
                                                alt=""
                                                className="block max-w-none size-full"
                                                src="/assets/2b8314611987c4a602a282b9d038bf48fe8bc6c7.svg"
                                            />
                                        </div>
                                        <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#787878] text-[14px] whitespace-pre">
                                            {product.dimensions || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[16px] items-start leading-[20px] not-italic p-[24px] relative rounded-[16px] shrink-0 text-black w-full">
                                <H3 className="text-[16px] font-semibold">
                                    Description
                                </H3>
                                <P className="text-[14px] font-normal leading-relaxed">
                                    {product.description}
                                </P>
                            </div>

                            {/* Details Section */}
                            <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[24px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                                <H3 className="text-[16px] font-semibold">
                                    Full details list
                                </H3>
                                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                                    <div className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full pb-3 border-b border-gray-200">
                                        <Small className="text-[rgba(29,29,31,0.5)]">
                                            Inverter type
                                        </Small>
                                        <p className="text-black">
                                            {product.panelType ||
                                                "Microinverter"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full pb-3 border-b border-gray-200">
                                        <p className="text-[rgba(29,29,31,0.5)]">
                                            Power output
                                        </p>
                                        <p className="text-black">
                                            {product.wattage
                                                ? `${product.wattage}W`
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full pb-3 border-b border-gray-200">
                                        <p className="text-[rgba(29,29,31,0.5)]">
                                            Efficiency
                                        </p>
                                        <p className="text-black">
                                            {product.efficiency
                                                ? `${product.efficiency}%`
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full">
                                        <p className="text-[rgba(29,29,31,0.5)]">
                                            Warranty
                                        </p>
                                        <p className="text-black">
                                            {product.warranty
                                                ? `${product.warranty} years`
                                                : "25 years"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            {product.attachments &&
                                product.attachments.length > 0 && (
                                <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[24px] items-start justify-center p-[24px] relative rounded-[16px] shrink-0 w-full">
                                    <p
                                        className="font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-black w-full"
                                        style={{ fontWeight: 600 }}
                                    >
                                        Documents & Downloads
                                    </p>
                                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                                        {product.attachments.map((
                                            attachment,
                                        ) => (
                                            <div
                                                key={attachment.id}
                                                className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full pb-3 border-b border-gray-200"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-600" />
                                                    <span className="text-[rgba(29,29,31,0.5)]">
                                                        {attachment
                                                            .originalName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-black">
                                                        {(attachment.fileSize /
                                                            1024).toFixed(1)} KB
                                                    </span>
                                                    <a
                                                        href={attachment
                                                            .filePath}
                                                        download={attachment
                                                            .originalName}
                                                        className="flex items-center gap-1 text-[#00b56a] hover:text-[#00a55a] transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Center Section - Image Gallery */}
                        <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start justify-center min-h-px min-w-px relative rounded-[16px] shrink-0">
                            {/* Main Image Container */}
                            <div className="bg-neutral-50 box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-hidden px-[24px] py-[24px] relative rounded-[16px] shrink-0 w-full">
                                <div className="h-[456px] relative shrink-0 w-[232px]">
                                    <Image
                                        src={product.thumbnail ||
                                            product.images[0] ||
                                            "/assets/99f6956ff82b9d2c6f0d749b9e0c274fa969adad.png"}
                                        alt={product.name}
                                        width={232}
                                        height={456}
                                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                                    />
                                </div>
                            </div>

                            {/* Thumbnails Container */}
                            <div className="content-stretch flex gap-[8px] h-[84px] items-start relative shrink-0 w-full">
                                {product.images.slice(0, 5).map((
                                    image,
                                    index,
                                ) => (
                                    <div
                                        key={index}
                                        className="basis-0 bg-neutral-50 box-border content-stretch flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px overflow-hidden px-[24px] py-[24px] relative rounded-[4px] shrink-0"
                                    >
                                        <div className="h-[40px] relative shrink-0 w-[40px]">
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${
                                                    index + 1
                                                }`}
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
                                <p
                                    className="font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-black w-full"
                                    style={{ fontWeight: 600 }}
                                >
                                    Delivery
                                </p>
                                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                                    <div className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full">
                                        <p className="text-[rgba(29,29,31,0.5)]">
                                            Warehouse location
                                        </p>
                                        <p className="text-black">
                                            {product.vendor.businessName}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 font-medium text-[14px] w-full">
                                        <p className="text-[rgba(29,29,31,0.5)]">
                                            Packing time
                                        </p>
                                        <p className="text-black">
                                            2 days
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Container */}
                            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
                                <div className="basis-0 bg-[#1d1d1f] box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-[24px] py-[16px] relative rounded-[8px] shrink-0">
                                    <Plus className="w-4 h-4 text-white" />
                                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-pre">
                                        Add to cart
                                    </p>
                                </div>
                                <div className="basis-0 bg-[#00b56a] box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px px-[24px] py-[16px] relative rounded-[8px] shrink-0">
                                    <ShoppingCart className="w-4 h-4 text-white" />
                                    <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-pre">
                                        Buy now
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products Section - Last Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Similar Products
                    </h2>
                    <p className="text-gray-600">
                        Discover more products in the same category
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {similarProducts.map((similarProduct) => (
                        <ProductCard
                            key={similarProduct.id}
                            product={similarProduct}
                        />
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
