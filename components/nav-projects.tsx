"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-sidebar-foreground/70"
        >
          <Plus />
          <span className="sr-only">Add Project</span>
        </Button>
      </div>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} onClick={() => isMobile && toggleSidebar()}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
