import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Mail, MapPin, Shield, Calendar, Camera, Trash2, Key } from 'lucide-react';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import DangerButton from '@/Components/Buttons/DangerButton';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import ConfirmationModal from '@/Components/Modal/ConfirmationModal';

export default function ProfileIndex({ user }) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Profile form
    const profileForm = useForm({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        profile_image: null,
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileForm.setData('profile_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditingProfile(false);
                setImagePreview(null);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post(route('profile.password.update'), {
            onSuccess: () => {
                passwordForm.reset();
                setIsChangingPassword(false);
            },
        });
    };

    const handleDeleteImage = () => {
        profileForm.delete(route('profile.image.delete'), {
            onSuccess: () => {
                setShowDeleteImageModal(false);
            },
        });
    };

    const getRoleBadgeColor = (access) => {
        const colors = {
            head_officer: 'bg-purple-100 text-purple-800',
            officer: 'bg-blue-100 text-blue-800',
            resident: 'bg-green-100 text-green-800',
        };
        return colors[access] || 'bg-gray-100 text-gray-800';
    };

    const getRoleLabel = (access) => {
        const labels = {
            head_officer: 'Head Officer',
            officer: 'Officer',
            resident: 'Resident',
        };
        return labels[access] || access;
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'My Profile', href: null },
            ]}>
            <Head title="My Profile" />

            <div className="py-4 sm:py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your account information and settings
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Cover Image */}
                        {/* <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div> */}

                        {/* Profile Content */}
                        <div className="px-4 sm:px-6 py-4 sm:py-6">
                            {/* Profile Image */}
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-5 gap-4 sm:gap-0">
                                <div className="relative flex-shrink-0">
                                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                                        {imagePreview || user.profile_image ? (
                                            <img
                                                src={imagePreview || user.profile_image}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-300">
                                                <User size={40} className="text-gray-500 sm:w-12 sm:h-12" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditingProfile && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition shadow-lg">
                                            <Camera size={14} className="text-white sm:w-4 sm:h-4" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleProfileImageChange}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                                        {user.first_name} {user.middle_name} {user.last_name}
                                    </h2>
                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.access)}`}>
                                            {getRoleLabel(user.access)}
                                        </span>
                                        {user.email_verified_at && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {!isEditingProfile && (
                                    <div className="w-full sm:w-auto mt-4 sm:mt-0">
                                        <SecondaryButton
                                            onClick={() => setIsEditingProfile(true)}
                                            className="w-full sm:w-auto"
                                        >
                                            Edit Profile
                                        </SecondaryButton>
                                    </div>
                                )}
                            </div>

                            {/* Profile Information */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                {!isEditingProfile ? (
                                    // View Mode
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <Mail className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-base text-gray-900">{user.email}</p>
                                            </div>
                                        </div>

                                        {user.position && (
                                            <div className="flex items-start gap-3">
                                                <Shield className="text-gray-400 mt-1" size={20} />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Position</p>
                                                    <p className="text-base text-gray-900 capitalize">{user.position}</p>
                                                </div>
                                            </div>
                                        )}

                                        {user.barangay && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="text-gray-400 mt-1" size={20} />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Barangay</p>
                                                    <p className="text-base text-gray-900">{user.barangay}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <Calendar className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Member Since</p>
                                                <p className="text-base text-gray-900">{user.created_at}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Edit Mode
                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <TextInput
                                                    id="first_name"
                                                    label="First Name"
                                                    className="mt-1 block w-full"
                                                    value={profileForm.data.first_name}
                                                    onChange={(e) => profileForm.setData('first_name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={profileForm.errors.first_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="middle_name" value="Middle Name" />
                                                <TextInput
                                                    id="middle_name"
                                                    label='Middle Name'
                                                    className="mt-1 block w-full"
                                                    value={profileForm.data.middle_name}
                                                    onChange={(e) => profileForm.setData('middle_name', e.target.value)}
                                                />
                                                <InputError message={profileForm.errors.middle_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="last_name" value="Last Name" />
                                                <TextInput
                                                    id="last_name"
                                                    label='Last Name'
                                                    className="mt-1 block w-full"
                                                    value={profileForm.data.last_name}
                                                    onChange={(e) => profileForm.setData('last_name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={profileForm.errors.last_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="email" value="Email" />
                                                <TextInput
                                                    id="email"
                                                    label="Email Address"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    required
                                                />
                                                <InputError message={profileForm.errors.email} className="mt-2" />
                                            </div>
                                        </div>

                                        {user.profile_image && !imagePreview && (
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                                                <span className="text-sm text-gray-600">Current profile image</span>
                                                <DangerButton
                                                    type="button"
                                                    onClick={() => setShowDeleteImageModal(true)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    <Trash2 size={16} className="mr-2" />
                                                    Delete Image
                                                </DangerButton>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                            <PrimaryButton
                                                type="submit"
                                                disabled={profileForm.processing}
                                                className="w-full sm:w-auto"
                                            >
                                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                            </PrimaryButton>
                                            <SecondaryButton
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingProfile(false);
                                                    profileForm.reset();
                                                    setImagePreview(null);
                                                }}
                                                className="w-full sm:w-auto"
                                            >
                                                Cancel
                                            </SecondaryButton>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                    <Key className="text-blue-600" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Change Password</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">Update your account password</p>
                                </div>
                            </div>
                            {!isChangingPassword && (
                                <SecondaryButton
                                    onClick={() => setIsChangingPassword(true)}
                                    className="w-full sm:w-auto flex-shrink-0"
                                >
                                    Change Password
                                </SecondaryButton>
                            )}
                        </div>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4 border-t border-gray-200 pt-4">
                                <div>
                                    <InputLabel htmlFor="current_password" value="Current Password" />
                                    <TextInput
                                        id="current_password"
                                        label="Current Password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        required
                                    />
                                    <InputError message={passwordForm.errors.current_password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="New Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        label="New Password"
                                        className="mt-1 block w-full"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={passwordForm.errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        label="Confirm New Password"
                                        className="mt-1 block w-full"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={passwordForm.errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="w-full sm:w-auto"
                                    >
                                        {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            passwordForm.reset();
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Image Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteImageModal}
                onClose={() => setShowDeleteImageModal(false)}
                onConfirm={handleDeleteImage}
                title="Delete Profile Image"
                message="Are you sure you want to delete your profile image? This action cannot be undone."
                confirmText="Delete"
                confirmButtonClass="danger"
            />
        </AuthenticatedLayout>
    );
}
