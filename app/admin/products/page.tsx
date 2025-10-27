import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ProductsTable } from '@/components/admin/ProductsTable';

interface Product {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    price: number;
    compareAtPrice: number | null;
    costPerItem: number | null;
    stock: number;
    lowStockThreshold: number;
    status: "DRAFT" | "PENDING" | "ACTIVE" | "REJECTED" | "OUT_OF_STOCK";
    wattage: number | null;
    voltage: number | null;
    panelType: string | null;
    efficiency: number | null;
    warranty: number | null;
    dimensions: string | null;
    weight: number | null;
    certification: string[];
    images: string[];
    thumbnail: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    vendor: {
        id: string;
        businessName: string;
        businessEmail: string;
        status: string;
        user: {
            name: string | null;
            email: string;
        };
    };
    categories: {
        id: string;
        name: string;
    }[];
}

interface Vendor {
    id: string;
    businessName: string;
    businessEmail: string;
    user: {
        name: string | null;
        email: string;
    };
}

async function getProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                    businessEmail: true,
                    status: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            },
            categories: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        publishedAt: product.publishedAt?.toISOString() || null
    }));
}

async function getVendors(): Promise<Vendor[]> {
    const vendors = await prisma.vendor.findMany({
        where: {
            status: 'APPROVED'
        },
        select: {
            id: true,
            businessName: true,
            businessEmail: true,
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            businessName: 'asc'
        }
    });

    return vendors;
}

export default async function AdminProductsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/unauthorized');
    }

    const [products, vendors] = await Promise.all([
        getProducts(),
        getVendors()
    ]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Product Management" />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/admin">
                                    Admin
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Product Management
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage and approve products from all vendors
                                </p>
                            </div>
                        </div>

                        {/* Products Table */}
                        <ProductsTable products={products} vendors={vendors} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
