import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Megaphone, Clock, User, ArrowRight, Search, X, Calendar, Filter } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/Form/TextInput';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';

export default function Announcements({ announcements, filters, hero }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(route('public.announcements'), {
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        router.get(route('public.announcements'));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <GuestLayout>
            <Head title="Announcements - Bacoor DRRMO" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-gray-600 text-white py-16 md:py-20 overflow-hidden">
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="Announcements Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-gray-900/85"></div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Megaphone className="w-5 h-5" />
                        <span className="font-semibold text-sm sm:text-base">Official Updates</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 line-clamp-2">
                        {hero?.title || 'Announcements & Updates'}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-100 max-w-3xl mx-auto line-clamp-3">
                        {hero?.content || 'Stay informed with the latest news, alerts, and important notices from Bacoor DRRMO'}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search & Filter Section */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search announcements by title or content..."
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
                            <div className="flex gap-2">
                                <PrimaryButton onClick={handleSearch} className="px-6 py-6">
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </PrimaryButton>
                                {search && (
                                    <SecondaryButton onClick={handleClearFilters} className="px-6 py-6">
                                        <X className="w-4 h-4 mr-2" />
                                        Clear
                                    </SecondaryButton>
                                )}
                            </div>
                        </div>
                        {search && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                <Filter className="w-4 h-4" />
                                <span>Searching for: <strong className="text-blue-600">"{search}"</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    {announcements.data.length > 0 && (
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600 text-sm sm:text-base">
                                Showing <strong>{announcements.data.length}</strong> of <strong>{announcements.total}</strong> announcements
                            </p>
                        </div>
                    )}

                    {/* Announcements Grid */}
                    {announcements.data.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Megaphone size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No announcements found
                            </h3>
                            <p className="text-gray-500">
                                {search
                                    ? 'Try adjusting your search criteria'
                                    : 'Check back later for new announcements'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {announcements.data.map((announcement) => (
                                    <AnnouncementCard
                                        key={announcement.id}
                                        announcement={announcement}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {announcements.last_page > 1 && (
                                <div className="flex flex-wrap justify-center gap-2">
                                    {Array.from({ length: announcements.last_page }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => router.get(route('public.announcements', { page, search }))}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${page === announcements.current_page
                                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            {page}
                                        </button>
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

function AnnouncementCard({ announcement }) {
    const handleClick = () => {
        router.get(route('public.announcements.show', announcement.id));
    };

    return (
        <article
            onClick={handleClick}
            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full"
        >
            {/* Featured Image */}
            {announcement.images && announcement.images.length > 0 ? (
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                        src={announcement.images[0]}
                        alt={announcement.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        New
                    </div>
                </div>
            ) : (
                <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Megaphone className="w-16 h-16 text-blue-300" />
                </div>
            )}

            <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="line-clamp-1">{announcement.created_at}</span>
                    </div>
                    {announcement.creator && (
                        <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1.5">
                                <User size={14} className="text-green-500" />
                                <span className="line-clamp-1">
                                    {announcement.creator.position
                                        ? `${announcement.creator.position} - ${announcement.creator.first_name} ${announcement.creator.last_name}`
                                        : announcement.creator.name || `${announcement.creator.first_name} ${announcement.creator.last_name}`
                                    }
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {announcement.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {announcement.description}
                </p>

                {/* Read More Link */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                        Read full announcement
                    </span>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </article>
    );
}
