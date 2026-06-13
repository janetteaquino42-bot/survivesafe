import { Button as HeroButton } from "@heroui/react";

export default function PrimaryButton({
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
            color="primary"
            variant="solid"
            size={size}
            startContent={startContent}
            endContent={endContent}
            fullWidth={fullWidth}
            radius="lg"
            className={`font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white rounded-xl ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            {...props}
        >
            {children}
        </HeroButton>
    );
}
