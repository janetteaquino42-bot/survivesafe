import { Button as HeroButton } from "@heroui/react";

export default function SuccessButton({
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
            color="success"
            variant="solid"
            size={size}
            startContent={startContent}
            endContent={endContent}
            fullWidth={fullWidth}
            radius="lg"
            className={`font-semibold transition-all bg-green-600 hover:bg-green-700 text-white rounded-xl ${className}`}
            {...props}
        >
            {children}
        </HeroButton>
    );
}
