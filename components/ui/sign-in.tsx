"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LogoLoop } from "@/components/LogoLoop";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 48 48"
    >
        <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
        />
        <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
        />
    </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
    avatarSrc: string;
    name: string;
    handle: string;
    text: string;
}

interface SignInPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroImageSrc?: string;
    heroVideoSrc?: string;
    testimonials?: Testimonial[];
    onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGoogleSignIn?: () => void;
    onResetPassword?: () => void;
    onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
        {children}
    </div>
);

const TestimonialCard = (
    { testimonial, delay }: { testimonial: Testimonial; delay: string },
) => (
    <div
        className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}
    >
        <img
            src={testimonial.avatarSrc}
            className="h-10 w-10 object-cover rounded-2xl"
            alt="avatar"
        />
        <div className="text-sm leading-snug">
            <p className="flex items-center gap-1 font-medium">
                {testimonial.name}
            </p>
            <p className="text-muted-foreground">{testimonial.handle}</p>
            <p className="mt-1 text-foreground/80">{testimonial.text}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
    title = (
        <span className="font-light text-foreground tracking-tighter">
            Welcome
        </span>
    ),
    description = "Access your account and continue your journey with us",
    heroImageSrc,
    heroVideoSrc,
    testimonials = [],
    onSignIn,
    onGoogleSignIn,
    onResetPassword,
    onCreateAccount,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video || !heroVideoSrc) return;

        // Set video source
        video.load();

        // Try to play when metadata is loaded
        const handleLoadedMetadata = () => {
            video.play().catch((error) => {
                console.error("Error playing video:", error);
            });
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        // Fallback: try to play on load
        video.addEventListener("canplay", () => {
            video.play().catch(() => {
                // Silent fail - autoplay might be blocked
            });
        });

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [heroVideoSrc]);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw]">
            {/* Left column: sign-in form */}
            <section className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-6">
                        <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
                            {title}
                        </h1>
                        <p className="animate-element animate-delay-200 text-muted-foreground">
                            {description}
                        </p>

                        <form className="space-y-5" onSubmit={onSignIn}>
                            <FieldGroup className="space-y-5">
                                <Field className="animate-element animate-delay-300">
                                    <FieldLabel htmlFor="email">
                                        Email Address
                                    </FieldLabel>
                                    <GlassInputWrapper>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                                        />
                                    </GlassInputWrapper>
                                </Field>

                                <Field className="animate-element animate-delay-400">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <GlassInputWrapper>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword
                                                    ? "text"
                                                    : "password"}
                                                placeholder="Enter your password"
                                                className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )}
                                                className="absolute inset-y-0 right-3 flex items-center"
                                            >
                                                {showPassword
                                                    ? (
                                                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                                    )
                                                    : (
                                                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                                    )}
                                            </button>
                                        </div>
                                    </GlassInputWrapper>
                                </Field>
                            </FieldGroup>

                            <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        className="custom-checkbox"
                                    />
                                    <span className="text-foreground/90">
                                        Keep me signed in
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onResetPassword?.();
                                    }}
                                    className="hover:underline text-violet-400 transition-colors"
                                >
                                    Reset password
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="animate-element animate-delay-700 relative flex items-center justify-center">
                            <span className="w-full border-t border-border">
                            </span>
                            <span className="px-4 text-sm text-muted-foreground bg-background absolute">
                                Or continue with
                            </span>
                        </div>

                        <button
                            onClick={onGoogleSignIn}
                            className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
                            New to our platform?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onCreateAccount?.();
                                }}
                                className="text-violet-400 hover:underline transition-colors"
                            >
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero video/image + testimonials */}
            {(heroVideoSrc || heroImageSrc) && (
                <section className="hidden md:block flex-1 relative p-4">
                    <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl overflow-hidden bg-black">
                        {!videoLoaded && (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <p>Loading video...</p>
                            </div>
                        )}
                        {heroVideoSrc && (
                            <video
                                ref={videoRef}
                                src={heroVideoSrc}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                autoPlay
                                preload="auto"
                                onError={(e) => {
                                    console.error(
                                        "Video error:",
                                        e.currentTarget.error,
                                    );
                                    console.error(
                                        "Video src:",
                                        e.currentTarget.src,
                                    );
                                    setVideoLoaded(false);
                                }}
                                onLoadStart={() =>
                                    console.log("Video loading started")}
                                onLoadedMetadata={() =>
                                    console.log("Video metadata loaded")}
                                onLoadedData={() => {
                                    console.log(
                                        "Video data loaded successfully",
                                    );
                                    setVideoLoaded(true);
                                }}
                                style={{
                                    display: videoLoaded ? "block" : "none",
                                }}
                            >
                            </video>
                        )}
                        {!heroVideoSrc && heroImageSrc && (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${heroImageSrc})`,
                                }}
                            />
                        )}

                        {/* LogoLoop inside video container */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full z-10">
                            <LogoLoop
                                logos={[
                                    {
                                        src: "/download.svg",
                                        alt: "SolarTech",
                                    },
                                    {
                                        src: "/download.svg",
                                        alt: "GreenEnergy",
                                    },
                                    {
                                        src: "/download.svg",
                                        alt: "SunPower",
                                    },
                                    {
                                        src: "/download.svg",
                                        alt: "EcoSolar",
                                    },
                                    {
                                        src: "/download.svg",
                                        alt: "RenewablePro",
                                    },
                                    {
                                        src: "/download.svg",
                                        alt: "CleanTech",
                                    },
                                ]}
                                speed={60}
                                direction="left"
                                logoHeight={32}
                                gap={24}
                                pauseOnHover={true}
                                fadeOut={false}
                                className="opacity-80 [&_img]:brightness-0 [&_img]:invert"
                            />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
