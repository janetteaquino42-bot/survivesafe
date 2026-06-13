import { Card as HeroCard, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function Card({
    children,
    header,
    footer,
    className = "",
    shadow = "lg",
    variant = "bordered",
    isHoverable = false,
    isPressable = false,
    onClick,
    ...props
}) {
    return (
        <HeroCard
            shadow={shadow}
            radius="lg"
            className={`border-gray-200 ${isHoverable ? "hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" : ""
                } ${className} border-none rounded-xl shadow-sm transition-all bg-gray-50`}
            isPressable={isPressable}
            isHoverable={isHoverable}
            onPress={onClick}
            {...props}
        >
            {header && (
                <CardHeader className="flex gap-3 border-b border-gray-100 pb-4 ">
                    {typeof header === "string" ? (
                        <h3 className="font-bold text-xl text-gray-800">{header}</h3>
                    ) : (
                        header
                    )}
                </CardHeader>
            )}

            <CardBody className="p-5 sm:pt-4 lg:pt-6">{children}</CardBody>

            {footer && (
                <CardFooter className="border-t border-gray-100 pt-4">
                    {footer}
                </CardFooter>
            )}
        </HeroCard>
    );
}
