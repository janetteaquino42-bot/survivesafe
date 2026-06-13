import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Card from "@/Components/Cards/Card";
import StatusBadge from "@/Components/Status/StatusBadge";
import ConfirmationModal from "@/Components/Modal/ConfirmationModal";
import FilterPanel from "@/Components/Filters/FilterPanel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SuccessButton from "@/Components/Buttons/SuccessButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    Calendar,
    User as UserIcon,
    FileText,
    Download,
    ExternalLink,
    Image as ImageIcon,
    Video,
} from "lucide-react";
import { Button } from "@heroui/react";
import AwarenessMaterialModal from "./AwarenessMaterialModal";

export default function AwarenessMaterialsList({
    materials,
    filters: initialFilters = {},
    canManage,
    isHeadOfficer,
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        file_type: initialFilters.file_type || '',
        from_date: initialFilters.from_date || '',
        to_date: initialFilters.to_date || '',
    });
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '',
        material: null,
        title: '',
        message: '',
    });
    const [declineReason, setDeclineReason] = useState('');

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/officer/awareness-materials', filters, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [filters.status, filters.file_type, filters.from_date, filters.to_date]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        router.get('/officer/awareness-materials', { ...filters, search: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            status: '',
            file_type: '',
            from_date: '',
            to_date: '',
        };
        setFilters(clearedFilters);
        router.get('/officer/awareness-materials', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Define filter fields dynamically
    const filterFields = [{
        type: 'select',
        name: 'status',
        label: 'Status',
        placeholder: 'All Statuses',
        options: [
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'declined', label: 'Declined' },
        ],
    },
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
    {
        type: 'date',
        name: 'from_date',
        label: 'From Date',
    },
    {
        type: 'date',
        name: 'to_date',
        label: 'To Date',
    },
    ].filter(Boolean);

    const openMaterialModal = (material = null) => {
        setEditingMaterial(material);
        setShowMaterialModal(true);
    };

    const closeMaterialModal = () => {
        setShowMaterialModal(false);
        setEditingMaterial(null);
    };

    const openConfirmModal = (type, material) => {
        let title = '';
        let message = '';

        if (type === 'approve') {
            title = 'Approve Material';
            message = 'Are you sure you want to approve this awareness material? It will be visible to all users.';
        } else if (type === 'decline') {
            title = 'Decline Material';
            message = 'Please provide a reason for declining this awareness material.';
        } else if (type === 'delete') {
            title = 'Archive Material';
            message = 'This will move the awareness material to archive. This action cannot be undone.';
        }

        setConfirmModal({
            isOpen: true,
            type,
            material,
            title,
            message,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: '',
            material: null,
            title: '',
            message: '',
        });
        setDeclineReason('');
    };

    const handleConfirm = () => {
        const { type, material } = confirmModal;

        if (type === 'approve') {
            router.post(`/officer/awareness-materials/${material.id}/status`, {
                status: 'approved',
            }, {
                preserveScroll: true,
                onSuccess: closeConfirmModal,
            });
        } else if (type === 'decline') {
            if (!declineReason.trim()) {
                alert('Please provide a reason for declining.');
                return;
            }
            router.post(`/officer/awareness-materials/${material.id}/status`, {
                status: 'declined',
                decline_reason: declineReason,
            }, {
                preserveScroll: true,
                onSuccess: closeConfirmModal,
            });
        } else if (type === 'delete') {
            router.delete(`/officer/awareness-materials/${material.id}`, {
                preserveScroll: true,
                onSuccess: closeConfirmModal,
            });
        }
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'pdf':
                return <FileText size={48} className="text-red-500" />;
            case 'docx':
                return <FileText size={48} className="text-blue-500" />;
            case 'pptx':
                return <FileText size={48} className="text-orange-500" />;
            case 'image':
                return <ImageIcon size={48} className="text-green-500" />;
            case 'video_link':
                return <Video size={48} className="text-purple-500" />;
            default:
                return <FileText size={48} className="text-gray-500" />;
        }
    };

    const getFileTypeLabel = (fileType) => {
        const labels = {
            'pdf': 'PDF Document',
            'docx': 'Word Document',
            'pptx': 'PowerPoint Presentation',
            'image': 'Image',
            'video_link': 'Video Link',
        };
        return labels[fileType] || fileType;
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
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Awareness Materials</h1>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                                {isHeadOfficer
                                    ? 'Create and manage awareness and educational materials.'
                                    : canManage
                                        ? 'Upload awareness materials for approval.'
                                        : 'Browse awareness and educational materials.'}
                            </p>
                        </div>
                        {canManage && (
                            <PrimaryButton onClick={() => openMaterialModal()} className="w-full sm:w-auto justify-center">
                                <Plus size={18} className="sm:mr-2" />
                                <span className="hidden sm:inline">New Material</span>
                                <span className="sm:hidden ml-2">New</span>
                            </PrimaryButton>
                        )}
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
                        description="Use the search bar to find specific materials, or apply filters to narrow down results by type, status, and date range."
                    />

                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {materials.from || 0} to {materials.to || 0} of {materials.total || 0} materials
                    </div>

                    {/* Materials List - Wide Cards */}
                    {materials.data.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                            {materials.data.map((material) => {
                                const embedPreviewUrl = getEmbedPreviewUrl(material.video_link);

                                return <Card
                                    key={material.id}
                                    className="hover:shadow-xl transition-all duration-300 overflow-hidden !p-2 sm:!p-3 lg:!p-5"
                                >
                                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                                        {/* File Preview Section */}
                                        <div className="lg:w-1/3 flex-shrink-0">
                                            {material.file_type === 'image' && material.file_path ? (
                                                <img
                                                    src={material.file_path}
                                                    alt={material.title}
                                                    className="w-full h-64 lg:h-full object-cover rounded-lg"
                                                />
                                            ) : material.file_type === 'video_link' && material.video_link ? (
                                                embedPreviewUrl ? (
                                                    <a
                                                        href={material.video_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full max-w-full h-56 rounded-lg overflow-hidden cursor-pointer mx-auto lg:mx-0"
                                                        title="View video"
                                                    >
                                                        <div className="w-full h-full flex items-center justify-center ">
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
                                                    </a>
                                                ) : (
                                                    <div className="w-full h-64 lg:h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex flex-col items-center justify-center p-4">
                                                        <Video size={64} className="text-purple-600 mb-3" />
                                                        <a
                                                            href={material.video_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-2"
                                                        >
                                                            Watch Video <ExternalLink size={16} />
                                                        </a>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full h-64 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center">
                                                    {getFileIcon(material.file_type)}
                                                    <span className="mt-3 text-sm font-semibold text-gray-600">
                                                        {getFileTypeLabel(material.file_type)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                        {material.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                                        <StatusBadge status={material.status} />
                                                        {material.creator_role && (
                                                            <StatusBadge status={material.creator_role} />
                                                        )}
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                            {getFileTypeLabel(material.file_type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
                                                {material.description}
                                            </p>

                                            {/* Decline Reason if applicable */}
                                            {material.status === 'declined' && material.decline_reason && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm font-semibold text-red-800 mb-1">Decline Reason:</p>
                                                    <p className="text-sm text-red-700">{material.decline_reason}</p>
                                                </div>
                                            )}

                                            {/* Footer with meta info and actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <UserIcon size={14} />
                                                        <span className="truncate max-w-[150px] sm:max-w-none">{material.created_by}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} />
                                                        <span>{material.created_at}</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    {/* Download Button */}
                                                    {material.file_path && material.file_type !== 'video_link' && (
                                                        <Button
                                                            as="a"
                                                            href={material.file_path}
                                                            download
                                                            variant="bordered"
                                                            className="flex-1 sm:flex-none h-9 text-xs sm:text-sm sm:h-10"
                                                            startContent={<Download size={14} className="sm:w-4 sm:h-4" />}
                                                        >
                                                            <span className="text-xs sm:text-sm">Download</span>
                                                        </Button>
                                                    )}

                                                    {/* Head Officer Actions */}
                                                    {isHeadOfficer && material.status === 'pending' && (
                                                        <>
                                                            <SuccessButton onClick={() => openConfirmModal('approve', material)} className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center">
                                                                <CheckCircle size={14} />
                                                                <span className="ml-1">Approve</span>
                                                            </SuccessButton>
                                                            <DangerButton onClick={() => openConfirmModal('decline', material)} className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center">
                                                                <XCircle size={14} />
                                                                <span className="ml-1">Decline</span>
                                                            </DangerButton>
                                                        </>
                                                    )}

                                                    {/* Edit Button */}
                                                    {(isHeadOfficer || (canManage && ['pending', 'declined'].includes(material.status))) && (
                                                        <PrimaryButton onClick={() => openMaterialModal(material)} className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center">
                                                            <Edit size={14} />
                                                            <span className="ml-1">Edit</span>
                                                        </PrimaryButton>
                                                    )}

                                                    {/* Archive Button */}
                                                    {(isHeadOfficer || canManage) && (
                                                        <DangerButton
                                                            className="px-3 py-2 flex items-center justify-center text-xs sm:text-sm"
                                                            onClick={() => openConfirmModal('delete', material)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </DangerButton>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>;
                            })}
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No awareness materials found.</p>
                                {canManage && (
                                    <PrimaryButton
                                        onClick={() => openMaterialModal()}
                                        className="mt-4"
                                    >
                                        Create First Material
                                    </PrimaryButton>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Pagination */}
                    {materials.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs sm:text-sm text-gray-600">
                                Page {materials.current_page} of {materials.last_page}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto justify-center">
                                {materials.prev_page_url && (
                                    <Button
                                        variant="bordered"
                                        onClick={() => router.get(materials.prev_page_url)}
                                        startContent={<ChevronLeft size={18} />}
                                        className="flex-1 sm:flex-none"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {materials.next_page_url && (
                                    <Button
                                        variant="bordered"
                                        onClick={() => router.get(materials.next_page_url)}
                                        endContent={<ChevronRight size={18} />}
                                        className="flex-1 sm:flex-none"
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Material Modal */}
            <AwarenessMaterialModal
                isOpen={showMaterialModal}
                onClose={closeMaterialModal}
                material={editingMaterial}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmColor={confirmModal.type === 'approve' ? 'success' : 'danger'}
                confirmText={
                    confirmModal.type === 'delete'
                        ? 'Archive'
                        : confirmModal.type === 'approve'
                            ? 'Approve'
                            : 'Decline'
                }
                icon={
                    confirmModal.type === 'delete'
                        ? Trash2
                        : confirmModal.type === 'approve'
                            ? CheckCircle
                            : XCircle
                }
                ConfirmButton={
                    confirmModal.type === 'delete'
                        ? DangerButton
                        : confirmModal.type === 'approve'
                            ? SuccessButton
                            : DangerButton
                }
                details={confirmModal.material ? {
                    'Title': confirmModal.material.title,
                    'Created By': confirmModal.material.created_by,
                    'Status': confirmModal.material.status?.charAt(0).toUpperCase() + confirmModal.material.status?.slice(1),
                    'Created At': confirmModal.material.created_at,
                } : null}
                detailsComponent={confirmModal.type === 'decline' && (
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Decline Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="4"
                            placeholder="Please provide a reason for declining this material..."
                        />
                    </div>
                )}
            />
        </AuthenticatedLayout>
    );
}
