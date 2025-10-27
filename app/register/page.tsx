"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpPage } from "@/components/ui/sign-up";

export default function CustomerRegistrationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData(event.currentTarget);
            const data = {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                password: formData.get("password") as string,
                confirmPassword: formData.get("confirmPassword") as string,
                acceptTerms: formData.get("acceptTerms") === "on",
            };

            // Validate password match
            if (data.password !== data.confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    role: "CUSTOMER",
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Registration failed");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // TODO: Implement Google OAuth
        console.log("Google sign up clicked");
    };

    const handleSignIn = () => {
        router.push("/login");
    };

    if (success) {
        return (
            <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
                <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="mb-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                        Registration Successful!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Your account has been created successfully. Redirecting to
                        sign in...
                    </p>
                    <button
                        onClick={() => router.push("/login")}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen">
            <SignUpPage
                title={
                    <span className="font-light text-foreground tracking-tighter">
                        Welcome to{" "}
                        <span className="font-semibold">Solar Marketplace</span>
                    </span>
                }
                description="Create your account and start your solar journey today"
                heroVideoSrc="/sun_store_header.mp4"
                onSignUp={handleSignUp}
                onGoogleSignUp={handleGoogleSignUp}
                onSignIn={handleSignIn}
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
                        <p>Creating account...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
