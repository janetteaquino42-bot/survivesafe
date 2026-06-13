import { Input } from "@heroui/react";
import { Mail } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function EmailInput({
    label = "Email",
    name = "email",
    value,
    onChange,
    placeholder = "Enter your email",
    error = "",
    required = false,
    disabled = false,
    className = "",
    variant = "bordered",
    size = "md",
    description = "",
    ...props
}) {
    return (
        <div className="w-full">
            <InputLabel htmlFor={name} required={true}>{label}</InputLabel>
            <Input
                type="email"
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
                startContent={
                    <Mail className="text-blue-500 pointer-events-none flex-shrink-0" size={18} />
                }
                className={`!mt-2 ${className}`}
                classNames={{
                    input: "text-gray-900 bg-white focus:ring-0 border-0",
                    inputWrapper: "border-2 border-gray-300 hover:border-blue-400 focus-within:!border-blue-600 shadow-sm bg-white rounded-xl",
                    description: "text-gray-500 text-xs",
                    innerWrapper: "bg-white",
                }}
                {...props}
            />
        </div>
    );
}
