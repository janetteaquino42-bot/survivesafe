import React from "react";
import { Head } from "@inertiajs/react";
import Logo from "@/Components/Logo";
import { motion } from "framer-motion";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import LinkButton from "@/Components/Buttons/LinkButton";
import { FaChevronLeft } from "react-icons/fa";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({
    children,
    title = "Authentication",
    heading,
    description,
    showBackgroundImage = true
}) {
    return (
        <>
            <Head title={title} />
            <div className="grid h-screen lg:grid-cols-2">
                {/* Right side - Background Image */}
                {showBackgroundImage && (
                    <div className="bg-muted relative hidden lg:block h-screen">
                        <img
                            src="/images/auth.webp"
                            alt="Authentication Background"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* Left side - Auth Form */}
                <div className="flex flex-col gap-4 p-6 md:p-10 h-screen overflow-y-auto">
                    {/* Logo and Brand */}
                    <div className="flex gap-2 justify-start flex-shrink-0">
                        <LinkButton href="/" className="text-sm" color="secondary">
                            <ChevronLeft /> Back to Home
                        </LinkButton>
                    </div>

                    {/* Form Container */}
                    <div className="flex flex-1 items-center justify-center px-2 sm:px-4">
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
                                    <Logo width={50} height={50} className="mx-auto sm:mx-0" />
                                    <div className="text-center sm:text-left">
                                        <h2 className="font-bold text-primary text-2xl">BACOOR</h2>
                                        <h3 className="uppercase text-sm text-balance">Disaster Risk Reduction &amp; Management Office</h3>
                                    </div>
                                </div>
                                {/* Optional Header */}
                                {(heading || description) && (
                                    <div className="flex flex-col items-start gap-1 text-start w-full mb-6">
                                        {heading && (
                                            <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
                                        )}
                                        {description && (
                                            <p className="text-gray-500 text-sm text-balance">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Form Content */}
                                {children}
                            </motion.div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}