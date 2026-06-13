import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, BookOpen, FileText, Video, Image, Download, Eye, X, Filter, Calendar, User } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';

export default function AwarenessMaterials({ materials, filters, hero }) {
    const [search, setSearch] = useState(filters.search || '');
    const [fileType, setFileType] = useState(filters.file_type || '');

    const handleSearch = () => {
        router.get(route('public.awareness'), {
            search,
            file_type: fileType || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setFileType('');
        router.get(route('public.awareness'));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const fileTypes = [
        { value: 'pdf', label: 'PDF Documents' },
        { value: 'doc', label: 'Word (.doc)' },
        { value: 'docx', label: 'Word (.docx)' },
        { value: 'ppt', label: 'PowerPoint (.ppt)' },
        { value: 'pptx', label: 'PowerPoint (.pptx)' },
        { value: 'image', label: 'Images' },
        { value: 'video_link', label: 'Videos' },
    ];

    const getMaterialIcon = (type) => {
        const icons = {
            pdf: <FileText className="w-5 h-5 text-red-600" />,
            doc: <FileText className="w-5 h-5 text-blue-600" />,
            docx: <FileText className="w-5 h-5 text-blue-600" />,
            ppt: <FileText className="w-5 h-5 text-orange-600" />,
            pptx: <FileText className="w-5 h-5 text-orange-600" />,
            video_link: <Video className="w-5 h-5 text-red-500" />,
            image: <Image className="w-5 h-5 text-blue-600" />,
        };
        return icons[type] || <BookOpen className="w-5 h-5 text-gray-600" />;
    };

    const getFileTypeColor = (type) => {
        const colors = {
            pdf: 'bg-red-100 text-red-700 border-red-200',
            doc: 'bg-blue-100 text-blue-700 border-blue-200',
            docx: 'bg-blue-100 text-blue-700 border-blue-200',
            ppt: 'bg-orange-100 text-orange-700 border-orange-200',
            pptx: 'bg-orange-100 text-orange-700 border-orange-200',
            image: 'bg-blue-100 text-blue-700 border-blue-200',
            video_link: 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getFileTypeLabel = (type) => {
        const labels = {
            pdf: 'PDF',
            doc: 'Word',
            docx: 'Word',
            ppt: 'PowerPoint',
            pptx: 'PowerPoint',
            image: 'Image',
            video_link: 'Video',
        };
        return labels[type] || type.toUpperCase();
    };

    return (
        <GuestLayout>
            <Head title="Awareness Materials - BDRRMO Bacoor" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-gray-600 text-white py-16 md:py-20 overflow-hidden">
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="Awareness Materials Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-900/85"></div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-semibold text-sm sm:text-base">Educational Resources</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 line-clamp-2">
                        {hero?.title || 'Awareness Materials'}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-100 max-w-3xl mx-auto line-clamp-3">
                        {hero?.content || 'Access educational resources, training materials, and important documents for disaster preparedness and safety'}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search & Filter Section */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search materials by title or description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Row */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* File Type Filter */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Filter className="w-4 h-4 inline mr-1" />
                                        File Type
                                    </label>
                                    <select
                                        value={fileType}
                                        onChange={(e) => setFileType(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">All file types</option>
                                        {fileTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 sm:items-end">
                                    <PrimaryButton onClick={handleSearch} className="px-6 bg-blue-600 hover:bg-blue-700">
                                        <Search className="w-4 h-4 mr-2" />
                                        Search
                                    </PrimaryButton>
                                    {(search || fileType) && (
                                        <SecondaryButton onClick={handleClearFilters} className="px-6">
                                            <X className="w-4 h-4 mr-2" />
                                            Clear
                                        </SecondaryButton>
                                    )}
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {(search || fileType) && (
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="text-gray-600 font-medium">Active filters:</span>
                                        {search && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                Search: "{search}"
                                            </span>
                                        )}
                                        {fileType && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                Type: {fileTypes.find(t => t.value === fileType)?.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    {materials.data.length > 0 && (
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600 text-sm sm:text-base">
                                Showing <strong>{materials.data.length}</strong> of <strong>{materials.total}</strong> materials
                            </p>
                        </div>
                    )}

                    {/* Materials Grid */}
                    {materials.data.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No materials found
                            </h3>
                            <p className="text-gray-500">
                                {search || fileType
                                    ? 'Try adjusting your search or filters'
                                    : 'Check back later for new educational materials'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {materials.data.map((material) => (
                                    <MaterialCard
                                        key={material.id}
                                        material={material}
                                        getMaterialIcon={getMaterialIcon}
                                        getFileTypeColor={getFileTypeColor}
                                        getFileTypeLabel={getFileTypeLabel}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {materials.last_page > 1 && (
                                <div className="flex flex-wrap justify-center gap-2">
                                    {Array.from({ length: materials.last_page }, (_, i) => i + 1).map((page) => (
                                        <PrimaryButton
                                            key={page}
                                            onClick={() => router.get(route('public.awareness', { page, search, file_type: fileType }))}
                                            className={` rounded-lg font-medium transition-all ${page === materials.current_page
                                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            {page}
                                        </PrimaryButton>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </GuestLayout>
    );
}

function getEmbedPreviewUrl(url) {
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
}

const getPreferredAspectRatio = (orientation) => orientation === 'portrait' ? '9 / 16' : '16 / 9';

function MaterialCard({ material, getMaterialIcon, getFileTypeColor, getFileTypeLabel }) {
    const handleClick = () => {
        router.get(route('public.awareness.show', material.id));
    };
    const embedPreviewUrl = material.video_link ? getEmbedPreviewUrl(material.video_link) : null;

    return (
        <article
            onClick={handleClick}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full"
        >
            {material.file_type === 'video_link' && embedPreviewUrl ? (
                <div className="p-4 pb-0">
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-stone-200 flex items-center justify-center">
                        <div
                            className="w-full"
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
                </div>
            ) : null}

            {/* Icon Header */}
            <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b border-gray-200 ${material.file_type === 'video_link' ? 'pt-4' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        {getMaterialIcon(material.file_type)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getFileTypeColor(material.file_type)
                        }`}>
                        {getFileTypeLabel(material.file_type)}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {material.title}
                </h3>
            </div>

            <div className="p-5 flex flex-col flex-1">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {material.description}
                </p>

                {/* Meta Information */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="line-clamp-1">{material.created_at}</span>
                    </div>
                    {material.creator && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-4 h-4 text-blue-500" />
                            <span className="line-clamp-1">
                                By {material.creator.position
                                    ? `${material.creator.position} - ${material.creator.first_name} ${material.creator.last_name}`
                                    : material.creator.name || `${material.creator.first_name} ${material.creator.last_name}`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* View Button */}
                <div className="mt-4">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg group-hover:from-blue-100 group-hover:to-emerald-100 transition-all">
                        <span className="text-sm font-semibold text-blue-700">
                            View Material
                        </span>
                        <Eye className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </article>
    );
}
