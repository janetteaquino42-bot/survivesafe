import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Card from "@/Components/Cards/Card";
import StatusBadge from "@/Components/Status/StatusBadge";
import ConfirmationModal from "@/Components/Modal/ConfirmationModal";
import IncidentFilterPanel from "@/Components/Filters/IncidentFilterPanel";
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

export default function ArchiveIncidents({
    incidents,
    filters: initialFilters = {},
    auth,
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        severity: initialFilters.severity || '',
        type: initialFilters.type || '',
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

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/officer/archive/incidents', filters, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [filters.status, filters.severity, filters.type, filters.from_date, filters.to_date]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        router.get('/officer/archive/incidents', { ...filters, search: value }, {
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
            from_date: '',
            to_date: '',
        };
        setFilters(clearedFilters);
        router.get('/officer/archive/incidents', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openConfirmModal = (type, item) => {
        const titles = {
            restore: 'Restore Incident',
            'force-delete': 'Permanently Delete Incident',
        };
        const messages = {
            restore: 'Are you sure you want to restore this incident? It will be moved back to the active list.',
            'force-delete': 'Are you sure you want to permanently delete this incident? This action cannot be undone.',
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
            router.post(route('officer.archive.incidents.restore', item.incident_id), {}, {
                onSuccess: () => closeConfirmModal(),
                preserveScroll: true,
            });
        } else if (type === 'force-delete') {
            router.delete(route('officer.archive.incidents.force-delete', item.incident_id), {
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

                {/* Decline Reason if applicable */}
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
                            {incident.user ? `${incident.user.first_name} ${incident.user.last_name}` : 'N/A'}
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Archive - Deleted Incidents" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Trash2 className="text-red-600" size={32} />
                            Archive - Deleted Incidents
                        </h1>
                        <p className="text-gray-600 mt-2">
                            View and manage deleted incidents. You can restore items or permanently delete them.
                        </p>
                    </div>

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

                    <div className="mt-6">
                        {incidents?.data?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {incidents.data.map(renderIncidentCard)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Trash2 className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted incidents</h3>
                                <p className="text-gray-600">There are no deleted incidents at the moment.</p>
                            </div>
                        )}

                        {incidents?.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <div className="text-sm text-gray-600">
                                    Showing {incidents.from || 0} to {incidents.to || 0} of {incidents.total || 0} results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.get(incidents.prev_page_url || '#', filters)}
                                        disabled={!incidents.prev_page_url}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => router.get(incidents.next_page_url || '#', filters)}
                                        disabled={!incidents.next_page_url}
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
