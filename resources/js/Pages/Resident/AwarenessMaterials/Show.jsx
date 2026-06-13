import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Calendar, User, FileText, Video, Image as ImageIcon, Download, ExternalLink, BookOpen, Share2, Eye, X } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DocumentViewer from '@/Components/Media/DocumentViewer';

export default function AwarenessMaterialView({ material, relatedMaterials, hero }) {
    const [imagePreview, setImagePreview] = useState(false);

    const getFileTypeIcon = (type) => {
        const icons = {
            pdf: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />,
            doc: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
            docx: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
            ppt: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />,
            pptx: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />,
            xls: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
            xlsx: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
            video_link: <Video className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />,
            image: <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
        };
        return icons[type] || <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />;
    };

    const getFileTypeLabel = (type) => {
        const labels = {
            pdf: 'PDF Document',
            doc: 'Word Document',
            docx: 'Word Document',
            ppt: 'PowerPoint Presentation',
            pptx: 'PowerPoint Presentation',
            xls: 'Excel Spreadsheet',
            xlsx: 'Excel Spreadsheet',
            image: 'Image File',
            video_link: 'Video Content',
        };
        return labels[type] || 'Document';
    };

    const getFileTypeColor = (type) => {
        const colors = {
            pdf: 'bg-red-100 text-red-700 border-red-200',
            doc: 'bg-blue-100 text-blue-700 border-blue-200',
            docx: 'bg-blue-100 text-blue-700 border-blue-200',
            ppt: 'bg-orange-100 text-orange-700 border-orange-200',
            pptx: 'bg-orange-100 text-orange-700 border-orange-200',
            xls: 'bg-blue-100 text-blue-700 border-blue-200',
            xlsx: 'bg-blue-100 text-blue-700 border-blue-200',
            image: 'bg-blue-100 text-blue-700 border-blue-200',
            video_link: 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: material.title,
                text: material.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
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

    const getVideoFrameWidth = (orientation) => {
        return orientation === 'portrait'
            ? 'min(100%, calc((100vh - 9rem) * 9 / 16))'
            : 'min(100%, calc((100vh - 9rem) * 16 / 9))';
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Awareness Materials', href: route('resident.awareness-materials.index') },
                { label: `${material.title}`, href: null },
            ]}>
            <Head title={`${material.title}`} />

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
                        href={route('resident.awareness-materials.index')}
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-medium transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Materials
                    </Link>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            {getFileTypeIcon(material.file_type)}
                        </div>
                        <div className="flex-1">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border-2 mb-3 ${getFileTypeColor(material.file_type)}`}>
                                {getFileTypeLabel(material.file_type)}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                {material.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-blue-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm sm:text-base">{material.created_at}</span>
                                </div>
                                {material.creator && (
                                    <>
                                        <span className="text-blue-300">•</span>
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            <span className="text-sm sm:text-base">
                                                {material.creator.position
                                                    ? `${material.creator.position} - ${material.creator.first_name} ${material.creator.last_name}`
                                                    : material.creator.name || `${material.creator.first_name} ${material.creator.last_name}`
                                                }
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Material Content */}
                        <div className="lg:col-span-2">
                            {/* Description Card */}
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">About this Material</h2>
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                                    {material.description}
                                </p>
                            </div>

                            {/* Viewer Card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Eye className="w-6 h-6 text-blue-600" />
                                        View Material
                                    </h2>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {/* PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX Viewer */}
                                    {['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(material.file_type) && material.file_path && (
                                        <div className="space-y-4">
                                            <DocumentViewer
                                                url={material.file_path}
                                                filename={material.title}
                                                height="700px"
                                                showControls={true}
                                            />
                                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                                <a
                                                    href={material.file_path}
                                                    download={material.title}
                                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download {getFileTypeLabel(material.file_type)}
                                                </a>
                                                <a
                                                    href={material.file_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-colors"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                    Open in New Tab
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Video Viewer */}
                                    {material.file_type === 'video_link' && material.video_link && (
                                        <div className="space-y-4">
                                            <div className="w-full rounded-lg bg-stone-200 p-2">
                                                <div className="mx-auto w-full max-w-5xl max-h-[calc(100vh-9rem)] flex items-center justify-center">
                                                    <div
                                                        className="mx-auto"
                                                        style={{
                                                            width: getVideoFrameWidth(material.video_orientation),
                                                            aspectRatio: material.video_orientation === 'portrait' ? '9 / 16' : '16 / 9',
                                                        }}
                                                    >
                                                        <iframe
                                                            src={getEmbedPreviewUrl(material.video_link) || material.video_link}
                                                            title={material.title}
                                                            width="560"
                                                            height="315"
                                                            className="w-full h-full rounded-lg"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                                <Video className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 mb-1">Video Content</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Watch this educational video for important safety information and guidelines.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Viewer */}
                                    {material.file_type === 'image' && material.file_path && (
                                        <div className="space-y-4">
                                            <div
                                                className="relative group cursor-pointer"
                                                onClick={() => setImagePreview(true)}
                                            >
                                                <img
                                                    src={material.file_path}
                                                    alt={material.title}
                                                    className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                        <Eye className="w-8 h-8 text-gray-800" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <a
                                                    href={material.file_path}
                                                    download={material.title}
                                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download Image
                                                </a>
                                                <button
                                                    onClick={() => setImagePreview(true)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                    View Full Size
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Material Information */}
                            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Material Information</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Type</p>
                                            <p className="text-gray-800 font-semibold">{getFileTypeLabel(material.file_type)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Published</p>
                                            <p className="text-gray-800 font-semibold">{material.created_at}</p>
                                        </div>
                                    </div>
                                    {material.creator && (
                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Created By</p>
                                                <p className="text-gray-800 font-semibold">
                                                    {material.creator.position
                                                        ? `${material.creator.position} - ${material.creator.first_name} ${material.creator.last_name}`
                                                        : material.creator.name || `${material.creator.first_name} ${material.creator.last_name}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                            <p className="text-gray-800 font-semibold">{material.updated_at}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 space-y-6">
                                {/* Related Materials */}
                                {relatedMaterials && relatedMaterials.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                            Related Materials
                                        </h3>
                                        <div className="space-y-4">
                                            {relatedMaterials.slice(0, 5).map((related) => (
                                                <Link
                                                    key={related.id}
                                                    href={route('resident.awareness-materials.show', related.id)}
                                                    className="block group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-gradient-to-br from-blue-100 to-emerald-100 p-2 rounded-lg flex-shrink-0">
                                                            {getFileTypeIcon(related.file_type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 leading-tight">
                                                                {related.title}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">
                                                                {getFileTypeLabel(related.file_type)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Download Options */}
                                {material.file_path && ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'image'].includes(material.file_type) && (
                                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl shadow-lg p-6">
                                        <h3 className="text-lg font-bold mb-2">Quick Download</h3>
                                        <p className="text-sm text-green-100 mb-4">
                                            Download this material for offline viewing
                                        </p>
                                        <a
                                            href={material.file_path}
                                            download={material.title}
                                            className="block text-center bg-white text-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                                        >
                                            <Download className="w-5 h-5 inline mr-2" />
                                            Download Now
                                        </a>
                                    </div>
                                )}

                                {/* Call to Action */}
                                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold mb-2">More Resources</h3>
                                    <p className="text-sm text-blue-100 mb-4">
                                        Explore more educational materials and training resources
                                    </p>
                                    <Link
                                        href={route('resident.awareness-materials.index')}
                                        className="block text-center bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        View All Materials
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Preview Modal */}
            {imagePreview && material.file_type === 'image' && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setImagePreview(false)}
                >
                    <button
                        onClick={() => setImagePreview(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 p-2 rounded-full"
                        aria-label="Close"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="w-full h-full flex items-center justify-center p-8">
                        <img
                            src={material.file_path}
                            alt={material.title}
                            className="w-auto h-auto max-w-full max-h-full object-contain"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                        {material.title}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

