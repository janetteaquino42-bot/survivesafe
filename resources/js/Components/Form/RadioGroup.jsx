import { RadioGroup as HeroRadioGroup, Radio } from "@heroui/react";

export default function RadioGroup({
    label,
    name,
    value,
    onChange,
    options = [],
    orientation = "vertical",
    error = "",
    required = false,
    disabled = false,
    className = "",
    description = "",
    color = "primary",
    ...props
}) {
    return (
        <div className={`w-full ${className}`}>
            <label htmlFor={name} className="font-semibold text-gray-700 mb-0">{label} {required && <span className="text-red-500">*</span>}</label>
            <HeroRadioGroup
                name={name}
                value={value}
                onValueChange={onChange}
                orientation={orientation}
                isInvalid={!!error}
                errorMessage={error}
                isRequired={required}
                isDisabled={disabled}
                description={description}
                className="mt-2"
                color={color}
                classNames={{
                    label: "text-gray-700 font-semibold text-sm",
                    description: "text-gray-500 text-xs",
                    innerWrapper: "mt-2",
                    radioGroup: "gap-4",
                    control: `
                            border-2 
                            border-blue-500 
                            ring-2 
                            ring-blue-200 
                            data-[selected=true]:bg-blue-500 
                            data-[selected=true]:ring-blue-500 
                            data-[selected=false]:bg-white 
                            data-[selected=false]:ring-blue-200
                        `
                }}
                {...props}

            >
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        value={option.value}
                        description={option.description}
                        isDisabled={option.disabled}
                        classNames={{
                            label: "text-gray-700",
                            control: "border-2 border-blue-500 ring-4 ring-blue-300 data-[selected=true]:bg-blue-500 data-[selected=true]:ring-blue-500",
                            icon: "bg-white data-[selected=true]:bg-blue-700",
                        }}
                    >
                        {option.label}
                    </Radio>
                ))}
            </HeroRadioGroup>
        </div>
    );
}
