"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LogoLoop } from "@/components/LogoLoop";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
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

interface SignUpPageProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    heroVideoSrc?: string;
    heroImageSrc?: string;
    onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
    onGoogleSignUp?: () => void;
    onSignIn?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
        {children}
    </div>
);

// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
    title = (
        <span className="font-light text-foreground tracking-tighter">
            Create Account
        </span>
    ),
    description = "Join us today and start your solar journey",
    heroVideoSrc,
    heroImageSrc,
    onSignUp,
    onGoogleSignUp,
    onSignIn,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        role: "CUSTOMER" as "CUSTOMER" | "VENDOR",
    });
    const [slideDirection, setSlideDirection] = useState<"left" | "right">(
        "left",
    );

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video || !heroVideoSrc) return;

        video.load();

        const handleLoadedMetadata = () => {
            video.play().catch((error) => {
                console.error("Error playing video:", error);
            });
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        video.addEventListener("canplay", () => {
            video.play().catch(() => {
                // Silent fail - autoplay might be blocked
            });
        });

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [heroVideoSrc]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const goToNextStep = () => {
        setSlideDirection("left");
        setCurrentStep(currentStep + 1);
    };

    const goToPreviousStep = () => {
        setSlideDirection("right");
        setCurrentStep(currentStep - 1);
    };

    const handleStepperComplete = () => {
        // Trigger form submission when stepper is complete
        if (onSignUp) {
            // Manually call onSignUp with collected data
            const form = document.createElement("form");
            Object.entries(formData).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            });
            // Add acceptTerms checkbox
            const checkbox = document.createElement("input");
            checkbox.name = "acceptTerms";
            checkbox.type = "checkbox";
            checkbox.checked = true;
            form.appendChild(checkbox);

            const fakeEvent = {
                currentTarget: form,
                preventDefault: () => {},
            } as React.FormEvent<HTMLFormElement>;

            onSignUp(fakeEvent);
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw]">
            {/* Left column: sign-up form with stepper */}
            <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-background">
                <div className="w-full max-w-2xl">
                    <div className="mb-8">
                        <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight mb-4">
                            {title}
                        </h1>
                        <p className="animate-element animate-delay-200 text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    currentStep >= 1
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {currentStep > 1 ? "✓" : "1"}
                            </div>
                            <div
                                className={`w-12 h-1 ${
                                    currentStep >= 2 ? "bg-primary" : "bg-muted"
                                }`}
                            >
                            </div>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    currentStep >= 2
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {currentStep > 2 ? "✓" : "2"}
                            </div>
                            <div
                                className={`w-12 h-1 ${
                                    currentStep >= 3 ? "bg-primary" : "bg-muted"
                                }`}
                            >
                            </div>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    currentStep >= 3
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                3
                            </div>
                        </div>
                    </div>

                    <form>
                        {/* Step 1: Email and Password */}
                        {currentStep === 1 && (
                            <FieldGroup
                                className={`transition-all duration-300 ease-in-out ${
                                    slideDirection === "left"
                                        ? "animate-slide-in-left"
                                        : "animate-slide-in-right"
                                }`}
                            >
                                <Field>
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
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </GlassInputWrapper>
                                </Field>

                                <Field>
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
                                                placeholder="Create a password"
                                                className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                                                required
                                                value={formData.password}
                                                onChange={handleInputChange}
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

                                <Field>
                                    <FieldLabel htmlFor="confirmPassword">
                                        Confirm Password
                                    </FieldLabel>
                                    <GlassInputWrapper>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword
                                                    ? "text"
                                                    : "password"}
                                                placeholder="Confirm your password"
                                                className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )}
                                                className="absolute inset-y-0 right-3 flex items-center"
                                            >
                                                {showConfirmPassword
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
                        )}

                        {/* Step 2: Name and Phone */}
                        {currentStep === 2 && (
                            <FieldGroup
                                className={`transition-all duration-300 ease-in-out ${
                                    slideDirection === "left"
                                        ? "animate-slide-in-left"
                                        : "animate-slide-in-right"
                                }`}
                            >
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Full Name
                                    </FieldLabel>
                                    <GlassInputWrapper>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </GlassInputWrapper>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="phone">
                                        Phone Number (Optional)
                                    </FieldLabel>
                                    <GlassInputWrapper>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </GlassInputWrapper>
                                </Field>

                                <Field>
                                    <div className="flex items-start text-sm pt-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="acceptTerms"
                                                className="custom-checkbox"
                                                required
                                            />
                                            <span className="text-foreground/90">
                                                I agree to the{" "}
                                                <a
                                                    href="/terms"
                                                    className="text-violet-400 hover:underline"
                                                >
                                                    Terms and Conditions
                                                </a>{" "}
                                                and{" "}
                                                <a
                                                    href="/privacy"
                                                    className="text-violet-400 hover:underline"
                                                >
                                                    Privacy Policy
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                </Field>
                            </FieldGroup>
                        )}

                        {/* Step 3: Account Type */}
                        {currentStep === 3 && (
                            <FieldGroup
                                className={`transition-all duration-300 ease-in-out ${
                                    slideDirection === "left"
                                        ? "animate-slide-in-left"
                                        : "animate-slide-in-right"
                                }`}
                            >
                                <Field>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-semibold mb-2">
                                            Account Type
                                        </h2>
                                        <p className="text-muted-foreground">
                                            Choose your account type
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    role: "CUSTOMER",
                                                }))}
                                            className={`p-6 rounded-2xl border-2 transition-all ${
                                                formData.role === "CUSTOMER"
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border bg-card hover:border-primary/50"
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">
                                                    🛒
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">
                                                    Customer
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Shop for solar panels and
                                                    products
                                                </p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    role: "VENDOR",
                                                }))}
                                            className={`p-6 rounded-2xl border-2 transition-all ${
                                                formData.role === "VENDOR"
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border bg-card hover:border-primary/50"
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">
                                                    🏪
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">
                                                    Vendor
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Sell products on our
                                                    marketplace
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        )}
                    </form>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={goToPreviousStep}
                            disabled={currentStep === 1}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentStep === 1
                                    ? "text-muted-foreground cursor-not-allowed"
                                    : "text-foreground hover:bg-muted"
                            }`}
                        >
                            Back
                        </button>
                        {currentStep < 3 && (
                            <button
                                type="button"
                                onClick={goToNextStep}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Continue
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button
                                type="button"
                                onClick={handleStepperComplete}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Create{" "}
                                {formData.role === "VENDOR"
                                    ? "Vendor"
                                    : "Customer"} Account
                            </button>
                        )}
                    </div>

                    {/* Google Sign Up and Sign In Link */}
                    <div className="mt-6 space-y-4">
                        <div className="relative flex items-center justify-center">
                            <span className="w-full border-t border-border">
                            </span>
                            <span className="px-4 text-sm text-muted-foreground bg-background absolute">
                                Or continue with
                            </span>
                        </div>

                        <button
                            onClick={onGoogleSignUp}
                            className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSignIn?.();
                                }}
                                className="text-violet-400 hover:underline transition-colors"
                            >
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero video/image */}
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
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full  z-10">
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
