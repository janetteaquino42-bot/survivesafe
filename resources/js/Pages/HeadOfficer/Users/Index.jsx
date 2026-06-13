import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchBar from "@/Components/Search/SearchBar";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import DangerButton from "@/Components/Buttons/DangerButton";
import Select from "@/Components/Form/Select";
import StatusBadge from "@/Components/Status/StatusBadge";
import Avatar from "@/Components/User/Avatar";
import UserModal from "./UserModal";
import ImportModal from "./ImportModal";
import ConfirmationModal from "@/Components/Modal/ConfirmationModal";
import { useToast } from "@/Hooks/useToast";
import { ChevronLeft, ChevronRight, Download, Upload, UserPlus, Trash2, Sparkles } from "lucide-react";
import Card from "@/Components/Cards/Card";

export default function Index({ users, filters }) {
    const toast = useToast();
    const [search, setSearch] = useState(filters.search || "");
    const [accessFilter, setAccessFilter] = useState(filters.access || "");
    const [positionFilter, setPositionFilter] = useState(filters.position || "");
    const [barangayFilter, setBarangayFilter] = useState(filters.barangay || "");
    const [barangayOptions, setBarangayOptions] = useState([{ value: "", label: "All Barangays" }]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [deletionReason, setDeletionReason] = useState('');

    // Fetch barangays from JSON
    useEffect(() => {
        fetch('/barangay_list.json')
            .then(response => response.json())
            .then(data => {
                const options = [
                    { value: "", label: "All Barangays" },
                    ...data.barangay_list.map(barangay => ({
                        value: barangay,
                        label: barangay
                    }))
                ];
                setBarangayOptions(options);
            })
            .catch(error => {
                console.error('Error loading barangay list:', error);
            });
    }, []);

    const accessLevels = [
        { value: "", label: "All Access" },
        { value: "pending", label: "Pending" },
        { value: "resident", label: "Resident" },
        { value: "officer", label: "Officer" },
        { value: "head_officer", label: "Head Officer" },
    ];

    const positionOptions = [
        { value: "", label: "All Positions" },
        { value: "Barangay Captain", label: "Barangay Captain" },
        { value: "Barangay Kagawad", label: "Barangay Kagawad" },
        { value: "Barangay Secretary", label: "Barangay Secretary" },
        { value: "Barangay Treasurer", label: "Barangay Treasurer" },
        { value: "Barangay Tanod", label: "Barangay Tanod" },
        { value: "SK Chairman", label: "SK Chairman" },
        { value: "SK Kagawad", label: "SK Kagawad" },
        { value: "Reporter", label: "Reporter" },
    ];

    const applyFilters = () => {
        router.get(
            route("officer.users.index"),
            {
                search,
                access: accessFilter,
                position: positionFilter,
                barangay: barangayFilter
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Auto-apply filters when they change
    const handleFilterChange = (filterSetter, value) => {
        filterSetter(value);
        setTimeout(() => {
            router.get(
                route("officer.users.index"),
                {
                    search,
                    access: filterSetter === setAccessFilter ? value : accessFilter,
                    position: filterSetter === setPositionFilter ? value : positionFilter,
                    barangay: filterSetter === setBarangayFilter ? value : barangayFilter
                },
                { preserveState: true, preserveScroll: true }
            );
        }, 0);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.data.map((user) => user.user_id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deletingUser) {
            router.delete(route("officer.users.destroy", deletingUser.user_id), {
                data: {
                    deletion_reason: deletionReason
                },
                onSuccess: () => {
                    toast.success("User deleted successfully");
                    setIsDeleteModalOpen(false);
                    setDeletingUser(null);
                    setDeletionReason('');
                },
                onError: () => {
                    toast.error("Failed to delete user");
                },
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length === 0) {
            toast.error("Please select users to delete");
            return;
        }

        router.post(
            route("officer.users.bulk-delete"),
            { user_ids: selectedUsers },
            {
                onSuccess: () => {
                    toast.success("Selected users deleted successfully");
                    setSelectedUsers([]);
                },
                onError: () => {
                    toast.error("Failed to delete selected users");
                },
            }
        );
    };

    const handleDownloadTemplate = () => {
        window.location.href = route("officer.users.template");
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Users', href: null },
            ]}>
            <Head title="User Management" />

            <div className="py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                Manage system users, assign roles, and import users
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <PrimaryButton onClick={handleAddUser}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add User
                            </PrimaryButton>
                            <SecondaryButton onClick={() => setIsImportModalOpen(true)} className="bg-white">
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                            </SecondaryButton>
                        </div>
                    </div>
                    <Card className="mb-4 sm:mb-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100">
                        <div className="space-y-3 sm:space-y-4">
                            {/* Header with sparkle effect */}
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                    <Sparkles size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Search & Filter</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Find items by search or apply filters</p>
                                </div>
                            </div>
                            {/* Search Bar */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                    <SearchBar
                                        placeholder="Search by name, email, barangay, or position..."
                                        value={search}
                                        onChange={setSearch}
                                        onSearch={applyFilters}
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Select
                                    label="Access Level"
                                    value={accessFilter}
                                    onChange={(value) => handleFilterChange(setAccessFilter, value)}
                                    options={accessLevels}
                                />
                                <Select
                                    label="Position"
                                    value={positionFilter}
                                    onChange={(value) => handleFilterChange(setPositionFilter, value)}
                                    options={positionOptions}
                                />
                                <Select
                                    label="Barangay"
                                    value={barangayFilter}
                                    onChange={(value) => handleFilterChange(setBarangayFilter, value)}
                                    options={barangayOptions}
                                />
                            </div>

                            {/* Bulk Actions */}
                            {selectedUsers.length > 0 && (
                                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                    <span className="text-xs sm:text-sm text-gray-600">
                                        {selectedUsers.length} user(s) selected
                                    </span>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <DangerButton onClick={handleBulkDelete} className="flex-1 sm:flex-none text-xs sm:text-sm">
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            <span className="hidden sm:inline">Delete Selected</span>
                                            <span className="sm:hidden">Delete</span>
                                        </DangerButton>
                                        <SecondaryButton onClick={() => setSelectedUsers([])} className="flex-1 sm:flex-none text-xs sm:text-sm">
                                            <span className="hidden sm:inline">Clear Selection</span>
                                            <span className="sm:hidden">Clear</span>
                                        </SecondaryButton>
                                    </div>
                                </div>
                            )}

                            {/* Template Download */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download CSV Template
                                </button>
                            </div>

                        </div>

                    </Card>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Mobile Card View */}
                        <div className="block md:hidden divide-y divide-gray-200">
                            {users.data.map((user) => (
                                <div key={user.user_id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-3 mb-3">
                                        <Avatar user={user} size="md" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            <div className="mt-1">
                                                <StatusBadge status={user.access} />
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.user_id)}
                                            onChange={() => handleSelectUser(user.user_id)}
                                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                        <div>
                                            <span className="text-gray-500">Position:</span>
                                            <p className="font-medium text-gray-900 truncate">{user.position || "-"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Barangay:</span>
                                            <p className="font-medium text-gray-900 truncate">{user.barangay}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">Joined:</span>
                                            <p className="font-medium text-gray-900">{user.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <PrimaryButton
                                            onClick={() => handleEditUser(user)}
                                            className="flex-1 text-xs sm:text-sm justify-center"
                                        >
                                            Edit
                                        </PrimaryButton>
                                        <DangerButton
                                            onClick={() => handleDeleteUser(user)}
                                            className="flex-1 text-xs sm:text-sm justify-center"
                                        >
                                            Delete
                                        </DangerButton>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 lg:px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    users.data.length > 0 &&
                                                    selectedUsers.length === users.data.length
                                                }
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Access
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Barangay
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                                            Joined
                                        </th>
                                        <th className="px-3 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.user_id} className="hover:bg-gray-50">
                                            <td className="px-3 lg:px-6 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.user_id)}
                                                    onChange={() => handleSelectUser(user.user_id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-3 lg:px-6 py-3">
                                                <div className="flex items-center min-w-0">
                                                    <div className="mr-2 flex-shrink-0">
                                                        <Avatar user={user} size="sm" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">
                                                            {user.full_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 lg:px-6 py-3">
                                                <div className="text-sm text-gray-500 truncate max-w-[150px] lg:max-w-none">{user.email}</div>
                                            </td>
                                            <td className="px-3 lg:px-6 py-3">
                                                <StatusBadge status={user.access} />
                                            </td>
                                            <td className="px-3 lg:px-6 py-3">
                                                <div className="text-sm text-gray-500 truncate max-w-[100px]">{user.position || "-"}</div>
                                            </td>
                                            <td className="px-3 lg:px-6 py-3">
                                                <div className="text-sm text-gray-500 truncate max-w-[120px]">{user.barangay}</div>
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 text-sm text-gray-500 hidden xl:table-cell">
                                                {user.created_at}
                                            </td>
                                            <td className="px-3 lg:px-6 py-3 text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 mr-2 lg:mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.data.length > 0 && (
                            <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-3">
                                <div className="w-full sm:w-auto">
                                    <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                                        Showing <span className="font-medium">{users.from}</span> to <span className="font-medium">{users.to}</span> of <span className="font-medium">{users.total}</span> results
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {users.prev_page_url && (
                                        <a
                                            href={users.prev_page_url}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="w-4 h-4 sm:mr-1" />
                                            <span className="hidden sm:inline">Previous</span>
                                        </a>
                                    )}
                                    {users.next_page_url && (
                                        <a
                                            href={users.next_page_url}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <span className="hidden sm:inline">Next</span>
                                            <ChevronRight className="w-4 h-4 sm:ml-1" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {users.data.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                user={editingUser}
            />

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingUser(null);
                    setDeletionReason('');
                }}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${deletingUser?.full_name}? This action cannot be undone.`}
                confirmText="Delete"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                detailsComponent={(
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Deletion Reason (Optional)
                        </label>
                        <textarea
                            value={deletionReason}
                            onChange={(e) => setDeletionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="4"
                            placeholder="Optional: Provide a reason for deleting this user account..."
                        />
                    </div>
                )}
            />
        </AuthenticatedLayout>
    );
}
