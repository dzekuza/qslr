import React from "react";
import SolarNavigationMenu from "@/components/layout/solar-navigation";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen">
            <SolarNavigationMenu />
            <main className="p-2">
                {children}
            </main>
        </div>
    );
}
