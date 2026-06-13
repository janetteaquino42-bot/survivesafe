import { useState } from "react";
import { Filter, X, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";
import SearchBar from "@/Components/Search/SearchBar";
import Select from "@/Components/Form/Select";
import Card from "@/Components/Cards/Card";
import SecondaryButton from "../Buttons/SecondaryButton";

export default function FilterPanel({
    filters,
    onFilterChange,
    onSearchChange,
    onClearFilters,
    searchPlaceholder = "Search...",
    filterFields = [],
    showDescription = true,
    title = "Search & Filter",
    description = "Use the search bar to find specific items, or apply filters to narrow down results.",
}) {
    const [showFilters, setShowFilters] = useState(false);

    // Count active filters dynamically
    const activeFilterCount = Object.entries(filters)
        .filter(([key, value]) => key !== 'search' && value)
        .length;

    const renderFilterField = (field) => {
        switch (field.type) {
            case 'select':
                return (
                    <Select
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        value={filters[field.name] || ''}
                        onChange={(value) => onFilterChange(field.name, value)}
                        options={[
                            { value: '', label: field.placeholder || `All ${field.label}s` },
                            ...field.options
                        ]}
                        placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
                    />
                );

            case 'date':
                return (
                    <div key={field.name}>
                        <label className="font-semibold text-gray-700 mb-2 block">
                            {field.label}
                        </label>
                        <input
                            type="date"
                            value={filters[field.name] || ''}
                            onChange={(e) => onFilterChange(field.name, e.target.value)}
                            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>
                );

            case 'text':
                return (
                    <div key={field.name}>
                        <label className="font-semibold text-gray-700 mb-2 block">
                            {field.label}
                        </label>
                        <input
                            type="text"
                            value={filters[field.name] || ''}
                            onChange={(e) => onFilterChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="mb-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100">
            <div className="space-y-4">
                {/* Header with sparkle effect */}
                <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Sparkles size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
                        {showDescription && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-2">{description}</p>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:flex-1">
                        <SearchBar
                            placeholder={searchPlaceholder}
                            value={filters.search || ''}
                            onChange={onSearchChange}
                            debounceTime={500}
                        />
                    </div>
                    <div className="flex gap-2">
                        <SecondaryButton
                            variant="bordered"
                            onClick={() => setShowFilters(!showFilters)}
                            startContent={<Filter size={18} />}
                            className={`${showFilters ? 'bg-blue-50 border-blue-400' : ''} w-full`}
                        >
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </SecondaryButton>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="flat"
                                color="danger"
                                onClick={onClearFilters}
                                startContent={<X size={18} />}
                                className="h-12"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filter Panel with slide animation */}
                {showFilters && filterFields.length > 0 && (
                    <div className="pt-4 border-t border-blue-200 animate-in slide-in-from-top duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filterFields.map(field => renderFilterField(field))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
