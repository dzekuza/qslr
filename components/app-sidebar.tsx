"use client";

import * as React from "react";
import {
  BarChart,
  FileText,
  LifeBuoy,
  Package,
  Send,
  Settings,
  Shield,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Vendor navigation
const vendorNavMain = [
  {
    title: "Dashboard",
    url: "/vendor",
    icon: ShoppingCart,
    isActive: true,
  },
  {
    title: "Products",
    url: "/vendor/products",
    icon: Package,
  },
  {
    title: "Warehouses",
    url: "/vendor/warehouses",
    icon: Warehouse,
  },
  {
    title: "Settings",
    url: "/vendor/settings",
    icon: Settings,
  },
];

const vendorNavSecondary = [
  {
    title: "Support",
    url: "/vendor/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/vendor/feedback",
    icon: Send,
  },
];

const vendorProjects = [
  {
    name: "Orders",
    url: "/vendor/orders",
    icon: ShoppingCart,
  },
  {
    name: "Analytics",
    url: "/vendor/analytics",
    icon: Package,
  },
];

// Admin navigation
const adminNavMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Shield,
    isActive: true,
  },
  {
    title: "Vendors",
    url: "/admin/vendors",
    icon: Users,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Warehouses",
    url: "/admin/warehouses",
    icon: Warehouse,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const adminNavSecondary = [
  {
    title: "Support",
    url: "/admin/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/admin/feedback",
    icon: Send,
  },
];

const adminProjects = [
  {
    name: "Analytics",
    url: "/admin/analytics",
    icon: BarChart,
  },
  {
    name: "Reports",
    url: "/admin/reports",
    icon: FileText,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  // Create user data from session
  const userData = session
    ? {
      name: session.user.name || "User",
      email: session.user.email,
      avatar: "/avatars/default.jpg",
    }
    : {
      name: "Loading...",
      email: "loading@example.com",
      avatar: "/avatars/default.jpg",
    };

  // Determine navigation based on user role
  const isAdmin = session?.user?.role === "ADMIN";
  const navMain = isAdmin ? adminNavMain : vendorNavMain;
  const navSecondary = isAdmin ? adminNavSecondary : vendorNavSecondary;
  const projects = isAdmin ? adminProjects : vendorProjects;

  // Determine header content based on role
  const headerTitle = isAdmin ? "Admin Dashboard" : "Vendor Dashboard";
  const headerSubtitle = "Solar Marketplace";
  const headerIcon = isAdmin ? Shield : Package;
  const headerUrl = isAdmin ? "/admin" : "/vendor";

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={headerUrl}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {React.createElement(headerIcon, { className: "size-4" })}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {headerTitle}
                  </span>
                  <span className="truncate text-xs">{headerSubtitle}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
