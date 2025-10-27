"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Activity,
    BarChart,
    CheckCircle,
    Clock,
    FileCode,
    FileText,
    Package,
    Settings,
    Shield,
    ShoppingCart,
    TrendingUp,
    Users,
    XCircle,
} from "lucide-react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Still loading

        if (!session) {
            router.push("/login");
            return;
        }

        if (session.user.role !== "ADMIN") {
            router.push("/unauthorized");
            return;
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto">
                    </div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Top Row - Summary Cards */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Vendors
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">
                                    +2 from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Products
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">156</div>
                                <p className="text-xs text-muted-foreground">
                                    +23 from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Orders
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">89</div>
                                <p className="text-xs text-muted-foreground">
                                    +12 from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Platform Revenue
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    $12,450
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +8.2% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle Row - Three Sections */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Admin Actions */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    <CardTitle>Admin Actions</CardTitle>
                                </div>
                                <CardDescription>
                                    Quick administrative tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={() =>
                                        router.push("/admin/vendors")}
                                >
                                    <Users className="h-4 w-4" />
                                    Manage Vendors
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={() =>
                                        router.push("/admin/products")}
                                >
                                    <Package className="h-4 w-4" />
                                    Manage Products
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={() => router.push("/admin/orders")}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Manage Orders
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                    onClick={() =>
                                        router.push("/admin/settings")}
                                >
                                    <Settings className="h-4 w-4" />
                                    System Settings
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Vendor Approvals */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    <CardTitle>Vendor Approvals</CardTitle>
                                </div>
                                <CardDescription>
                                    Pending vendor applications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">
                                            Green Energy Solutions
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                        Pending
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">
                                            SolarTech Pro
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-600 text-white border-blue-700"
                                    >
                                        Approved
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">
                                            EcoPanels Inc
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-red-50 text-red-700 border-red-200"
                                    >
                                        Rejected
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Platform Analytics */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <BarChart className="h-5 w-5" />
                                    <CardTitle>Platform Analytics</CardTitle>
                                </div>
                                <CardDescription>
                                    Key performance metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Total Visitors
                                    </div>
                                    <Select defaultValue="30">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7">
                                                Last 7 days
                                            </SelectItem>
                                            <SelectItem value="30">
                                                Last 30 days
                                            </SelectItem>
                                            <SelectItem value="90">
                                                Last 90 days
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="h-[150px] overflow-hidden">
                                    <ChartAreaInteractive />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Bottom Row - Two Sections */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    <CardTitle>Recent Activity</CardTitle>
                                </div>
                                <CardDescription>
                                    Latest platform activity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                            <Users className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                New vendor registered
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                2 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                            <Package className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                New product added
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                4 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                New order placed
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                6 hours ago
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    <CardTitle>Recent Orders</CardTitle>
                                </div>
                                <CardDescription>
                                    Latest customer orders
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <FileCode className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Order #1234
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Customer: John Doe
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                $1,250.00
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                Pending
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                                <FileCode className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Order #1233
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Customer: Jane Smith
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                $890.00
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                                Paid
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                                <FileCode className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Order #1232
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Customer: Bob Johnson
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                $2,450.00
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                            >
                                                Processing
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
