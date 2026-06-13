import { Textarea as HeroTextarea } from "@heroui/react";
import InputError from "./InputError";

export default function Textarea({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    error = "",
    required = false,
    disabled = false,
    className = "",
    variant = "bordered",
    size = "md",
    description = "",
    minRows = 3,
    maxRows = 8,
    maxLength,
    showCounter = false,
    ...props
}) {
    return (
        <div className="w-full">
            <label htmlFor={name} className="font-semibold text-gray-700 mb-0 text-sm">{label} {required && <span className="text-red-500">*</span>}</label>
            <HeroTextarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                isInvalid={!!error}
                isDisabled={disabled}
                variant={variant}
                size={size}
                radius="lg"
                description={description}
                minRows={minRows}
                maxRows={maxRows}
                maxLength={maxLength}
                className={className}
                classNames={{
                    label: "text-gray-700 font-semibold",
                    input: "text-gray-900 bg-white focus:ring-0 border-0",
                    inputWrapper: "border-2 border-gray-300 hover:border-blue-400 focus-within:!border-blue-600 shadow-sm bg-white rounded-xl",
                    description: "text-gray-500 text-xs",
                    innerWrapper: "bg-white",
                }}
                labelPlacement="outside"
            />
            {showCounter && maxLength && (
                <div className="flex justify-end mt-1">
                    <p className="text-xs text-gray-500">
                        {value?.length || 0} / {maxLength}
                    </p>
                </div>
            )}
            <InputError message={error} className="mt-1" />
        </div>
    );
}
