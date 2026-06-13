import { Link, usePage, router } from "@inertiajs/react";
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import FlashMessageHandler from "@/Components/Toast/FlashMessageHandler";
import Logo from "@/Components/Logo";

export default function GuestLayout({ children }) {
    const page = usePage();
    const { auth, footerContact } = page.props;
    const currentPage = page.component || '';
    const isPublicHome = currentPage === 'Public/Home' || currentPage.endsWith('Public/Home');
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <FlashMessageHandler />

            {/* Navigation */}
            <nav className="bg-blue-700 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
                            <Logo className="mx-auto sm:mx-0 w-12 h-12" />
                            <div>
                                <h1 className="text-white font-bold text-lg">BACOOR</h1>
                                <p className="text-blue-100 text-xs">Disaster Risk Reduction &amp; Management Office</p>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-white hover:text-blue-100 transition font-medium">Home</Link>
                            <Link href="/about" className="text-white hover:text-blue-100 transition font-medium">About</Link>
                            {/* <Link href="/hazard-map" className="text-white hover:text-blue-100 transition font-medium">Hazard Map</Link> */}
                            {/* <Link href="/announcements" className="text-white hover:text-blue-100 transition font-medium">Announcements</Link> */}
                            {/* <Link href="/awareness" className="text-white hover:text-blue-100 transition font-medium">Resources</Link> */}
                            {!isPublicHome && (
                                <Link href="/contact" className="text-white hover:text-blue-100 transition font-medium">Contact</Link>
                            )}

                            {user ? (
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Avatar
                                            as="button"
                                            className="transition-transform cursor-pointer border-white border-2 hover:scale-105 bg-slate-100"
                                            src={user.profile_image ? `${user.profile_image}` : null}
                                            name={`${user.first_name} ${user.last_name}`}
                                            size="sm"
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="User Actions" variant="flat" className="bg-white">
                                        <DropdownItem key="profile" className="h-14 gap-2">
                                            <p className="font-semibold">Signed in as</p>
                                            <p className="font-semibold">{user.email}</p>
                                        </DropdownItem>
                                        <DropdownItem key="dashboard" as={Link} href="/dashboard" className="hover:bg-gray-50">
                                            Dashboard
                                        </DropdownItem>
                                        <DropdownItem key="profile-settings" as={Link} href="/profile" className="hover:bg-gray-50">
                                            Profile Settings
                                        </DropdownItem>
                                        <DropdownItem key="logout" color="danger" onClick={handleLogout} className="hover:bg-red-50">
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
                                >
                                    Portal Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white p-2"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-blue-600">
                            <div className="flex flex-col space-y-3">
                                <Link href="/" className="text-white hover:text-blue-100 transition font-medium py-2">Home</Link>
                                <Link href="/about" className="text-white hover:text-blue-100 transition font-medium py-2">About</Link>
                                {/* <Link href="/announcements" className="text-white hover:text-blue-100 transition font-medium py-2">Announcements</Link> */}
                                {/* <Link href="/awareness" className="text-white hover:text-blue-100 transition font-medium py-2">Resources</Link> */}
                                {!isPublicHome && (
                                    <Link href="/contact" className="text-white hover:text-blue-100 transition font-medium py-2">Contact</Link>
                                )}

                                {user ? (
                                    <>
                                        <div className="border-t border-blue-600 pt-3">
                                            <p className="text-blue-100 text-sm mb-2">{user.first_name} {user.last_name}</p>
                                            <Link href="/dashboard" className="text-white hover:text-blue-100 transition font-medium block py-2">Dashboard</Link>
                                            <Link href="/profile" className="text-white hover:text-blue-100 transition font-medium block py-2">Profile</Link>
                                            <button onClick={handleLogout} className="text-white hover:text-blue-100 transition font-medium py-2 text-left w-full">
                                                Log Out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold text-center"
                                    >
                                        Portal Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Logo className="w-8 h-8" />
                                <div>
                                    <h3 className="font-bold text-lg">BACOOR</h3>
                                    <p className="text-gray-400 text-sm">Disaster Risk Reduction &amp; Management Office</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Protecting lives, properties, and promoting disaster resilience in Bacoor City.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                                <li><Link href="/announcements" className="hover:text-white transition">Announcements</Link></li>
                                <li><Link href="/awareness" className="hover:text-white transition">Resources</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact Information</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>{footerContact?.meta?.address || 'City of Bacoor, Cavite'}</li>
                                <li>Hotline: {footerContact?.meta?.emergency_hotline || '(046) 417-0727'}</li>
                                <li>Emergency: 911</li>
                                <li>Email: {footerContact?.meta?.email || 'bdrrmo@bacoor.gov.ph'}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} BACOOR DRRMO. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
