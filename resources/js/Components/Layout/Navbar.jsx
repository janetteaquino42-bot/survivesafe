import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Navbar as HeroNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    Badge,
} from "@heroui/react";
import { ChevronDown, User, LogOut, Settings, Bell } from "lucide-react";
import PrimaryButton from "../Buttons/PrimaryButton";

export default function Navbar({
    siteName = "BDRRMO",
    logo,
    menuItems = [],
    showAuthButtons = true,
    className = "",
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;

    const defaultMenuItems = [
        { label: "Home", href: "/" },
        { label: "Incidents", href: "/incidents" },
        { label: "Awareness", href: "/awareness" },
        { label: "Announcements", href: "/announcements" },
        { label: "Contact", href: "/contact" },
    ];

    const displayMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

    return (
        <HeroNavbar
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            maxWidth="xl"
            isBordered
            className={`shadow-md bg-white/95 backdrop-blur-md ${className}`}
            classNames={{
                wrapper: "px-4 sm:px-6",
            }}
        >
            {/* Mobile Menu Toggle */}
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            {/* Logo/Brand */}
            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Link href="/" className="flex items-center gap-2">
                        {logo && <img src={logo} alt={siteName} className="h-8" />}
                        <p className="font-bold text-blue-600 text-xl">
                            {siteName}
                        </p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Logo */}
            <NavbarContent className="hidden sm:flex gap-4" justify="start">
                <NavbarBrand>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {logo && <img src={logo} alt={siteName} className="h-8" />}
                        <p className="font-bold text-blue-600 text-2xl">
                            {siteName}
                        </p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Menu Items */}
            <NavbarContent className="hidden sm:flex gap-8" justify="center">
                {displayMenuItems.map((item, index) => (
                    <NavbarItem key={index}>
                        {item.children ? (
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        endContent={<ChevronDown size={16} />}
                                        radius="sm"
                                        variant="light"
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        {item.label}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label={item.label}>
                                    {item.children.map((child, childIndex) => (
                                        <DropdownItem key={childIndex}>
                                            <Link href={child.href} className="w-full block">
                                                {child.label}
                                            </Link>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <Link
                                href={item.href}
                                className="uppercase text-gray-700 hover:text-primary transition-colors font-semibold relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 transition-all group-hover:w-full"></span>
                            </Link>
                        )}
                    </NavbarItem>
                ))}
            </NavbarContent>

            {/* Auth Section */}
            <NavbarContent justify="end">
                {user ? (
                    <>
                        {/* Notifications */}
                        <NavbarItem className="hidden sm:flex">
                            <Badge content="3" color="danger" size="sm" placement="top-right">
                                <Button isIconOnly variant="light" radius="full" className="hover:bg-gray-100">
                                    <Bell size={20} className="text-gray-600" />
                                </Button>
                            </Badge>
                        </NavbarItem>

                        {/* User Dropdown */}
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform hover:scale-110"
                                    color="success"
                                    name={user.first_name}
                                    size="sm"
                                    src={user.profile_image}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold text-blue-600">{user.email}</p>
                                </DropdownItem>
                                <DropdownItem
                                    key="profile-page"
                                    startContent={<User size={18} />}
                                >
                                    <Link href="/profile">My Profile</Link>
                                </DropdownItem>
                                <DropdownItem
                                    key="settings"
                                    startContent={<Settings size={18} />}
                                >
                                    <Link href="/settings">Settings</Link>
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    startContent={<LogOut size={18} />}
                                >
                                    <Link href="/logout" method="post" as="button">
                                        Log Out
                                    </Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </>
                ) : (
                    showAuthButtons && (
                        <>
                            <NavbarItem className="hidden sm:flex">
                                <Link href="/login">
                                    <Button variant="light" className="font-semibold rounded-xl">Login</Button>
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Link href="/register">
                                    <PrimaryButton>
                                        Sign Up
                                    </PrimaryButton>
                                </Link>
                            </NavbarItem>
                        </>
                    )
                )}
            </NavbarContent>

            {/* Mobile Menu */}
            <NavbarMenu className="pt-6">
                {displayMenuItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            href={item.href}
                            className="w-full text-lg py-3 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
                {!user && showAuthButtons && (
                    <>
                        <NavbarMenuItem>
                            <Link
                                href="/login"
                                className="w-full text-lg py-3 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <Link
                                href="/register"
                                className="w-full text-lg py-3 text-blue-600 font-bold transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </NavbarMenuItem>
                    </>
                )}
            </NavbarMenu>
        </HeroNavbar>
    );
}
