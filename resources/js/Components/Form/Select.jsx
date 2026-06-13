import { Select as HeroSelect, SelectItem } from "@heroui/react";
import InputError from "./InputError";

export default function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    error = "",
    required = false,
    disabled = false,
    className = "",
    variant = "bordered",
    size = "md",
    description = "",
    startContent,
    multiple = false,
    ...props
}) {
    return (
        <div>
            <label htmlFor={name} className="font-semibold text-gray-700 mb-0">{label} {required && <span className="text-red-500">*</span>}</label>
            <HeroSelect
                name={name}
                selectedKeys={value ? (multiple ? value : [value]) : []}
                onSelectionChange={(keys) => {
                    const selected = Array.from(keys);
                    onChange(multiple ? selected : selected[0]);
                }}
                placeholder={placeholder}
                isInvalid={!!error}
                isRequired={required}
                isDisabled={disabled}
                variant={variant}
                size={size}
                radius="lg"
                description={description}
                startContent={startContent}
                selectionMode={multiple ? "multiple" : "single"}
                className={`!mt-2 ${className}`}
                classNames={{
                    value: "text-gray-900",
                    // trigger: "border-2 border-gray-300 hover:border-blue-400 data-[focus=true]:!border-blue-600 shadow-sm bg-white rounded-xl",
                    // description: "text-gray-500 text-xs",
                    // innerWrapper: "bg-gray-50",
                    trigger: `min-h-[40px] border border-gray-300 rounded-lg shadow-sm ${disabled
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : 'bg-white hover:border-gray-400'
                        }`,
                    // value: "text-sm",
                    listboxWrapper: "max-h-[300px] overflow-y-auto",
                    listbox: "p-0",
                    popoverContent: "bg-white",
                    base: "w-full"
                }}
                labelPlacement="outside"
                listboxProps={{
                    itemClasses: {
                        base: [
                            "rounded-none",
                            "transition-colors",
                            "data-[hover=true]:bg-gray-100",
                            "data-[selectable=true]:focus:bg-blue-200",
                        ]
                    }
                }}
                {...props}
            >
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        textValue={option.label}
                        isDisabled={option.disabled}
                    // className="bg-gray-500"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </HeroSelect>
        </div>
    );
}
