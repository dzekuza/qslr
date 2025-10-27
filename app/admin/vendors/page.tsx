import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VendorsTable as VendorsTableComponent } from "@/components/admin/VendorsTable";

interface Vendor {
    id: string;
    businessName: string;
    businessEmail: string;
    businessPhone: string | null;
    status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
    createdAt: string;
    approvedAt: string | null;
    user: {
        name: string | null;
        email: string;
    };
}

async function getVendors() {
    const vendors = await prisma.vendor.findMany({
        where: {
            status: "APPROVED", // Only show approved vendors
        },
        select: {
            id: true,
            businessName: true,
            businessEmail: true,
            businessPhone: true,
            status: true,
            createdAt: true,
            approvedAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            businessName: "asc",
        },
    });

    return vendors.map((vendor) => ({
        ...vendor,
        createdAt: vendor.createdAt.toISOString(),
        approvedAt: vendor.approvedAt?.toISOString() || null,
    }));
}

export default async function VendorsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/unauthorized");
    }

    const vendors = await getVendors();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Vendor Management" />
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
                                <BreadcrumbPage>Vendors</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-4">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Vendor Management
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage and approve vendor applications
                                </p>
                            </div>
                        </div>

                        {/* Vendors Table */}
                        <VendorsTableComponent vendors={vendors} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
