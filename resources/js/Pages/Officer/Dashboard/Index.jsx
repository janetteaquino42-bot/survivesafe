import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StatOverview from "@/Components/Stats/StatOverview";
import Card from "@/Components/Cards/Card";
import StatusBadge from "@/Components/Status/StatusBadge";
import {
    Users,
    FileText,
    CheckCircle,
    Clock,
    Activity,
    AlertTriangle,
    Flame,
    ChevronDown,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { INCIDENT_TYPES, CHART_COLORS } from "@/Utils/incidentHelper";

// Navigation configuration - edit this array to customize menu
const NAVIGATION_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Activity, roles: ['resident', 'officer', 'head_officer', 'pending'] },
    { label: "Incidents", href: "/incidents", icon: Activity, roles: ['resident', 'officer', 'head_officer', 'pending'] },
    { label: "Report Incident", href: "/incidents/create", icon: Activity, roles: ['resident', 'officer', 'head_officer'] },
    { label: "Awareness", href: "/awareness", icon: FileText, roles: ['resident', 'officer', 'head_officer', 'pending'] },
    { label: "Announcements", href: "/announcements", icon: Activity, roles: ['resident', 'officer', 'head_officer', 'pending'] },
    { label: "Users", href: "/users", icon: Users, roles: ['officer', 'head_officer'] },
    { label: "Settings", href: "/settings", icon: Activity, roles: ['resident', 'officer', 'head_officer'] },
];

export default function Dashboard({
    incidentStats,
    recentIncidents,
    recentAnnouncements,
    userStats,
    chartData,
    selectedPeriod = '7days',
    chartLabel = 'Last 7 Days',
    userRole
}) {
    const [period, setPeriod] = useState(selectedPeriod);

    useEffect(() => {
        setPeriod(selectedPeriod || '7days');
    }, [selectedPeriod]);

    const periodOptions = [
        { value: '7days', label: 'Past 7 Days' },
        { value: '1month', label: 'Past 1 Month' },
        { value: 'year', label: 'Past Year' },
    ];

    const handlePeriodChange = (value) => {
        setPeriod(value);
        router.get(route('dashboard'), { period: value }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Prepare data for charts
    const incidentTypeData = [
        { name: 'Fire', value: incidentStats.fire, color: CHART_COLORS.fire },
        { name: 'Flood', value: incidentStats.flood, color: CHART_COLORS.flood },
        { name: 'Earthquake', value: incidentStats.earthquake, color: CHART_COLORS.earthquake },
        { name: 'Landslide', value: incidentStats.landslide, color: CHART_COLORS.landslide },
    ];

    const statusData = [
        { name: 'Active', value: incidentStats.active, color: CHART_COLORS.active },
        { name: 'Verified', value: incidentStats.verified, color: CHART_COLORS.verified },
        { name: 'Resolved', value: incidentStats.resolved, color: CHART_COLORS.resolved },
    ];

    const severityData = [
        { name: 'Low', value: incidentStats.low, color: CHART_COLORS.low },
        { name: 'Medium', value: incidentStats.medium, color: CHART_COLORS.medium },
        { name: 'High', value: incidentStats.high, color: CHART_COLORS.high },
    ];

    const hasTrendData = chartData.some((item) => Number(item.count) > 0);
    const hasIncidentTypeData = incidentTypeData.some((item) => Number(item.value) > 0);
    const hasStatusData = statusData.some((item) => Number(item.value) > 0);
    const hasSeverityData = severityData.some((item) => Number(item.value) > 0);

    const NoDataChart = ({ height = 260 }) => (
        <div className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center" style={{ height }}>
            <p className="text-sm text-gray-500 font-medium">No Data Available</p>
        </div>
    );

    // Filter navigation items based on user role
    const filteredNavigation = NAVIGATION_ITEMS.filter(item =>
        item.roles.includes(userRole)
    );

    return (
        <AuthenticatedLayout navigation={filteredNavigation}
            breadcrumbs={[
                { label: 'Dashboard', href: null },
            ]}>
            <Head title="Dashboard" />

            <div className="py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6 lg:mb-8">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Overview of incident reports, statistics, and activities.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="mb-8">
                        <StatOverview
                            stats={[
                                {
                                    title: "Total Incidents",
                                    value: incidentStats.total,
                                    icon: AlertTriangle,
                                    trend: incidentStats.total > 0 ? "up" : "neutral",
                                    trendValue: "0%",
                                    color: "primary",
                                },
                                {
                                    title: "Active Reports",
                                    value: incidentStats.active,
                                    icon: Clock,
                                    trend: "neutral",
                                    trendValue: "0%",
                                    color: "warning",
                                },
                                {
                                    title: "Resolved",
                                    value: incidentStats.resolved,
                                    icon: CheckCircle,
                                    trend: "up",
                                    trendValue: "0%",
                                    color: "success",
                                },
                                {
                                    title: "High Severity",
                                    value: incidentStats.high,
                                    icon: Flame,
                                    trend: incidentStats.high > 0 ? "up" : "down",
                                    trendValue: "0%",
                                    color: "danger",
                                },
                            ]}
                        />
                    </div>

                    {/* User-specific Stats */}
                    {Object.keys(userStats).length > 0 && (
                        <div className="mb-8">
                            <Card>
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                    Incident Statistics
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {incidentTypeData.map((type) => {
                                        const typeConfig = INCIDENT_TYPES[type.name.toLowerCase()];
                                        const IconComponent = typeConfig?.icon;

                                        return (
                                            <div
                                                key={type.name}
                                                className="rounded-lg p-4 flex items-center gap-4"
                                                style={{ backgroundColor: typeConfig?.bgColor }}
                                            >
                                                <div
                                                    className="rounded-full p-2"
                                                    style={{ backgroundColor: `${type.color}26` }}
                                                >
                                                    {IconComponent && <IconComponent size={28} color={type.color} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {type.name}
                                                    </p>
                                                    <p className="text-2xl font-bold" style={{ color: type.color }}>
                                                        {type.value}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
                        {/* Incident Trend Chart */}
                        <Card className="overflow-x-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2">Incident Trend ({chartLabel})</h2>
                                <div className="relative w-full sm:w-40">
                                    <select
                                        value={period}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        {periodOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            {hasTrendData ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            name="Incidents"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <NoDataChart height={260} />
                            )}
                        </Card>

                        {/* Incident Types Distribution */}
                        <Card>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2">Incidents by Type ({chartLabel})</h2>
                                <div className="relative w-full sm:w-40">
                                    <select
                                        value={period}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        {periodOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            {hasIncidentTypeData ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={incidentTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {incidentTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <NoDataChart height={260} />
                            )}
                        </Card>

                        {/* Status Distribution */}
                        <Card>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2">Incidents by Status ({chartLabel})</h2>
                                <div className="relative w-full sm:w-40">
                                    <select
                                        value={period}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        {periodOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            {hasStatusData ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={statusData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Bar dataKey="value" name="Count">
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <NoDataChart height={260} />
                            )}
                        </Card>

                        {/* Severity Distribution */}
                        <Card>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2">Incidents by Severity ({chartLabel})</h2>
                                <div className="relative w-full sm:w-40">
                                    <select
                                        value={period}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        {periodOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            {hasSeverityData ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={severityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Bar dataKey="value" name="Count">
                                            {severityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <NoDataChart height={260} />
                            )}
                        </Card>
                    </div>

                    {/* Recent Activities Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        {/* Recent Incidents */}
                        <Card>
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Recent Incidents</h2>
                                <a href="/incidents" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                                    View All
                                </a>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                {recentIncidents.length > 0 ? (
                                    recentIncidents.map((incident) => (
                                        <div key={incident.id} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                                                        <StatusBadge status={incident.type} />
                                                        <StatusBadge status={incident.severity} />
                                                        <StatusBadge status={incident.status} />
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                                                        {incident.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500 gap-2">
                                                <span className="truncate">{incident.barangay}</span>
                                                <span className="text-xs whitespace-nowrap flex-shrink-0">{incident.created_at}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent incidents</p>
                                )}
                            </div>
                        </Card>

                        {/* Recent Announcements */}
                        <Card>
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Recent Announcements</h2>
                                <a href="/announcements" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                                    View All
                                </a>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                {recentAnnouncements.length > 0 ? (
                                    recentAnnouncements.map((announcement) => (
                                        <div key={announcement.id} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                                                {announcement.description}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-gray-500 gap-2">
                                                <span>By {announcement.creator_name}</span>
                                                <span>{announcement.created_at}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent announcements</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
