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
    Image as ImageIcon,
} from "lucide-react";
import { Button } from "@heroui/react";
import AnnouncementModal from "./AnnouncementModal";

export default function AnnouncementsList({
    announcements,
    filters: initialFilters = {},
    canManage,
    isHeadOfficer,
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        from_date: initialFilters.from_date || '',
        to_date: initialFilters.to_date || '',
    });
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '', // 'approve', 'decline', 'delete'
        announcement: null,
        title: '',
        message: '',
    });
    const [declineReason, setDeclineReason] = useState('');

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/officer/announcements', filters, {
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
        router.get('/officer/announcements', { ...filters, search: value }, {
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
        router.get('/officer/announcements', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Define filter fields dynamically
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

    const openAnnouncementModal = (announcement = null) => {
        setEditingAnnouncement(announcement);
        setShowAnnouncementModal(true);
    };

    const closeAnnouncementModal = () => {
        setShowAnnouncementModal(false);
        setEditingAnnouncement(null);
    };

    const openConfirmModal = (type, announcement) => {
        let title = '';
        let message = '';

        if (type === 'approve') {
            title = 'Approve Announcement';
            message = 'Are you sure you want to approve this announcement? It will be visible to all users.';
        } else if (type === 'decline') {
            title = 'Decline Announcement';
            message = 'Please provide a reason for declining this announcement.';
        } else if (type === 'delete') {
            title = 'Archive Announcement';
            message = 'This will move the announcement to archive. This action cannot be undone.';
        }

        setConfirmModal({
            isOpen: true,
            type,
            announcement,
            title,
            message,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: '',
            announcement: null,
            title: '',
            message: '',
        });
        setDeclineReason('');
    };

    const handleConfirm = () => {
        const { type, announcement } = confirmModal;

        if (type === 'approve') {
            router.post(`/officer/announcements/${announcement.id}/status`, {
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
            router.post(`/officer/announcements/${announcement.id}/status`, {
                status: 'declined',
                decline_reason: declineReason,
            }, {
                preserveScroll: true,
                onSuccess: closeConfirmModal,
            });
        } else if (type === 'delete') {
            router.delete(`/officer/announcements/${announcement.id}`, {
                preserveScroll: true,
                onSuccess: closeConfirmModal,
            });
        }
    };

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
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Announcements</h1>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                                {isHeadOfficer
                                    ? 'Create and manage community announcements.'
                                    : canManage
                                        ? 'Create announcements for approval.'
                                        : 'View community announcements.'}
                            </p>
                        </div>
                        {canManage && (
                            <PrimaryButton onClick={() => openAnnouncementModal()} className="w-full sm:w-auto justify-center">
                                <Plus size={18} className="sm:mr-2" />
                                <span className="hidden sm:inline">New Announcement</span>
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
                        searchPlaceholder="Search announcements..."
                        filterFields={filterFields}
                        title="Search & Filter"
                        description="Use the search bar to find specific announcements, or apply filters to narrow down results by status and date range."
                    />

                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {announcements.from || 0} to {announcements.to || 0} of {announcements.total || 0} announcements
                    </div>

                    {/* Announcements List - Wide Cards */}
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

                                        {/* Content Section */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                                                        {announcement.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                                        <StatusBadge status={announcement.status} />
                                                        {announcement.creator_role && (
                                                            <StatusBadge status={announcement.creator_role} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
                                                {announcement.description}
                                            </p>

                                            {/* Decline Reason if applicable */}
                                            {announcement.status === 'declined' && announcement.decline_reason && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm font-semibold text-red-800 mb-1">Decline Reason:</p>
                                                    <p className="text-sm text-red-700">{announcement.decline_reason}</p>
                                                </div>
                                            )}

                                            {/* Footer with meta info and actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <UserIcon size={14} />
                                                        <span className="truncate max-w-[150px] sm:max-w-none">{announcement.created_by}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} />
                                                        <span>{announcement.created_at}</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    {/* Head Officer Actions */}
                                                    {isHeadOfficer && announcement.status === 'pending' && (
                                                        <>
                                                            <SuccessButton onClick={() => openConfirmModal('approve', announcement)} className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center">
                                                                <CheckCircle size={14} />
                                                                <span className="ml-1">Approve</span>
                                                            </SuccessButton>
                                                            <DangerButton onClick={() => openConfirmModal('decline', announcement)} className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center">
                                                                <XCircle size={14} />
                                                                <span className="ml-1">Decline</span>
                                                            </DangerButton>
                                                        </>
                                                    )}

                                                    {/* Edit Button */}
                                                    {/* Head officers can edit all announcements, regular officers can only edit pending/declined */}
                                                    {(isHeadOfficer || (canManage && ['pending', 'declined'].includes(announcement.status))) && (
                                                        <PrimaryButton onClick={() => openAnnouncementModal(announcement)} className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-2 justify-center">
                                                            <Edit size={14} />
                                                            <span className="ml-1">Edit</span>
                                                        </PrimaryButton>
                                                    )}

                                                    {/* Archive Button */}
                                                    {(isHeadOfficer || canManage) && (
                                                        <DangerButton
                                                            className="px-3 py-2 flex items-center justify-center text-xs sm:text-sm"
                                                            onClick={() => openConfirmModal('delete', announcement)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </DangerButton>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No announcements found.</p>
                                {canManage && (
                                    <PrimaryButton
                                        onClick={() => openAnnouncementModal()}
                                        className="mt-4"
                                    >
                                        Create First Announcement
                                    </PrimaryButton>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Pagination */}
                    {announcements.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs sm:text-sm text-gray-600">
                                Page {announcements.current_page} of {announcements.last_page}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto justify-center">
                                {announcements.prev_page_url && (
                                    <Button
                                        variant="bordered"
                                        onClick={() => router.get(announcements.prev_page_url)}
                                        startContent={<ChevronLeft size={18} />}
                                        className="flex-1 sm:flex-none"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {announcements.next_page_url && (
                                    <Button
                                        variant="bordered"
                                        onClick={() => router.get(announcements.next_page_url)}
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

            {/* Announcement Modal */}
            <AnnouncementModal
                isOpen={showAnnouncementModal}
                onClose={closeAnnouncementModal}
                announcement={editingAnnouncement}
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
                details={confirmModal.announcement ? {
                    'Title': confirmModal.announcement.title,
                    'Created By': confirmModal.announcement.created_by,
                    'Status': confirmModal.announcement.status?.charAt(0).toUpperCase() + confirmModal.announcement.status?.slice(1),
                    'Created At': confirmModal.announcement.created_at,
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
                            placeholder="Please provide a reason for declining this announcement..."
                        />
                    </div>
                )}
            />
        </AuthenticatedLayout>
    );
}


