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
    Image as ImageIcon,
    AlertCircle,
} from "lucide-react";
import { formatDate } from "@/Utils/helpers";

export default function ArchiveAnnouncements({
    announcements,
    filters: initialFilters = {},
    auth,
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
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
            router.get('/officer/archive/announcements', filters, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [filters.status, filters.from_date, filters.to_date]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        router.get('/officer/archive/announcements', { ...filters, search: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            status: '',
            from_date: '',
            to_date: '',
        };
        setFilters(clearedFilters);
        router.get('/officer/archive/announcements', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openConfirmModal = (type, item) => {
        const titles = {
            restore: 'Restore Announcement',
            'force-delete': 'Permanently Delete Announcement',
        };
        const messages = {
            restore: 'Are you sure you want to restore this announcement? It will be moved back to the active list.',
            'force-delete': 'Are you sure you want to permanently delete this announcement? This action cannot be undone.',
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
            router.post(route('officer.archive.announcements.restore', item.announcement_id), {}, {
                onSuccess: () => closeConfirmModal(),
                preserveScroll: true,
            });
        } else if (type === 'force-delete') {
            router.delete(route('officer.archive.announcements.force-delete', item.announcement_id), {
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
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Archive - Deleted Announcements" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Trash2 className="text-red-600" size={32} />
                            Archive - Deleted Announcements
                        </h1>
                        <p className="text-gray-600 mt-2">
                            View and manage deleted announcements. You can restore items or permanently delete them.
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
                        {announcements?.data?.length > 0 ? (
                            <div className="space-y-6">
                                {announcements.data.map((announcement) => (
                                    <Card key={announcement.announcement_id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                                        <div className="lg:w-80 flex-shrink-0">
                                            {announcement.images && announcement.images.length > 0 ? (
                                                announcement.images.length === 1 ? (
                                                    <img
                                                        src={announcement.images[0]}
                                                        alt={announcement.title}
                                                        className="w-full h-64 lg:h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className={`grid gap-2 h-64 lg:h-full ${announcement.images.length === 2 ? 'grid-cols-2' :
                                                        announcement.images.length === 3 ? 'grid-cols-3' :
                                                            'grid-cols-2 grid-rows-2'
                                                        }`}>
                                                        {announcement.images.slice(0, 4).map((img, idx) => (
                                                            <div key={idx} className="relative">
                                                                <img
                                                                    src={img}
                                                                    alt={`${announcement.title} ${idx + 1}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                                {idx === 3 && announcement.images.length > 4 && (
                                                                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                                                        <span className="text-white text-2xl font-bold">
                                                                            +{announcement.images.length - 4}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full h-64 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                                    <ImageIcon size={48} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                        {announcement.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                                        <StatusBadge status={announcement.status} />
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <AlertCircle size={12} className="mr-1" />
                                                            Deleted
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Calendar size={12} />
                                                        <span>Deleted: {formatDate(announcement.deleted_at)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
                                                {announcement.description}
                                            </p>

                                            {announcement.status === 'declined' && announcement.decline_reason && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm font-semibold text-red-800 mb-1">Decline Reason:</p>
                                                    <p className="text-sm text-red-700">{announcement.decline_reason}</p>
                                                </div>
                                            )}

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <UserIcon size={14} />
                                                        <span className="truncate max-w-[150px] sm:max-w-none">
                                                            {announcement.creator ? `${announcement.creator.first_name} ${announcement.creator.last_name}` : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <SuccessButton
                                                        onClick={() => openConfirmModal('restore', announcement)}
                                                        className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center"
                                                    >
                                                        <RotateCcw size={14} />
                                                        <span className="ml-1">Restore</span>
                                                    </SuccessButton>
                                                    <DangerButton
                                                        onClick={() => openConfirmModal('force-delete', announcement)}
                                                        className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span className="ml-1">Delete Forever</span>
                                                    </DangerButton>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Trash2 className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted announcements</h3>
                                <p className="text-gray-600">There are no deleted announcements at the moment.</p>
                            </div>
                        )}

                        {announcements?.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <div className="text-sm text-gray-600">
                                    Showing {announcements.from || 0} to {announcements.to || 0} of {announcements.total || 0} results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.get(announcements.prev_page_url || '#', filters)}
                                        disabled={!announcements.prev_page_url}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => router.get(announcements.next_page_url || '#', filters)}
                                        disabled={!announcements.next_page_url}
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
