import { Input } from "@heroui/react";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function PasswordInput({
    label = "Password",
    name = "password",
    value,
    onChange,
    placeholder = "Enter your password",
    error = "",
    required = false,
    disabled = false,
    className = "",
    variant = "bordered",
    size = "md",
    description = "",
    showStrengthIndicator = false,
    ...props
}) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "" };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        const labels = ["Weak", "Fair", "Good", "Strong"];
        const colors = ["danger", "warning", "primary", "success"];

        return { strength, label: labels[strength - 1] || "", color: colors[strength - 1] || "" };
    };

    const passwordStrength = showStrengthIndicator ? getPasswordStrength(value) : null;

    return (
        <div className="w-full">
            <InputLabel htmlFor={name} required={true}>{label}</InputLabel>
            <Input
                type={isVisible ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                isInvalid={!!error}
                isRequired={required}
                isDisabled={disabled}
                variant={variant}
                size={size}
                radius="lg"
                description={description}
                startContent={
                    <Lock className="text-blue-500 pointer-events-none flex-shrink-0" size={18} />
                }
                endContent={
                    <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                    >
                        {isVisible ? (
                            <EyeOff className="text-gray-400 hover:text-blue-600 transition-colors" size={20} />
                        ) : (
                            <Eye className="text-gray-400 hover:text-blue-600 transition-colors" size={20} />
                        )}
                    </button>
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

            {showStrengthIndicator && value && (
                <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 flex-1 rounded-full transition-all ${index < passwordStrength.strength
                                    ? passwordStrength.color === "danger"
                                        ? "bg-red-500"
                                        : passwordStrength.color === "warning"
                                            ? "bg-yellow-500"
                                            : passwordStrength.color === "primary"
                                                ? "bg-blue-500"
                                                : "bg-green-500"
                                    : "bg-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-600">
                        Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                    </p>
                </div>
            )}

        </div>
    );
}
