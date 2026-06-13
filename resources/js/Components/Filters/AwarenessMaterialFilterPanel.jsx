import { useState } from "react";
import { Filter, X, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";
import SearchBar from "@/Components/Search/SearchBar";
import Select from "@/Components/Form/Select";
import Card from "@/Components/Cards/Card";
import SecondaryButton from "../Buttons/SecondaryButton";

export default function AwarenessMaterialFilterPanel({
    filters,
    onFilterChange,
    onSearchChange,
    onClearFilters,
    statuses = [],
    fileTypes = [],
    showDescription = true,
    description = "Use the search bar to find specific awareness materials, or apply filters to narrow down results by status, file type, and date range.",
}) {
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = [
        filters.status,
        filters.file_type,
        filters.from_date,
        filters.to_date,
    ].filter(Boolean).length;

    return (
        <Card className="mb-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100">
            <div className="space-y-4">
                {/* Header with sparkle effect */}
                <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Sparkles size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Search & Filter</h3>
                        {showDescription && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-2">{description}</p>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Search by title or description..."
                            value={filters.search}
                            onChange={onSearchChange}
                            debounceTime={500}
                        />
                    </div>
                    <div className="flex gap-2">
                        <SecondaryButton
                            variant="bordered"
                            onClick={() => setShowFilters(!showFilters)}
                            startContent={<Filter size={18} />}
                            className={`h-12 ${showFilters ? 'bg-blue-50 border-blue-400' : ''}`}
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
                {showFilters && (
                    <div className="pt-4 border-t border-blue-200 animate-in slide-in-from-top duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Status Filter */}
                            {statuses.length > 0 && (
                                <Select
                                    label="Status"
                                    name="status"
                                    value={filters.status}
                                    onChange={(value) => onFilterChange('status', value)}
                                    options={[
                                        { value: '', label: 'All Statuses' },
                                        ...statuses.map(s => ({
                                            value: s,
                                            label: s.charAt(0).toUpperCase() + s.slice(1)
                                        }))
                                    ]}
                                    placeholder="Select status"
                                />
                            )}

                            {/* File Type Filter */}
                            {fileTypes.length > 0 && (
                                <Select
                                    label="File Type"
                                    name="file_type"
                                    value={filters.file_type}
                                    onChange={(value) => onFilterChange('file_type', value)}
                                    options={[
                                        { value: '', label: 'All Types' },
                                        ...fileTypes.map(ft => ({
                                            value: ft,
                                            label: ft.charAt(0).toUpperCase() + ft.slice(1)
                                        }))
                                    ]}
                                    placeholder="Select file type"
                                />
                            )}

                            {/* From Date */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">From Date</label>
                                <input
                                    type="date"
                                    value={filters.from_date}
                                    onChange={(e) => onFilterChange('from_date', e.target.value)}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">To Date</label>
                                <input
                                    type="date"
                                    value={filters.to_date}
                                    onChange={(e) => onFilterChange('to_date', e.target.value)}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
