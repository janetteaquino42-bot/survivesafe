import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Settings, Calendar, BarChart3, FileText, AlertTriangle, Bell, ChevronDown } from 'lucide-react';
import Card from '@/Components/Cards/Card';

export default function SystemSettings({ auth, availableYears = [], activeYear, statistics }) {
    const [selectedYear, setSelectedYear] = useState(activeYear);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ensure availableYears is an array
    const years = Array.isArray(availableYears) ? availableYears : [activeYear || new Date().getFullYear()];

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value);
        setSelectedYear(year);
        setIsSubmitting(true);

        router.post(route('officer.system-settings.update-year'),
            { year },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                    setSelectedYear(activeYear);
                }
            }
        );
    };

    const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="System Settings" />

            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 line-clamp-2">System Settings</h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2">Manage system-wide settings and data filters</p>
                </div>

                {/* Year Filter Card */}
                <Card className="mb-6 sm:mb-8">
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">Active Data Year</h2>
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-4">
                                    Select the year to filter all incidents, announcements, and awareness materials throughout the system.
                                    This setting affects all data displayed across the application.
                                </p>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Changing the active year will immediately update all data views
                                        for all users in the system. Only data from the selected year will be visible.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
                                        Select Year:
                                    </label>
                                    <div className="relative w-full sm:w-40">
                                        <select
                                            id="year-select"
                                            value={selectedYear}
                                            onChange={handleYearChange}
                                            disabled={isSubmitting}
                                            className="w-full appearance-none px-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    </div>
                                    {isSubmitting && (
                                        <span className="text-sm text-gray-500">Updating...</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 sm:p-6 w-full sm:w-auto min-w-[180px]">
                                <div className="text-center">
                                    <p className="text-sm opacity-90 mb-2">Current Active Year</p>
                                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">{activeYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Statistics Overview */}
                {/* <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Overview for {activeYear}</h2>
                </div> */}

                {/* Incidents Statistics */}
                {/* <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Incident Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard
                            icon={BarChart3}
                            title="Total Incidents"
                            value={statistics.incidents.total}
                            color="text-gray-600"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            title="Active"
                            value={statistics.incidents.active}
                            color="text-yellow-600"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            title="Verified"
                            value={statistics.incidents.verified}
                            color="text-blue-600"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            title="Resolved"
                            value={statistics.incidents.resolved}
                            color="text-green-600"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            title="Declined"
                            value={statistics.incidents.declined}
                            color="text-red-600"
                        />
                    </div>
                </div> */}

                {/* Announcements Statistics */}
                {/* <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        Announcements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={Bell}
                            title="Total Announcements"
                            value={statistics.announcements.total}
                            color="text-gray-600"
                        />
                        <StatCard
                            icon={Bell}
                            title="Pending"
                            value={statistics.announcements.pending}
                            color="text-yellow-600"
                        />
                        <StatCard
                            icon={Bell}
                            title="Approved"
                            value={statistics.announcements.approved}
                            color="text-green-600"
                        />
                        <StatCard
                            icon={Bell}
                            title="Declined"
                            value={statistics.announcements.declined}
                            color="text-red-600"
                        />
                    </div>
                </div> */}

                {/* Awareness Materials Statistics */}
                {/* <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        Awareness Materials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={FileText}
                            title="Total Materials"
                            value={statistics.awareness_materials.total}
                            color="text-gray-600"
                        />
                        <StatCard
                            icon={FileText}
                            title="Pending"
                            value={statistics.awareness_materials.pending}
                            color="text-yellow-600"
                        />
                        <StatCard
                            icon={FileText}
                            title="Approved"
                            value={statistics.awareness_materials.approved}
                            color="text-green-600"
                        />
                        <StatCard
                            icon={FileText}
                            title="Declined"
                            value={statistics.awareness_materials.declined}
                            color="text-red-600"
                        />
                    </div>
                </div> */}
            </div>
        </AuthenticatedLayout>
    );
}
