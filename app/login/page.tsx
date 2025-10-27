"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";

const sampleTestimonials: Testimonial[] = [
    {
        avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
        name: "Sarah Chen",
        handle: "@sarahdigital",
        text:
            "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
    },
    {
        avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
        name: "Marcus Johnson",
        handle: "@marcustech",
        text:
            "This service has transformed how I work. Clean design, powerful features, and excellent support.",
    },
    {
        avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "David Martinez",
        handle: "@davidcreates",
        text:
            "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
    },
];

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData(
                event.currentTarget as HTMLFormElement,
            );
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else if (result?.ok) {
                // Redirect to dashboard - middleware will handle role-based routing
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // TODO: Implement Google OAuth
        console.log("Google sign in clicked");
    };

    const handleResetPassword = () => {
        // TODO: Implement password reset
        router.push("/forgot-password");
    };

    const handleCreateAccount = () => {
        router.push("/register");
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <SignInPage
                title={
                    <span className="font-light text-foreground tracking-tighter">
                        Welcome to{" "}
                        <span className="font-semibold">Solar Marketplace</span>
                    </span>
                }
                description="Access your account and continue your journey with us"
                heroVideoSrc="/sun_store_header.mp4"
                testimonials={sampleTestimonials}
                onSignIn={handleSignIn}
                onGoogleSignIn={handleGoogleSignIn}
                onResetPassword={handleResetPassword}
                onCreateAccount={handleCreateAccount}
            />
            {error && (
                <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg z-50">
                    {error}
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 flex items-center gap-3">
                        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin">
                        </div>
                        <p>Signing in...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
