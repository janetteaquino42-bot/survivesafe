import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, Calendar, User, ChevronLeft, ChevronRight, Eye, FileText, Video, Download } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Cards/Card';
import FilterPanel from '@/Components/Filters/FilterPanel';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';

export default function AwarenessMaterials({ materials, filters: initialFilters = {} }) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        file_type: initialFilters.file_type || '',
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        router.get(route('resident.awareness-materials.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        router.get(route('resident.awareness-materials.index'), { ...filters, search: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = { search: '', file_type: '' };
        setFilters(clearedFilters);
        router.get(route('resident.awareness-materials.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleViewMaterial = (id) => {
        router.get(route('resident.awareness-materials.show', id));
    };

    const getFileIcon = (fileType) => {
        if (fileType === 'video_link') return <Video className="w-6 h-6" />;
        return <FileText className="w-6 h-6" />;
    };

    const getEmbedPreviewUrl = (url) => {
        if (!url) return null;

        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname.toLowerCase();

            if (host.includes('youtu.be')) {
                const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
                return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
            }

            if (host.includes('youtube.com')) {
                const videoId = parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop();
                return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
            }

            if (host.includes('vimeo.com')) {
                const videoId = parsedUrl.pathname.split('/').filter(Boolean).pop();
                return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
            }

            if (host.includes('facebook.com') || host.includes('fb.watch')) {
                return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
            }
        } catch {
            return null;
        }

        return null;
    };

    const getPreferredAspectRatio = (orientation) => orientation === 'portrait' ? '9 / 16' : '16 / 9';

    const filterFields = [
        {
            type: 'select',
            name: 'file_type',
            label: 'File Type',
            placeholder: 'All Types',
            options: [
                { value: 'pdf', label: 'PDF' },
                { value: 'docx', label: 'Word Document' },
                { value: 'pptx', label: 'PowerPoint' },
                { value: 'image', label: 'Image' },
                { value: 'video_link', label: 'Video Link' },
            ],
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Awareness Materials', href: null },
            ]}
        >
            <Head title="Awareness Materials" />

            <div className="py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Awareness Materials</h1>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                            Access educational resources and materials for disaster preparedness
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        onClearFilters={clearFilters}
                        searchPlaceholder="Search materials..."
                        filterFields={filterFields}
                        title="Search & Filter"
                        description="Find materials by title, description, or file type"
                    />

                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {materials.from || 0} to {materials.to || 0} of {materials.total || 0} materials
                    </div>

                    {/* Materials List */}
                    {materials.data.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                            {materials.data.map((material) => {
                                const embedPreviewUrl = getEmbedPreviewUrl(material.video_link);

                                return <Card
                                    key={material.id}
                                    className="hover:shadow-xl transition-all duration-300 overflow-hidden !p-2 sm:!p-3 lg:!p-5"
                                >
                                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                                        {/* Icon Section */}
                                        <div className="lg:w-2/5 flex-shrink-0">
                                            {material.file_type === 'video_link' && material.video_link && embedPreviewUrl ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewMaterial(material.id)}
                                                    className="w-full max-w-full h-64 rounded-lg overflow-hidden bg-stone-200 cursor-pointer text-left mx-auto lg:mx-0"
                                                    title="View details"
                                                >
                                                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                        <div
                                                            className="w-full max-w-full"
                                                            style={
                                                                getPreferredAspectRatio(material.video_orientation) === '9 / 16'
                                                                    ? { aspectRatio: '9 / 16', height: '100%' }
                                                                    : { aspectRatio: '16 / 9' }
                                                            }
                                                        >
                                                            <iframe
                                                                src={embedPreviewUrl}
                                                                title={material.title}
                                                                className="w-full h-full pointer-events-none rounded-md"
                                                                frameBorder="0"
                                                                tabIndex={-1}
                                                                aria-hidden="true"
                                                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            />
                                                        </div>
                                                    </div>
                                                </button>
                                            ) : (
                                                <div className="w-full h-48 lg:h-64 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                                                    <div className="text-green-600">
                                                        {getFileIcon(material.file_type)}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="mt-2 text-center">
                                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">
                                                    {material.file_type === 'video_link' ? 'Video' : material.file_type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="lg:w-3/5 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                    {material.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{material.created_at}</span>
                                                    </div>
                                                    {material.creator && (
                                                        <>
                                                            <span className="text-gray-300">•</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="w-4 h-4" />
                                                                <span>
                                                                    {material.creator.position
                                                                        ? `${material.creator.position} - ${material.creator.first_name} ${material.creator.last_name}`
                                                                        : material.creator.name || `${material.creator.first_name} ${material.creator.last_name}`
                                                                    }
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4">
                                                    {material.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <SecondaryButton
                                                    onClick={() => handleViewMaterial(material.id)}
                                                    className="!px-3 sm:!px-4 !py-2"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </SecondaryButton>
                                                {material.file_path && (
                                                    <SecondaryButton
                                                        onClick={() => window.open(material.file_path, '_blank')}
                                                        className="!px-3 sm:!px-4 !py-2"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </SecondaryButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>;
                            })}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                                No materials found
                            </h3>
                            <p className="text-gray-500 text-center">
                                {filters.search || filters.file_type ? 'Try adjusting your search or filter criteria' : 'Check back later for new materials'}
                            </p>
                        </Card>
                    )}

                    {/* Pagination */}
                    {materials.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            {materials.prev_page_url && (
                                <button
                                    onClick={() => router.get(materials.prev_page_url)}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            {Array.from({ length: materials.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get(route('resident.awareness-materials.index', { page, ...filters }))}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${page === materials.current_page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            {materials.next_page_url && (
                                <button
                                    onClick={() => router.get(materials.next_page_url)}
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
