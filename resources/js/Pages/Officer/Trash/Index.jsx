import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Card from "@/Components/Cards/Card";
import StatusBadge from "@/Components/Status/StatusBadge";
import ConfirmationModal from "@/Components/Modal/ConfirmationModal";
import Select from "@/Components/Form/Select";
import IncidentFilterPanel from "@/Components/Filters/IncidentFilterPanel";
import FilterPanel from "@/Components/Filters/FilterPanel";
import AwarenessMaterialFilterPanel from "@/Components/Filters/AwarenessMaterialFilterPanel";
import SuccessButton from "@/Components/Buttons/SuccessButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Trash2,
    MapPin,
    Calendar,
    User as UserIcon,
    AlertCircle,
    Image as ImageIcon,
    FileText,
} from "lucide-react";
import {
    getIncidentTypeConfig,
    getIncidentStatusConfig,
    getIncidentSeverityConfig,
    getIncidentTypesArray,
    getIncidentStatusArray,
    getIncidentSeverityArray,
} from "@/Utils/incidentHelper";
import { formatDate } from "@/Utils/helpers";

export default function ArchiveIndex({
    type: initialType = 'incidents',
    items,
    filters: initialFilters = {},
    auth,
}) {
    const [selectedType, setSelectedType] = useState(initialType);
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        severity: initialFilters.severity || '',
        type: initialFilters.type || '',
        file_type: initialFilters.file_type || '',
        from_date: initialFilters.from_date || '',
        to_date: initialFilters.to_date || '',
    });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '', // 'restore' or 'force-delete'
        item: null,
        title: '',
        message: '',
    });

    const typeOptions = [
        { value: 'incidents', label: 'Incidents' },
        { value: 'announcements', label: 'Announcements' },
        { value: 'materials', label: 'Awareness Materials' },
    ];

    // Handle type change
    const handleTypeChange = (newType) => {
        setSelectedType(newType);
        // Reset filters when changing type
        setFilters({
            search: '',
            status: '',
            severity: '',
            type: '',
            file_type: '',
            from_date: '',
            to_date: '',
        });
        router.get('/officer/archive', { type: newType }, {
            preserveState: false,
        });
    };

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Only send non-empty filters to avoid cluttering URL
            const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value) acc[key] = value;
                return acc;
            }, {});

            // Only make request if there are active filters
            // This prevents unnecessary requests on initial mount or type change with empty filters
            if (Object.keys(activeFilters).length > 0) {
                router.get('/officer/archive', { type: selectedType, ...activeFilters }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [filters.status, filters.severity, filters.type, filters.file_type, filters.from_date, filters.to_date]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));

        // Only send non-empty filters
        const activeFilters = Object.entries({ ...filters, search: value }).reduce((acc, [key, val]) => {
            if (val) acc[key] = val;
            return acc;
        }, {});

        router.get('/officer/archive', { type: selectedType, ...activeFilters }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            status: '',
            severity: '',
            type: '',
            file_type: '',
            from_date: '',
            to_date: '',
        };
        setFilters(clearedFilters);
        router.get('/officer/archive', { type: selectedType }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openConfirmModal = (actionType, item) => {
        const typeLabel = selectedType === 'incidents' ? 'Incident' : selectedType === 'announcements' ? 'Announcement' : 'Awareness Material';
        const titles = {
            restore: `Restore ${typeLabel}`,
            'force-delete': `Permanently Delete ${typeLabel}`,
        };
        const messages = {
            restore: `Are you sure you want to restore this ${typeLabel.toLowerCase()}? It will be moved back to the active list.`,
            'force-delete': `Are you sure you want to permanently delete this ${typeLabel.toLowerCase()}? This action cannot be undone.`,
        };

        setConfirmModal({
            isOpen: true,
            type: actionType,
            item,
            title: titles[actionType],
            message: messages[actionType],
        });
    };

    const handleConfirm = () => {
        const { type: actionType, item } = confirmModal;

        let routeName = '';
        let itemId = '';

        if (selectedType === 'incidents') {
            routeName = actionType === 'restore' ? 'officer.archive.incidents.restore' : 'officer.archive.incidents.force-delete';
            itemId = item.incident_id;
        } else if (selectedType === 'announcements') {
            routeName = actionType === 'restore' ? 'officer.archive.announcements.restore' : 'officer.archive.announcements.force-delete';
            itemId = item.announcement_id;
        } else {
            routeName = actionType === 'restore' ? 'officer.archive.materials.restore' : 'officer.archive.materials.force-delete';
            itemId = item.material_id;
        }

        if (actionType === 'restore') {
            router.post(route(routeName, itemId), {}, {
                onSuccess: () => closeConfirmModal(),
                preserveScroll: true,
            });
        } else {
            router.delete(route(routeName, itemId), {
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

    // Render functions for different item types
    const renderIncidentCard = (incident) => {
        const typeConfig = getIncidentTypeConfig(incident.type);
        const severityConfig = getIncidentSeverityConfig(incident.severity);
        const TypeIcon = typeConfig.icon;

        return (
            <Card
                key={incident.incident_id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                style={{
                    borderLeft: `4px solid ${severityConfig.color}`,
                }}
            >
                <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl transition-opacity group-hover:opacity-20"
                    style={{ backgroundColor: typeConfig.color }}
                />

                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2.5 rounded-xl shadow-sm transition-transform group-hover:scale-110"
                            style={{
                                backgroundColor: typeConfig.bgColor,
                                boxShadow: `0 4px 12px ${typeConfig.bgColor}`
                            }}
                        >
                            <TypeIcon size={24} color={typeConfig.color} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 capitalize">
                                {incident.type} Incident
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                <Calendar size={12} />
                                <span>Deleted: {formatDate(incident.deleted_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge status={incident.type} />
                    <StatusBadge status={incident.severity} />
                    <StatusBadge status={incident.status} />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle size={12} className="mr-1" />
                        Deleted
                    </span>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {incident.description}
                </p>

                {incident.status === 'declined' && incident.decline_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm font-semibold text-red-800 mb-1">Decline Reason:</p>
                        <p className="text-sm text-red-700">{incident.decline_reason}</p>
                    </div>
                )}

                <div className="border-t border-gray-100 pt-3 space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Barangay:</span>
                        <span className="font-medium text-gray-700 ml-auto">{incident.barangay || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <UserIcon size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Reported by:</span>
                        <span className="font-medium text-gray-700 ml-auto">
                            {incident.user ? (
                                incident.user.access === 'resident'
                                    ? `${incident.user.first_name} ${incident.user.last_name}`
                                    : `${incident.user.position || 'Officer'} - ${incident.user.first_name} ${incident.user.last_name}`
                            ) : 'N/A'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <SuccessButton
                        className="sm:flex-1"
                        onClick={() => openConfirmModal('restore', incident)}
                    >
                        <RotateCcw size={16} className="mr-1" />
                        Restore
                    </SuccessButton>
                    <DangerButton
                        onClick={() => openConfirmModal('force-delete', incident)}
                    >
                        <Trash2 size={16} className="mr-1" />
                        Delete Forever
                    </DangerButton>
                </div>
            </Card>
        );
    };

    const renderAnnouncementCard = (announcement) => {
        return (
            <Card
                key={announcement.announcement_id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                            {announcement.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <Calendar size={12} />
                            <span>Deleted: {formatDate(announcement.deleted_at)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge status={announcement.status} />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle size={12} className="mr-1" />
                        Deleted
                    </span>
                </div>

                {announcement.images && announcement.images.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <ImageIcon size={14} />
                            <span>{announcement.images.length} image(s)</span>
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {announcement.description}
                </p>

                <div className="border-t border-gray-100 pt-3 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                        <UserIcon size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Created by:</span>
                        <span className="font-medium text-gray-700 ml-auto">
                            {announcement.creator ? `${announcement.creator.position || 'Officer'} - ${announcement.creator.first_name} ${announcement.creator.last_name}` : 'N/A'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <SuccessButton
                        className="sm:flex-1"
                        onClick={() => openConfirmModal('restore', announcement)}
                    >
                        <RotateCcw size={16} className="mr-1" />
                        Restore
                    </SuccessButton>
                    <DangerButton
                        onClick={() => openConfirmModal('force-delete', announcement)}
                    >
                        <Trash2 size={16} className="mr-1" />
                        Delete Forever
                    </DangerButton>
                </div>
            </Card>
        );
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

    const renderMaterialCard = (material) => {
        return (
            <Card
                key={material.material_id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                            {material.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <Calendar size={12} />
                            <span>Deleted: {formatDate(material.deleted_at)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge status={material.status} />
                    {material.file_type && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            <FileText size={12} className="mr-1" />
                            {material.file_type}
                        </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle size={12} className="mr-1" />
                        Deleted
                    </span>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {material.description}
                </p>

                <div className="border-t border-gray-100 pt-3 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                        <UserIcon size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Created by:</span>
                        <span className="font-medium text-gray-700 ml-auto">
                            {material.creator ? `${material.creator.position || 'Officer'} - ${material.creator.first_name} ${material.creator.last_name}` : 'N/A'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <SuccessButton
                        className="sm:flex-1"
                        onClick={() => openConfirmModal('restore', material)}
                    >
                        <RotateCcw size={16} className="mr-1" />
                        Restore
                    </SuccessButton>
                    <DangerButton
                        onClick={() => openConfirmModal('force-delete', material)}
                    >
                        <Trash2 size={16} className="mr-1" />
                        Delete Forever
                    </DangerButton>
                </div>
            </Card>
        );
    };

    const renderFilterPanel = () => {
        if (selectedType === 'incidents') {
            return (
                <IncidentFilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearchChange={handleSearchChange}
                    onClearFilters={clearFilters}
                    incidentTypes={getIncidentTypesArray()}
                    incidentStatuses={getIncidentStatusArray()}
                    incidentSeverities={getIncidentSeverityArray()}
                    barangays={[]}
                    showBarangayFilter={false}
                />
            );
        } else if (selectedType === 'announcements') {
            return (
                <FilterPanel
                    filters={filters}
                    filterFields={filterFields}
                    onFilterChange={handleFilterChange}
                    onSearchChange={handleSearchChange}
                    onClearFilters={clearFilters}
                    statuses={['draft', 'published']}
                />
            );
        } else {
            return (
                <AwarenessMaterialFilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearchChange={handleSearchChange}
                    onClearFilters={clearFilters}
                    statuses={['draft', 'published']}
                    fileTypes={['image', 'pdf', 'video']}
                />
            );
        }
    };

    const renderItems = () => {
        if (!items?.data || items.data.length === 0) {
            const emptyMessages = {
                incidents: 'There are no deleted incidents at the moment.',
                announcements: 'There are no deleted announcements at the moment.',
                materials: 'There are no deleted awareness materials at the moment.',
            };

            return (
                <div className="text-center py-12">
                    <Trash2 className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted items</h3>
                    <p className="text-gray-600">{emptyMessages[selectedType]}</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.data.map(item => {
                    if (selectedType === 'incidents') return renderIncidentCard(item);
                    if (selectedType === 'announcements') return renderAnnouncementCard(item);
                    return renderMaterialCard(item);
                })}
            </div>
        );
    };

    const typeLabels = {
        incidents: 'Incidents',
        announcements: 'Announcements',
        materials: 'Awareness Materials',
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Archive - Deleted Items" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Trash2 className="text-red-600" size={32} />
                            Archive
                        </h1>
                        <p className="text-gray-600 mt-2">
                            View and manage deleted items. You can restore items or permanently delete them.
                        </p>
                    </div>

                    {/* Type Selector */}
                    <div className="mb-6">
                        <Select
                            label="Content Type"
                            value={selectedType}
                            onChange={handleTypeChange}
                            options={typeOptions}
                        />
                    </div>

                    {renderFilterPanel()}

                    <div className="mt-6">
                        {renderItems()}

                        {items?.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <div className="text-sm text-gray-600">
                                    Showing {items.from || 0} to {items.to || 0} of {items.total || 0} results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.get(items.prev_page_url || '#', { type: selectedType, ...filters })}
                                        disabled={!items.prev_page_url}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => router.get(items.next_page_url || '#', { type: selectedType, ...filters })}
                                        disabled={!items.next_page_url}
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
