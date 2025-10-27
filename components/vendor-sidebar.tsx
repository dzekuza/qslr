"use client";

import * as React from "react";
import {
  LifeBuoy,
  Package,
  Send,
  Settings,
  ShoppingCart,
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

const navMain = [
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

const navSecondary = [
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

const projects = [
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

export function VendorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/vendor">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Vendor Dashboard
                  </span>
                  <span className="truncate text-xs">Solar Marketplace</span>
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
