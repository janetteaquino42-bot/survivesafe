import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Bell,
    LogOut,
    Menu,
    X,
    User,
    ChevronDown,
    Activity,
    FileText,
    Users,
    LayoutDashboard,
    AlertTriangle,
    FileWarning,
    BookOpen,
    Megaphone,
    Settings,
    ChevronRight,
    Map,
    FileEdit,
    Trash2,
    Mail,
} from 'lucide-react';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from '@heroui/react';
import FlashMessageHandler from "@/Components/Toast/FlashMessageHandler";
import ToastContainer from "@/Components/Toast/ToastContainer";
import Logo from "@/Components/Logo";

// Navigation configuration
const NAVIGATION_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ['officer', 'head_officer'] },
    { label: "Hazard Mapping", href: "/resident/hazard-map", icon: Map, roles: ['resident'] },
    { label: "Hazard Mapping", href: "/officer/hazard-map", icon: Map, roles: ['head_officer', 'officer'] },
    { label: "Report Incident", href: "/officer/incidents/create", icon: FileWarning, roles: ['officer'] },
    { label: "My Incidents", href: "/officer/incidents", icon: FileText, roles: ['officer'] },
    { label: "Awareness Materials", href: "/resident/awareness-materials", icon: BookOpen, roles: ['resident'] },
    { label: "Announcements", href: "/resident/announcements", icon: Megaphone, roles: ['resident'] },
    { label: "Contact", href: "/resident/contact", icon: Mail, roles: ['resident'] },
    { label: "Awareness Materials", href: "/officer/awareness-materials", icon: BookOpen, roles: ['officer', 'head_officer'] },
    { label: "Announcements", href: "/officer/announcements", icon: Megaphone, roles: ['officer', 'head_officer'] },
    { label: "Users", href: "/officer/users", icon: Users, roles: ['head_officer'] },
    { label: "Content Management", href: "/officer/content-management", icon: FileEdit, roles: ['head_officer'] },
    { label: "Archive", href: "/officer/archive", icon: Trash2, roles: ['head_officer'] },
    { label: "My Profile", href: "/profile", icon: User, roles: ['resident', 'officer', 'head_officer'] },
    { label: "System Settings", href: "/officer/system-settings", icon: Settings, roles: ['head_officer'] },
];

export default function AuthenticatedLayout({
    header,
    children,
    breadcrumbs = [],
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Filter navigation based on user role
    const navigation = NAVIGATION_ITEMS.filter(item =>
        item.roles.includes(user?.access || 'resident')
    );

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <FlashMessageHandler />
            {/* <ToastContainer /> */}

            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-3 py-2.5 gap-2">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 flex-shrink-0"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <Link href="/" className="text-base sm:text-lg font-bold text-blue-600 truncate flex-1 text-center">
                        BACOOR DRRMO
                    </Link>
                    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0" aria-label="Notifications">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
                    {/* Logo */}
                    <div className="flex items-center justify-start h-20 px-6 border-gray-200">
                        <Link href="/" className="text-2xl font-bold flex flex-col sm:flex-row items-center gap-3 justify-center align-middle">
                            <Logo width={50} height={50} className="mx-auto sm:mx-0" />
                            <div className="text-center sm:text-left">
                                <h2 className="font-bold text-primary text-2xl">BACOOR</h2>
                                <h3 className="uppercase text-sm text-balance">DRRMO</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = route().current(item.href.substring(1)) ||
                                    window.location.pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon size={20} className="mr-3" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-gray-200 p-4">
                        <Dropdown placement="top-start">
                            <DropdownTrigger>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Avatar
                                        src={user.profile_image}
                                        name={user.first_name}
                                        size="sm"
                                        className="bg-blue-600 text-white"
                                    />
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">{user.access}</p>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User menu" className="bg-white">
                                <DropdownItem
                                    key="profile"
                                    startContent={<User size={18} />}
                                    href="/profile"
                                    className="hover:bg-gray-50"
                                >
                                    Profile
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    startContent={<LogOut size={18} />}
                                    color="danger"
                                    onClick={handleLogout}
                                    className="hover:bg-red-50"
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="fixed inset-0 bg-black/50" />
                        <aside
                            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Sidebar Header */}
                            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                                <Link href="/" className="text-2xl font-bold text-blue-600">
                                    BDRRMO
                                </Link>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="flex-1 overflow-y-auto px-4 py-6">
                                <div className="space-y-1">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = route().current(item.href.substring(1)) ||
                                            window.location.pathname === item.href;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <Icon size={20} className="mr-3" />
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Mobile User Section */}
                            <div className="border-t border-gray-200 p-4">
                                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                    <Avatar
                                        src={user.profile_image ? `/storage/${user.profile_image}` : null}
                                        name={`${user.first_name} ${user.last_name}`}
                                        size="sm"
                                        className="bg-blue-600 text-white"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">{user.access}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-2"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 lg:pl-64" style={{ minWidth: '320px' }}>
                    {/* Top Bar for Desktop */}
                    <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
                        <div className="flex items-center justify-between px-4 xl:px-6 py-3">
                            <div className="flex-1 min-w-0 pr-4">
                                {header && <h1 className="text-lg xl:text-xl font-semibold text-gray-900 truncate">{header}</h1>}
                                {/* Breadcrumbs */}
                                {breadcrumbs.length > 0 && (
                                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mt-1 overflow-x-auto">
                                        <Link href="/dashboard" className="hover:text-blue-600 transition-colors whitespace-nowrap">
                                            Home
                                        </Link>
                                        {breadcrumbs.map((crumb, index) => (
                                            <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                                                <ChevronRight size={14} className="text-gray-400" />
                                                {crumb.href ? (
                                                    <Link href={crumb.href} className="hover:text-blue-600 transition-colors whitespace-nowrap">
                                                        {crumb.label}
                                                    </Link>
                                                ) : (
                                                    <span className="text-primary font-semibold whitespace-nowrap">{crumb.label}</span>
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                )}
                            </div>
                            {/* <div className="flex items-center gap-2 flex-shrink-0">
                                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
                                    <Bell size={20} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </div> */}
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="p-3 sm:p-4 lg:p-6 overflow-x-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

