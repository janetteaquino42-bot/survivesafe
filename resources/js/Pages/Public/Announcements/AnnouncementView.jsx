import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Calendar, User, Share2, Megaphone, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import ImagePreviewModal from '@/Components/Modal/ImagePreviewModal';

export default function AnnouncementView({ announcement, previousAnnouncement, nextAnnouncement, recentAnnouncements, hero }) {
    const [previewModal, setPreviewModal] = useState({ isOpen: false, images: [], currentIndex: 0 });

    const openImagePreview = (images, index = 0) => {
        console.log('Opening preview:', { images, index });
        setPreviewModal({ isOpen: true, images, currentIndex: index });
    };

    const closeImagePreview = () => {
        setPreviewModal({ isOpen: false, images: [], currentIndex: 0 });
    };

    const handleImageNavigate = (newIndex) => {
        setPreviewModal(prev => ({ ...prev, currentIndex: newIndex }));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: announcement.title,
                text: announcement.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <GuestLayout>
            <Head title={`${announcement.title} - Bacoor DRRMO`}>
                <meta name="description" content={announcement.description?.substring(0, 160)} />
                <meta property="og:title" content={announcement.title} />
                <meta property="og:description" content={announcement.description?.substring(0, 160)} />
                {announcement.images && announcement.images.length > 0 && (
                    <meta property="og:image" content={announcement.images[0]} />
                )}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={announcement.title} />
                <meta name="twitter:description" content={announcement.description?.substring(0, 160)} />
                {announcement.images && announcement.images.length > 0 && (
                    <meta name="twitter:image" content={announcement.images[0]} />
                )}
            </Head>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-gray-600 text-white py-16 md:py-20 overflow-hidden">
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-gray-900/85"></div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route('public.announcements')}
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-medium transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Announcements
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <Megaphone className="w-8 h-8" />
                        <span className="text-sm sm:text-base font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            Official Announcement
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        {announcement.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-blue-100">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span className="text-sm sm:text-base">{announcement.created_at}</span>
                        </div>
                        {announcement.creator && (
                            <>
                                <span className="text-blue-300">•</span>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span className="text-sm sm:text-base">
                                        {announcement.creator.position
                                            ? `${announcement.creator.position} - ${announcement.creator.first_name} ${announcement.creator.last_name}`
                                            : announcement.creator.name || `${announcement.creator.first_name} ${announcement.creator.last_name}`
                                        }
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Article Content */}
                        <div className="lg:col-span-2">
                            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Featured Images Gallery */}
                                {announcement.images && announcement.images.length > 0 && (
                                    <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
                                        {announcement.images.length === 1 ? (
                                            <div className="relative group">
                                                <img
                                                    src={announcement.images[0]}
                                                    alt={announcement.title}
                                                    onClick={() => openImagePreview(
                                                        announcement.images.map((img, idx) => ({
                                                            src: img,
                                                            alt: `${announcement.title} - Image ${idx + 1}`
                                                        })),
                                                        0
                                                    )}
                                                    className="w-full max-h-[500px] object-contain rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                                    <Eye className="w-12 h-12 text-white drop-shadow-lg" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Main Image */}
                                                <div className="relative group">
                                                    <img
                                                        src={announcement.images[0]}
                                                        alt={`${announcement.title} - Main Image`}
                                                        onClick={() => openImagePreview(
                                                            announcement.images.map((img, idx) => ({
                                                                src: img,
                                                                alt: `${announcement.title} - Image ${idx + 1}`
                                                            })),
                                                            0
                                                        )}
                                                        className="w-full h-64 sm:h-96 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                                        <Eye className="w-12 h-12 text-white drop-shadow-lg" />
                                                    </div>
                                                    {announcement.images.length > 1 && (
                                                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                            1 / {announcement.images.length}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Thumbnail Grid */}
                                                {announcement.images.length > 1 && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        {announcement.images.slice(1).map((image, index) => (
                                                            <div key={index + 1} className="relative group">
                                                                <img
                                                                    src={image}
                                                                    alt={`${announcement.title} - Image ${index + 2}`}
                                                                    onClick={() => openImagePreview(
                                                                        announcement.images.map((img, idx) => ({
                                                                            src: img,
                                                                            alt: `${announcement.title} - Image ${idx + 1}`
                                                                        })),
                                                                        index + 1
                                                                    )}
                                                                    className="w-full h-24 sm:h-28 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity border-2 border-transparent hover:border-blue-500"
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                                                    <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                                                                </div>
                                                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                                                    {index + 2}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-6 sm:p-8 md:p-10\">
                                    {/* Share Button */}
                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="prose prose-lg max-w-none">
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg space-y-4">
                                            {announcement.description}
                                        </div>
                                    </div>


                                </div>
                            </article>

                            {/* Previous/Next Navigation */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                {previousAnnouncement ? (
                                    <Link
                                        href={route('public.announcements.show', previousAnnouncement.id)}
                                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all group border border-gray-200 hover:border-blue-300"
                                    >
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                                            <ChevronLeft className="w-5 h-5\" />
                                            <span className="font-medium">Previous</span>
                                        </div>
                                        <p className="text-gray-800 font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                            {previousAnnouncement.title}
                                        </p>
                                    </Link>
                                ) : (
                                    <div></div>
                                )}

                                {nextAnnouncement ? (
                                    <Link
                                        href={route('public.announcements.show', nextAnnouncement.id)}
                                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all group border border-gray-200 hover:border-blue-300 text-right"
                                    >
                                        <div className="flex items-center justify-end gap-2 text-gray-500 text-sm mb-2">
                                            <span className="font-medium">Next</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                        <p className="text-gray-800 font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                            {nextAnnouncement.title}
                                        </p>
                                    </Link>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 space-y-6">
                                {/* Recent Announcements */}
                                {recentAnnouncements && recentAnnouncements.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            Recent Announcements
                                        </h3>
                                        <div className="space-y-4">
                                            {recentAnnouncements.map((recent) => (
                                                <Link
                                                    key={recent.id}
                                                    href={route('public.announcements.show', recent.id)}
                                                    className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                                >
                                                    {recent.image ? (
                                                        <img
                                                            src={recent.image}
                                                            alt={recent.title}
                                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                            <Megaphone className="w-8 h-8 text-blue-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 leading-tight">
                                                            {recent.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {recent.created_at}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Call to Action */}
                                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                                    <p className="text-sm text-blue-100 mb-4">
                                        Get the latest updates and announcements from Bacoor DRRMO
                                    </p>
                                    <Link
                                        href={route('public.announcements')}
                                        className="block text-center bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        View All Announcements
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={previewModal.isOpen}
                onClose={closeImagePreview}
                images={previewModal.images}
                currentIndex={previewModal.currentIndex}
                onNavigate={handleImageNavigate}
            />
        </GuestLayout>
    );
}
