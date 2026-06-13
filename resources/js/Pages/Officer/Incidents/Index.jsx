import { Head, router, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Card from "@/Components/Cards/Card";
import StatusBadge from "@/Components/Status/StatusBadge";
import ConfirmationModal from "@/Components/Modal/ConfirmationModal";
import IncidentFilterPanel from "@/Components/Filters/IncidentFilterPanel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SuccessButton from "@/Components/Buttons/SuccessButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import {
    ChevronLeft,
    ChevronRight,
    Activity,
    Users,
    FileText,
    CheckCircle,
    Trash2,
    MapPin,
    Calendar,
    User as UserIcon,
    Edit,
    XCircle,
} from "lucide-react";
import { Button } from "@heroui/react";
import {
    getIncidentTypeConfig,
    getIncidentStatusConfig,
    getIncidentSeverityConfig,
    getIncidentTypesArray,
    getIncidentStatusArray,
    getIncidentSeverityArray,
} from "@/Utils/incidentHelper";

export default function IncidentsList({
    auth,
    incidents,
    barangays,
    filters: initialFilters = {},
    canChangeStatus,
    userRole = 'officer',
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        type: initialFilters.type || '',
        status: initialFilters.status || '',
        severity: initialFilters.severity || '',
        barangay: initialFilters.barangay || '',
        from_date: initialFilters.from_date || '',
        to_date: initialFilters.to_date || '',
    });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '', // 'status' or 'delete'
        incident: null,
        newStatus: null,
        title: '',
        message: '',
    });
    const [declineReason, setDeclineReason] = useState('');

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get('/officer/incidents', filters, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 100); // Small delay to batch rapid changes

        return () => clearTimeout(timeoutId);
    }, [filters.type, filters.status, filters.severity, filters.barangay, filters.from_date, filters.to_date]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
        router.get('/incidents', { ...filters, search: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            type: '',
            status: '',
            severity: '',
            barangay: '',
            from_date: '',
            to_date: '',
        };
        setFilters(clearedFilters);
        router.get('/incidents', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openConfirmModal = (type, incident, newStatus = null) => {
        let title = '';
        let message = '';

        if (type === 'status') {
            if (newStatus === 'verified') {
                title = 'Mark as Reviewed';
                message = 'Are you sure you want to mark this incident as reviewed?';
            } else if (newStatus === 'resolved') {
                title = 'Mark as Resolved';
                message = 'Are you sure you want to mark this incident as resolved?';
            } else if (newStatus === 'declined') {
                title = 'Decline Incident';
                message = 'Please provide a reason for declining this incident report.';
            }
        } else if (type === 'delete') {
            title = 'Archive Incident';
            message = 'This will move the incident to archive. This action cannot be undone.';
        }

        setConfirmModal({
            isOpen: true,
            type,
            incident,
            newStatus,
            title,
            message,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            type: '',
            incident: null,
            newStatus: null,
            title: '',
            message: '',
        });
        setDeclineReason('');
    };

    const handleConfirm = () => {
        if (confirmModal.type === 'status') {
            handleStatusChange(confirmModal.incident.id, confirmModal.newStatus);
        } else if (confirmModal.type === 'delete') {
            handleDelete(confirmModal.incident.id);
        }
        closeConfirmModal();
    };

    const handleStatusChange = (incidentId, newStatus) => {
        if (!canChangeStatus) return;

        // If declining, require a reason
        if (newStatus === 'declined' && !declineReason.trim()) {
            alert('Please provide a reason for declining.');
            return;
        }

        router.post(`/incidents/${incidentId}/status`, {
            status: newStatus,
            decline_reason: newStatus === 'declined' ? declineReason : null,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (incidentId) => {
        router.delete(`/incidents/${incidentId}`, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Incidents', href: null },
            ]}
        >
            <Head title="Incidents" />

            <div className="py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Incident Reports</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                View and manage all incident reports from the community.
                            </p>
                        </div>
                        {(auth.user.access === 'officer') && (
                            <Link
                                href={route('officer.incidents.create')}
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm w-full sm:w-auto text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="ml-2 sm:ml-0">Report Incident</span>
                            </Link>
                        )}
                    </div>

                    {/* Search and Filter Panel */}
                    <IncidentFilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        onClearFilters={clearFilters}
                        incidentTypes={getIncidentTypesArray()}
                        incidentStatuses={getIncidentStatusArray()}
                        incidentSeverities={getIncidentSeverityArray()}
                        barangays={barangays}
                        description="Use the search bar and filters below to find specific incident reports. Filters are automatically applied as you make changes."
                    />

                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {incidents.from || 0} to {incidents.to || 0} of {incidents.total || 0} incidents
                    </div>

                    {/* Incidents Grid */}
                    {incidents.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {incidents.data.map((incident) => {
                                const typeConfig = getIncidentTypeConfig(incident.type);
                                const severityConfig = getIncidentSeverityConfig(incident.severity);
                                const TypeIcon = typeConfig.icon;

                                return (
                                    <Card
                                        key={incident.id}
                                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                                        style={{
                                            borderLeft: `4px solid ${severityConfig.color}`,
                                        }}
                                    >
                                        {/* Gradient Background Accent */}
                                        <div
                                            className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl transition-opacity group-hover:opacity-20"
                                            style={{ backgroundColor: typeConfig.color }}
                                        />

                                        {/* Icon and Type Header */}
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
                                                        {incident.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                                        <Calendar size={12} />
                                                        <span>{incident.created_at}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <StatusBadge status={incident.type} />
                                            <StatusBadge status={incident.severity} />
                                            <StatusBadge status={incident.status} />
                                        </div>

                                        {/* Description */}
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

                                        {/* Location and Reporter Info */}
                                        <div className="border-t border-gray-100 pt-3 space-y-2.5 mb-4">
                                            <div className="flex items-center gap-2 text-xs">
                                                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-500">Location:</span>
                                                <span className="font-medium text-gray-700 ml-auto">{incident.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-500">Barangay:</span>
                                                <span className="font-medium text-gray-700 ml-auto">{incident.barangay}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <UserIcon size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-500">Reported by:</span>
                                                <span className="font-medium text-gray-700 ml-auto">{incident.reported_by}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            {/* Edit & Resubmit Button for Declined Incidents */}
                                            {incident.status === 'declined' && (
                                                <PrimaryButton
                                                    className="sm:flex-1"
                                                    onClick={() => {
                                                        router.get(route('officer.incidents.create'), {
                                                            edit: incident.id,
                                                            type: incident.type,
                                                            barangay: incident.barangay,
                                                            latitude: incident.latitude,
                                                            longitude: incident.longitude,
                                                            description: incident.description,
                                                            severity: incident.severity,
                                                        });
                                                    }}
                                                >
                                                    <Edit size={16} className="mr-1" />
                                                    Edit & Resubmit
                                                </PrimaryButton>
                                            )}

                                            {/* Head Officer Actions */}
                                            {canChangeStatus && (
                                                <>
                                                    {/* Mark as Reviewed/Declined Button */}
                                                    {incident.status === 'active' && (
                                                        <>
                                                            <PrimaryButton
                                                                className="sm:flex-1"
                                                                onClick={() => openConfirmModal('status', incident, 'verified')}
                                                            >
                                                                <CheckCircle size={16} className="mr-1" />
                                                                Mark as Reviewed
                                                            </PrimaryButton>
                                                            <DangerButton
                                                                className="sm:flex-1"
                                                                onClick={() => openConfirmModal('status', incident, 'declined')}
                                                            >
                                                                <XCircle size={16} className="mr-1" />
                                                                Decline
                                                            </DangerButton>
                                                        </>
                                                    )}
                                                    {incident.status === 'verified' && (
                                                        <SuccessButton
                                                            className="sm:flex-1"
                                                            onClick={() => openConfirmModal('status', incident, 'resolved')}
                                                        >
                                                            <CheckCircle size={16} className="mr-1" />
                                                            Mark as Resolved
                                                        </SuccessButton>
                                                    )}
                                                </>
                                            )}

                                            {/* Archive Button - Officers can archive their own, Head Officer can archive all */}
                                            {(canChangeStatus || (auth.user.access === 'officer' && incident.reported_by === auth.user.name)) && (
                                                <DangerButton
                                                    onClick={() => openConfirmModal('delete', incident)}
                                                >
                                                    <Trash2 size={16} />
                                                </DangerButton>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No incidents found matching your criteria.</p>
                                <PrimaryButton
                                    onClick={clearFilters}
                                    variant="flat"
                                    color="primary"
                                    className="mt-4"
                                >
                                    Clear Filters
                                </PrimaryButton>
                            </div>
                        </Card>
                    )}

                    {/* Pagination */}
                    {incidents.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Page {incidents.current_page} of {incidents.last_page}
                            </div>
                            <div className="flex gap-2">
                                {/* Previous Page */}
                                {incidents.prev_page_url && (
                                    <Button
                                        variant="bordered"
                                        onClick={() => router.get(incidents.prev_page_url)}
                                        startContent={<ChevronLeft size={18} />}
                                    >
                                        Previous
                                    </Button>
                                )}

                                {/* Next Page */}
                                {incidents.next_page_url && (
                                    <Button
                                        variant="bordered"
                                        onClick={() => router.get(incidents.next_page_url)}
                                        endContent={<ChevronRight size={18} />}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmColor={confirmModal.type === 'delete' ? 'danger' : confirmModal.newStatus === 'declined' ? 'danger' : confirmModal.newStatus === 'resolved' ? 'success' : 'primary'}
                confirmText={confirmModal.type === 'delete' ? 'Archive' : confirmModal.newStatus === 'declined' ? 'Decline' : 'Confirm'}
                icon={confirmModal.type === 'delete' ? Trash2 : CheckCircle}
                ConfirmButton={
                    confirmModal.type === 'delete'
                        ? DangerButton
                        : confirmModal.newStatus === 'declined'
                            ? DangerButton
                            : confirmModal.newStatus === 'resolved'
                                ? SuccessButton
                                : PrimaryButton
                }
                details={confirmModal.incident ? {
                    'Incident Type': confirmModal.incident.type?.charAt(0).toUpperCase() + confirmModal.incident.type?.slice(1) || 'N/A',
                    'Title': confirmModal.incident.title || 'N/A',
                    'Severity': confirmModal.incident.severity?.charAt(0).toUpperCase() + confirmModal.incident.severity?.slice(1) || 'N/A',
                    'Current Status': confirmModal.incident.status?.charAt(0).toUpperCase() + confirmModal.incident.status?.slice(1) || 'N/A',
                    'Barangay': confirmModal.incident.barangay || 'N/A',
                    'Reported By': confirmModal.incident.reported_by || 'N/A',
                    ...(confirmModal.newStatus && { 'New Status': confirmModal.newStatus.charAt(0).toUpperCase() + confirmModal.newStatus.slice(1) })
                } : null}
                detailsComponent={confirmModal.newStatus === 'declined' && (
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Decline Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="4"
                            placeholder="Please provide a reason for declining this incident report..."
                        />
                    </div>
                )}
            />
        </AuthenticatedLayout>
    );
}
