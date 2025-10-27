import React from "react";
import {
    BarChart,
    DollarSign,
    FileText,
    GlobeIcon,
    Grid2x2PlusIcon,
    Handshake,
    HelpCircle,
    Home,
    LayersIcon,
    Leaf,
    MenuIcon,
    Package,
    PlugIcon,
    RotateCcw,
    Settings,
    Shield,
    Star,
    Sun,
    TrendingUp,
    UserPlusIcon,
    Users,
    XIcon,
    Zap,
} from "lucide-react";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    NavGridCard,
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavItemMobile,
    type NavItemType,
    NavLargeItem,
    NavSmallItem,
} from "@/components/ui/navigation-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const productLinks: NavItemType[] = [
    {
        title: "Solar Panels",
        href: "/products/solar-panels",
        description:
            "High-efficiency solar panels for residential and commercial use",
        icon: Sun,
    },
    {
        title: "Inverters",
        href: "/products/inverters",
        description: "Power inverters to convert DC to AC electricity",
        icon: Zap,
    },
    {
        title: "Mounting Systems",
        href: "/products/mounting",
        description: "Professional mounting solutions for solar installations",
        icon: Package,
    },
    {
        title: "Battery Storage",
        href: "/products/batteries",
        description: "Energy storage solutions for solar systems",
        icon: LayersIcon,
    },
    {
        title: "Monitoring",
        href: "/products/monitoring",
        description: "Real-time solar system monitoring and analytics",
        icon: BarChart,
    },
    {
        title: "Accessories",
        href: "/products/accessories",
        description: "Cables, connectors, and installation accessories",
        icon: PlugIcon,
    },
    {
        title: "Installation Services",
        href: "/services/installation",
        description: "Professional solar installation services",
        icon: Settings,
    },
    {
        title: "Maintenance",
        href: "/services/maintenance",
        description: "Solar system maintenance and repair services",
        icon: TrendingUp,
    },
];

export const companyLinks: NavItemType[] = [
    {
        title: "About Us",
        href: "/about",
        description: "Learn more about our mission and team",
        icon: Users,
    },
    {
        title: "Success Stories",
        href: "/success-stories",
        description: "See how we've helped customers go solar",
        icon: Star,
    },
    {
        title: "Terms of Service",
        href: "/terms",
        description: "Understand our terms and conditions",
        icon: FileText,
    },
    {
        title: "Privacy Policy",
        href: "/privacy",
        description: "How we protect your information",
        icon: Shield,
    },
    {
        title: "Refund Policy",
        href: "/refunds",
        description: "Details about refunds and cancellations",
        icon: RotateCcw,
    },
    {
        title: "Partnerships",
        href: "/partnerships",
        icon: Handshake,
        description: "Partner with us for mutual growth",
    },
    {
        title: "Blog",
        href: "/blog",
        icon: Leaf,
        description: "Solar energy insights and company news",
    },
    {
        title: "Help Center",
        href: "/help",
        icon: HelpCircle,
        description: "Find answers to your questions",
    },
];

export default function SolarNavigationMenu() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4">
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 -z-10 size-full",
                    "bg-[radial-gradient(color-mix(in_oklab,--theme(--color-foreground/.2)30%,transparent)_2px,transparent_2px)]",
                    "bg-[size:12px_12px]",
                )}
            />

            <div className="bg-white/10 backdrop-blur-md mx-auto h-14 w-full max-w-4xl border border-white/20 px-4 rounded-lg shadow-2xl">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sun className="size-6 text-primary" />
                        <p className="font-mono text-lg font-bold">
                            SolarMarket
                        </p>
                    </div>
                    <DesktopMenu />

                    <div className="flex items-center gap-2">
                        <Button>Get Started</Button>
                        <MobileNav />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesktopMenu() {
    return (
        <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent className="w-full max-w-none">
                        <div className="grid w-full md:grid-cols-[1fr_.30fr]">
                            <ul className="grid grow gap-4 p-4 md:grid-cols-3 md:border-r">
                                {productLinks.slice(0, 3).map((link) => (
                                    <li key={link.href}>
                                        <NavGridCard link={link} />
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-1 p-4">
                                {productLinks.slice(3).map((link) => (
                                    <li key={link.href}>
                                        <NavSmallItem
                                            item={link}
                                            href={link.href}
                                            className="gap-x-1"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                    <NavigationMenuContent className="w-full max-w-none">
                        <div className="grid w-full md:grid-cols-[1fr_.40fr]">
                            <ul className="grid grow grid-cols-2 gap-4 p-4 md:border-r">
                                {companyLinks.slice(0, 2).map((link) => (
                                    <li key={link.href}>
                                        <NavGridCard
                                            link={link}
                                            className="min-h-36"
                                        />
                                    </li>
                                ))}
                                <div className="col-span-2 grid grid-cols-3 gap-x-4">
                                    {companyLinks.slice(2, 5).map((link) => (
                                        <li key={link.href}>
                                            <NavLargeItem
                                                href={link.href}
                                                link={link}
                                            />
                                        </li>
                                    ))}
                                </div>
                            </ul>
                            <ul className="space-y-2 p-4">
                                {companyLinks.slice(5, 10).map((link) => (
                                    <li key={link.href}>
                                        <NavLargeItem
                                            href={link.href}
                                            link={link}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className="cursor-pointer"
                        href="/pricing"
                    >
                        Pricing
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function MobileNav() {
    const sections = [
        {
            id: "products",
            name: "Products",
            list: productLinks,
        },
        {
            id: "company",
            name: "Company",
            list: companyLinks,
        },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full lg:hidden"
                >
                    <MenuIcon className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-background/95 supports-[backdrop-filter]:bg-background/80 w-full gap-0 backdrop-blur-lg">
                <div className="container grid gap-y-2 overflow-y-auto px-4 pt-5 pb-12">
                    <Accordion type="single" collapsible>
                        {sections.map((section) => (
                            <AccordionItem key={section.id} value={section.id}>
                                <AccordionTrigger className="capitalize hover:no-underline">
                                    {section.name}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-1">
                                    <ul className="grid gap-1">
                                        {section.list.map((link) => (
                                            <li key={link.href}>
                                                <SheetClose asChild>
                                                    <NavItemMobile
                                                        item={link}
                                                        href={link.href}
                                                    />
                                                </SheetClose>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>
    );
}
