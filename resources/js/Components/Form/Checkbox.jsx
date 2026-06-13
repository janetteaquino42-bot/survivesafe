import { Checkbox as HeroCheckbox } from "@heroui/react";

export default function Checkbox({
    label,
    name,
    checked,
    onChange,
    color = "primary",
    size = "md",
    disabled = false,
    className = "",
    description = "",
    isIndeterminate = false,
    ...props
}) {
    return (
        <HeroCheckbox
            name={name}
            isSelected={checked}
            onValueChange={onChange}
            color={color}
            size={size}
            isDisabled={disabled}
            isIndeterminate={isIndeterminate}
            className={className}
            classNames={{
                label: "text-gray-700 font-medium",
                icon: "text-white", // set check color to white
            }}
            {...props}
        >
            <div>
                <span className="font-medium text-  -800">{label}</span>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
        </HeroCheckbox>
    );
}
