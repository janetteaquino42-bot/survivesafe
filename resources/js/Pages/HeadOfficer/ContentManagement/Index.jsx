import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Cards/Card';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import DangerButton from '@/Components/Buttons/DangerButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import ContentModal from './ContentModal';
import ConfirmationModal from '@/Components/Modal/ConfirmationModal';
import { Edit, Trash2, Plus, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

export default function ContentManagement({ contents = [] }) {
    const [activeTab, setActiveTab] = useState('home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, content: null });

    const tabs = [
        { key: 'home', label: 'Home Page', allowAddSection: true },
        { key: 'about', label: 'About Page', allowAddSection: true },
        { key: 'contact', label: 'Contact Page', allowAddSection: true },
        { key: 'announcements', label: 'Announcements', allowAddSection: false },
        { key: 'awareness_materials', label: 'Awareness Materials', allowAddSection: false },
        { key: 'hazard_map', label: 'Hazard Map', allowAddSection: false },
    ];

    const filteredContents = contents.filter(c => c.page_key === activeTab);
    const currentTab = tabs.find(t => t.key === activeTab);

    const handleCreate = () => {
        setEditingContent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (content) => {
        setEditingContent(content);
        setIsModalOpen(true);
    };

    const handleDelete = (content) => {
        setDeleteModal({ isOpen: true, content });
    };

    const confirmDelete = () => {
        if (deleteModal.content) {
            router.delete(route('officer.content-management.destroy', deleteModal.content.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteModal({ isOpen: false, content: null });
                }
            });
        }
    };

    const handleDeleteImage = (contentId, imageIndex) => {
        router.post(route('officer.content-management.delete-image', contentId), {
            image_index: imageIndex,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Content Management">
            <Head title="Content Management" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200 overflow-x-auto">
                        <nav className="flex gap-2 sm:gap-4 min-w-max sm:min-w-0" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Action Button */}
                    {currentTab?.allowAddSection && (
                        <div className="mb-6">
                            <PrimaryButton onClick={handleCreate}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Section
                            </PrimaryButton>
                        </div>
                    )}

                    {/* Content List */}
                    <div className="space-y-4">
                        {filteredContents.length === 0 ? (
                            <Card>
                                <div className="text-center py-12">
                                    <p className="text-gray-500">
                                        {currentTab?.allowAddSection
                                            ? 'No content sections found. Click "Add New Section" to create one.'
                                            : 'No hero content found. Click "Edit Hero" to customize the page header.'}
                                    </p>
                                    {!currentTab?.allowAddSection && (
                                        <PrimaryButton onClick={handleCreate} className="mt-4">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Edit Hero
                                        </PrimaryButton>
                                    )}
                                </div>
                            </Card>
                        ) : (
                            filteredContents.map((content) => (
                                <Card key={content.id}>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Content Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-start gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 break-words">
                                                    {content.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {content.section_key}
                                                    </span>
                                                    {content.is_active ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            <EyeOff className="w-3 h-3 mr-1" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Order: {content.order}
                                                    </span>
                                                </div>
                                            </div>
                                            {content.content && (
                                                <p className="text-gray-600 text-sm mb-3 break-words line-clamp-2">
                                                    {content.content}
                                                </p>
                                            )}
                                            {content.images && content.images.length > 0 && (
                                                <div className="flex gap-2 mb-3 overflow-x-auto">
                                                    {content.images.map((image, idx) => (
                                                        <div key={idx} className="relative group flex-shrink-0">
                                                            <img
                                                                src={`/storage/${image}`}
                                                                alt={`${content.title} - ${idx + 1}`}
                                                                className="h-20 w-20 object-cover rounded border border-gray-200"
                                                            />
                                                            <button
                                                                onClick={() => handleDeleteImage(content.id, idx)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {content.meta && Object.keys(content.meta).length > 0 && (
                                                <div className="text-xs text-gray-500 space-y-1">
                                                    {Object.entries(content.meta).map(([key, value]) => (
                                                        <div key={key} className="flex gap-2 break-all">
                                                            <span className="font-medium">{key}:</span>
                                                            <span className="break-words">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                            <SecondaryButton
                                                onClick={() => handleEdit(content)}
                                                className="justify-center"
                                            >
                                                <Edit className="w-4 h-4 sm:mr-2" />
                                                <span className="hidden sm:inline">Edit</span>
                                            </SecondaryButton>
                                            <DangerButton
                                                onClick={() => handleDelete(content)}
                                                className="justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </DangerButton>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ContentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingContent(null);
                }}
                content={editingContent}
                pageKey={activeTab}
                allowSectionChange={currentTab?.allowAddSection}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, content: null })}
                onConfirm={confirmDelete}
                title="Delete Content Section"
                message="Are you sure you want to delete this content section? This action cannot be undone."
                confirmText="Delete"
                icon={Trash2}
                ConfirmButton={DangerButton}
            />
        </AuthenticatedLayout>
    );
}
