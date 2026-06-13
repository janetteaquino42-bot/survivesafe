import { Button as HeroButton } from "@heroui/react";

export default function SecondaryButton({
    children,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
    className = "",
    size = "md",
    startContent,
    endContent,
    fullWidth = false,
    ...props
}) {
    return (
        <HeroButton
            type={type}
            onClick={onClick}
            isDisabled={disabled}
            isLoading={loading}
            color="default"
            variant="bordered"
            size={size}
            startContent={startContent}
            endContent={endContent}
            fullWidth={fullWidth}
            radius="lg"
            className={`font-semibold border-2 rounded-xl hover:bg-gray-100 transition-all ${className}`}
            {...props}
        >
            {children}
        </HeroButton>
    );
}
