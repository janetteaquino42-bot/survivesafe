import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Card from "@/Components/Cards/Card";
import StatusBadge from "@/Components/Status/StatusBadge";
import ConfirmationModal from "@/Components/Modal/ConfirmationModal";
import FilterPanel from "@/Components/Filters/FilterPanel";
import SuccessButton from "@/Components/Buttons/SuccessButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Trash2,
    Calendar,
    User as UserIcon,
    FileText,
    Image as ImageIcon,
    Video,
    ExternalLink,
    AlertCircle,
} from "lucide-react";
import { formatDate } from "@/Utils/helpers";

export default function ArchiveMaterials({
    materials,
    filters: initialFilters = {},
    auth,
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        file_type: initialFilters.file_type || '',
        from_date: initialFilters.from_date || '',
        to_date: initialFilters.to_date || '',
    });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '',
        item: null,
        title: '',
        message: '',
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/officer/archive/materials', filters, {
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
        router.get('/officer/archive/materials', { ...filters, search: value }, {
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
        router.get('/officer/archive/materials', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openConfirmModal = (type, item) => {
        const titles = {
            restore: 'Restore Awareness Material',
            'force-delete': 'Permanently Delete Awareness Material',
        };
        const messages = {
            restore: 'Are you sure you want to restore this awareness material? It will be moved back to the active list.',
            'force-delete': 'Are you sure you want to permanently delete this awareness material? This action cannot be undone.',
        };

        setConfirmModal({
            isOpen: true,
            type,
            item,
            title: titles[type],
            message: messages[type],
        });
    };

    const handleConfirm = () => {
        const { type, item } = confirmModal;

        if (type === 'restore') {
            router.post(route('officer.archive.materials.restore', item.material_id), {}, {
                onSuccess: () => closeConfirmModal(),
                preserveScroll: true,
            });
        } else if (type === 'force-delete') {
            router.delete(route('officer.archive.materials.force-delete', item.material_id), {
                onSuccess: () => closeConfirmModal(),
                preserveScroll: true,
            });
        }
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: '',
            item: null,
            title: '',
            message: '',
        });
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

    const filterFields = [
        {
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
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Archive - Deleted Awareness Materials" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Trash2 className="text-red-600" size={32} />
                            Archive - Deleted Awareness Materials
                        </h1>
                        <p className="text-gray-600 mt-2">
                            View and manage deleted awareness materials. You can restore items or permanently delete them.
                        </p>
                    </div>

                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        onClearFilters={clearFilters}
                        filterFields={filterFields}
                    />

                    <div className="mt-6">
                        {materials?.data?.length > 0 ? (
                            <div className="space-y-4 sm:space-y-6">
                                {materials.data.map((material) => (
                                    <Card
                                        key={material.material_id}
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
                                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                            {material.title}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                                            <StatusBadge status={material.status} />
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                <AlertCircle size={12} className="mr-1" />
                                                                Deleted
                                                            </span>
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                                                {getFileTypeLabel(material.file_type)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Calendar size={12} />
                                                            <span>Deleted: {formatDate(material.deleted_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
                                                    {material.description}
                                                </p>

                                                {material.status === 'declined' && material.decline_reason && (
                                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <p className="text-sm font-semibold text-red-800 mb-1">Decline Reason:</p>
                                                        <p className="text-sm text-red-700">{material.decline_reason}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <UserIcon size={14} />
                                                            <span className="truncate max-w-[150px] sm:max-w-none">
                                                                {material.creator ? `${material.creator.first_name} ${material.creator.last_name}` : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <SuccessButton
                                                            onClick={() => openConfirmModal('restore', material)}
                                                            className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center"
                                                        >
                                                            <RotateCcw size={14} />
                                                            <span className="ml-1">Restore</span>
                                                        </SuccessButton>
                                                        <DangerButton
                                                            onClick={() => openConfirmModal('force-delete', material)}
                                                            className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center"
                                                        >
                                                            <Trash2 size={14} />
                                                            <span className="ml-1">Delete Forever</span>
                                                        </DangerButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Trash2 className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted awareness materials</h3>
                                <p className="text-gray-600">There are no deleted awareness materials at the moment.</p>
                            </div>
                        )}

                        {materials?.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <div className="text-sm text-gray-600">
                                    Showing {materials.from || 0} to {materials.to || 0} of {materials.total || 0} results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.get(materials.prev_page_url || '#', filters)}
                                        disabled={!materials.prev_page_url}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => router.get(materials.next_page_url || '#', filters)}
                                        disabled={!materials.next_page_url}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.type === 'restore' ? 'Restore' : 'Delete Forever'}
                confirmButtonClass={confirmModal.type === 'restore' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            />
        </AuthenticatedLayout>
    );
}
