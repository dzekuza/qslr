import React from "react";
import SolarNavigationMenu from "@/components/layout/solar-navigation";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen">
            <SolarNavigationMenu />
            <main className="pt-20 p-2 bg-gray-100 gap-4 space-y-2">
                {children}
            </main>
        </div>
    );
}
