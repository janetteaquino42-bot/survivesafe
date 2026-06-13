import { Input } from "@heroui/react";
import { useState } from "react";
import InputError from "./InputError";

export default function TextInput({
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
    startContent,
    endContent,
    description = "",
    readOnly = false,
    ...props
}) {
    return (
        <>
            <label htmlFor={name} className="font-semibold text-gray-700 mb-0 text-sm">{label} {required && <span className="text-red-500">*</span>}</label>
            <Input
                // label={label}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                isInvalid={!!error}
                isDisabled={disabled}
                variant={variant}
                size={size}
                radius="lg"
                startContent={startContent}
                endContent={endContent}
                description={description}
                className={`!mt-2 ${className}`}
                classNames={{
                    input: "text-gray-900 bg-white focus:ring-0 border-0",
                    inputWrapper: "border-2 border-gray-300 hover:border-blue-400 focus-within:!border-blue-600 shadow-sm bg-white rounded-xl",
                    description: "text-gray-500 text-xs",
                    innerWrapper: "bg-white",
                }}
                labelPlacement="outside"
                readOnly={readOnly}
            />
        </>
    );
}
