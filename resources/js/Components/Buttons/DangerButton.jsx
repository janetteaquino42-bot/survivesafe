import { Button as HeroButton } from "@heroui/react";

export default function DangerButton({
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
            color="danger"
            variant="solid"
            size={size}
            startContent={startContent}
            endContent={endContent}
            fullWidth={fullWidth}
            radius="lg"
            className={`font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-all ${className}`}
            {...props}
        >
            {children}
        </HeroButton>
    );
}
