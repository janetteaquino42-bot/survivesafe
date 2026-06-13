import { useState } from "react";
import { Head } from "@inertiajs/react";
// import GuestLayout from "@/Layouts/GuestLayout";

// Form Components
import TextInput from "@/Components/Form/TextInput";
import EmailInput from "@/Components/Form/EmailInput";
import PasswordInput from "@/Components/Form/PasswordInput";
import RadioGroup from "@/Components/Form/RadioGroup";
import Checkbox from "@/Components/Form/Checkbox";
import Select from "@/Components/Form/Select";
import Textarea from "@/Components/Form/Textarea";
import FileUpload from "@/Components/Form/FileUpload";

// Button Components
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import SuccessButton from "@/Components/Buttons/SuccessButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import LinkButton from "@/Components/Buttons/LinkButton";

// Status, Search & Filter
import StatusBadge from "@/Components/Status/StatusBadge";
import SearchBar from "@/Components/Search/SearchBar";
import Filter from "@/Components/Filters/Filter";

// Stats & Cards
import StatCard from "@/Components/Stats/StatCard";
import StatOverview from "@/Components/Stats/StatOverview";
import Card from "@/Components/Cards/Card";

// Layout
import Navbar from "@/Components/Layout/Navbar";
import Footer from "@/Components/Layout/Footer";

// Modal
import Modal from "@/Components/Modal/Modal";

// Icons
import {
    Flame,
    Droplets,
    Mountain,
    Users,
    AlertTriangle,
    CheckCircle,
    Send,
    Download,
    Plus,
} from "lucide-react";

export default function Index() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        terms: false,
        incidentType: "",
        description: "",
        files: [],
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Head title="Component Library - SurviveSafe" />

            {/* Navbar Demo */}
            <Navbar
                siteName="SurviveSafe"
                menuItems={[
                    { label: "Home", href: "/" },
                    { label: "Incidents", href: "/incidents" },
                    { label: "Awareness", href: "/awareness" },
                    { label: "Announcements", href: "/announcements" },
                ]}
                contactInfo={{
                    email: "info@survivesafe.ph",
                    phone: "(02) 8888-8888",
                }}
            />

            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            SurviveSafe Component Library
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            A comprehensive collection of reusable, modern, and sleek components
                            built with HeroUI for the SurviveSafe incident reporting and hazard
                            mapping system.
                        </p>
                    </div>

                    {/* Statistics Overview */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Statistics Overview
                        </h2>
                        <StatOverview
                            columns={4}
                            stats={[
                                {
                                    title: "Total Incidents",
                                    value: "234",
                                    icon: AlertTriangle,
                                    trend: "up",
                                    trendValue: "+12%",
                                    description: "vs last month",
                                    color: "danger",
                                },
                                {
                                    title: "Active Users",
                                    value: "1,429",
                                    icon: Users,
                                    trend: "up",
                                    trendValue: "+23%",
                                    description: "vs last month",
                                    color: "primary",
                                },
                                {
                                    title: "Resolved Cases",
                                    value: "187",
                                    icon: CheckCircle,
                                    trend: "up",
                                    trendValue: "+8%",
                                    description: "vs last month",
                                    color: "success",
                                },
                                {
                                    title: "Response Time",
                                    value: "24min",
                                    icon: AlertTriangle,
                                    trend: "down",
                                    trendValue: "-5%",
                                    description: "vs last month",
                                    color: "warning",
                                },
                            ]}
                        />
                    </section>

                    {/* Buttons */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
                        <Card>
                            <div className="flex flex-wrap gap-4">
                                <PrimaryButton startContent={<Plus size={18} />}>
                                    Primary Button
                                </PrimaryButton>
                                <SecondaryButton>Secondary Button</SecondaryButton>
                                <SuccessButton startContent={<CheckCircle size={18} />}>
                                    Success Button
                                </SuccessButton>
                                <DangerButton startContent={<CheckCircle size={18} />}>
                                    Danger Button
                                </DangerButton>
                                <PrimaryButton> <svg className="animate-spin h-5 w-5 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg> Loading...</PrimaryButton>
                                <SecondaryButton disabled>Disabled</SecondaryButton>
                                <LinkButton href="/test">Link Button</LinkButton>
                            </div>
                        </Card>
                    </section>

                    {/* Status Badges */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Badges</h2>
                        <Card>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Incident Status:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <StatusBadge status="active" />
                                        <StatusBadge status="verified" />
                                        <StatusBadge status="resolved" />
                                        <StatusBadge status="pending" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Severity Levels:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <StatusBadge status="low" />
                                        <StatusBadge status="medium" />
                                        <StatusBadge status="high" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Incident Types:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <StatusBadge status="fire" />
                                        <StatusBadge status="flood" />
                                        <StatusBadge status="earthquake" />
                                        <StatusBadge status="landslide" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Search and Filter */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Search & Filter
                        </h2>
                        <Card>
                            <div className="space-y-4">
                                <SearchBar
                                    placeholder="Search incidents..."
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                />
                                <Filter
                                    filters={[
                                        {
                                            key: "type",
                                            label: "Incident Type",
                                            type: "select",
                                            options: [
                                                { label: "Fire", value: "fire" },
                                                { label: "Flood", value: "flood" },
                                                { label: "Earthquake", value: "earthquake" },
                                                { label: "Landslide", value: "landslide" },
                                            ],
                                        },
                                        {
                                            key: "severity",
                                            label: "Severity",
                                            type: "checkbox",
                                            options: [
                                                { label: "Low", value: "low" },
                                                { label: "Medium", value: "medium" },
                                                { label: "High", value: "high" },
                                            ],
                                        },
                                    ]}
                                    activeFilters={activeFilters}
                                    onFilterChange={setActiveFilters}
                                    onClearAll={() => setActiveFilters({})}
                                />
                            </div>
                        </Card>
                    </section>

                    {/* Form Components */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Form Components
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <Card header="Text Inputs">
                                <div className="space-y-4">
                                    <TextInput
                                        label="Full Name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange("name", e.target.value)
                                        }
                                        required
                                    />
                                    <EmailInput
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange("email", e.target.value)
                                        }
                                        required
                                    />
                                    <PasswordInput
                                        value={formData.password}
                                        onChange={(e) =>
                                            handleInputChange("password", e.target.value)
                                        }
                                        showStrengthIndicator
                                        required
                                    />
                                </div>
                            </Card>

                            {/* Right Column */}
                            <Card header="Select & Radio">
                                <div className="space-y-4">
                                    <Select
                                        label="Incident Type"
                                        placeholder="Select incident type"
                                        value={formData.incidentType}
                                        onChange={(value) =>
                                            handleInputChange("incidentType", value)
                                        }
                                        options={[
                                            { label: "Fire", value: "fire" },
                                            { label: "Flood", value: "flood" },
                                            { label: "Earthquake", value: "earthquake" },
                                            { label: "Landslide", value: "landslide" },
                                        ]}
                                    />
                                    <RadioGroup
                                        label="Gender"
                                        value={formData.gender}
                                        onChange={(value) => handleInputChange("gender", value)}
                                        options={[
                                            { label: "Male", value: "male" },
                                            { label: "Female", value: "female" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />
                                    <Checkbox
                                        label="I agree to the terms and conditions"
                                        checked={formData.terms}
                                        onChange={(checked) =>
                                            handleInputChange("terms", checked)
                                        }
                                    />
                                </div>
                            </Card>

                            {/* Full Width */}
                            <Card header="Textarea" className="lg:col-span-2">
                                <Textarea
                                    label="Description"
                                    placeholder="Describe the incident..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleInputChange("description", e.target.value)
                                    }
                                    maxLength={500}
                                    showCounter
                                />
                            </Card>

                            <Card header="File Upload" className="lg:col-span-2">
                                <FileUpload
                                    label="Upload Evidence"
                                    accept="image/*"
                                    multiple
                                    onChange={(files) => handleInputChange("files", files)}
                                    description="Upload images related to the incident (Max 5MB)"
                                />
                            </Card>
                        </div>
                    </section>

                    {/* Cards */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card
                                header="Fire Incident"
                                footer={
                                    <div className="flex gap-2">
                                        <SecondaryButton size="sm">View Details</SecondaryButton>
                                        <PrimaryButton size="sm">Respond</PrimaryButton>
                                    </div>
                                }
                                isHoverable
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Flame className="text-red-500" size={20} />
                                        <StatusBadge status="high" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Fire reported near marketplace area. Multiple structures
                                        affected.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Barangay 1 • 2 hours ago
                                    </p>
                                </div>
                            </Card>

                            <Card
                                header="Flood Alert"
                                footer={
                                    <div className="flex gap-2">
                                        <SecondaryButton size="sm">View Details</SecondaryButton>
                                        <PrimaryButton size="sm">Respond</PrimaryButton>
                                    </div>
                                }
                                isHoverable
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Droplets className="text-blue-500" size={20} />
                                        <StatusBadge status="medium" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Heavy flooding in residential area due to continuous
                                        rainfall.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Barangay 2 • 5 hours ago
                                    </p>
                                </div>
                            </Card>

                            <Card
                                header="Landslide Warning"
                                footer={
                                    <div className="flex gap-2">
                                        <SecondaryButton size="sm">View Details</SecondaryButton>
                                        <PrimaryButton size="sm">Respond</PrimaryButton>
                                    </div>
                                }
                                isHoverable
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Mountain className="text-yellow-600" size={20} />
                                        <StatusBadge status="verified" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Landslide blocking the main road. Immediate attention
                                        required.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Barangay 3 • 1 day ago
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </section>

                    {/* Component Summary */}
                    <section className="mb-16">
                        <Card>
                            <div className="text-center py-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Component Library Complete
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    All components are fully functional, reusable, and built with
                                    modern design principles using HeroUI. Ready for integration
                                    into the SurviveSafe system.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <PrimaryButton
                                        startContent={<Download size={18} />}
                                        size="lg"
                                    >
                                        Download Components
                                    </PrimaryButton>
                                    <SecondaryButton size="lg">View Documentation</SecondaryButton>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Modal Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Modals</h2>
                        <Card>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                        Modal Examples
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Modals for dialogs, confirmations, and forms.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <PrimaryButton onClick={() => setIsModalOpen(true)}>
                                        Open Basic Modal
                                    </PrimaryButton>
                                    <SecondaryButton onClick={() => setIsConfirmModalOpen(true)}>
                                        Open Confirmation Modal
                                    </SecondaryButton>
                                </div>

                                {/* Basic Modal */}
                                <Modal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    title="Basic Modal Example"
                                    confirmText="Save"
                                    cancelText="Cancel"
                                    onConfirm={() => {
                                        alert('Saved!');
                                        setIsModalOpen(false);
                                    }}
                                    size="3xl"
                                >
                                    <div className="space-y-4">
                                        <p className="text-gray-600">
                                            This is a basic modal with a title, body content, and action buttons.
                                        </p>
                                        <TextInput
                                            label="Example Input"
                                            placeholder="Enter some text"
                                        />
                                        <Textarea
                                            label="Description"
                                            placeholder="Enter description"
                                            rows={3}
                                        />
                                    </div>
                                </Modal>

                                {/* Confirmation Modal */}
                                <Modal
                                    isOpen={isConfirmModalOpen}
                                    onClose={() => setIsConfirmModalOpen(false)}
                                    title="Confirm Action"
                                    confirmText="Delete"
                                    cancelText="Cancel"
                                    size="sm"
                                    onConfirm={() => {
                                        alert('Deleted!');
                                        setIsConfirmModalOpen(false);
                                    }}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-red-600">
                                            <AlertTriangle size={24} />
                                            <p className="font-semibold">Are you sure?</p>
                                        </div>
                                        <p className="text-gray-600">
                                            This action cannot be undone. This will permanently delete the incident report.
                                        </p>
                                    </div>
                                </Modal>
                            </div>
                        </Card>
                    </section>
                </div>
            </main>

            {/* Footer Demo */}
            <Footer
                siteName="SurviveSafe"
                description="Community Incident Reporting & Hazard Mapping System"
                contactInfo={{
                    email: "info@survivesafe.ph",
                    phone: "(02) 8888-8888",
                    address: "123 Safety Street, Manila, Philippines",
                }}
            />
        </>
    );
}