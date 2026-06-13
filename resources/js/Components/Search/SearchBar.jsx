import { Input } from "@heroui/react";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
    placeholder = "Search...",
    value = "",
    onChange,
    onSearch,
    onClear,
    className = "",
    size = "md",
    variant = "bordered",
    disabled = false,
    autoFocus = false,
    debounceTime = 300,
    ...props
}) {
    const [searchValue, setSearchValue] = useState(value);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSearchValue(newValue);

        // Clear existing timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set new timeout
        const timeout = setTimeout(() => {
            onChange?.(newValue);
            onSearch?.(newValue);
        }, debounceTime);

        setDebounceTimeout(timeout);
    };

    const handleClear = () => {
        setSearchValue("");
        onChange?.("");
        onClear?.();
    };

    return (
        <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleChange}
            size={size}
            variant={variant}
            radius="lg"
            isDisabled={disabled}
            autoFocus={autoFocus}
            startContent={<Search className="text-blue-500" size={20} />}
            endContent={
                searchValue && (
                    <button
                        onClick={handleClear}
                        className="focus:outline-none text-gray-400 hover:text-red-500 transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                )
            }
            className={className}
            classNames={{
                input: "text-gray-900 bg-white border-0 px-3 py-2 focus:ring-0",
                inputWrapper: "border-2 border-gray-300 hover:border-blue-400 focus-within:!border-blue-600 bg-white rounded-xl ",
            }}
            {...props}
        />
    );
}
