import { useState } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import { Button, Popover, PopoverTrigger, PopoverContent, Chip } from "@heroui/react";
import Select from "../Form/Select";
import Checkbox from "../Form/Checkbox";
import SecondaryButton from "../Buttons/SecondaryButton";

export default function Filter({
    filters = [],
    activeFilters = {},
    onFilterChange,
    onClearAll,
    buttonText = "Filter",
    className = "",
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (filterKey, value) => {
        onFilterChange?.({ ...activeFilters, [filterKey]: value });
    };

    const handleClearFilter = (filterKey) => {
        const newFilters = { ...activeFilters };
        delete newFilters[filterKey];
        onFilterChange?.(newFilters);
    };

    const handleClearAll = () => {
        onClearAll?.();
        setIsOpen(false);
    };

    const activeFilterCount = Object.keys(activeFilters).filter(
        (key) => activeFilters[key] && activeFilters[key].length > 0
    ).length;

    return (
        <div className={`relative ${className}`}>
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="bottom-end"
                {...props}
            >
                <PopoverTrigger>
                    <SecondaryButton
                        variant="bordered"
                        startContent={<FilterIcon size={16} />}
                        endContent={
                            activeFilterCount > 0 && (
                                <Chip size="sm" variant="solid" className="bg-blue-100 text-blue-800">
                                    {activeFilterCount}
                                </Chip>
                            )
                        }
                    >
                        {buttonText}
                    </SecondaryButton>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Filters</h3>
                            {activeFilterCount > 0 && (
                                <Button
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                    onClick={handleClearAll}
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>

                        {filters.map((filter) => (
                            <div key={filter.key}>
                                {filter.type === "select" && (
                                    <Select
                                        label={filter.label}
                                        placeholder={filter.placeholder || "Select..."}
                                        options={filter.options}
                                        value={activeFilters[filter.key] || ""}
                                        onChange={(value) => handleFilterChange(filter.key, value)}
                                        multiple={filter.multiple}
                                        size="sm"
                                    />
                                )}

                                {filter.type === "checkbox" && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            {filter.label}
                                        </p>
                                        <div className="space-y-2">
                                            {filter.options.map((option) => (
                                                <Checkbox
                                                    key={option.value}
                                                    label={option.label}
                                                    checked={
                                                        activeFilters[filter.key]?.includes(
                                                            option.value
                                                        ) || false
                                                    }
                                                    onChange={(checked) => {
                                                        const current =
                                                            activeFilters[filter.key] || [];
                                                        const updated = checked
                                                            ? [...current, option.value]
                                                            : current.filter(
                                                                (v) => v !== option.value
                                                            );
                                                        handleFilterChange(filter.key, updated);
                                                    }}
                                                    size="sm"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;

                        const filter = filters.find((f) => f.key === key);
                        if (!filter) return null;

                        const displayValue = Array.isArray(value)
                            ? value
                                .map(
                                    (v) =>
                                        filter.options.find((o) => o.value === v)?.label || v
                                )
                                .join(", ")
                            : filter.options.find((o) => o.value === value)?.label || value;

                        return (
                            <Chip
                                key={key}
                                onClose={() => handleClearFilter(key)}
                                variant="flat"
                                className="bg-blue-100 text-blue-700"
                                size="sm"
                            >
                                {filter.label}: {displayValue}
                            </Chip>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
