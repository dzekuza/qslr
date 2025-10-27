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
import { WarehousesTable } from '@/components/admin/WarehousesTable';

interface Warehouse {
    id: string;
    vendorId: string;
    name: string;
    country: string;
    street: string;
    city: string;
    zipCode: string;
    apartment: string | null;
    contactName: string;
    email: string;
    phone: string;
    address: string | null;
    state: string | null;
    postalCode: string | null;
    isActive: boolean | null;
    cifPrice: number | null;
    cifCurrency: string | null;
    exwPrice: number | null;
    exwCurrency: string | null;
    fcaPrice: number | null;
    fcaCurrency: string | null;
    deliveryCountries: string[];
    createdAt: string;
    updatedAt: string;
    vendor: {
        id: string;
        businessName: string;
        businessEmail: string;
        businessPhone: string | null;
        status: string;
        user: {
            name: string | null;
            email: string;
        };
    };
}

async function getWarehouses(): Promise<Warehouse[]> {
    const warehouses = await prisma.warehouse.findMany({
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                    businessEmail: true,
                    businessPhone: true,
                    status: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return warehouses.map(warehouse => ({
        ...warehouse,
        createdAt: warehouse.createdAt.toISOString(),
        updatedAt: warehouse.updatedAt.toISOString()
    }));
}

export default async function AdminWarehousesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/unauthorized');
    }

    const warehouses = await getWarehouses();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Warehouse Management" />
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
                                <BreadcrumbPage>Warehouses</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Warehouse Management
                                </h1>
                                <p className="text-muted-foreground">
                                    View and manage warehouses from all vendors
                                </p>
                            </div>
                        </div>

                        {/* Warehouses Table */}
                        <WarehousesTable warehouses={warehouses} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
