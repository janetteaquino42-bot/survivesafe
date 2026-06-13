import { Link } from "@inertiajs/react";

export default function LinkButton({
    children,
    href,
    className = "",
    color = "primary",
    underline = "hover",
    size = "md",
    disabled = false,
    external = false,
    ...props
}) {
    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    const colorClasses = {
        primary: "text-blue-600 hover:text-blue-700",
        secondary: "text-gray-600 hover:text-gray-800",
        success: "text-green-600 hover:text-green-700",
        danger: "text-red-600 hover:text-red-700",
    };

    const underlineClasses = {
        none: "",
        hover: "hover:underline",
        always: "underline",
    };

    const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${underlineClasses[underline]} 
        font-medium transition-colors inline-flex items-center gap-1
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}`;

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClasses}
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={baseClasses} {...props}>
            {children}
        </Link>
    );
}
