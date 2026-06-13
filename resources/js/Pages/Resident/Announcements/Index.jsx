import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Megaphone, Calendar, User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Cards/Card';
import FilterPanel from '@/Components/Filters/FilterPanel';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';

export default function Announcements({ announcements, filters: initialFilters = {} }) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        from_date: initialFilters.from_date || '',
        to_date: initialFilters.to_date || '',
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        router.get(route('resident.announcements.index'), { search: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            from_date: '',
            to_date: '',
        };
        setFilters(clearedFilters);
        router.get('/officer/announcements', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleViewAnnouncement = (id) => {
        router.get(route('resident.announcements.show', id));
    };

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/resident/announcements', filters, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [filters.from_date, filters.to_date]);

    // Define filter fields dynamically
    const filterFields = [
        {
            type: 'date',
            name: 'from_date',
            label: 'From Date',
        },
        {
            type: 'date',
            name: 'to_date',
            label: 'To Date',
        }
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Announcements', href: null },
            ]}
        >
            <Head title="Announcements" />

            <div className="py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Announcements</h1>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                            Stay informed with the latest news and important notices from Bacoor DRRMO
                        </p>
                    </div>

                    {/* Search Bar */}
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        onClearFilters={clearFilters}
                        searchPlaceholder="Search announcements..."
                        title="Search Announcements"
                        filterFields={filterFields}
                        description="Find announcements by title or content"
                    />

                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {announcements.from || 0} to {announcements.to || 0} of {announcements.total || 0} announcements
                    </div>

                    {/* Announcements List */}
                    {announcements.data.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                            {announcements.data.map((announcement) => (
                                <Card
                                    key={announcement.id}
                                    className="hover:shadow-xl transition-all duration-300 overflow-hidden !p-2 sm:!p-3 lg:!p-5"
                                >
                                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                                        {/* Image Section */}
                                        <div className="lg:w-1/3 flex-shrink-0">
                                            {announcement.images && announcement.images.length > 0 ? (
                                                <img
                                                    src={announcement.images[0]}
                                                    alt={announcement.title}
                                                    className="w-full h-48 lg:h-64 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-48 lg:h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                                                    <Megaphone className="w-16 h-16 text-blue-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="lg:w-2/3 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {announcement.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{announcement.created_at}</span>
                                                    </div>
                                                    {announcement.creator && (
                                                        <>
                                                            <span className="text-gray-300">•</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="w-4 h-4" />
                                                                <span>
                                                                    {announcement.creator.position
                                                                        ? `${announcement.creator.position} - ${announcement.creator.first_name} ${announcement.creator.last_name}`
                                                                        : announcement.creator.name || `${announcement.creator.first_name} ${announcement.creator.last_name}`
                                                                    }
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4">
                                                    {announcement.description}
                                                </p>
                                            </div>

                                            <div className="flex justify-end">
                                                <SecondaryButton
                                                    onClick={() => handleViewAnnouncement(announcement.id)}
                                                    className="!px-3 sm:!px-4 !py-2"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <Megaphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                                No announcements found
                            </h3>
                            <p className="text-gray-500 text-center">
                                {filters.search ? 'Try adjusting your search criteria' : 'Check back later for new announcements'}
                            </p>
                        </Card>
                    )}

                    {/* Pagination */}
                    {announcements.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            {announcements.prev_page_url && (
                                <button
                                    onClick={() => router.get(announcements.prev_page_url)}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            {Array.from({ length: announcements.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get(route('resident.announcements.index', { page, ...filters }))}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${page === announcements.current_page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            {announcements.next_page_url && (
                                <button
                                    onClick={() => router.get(announcements.next_page_url)}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
