import { useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import TextInput from '@/Components/Form/TextInput';
import Textarea from '@/Components/Form/Textarea';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import DangerButton from '@/Components/Buttons/DangerButton';
import FileUpload from '@/Components/Form/FileUpload';
import { X, Plus, Image, Code, FileEdit } from 'lucide-react';
import { useToast } from '@/Hooks/useToast';
import { getIconOptions } from '@/Utils/iconHelper';

export default function ContentModal({ isOpen, onClose, content, pageKey, allowSectionChange = true }) {
    const toast = useToast();
    const isEditing = content && content.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        page_key: content?.page_key || pageKey || '',
        section_key: content?.section_key || 'hero',
        title: content?.title || '',
        content: content?.content || '',
        meta: content?.meta || {},
        images: content?.images || [],
        new_images: [],
        embed_code: content?.embed_code || '',
        is_active: content?.is_active ?? true,
        order: content?.order || 0,
    });

    const [metaFields, setMetaFields] = useState(
        content?.meta ? Object.entries(content.meta).map(([key, value]) => ({ key, value })) : []
    );

    const [showImageUpload, setShowImageUpload] = useState(
        (content?.images && content.images.length > 0) || false
    );

    const [showEmbedCode, setShowEmbedCode] = useState(
        (content?.embed_code && content.embed_code.length > 0) || false
    );

    // Update form data when content changes
    useEffect(() => {
        if (isOpen) {
            setData({
                page_key: content?.page_key || pageKey || '',
                section_key: content?.section_key || 'hero',
                title: content?.title || '',
                content: content?.content || '',
                meta: content?.meta || {},
                images: content?.images || [],
                new_images: [],
                embed_code: content?.embed_code || '',
                is_active: content?.is_active ?? true,
                order: content?.order || 0,
            });

            setMetaFields(
                content?.meta ? Object.entries(content.meta).map(([key, value]) => ({ key, value })) : []
            );

            setShowImageUpload((content?.images && content.images.length > 0) || false);
            setShowEmbedCode((content?.embed_code && content.embed_code.length > 0) || false);
        }
    }, [isOpen, content]);

    const sectionOptions = {
        home: ['hero', 'emergency', 'service_1', 'service_2', 'service_3', 'custom'],
        about: ['hero', 'mission', 'vision', 'history', 'org_structure', 'core_function', 'team', 'gallery', 'custom'],
        contact: ['hero', 'emergency', 'info', 'hours', 'social', 'map', 'custom'],
        announcements: ['hero'],
        awareness_materials: ['hero'],
    };

    const handleMetaChange = (index, field, value) => {
        const updated = [...metaFields];
        updated[index][field] = value;
        setMetaFields(updated);

        // Update form data
        const metaObj = {};
        updated.forEach(item => {
            if (item.key) metaObj[item.key] = item.value;
        });
        setData('meta', metaObj);
    };

    const addMetaField = () => {
        setMetaFields([...metaFields, { key: '', value: '' }]);
    };

    const removeMetaField = (index) => {
        const updated = metaFields.filter((_, i) => i !== index);
        setMetaFields(updated);

        const metaObj = {};
        updated.forEach(item => {
            if (item.key) metaObj[item.key] = item.value;
        });
        setData('meta', metaObj);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Submitting form with data:', data);

        const submitData = {
            page_key: data.page_key,
            section_key: data.section_key,
            title: data.title,
            content: data.content,
            meta: data.meta,
            embed_code: data.embed_code,
            is_active: data.is_active,
            order: parseInt(data.order) || 0,
        };

        // Handle existing images
        if (data.images && data.images.length > 0) {
            submitData.images = data.images;
        }

        // For file uploads, use FormData
        if (data.new_images && data.new_images.length > 0) {
            const formData = new FormData();
            Object.keys(submitData).forEach(key => {
                if (key === 'meta' || key === 'images') {
                    formData.append(key, JSON.stringify(submitData[key]));
                } else {
                    formData.append(key, submitData[key]);
                }
            });

            data.new_images.forEach((file, index) => {
                formData.append(`new_images[${index}]`, file);
            });

            if (isEditing) {
                formData.append('_method', 'PUT');
                router.post(`/officer/content-management/${content.id}`, formData, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(isEditing ? 'Content updated successfully!' : 'Content created successfully!');
                        onClose();
                    },
                    onError: (errors) => {
                        console.error('Form errors:', errors);
                        Object.values(errors).forEach(error => toast.error(error));
                    },
                });
            } else {
                router.post('/officer/content-management', formData, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Content created successfully!');
                        onClose();
                    },
                    onError: (errors) => {
                        console.error('Form errors:', errors);
                        Object.values(errors).forEach(error => toast.error(error));
                    },
                });
            }
        } else {
            // No file uploads, use regular JSON
            if (isEditing) {
                router.put(`/officer/content-management/${content.id}`, submitData, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Content updated successfully!');
                        onClose();
                    },
                    onError: (errors) => {
                        console.error('Form errors:', errors);
                        Object.values(errors).forEach(error => toast.error(error));
                    },
                });
            } else {
                router.post('/officer/content-management', submitData, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Content created successfully!');
                        onClose();
                    },
                    onError: (errors) => {
                        console.error('Form errors:', errors);
                        Object.values(errors).forEach(error => toast.error(error));
                    },
                });
            }
        }
    };

    const handleDeleteImage = (imagePath) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.post(`/officer/content-management/${content.id}/delete-image`, {
                image: imagePath,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    const updated = data.images.filter(img => img !== imagePath);
                    setData('images', updated);
                },
            });
        }
    };

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="opaque"
            placement="center"
            size="3xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh] bg-white rounded-lg",
                backdrop: "bg-black/50",
                body: "overflow-y-auto px-4 sm:px-6",
                header: "border-b border-gray-200 px-4 sm:px-6",
                footer: "border-t border-gray-200 px-4 sm:px-6",
            }}
        >
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-100">
                                    <FileEdit size={24} className="text-blue-600" />
                                </div>
                                <span className="text-lg font-semibold">
                                    {content ? 'Edit Content' : 'Create New Content'}
                                </span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Page Key (Hidden for restricted pages) */}
                                {allowSectionChange && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Page <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.page_key}
                                            onChange={(e) => {
                                                setData('page_key', e.target.value);
                                                setData('section_key', '');
                                            }}
                                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Page</option>
                                            <option value="home">Home</option>
                                            <option value="about">About</option>
                                            <option value="contact">Contact</option>
                                        </select>
                                        {errors.page_key && (
                                            <p className="mt-1 text-sm text-red-600">{errors.page_key}</p>
                                        )}
                                    </div>
                                )}

                                {/* Section Key */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Section {allowSectionChange && <span className="text-red-500">*</span>}
                                    </label>
                                    <select
                                        value={data.section_key}
                                        onChange={(e) => setData('section_key', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        disabled={!allowSectionChange}
                                        required={allowSectionChange}
                                    >
                                        <option value="">Select Section</option>
                                        {(sectionOptions[data.page_key] || []).map((option) => (
                                            <option key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                    {data.section_key === 'custom' && (
                                        <input
                                            type="text"
                                            placeholder="Enter custom section key"
                                            value={data.custom_section_key || ''}
                                            onChange={(e) => setData('custom_section_key', e.target.value)}
                                            className="w-full mt-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    )}
                                    {errors.section_key && (
                                        <p className="mt-1 text-sm text-red-600">{errors.section_key}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <TextInput
                                    label="Title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Section title"
                                />

                                {/* Content */}
                                <Textarea
                                    label="Content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Main content text..."
                                    rows={6}
                                />

                                {/* Meta Fields */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Additional Fields (Meta)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addMetaField}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Field
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {metaFields.map((field, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-2">
                                                <select
                                                    value={field.key}
                                                    onChange={(e) => handleMetaChange(index, 'key', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">Select field or type custom</option>
                                                    <option value="hotline">Hotline</option>
                                                    <option value="email">Email</option>
                                                    <option value="address">Address</option>
                                                    <option value="telephone">Telephone</option>
                                                    <option value="facebook">Facebook</option>
                                                    <option value="weekdays">Weekdays</option>
                                                    <option value="saturday">Saturday</option>
                                                    <option value="sunday">Sunday</option>
                                                    <option value="emergency_hotline">Emergency Hotline</option>
                                                    <option value="national_emergency">National Emergency</option>
                                                    <option value="position">Position</option>
                                                    <option value="icon">Icon</option>
                                                    <option value="color">Color</option>
                                                    <option value="custom">Custom (type in value field)</option>
                                                </select>
                                                {field.key === 'icon' ? (
                                                    <select
                                                        value={field.value}
                                                        onChange={(e) => handleMetaChange(index, 'value', e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    >
                                                        <option value="">Select an icon</option>
                                                        {getIconOptions().map(iconName => (
                                                            <option key={iconName} value={iconName}>
                                                                {iconName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : field.key === 'color' ? (
                                                    <select
                                                        value={field.value}
                                                        onChange={(e) => handleMetaChange(index, 'value', e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    >
                                                        <option value="">Select a color</option>
                                                        <option value="red">Red</option>
                                                        <option value="orange">Orange</option>
                                                        <option value="amber">Amber</option>
                                                        <option value="yellow">Yellow</option>
                                                        <option value="lime">Lime</option>
                                                        <option value="green">Green</option>
                                                        <option value="emerald">Emerald</option>
                                                        <option value="teal">Teal</option>
                                                        <option value="cyan">Cyan</option>
                                                        <option value="sky">Sky</option>
                                                        <option value="blue">Blue</option>
                                                        <option value="indigo">Indigo</option>
                                                        <option value="violet">Violet</option>
                                                        <option value="purple">Purple</option>
                                                        <option value="fuchsia">Fuchsia</option>
                                                        <option value="pink">Pink</option>
                                                        <option value="rose">Rose</option>
                                                        <option value="slate">Slate</option>
                                                        <option value="gray">Gray</option>
                                                        <option value="zinc">Zinc</option>
                                                        <option value="neutral">Neutral</option>
                                                        <option value="stone">Stone</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={field.value}
                                                        onChange={(e) => handleMetaChange(index, 'value', e.target.value)}
                                                        placeholder="Value"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeMetaField(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Store additional data like hotline numbers, email addresses, etc.
                                    </p>
                                </div>

                                {/* Image Upload Toggle & Section */}
                                <div>
                                    {!showImageUpload && (
                                        <button
                                            type="button"
                                            onClick={() => setShowImageUpload(true)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            <Image className="w-4 h-4" />
                                            Add Images
                                        </button>
                                    )}

                                    {showImageUpload && (
                                        <div className="space-y-4">
                                            {/* Existing Images */}
                                            {data.images && data.images.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Current Images ({data.images.length})
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {data.images.map((imagePath, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={`/storage/${imagePath}`}
                                                                    alt={`Image ${index + 1}`}
                                                                    className="w-full h-48 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteImage(imagePath)}
                                                                    className="absolute top-2 right-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* New Images */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        {data.images && data.images.length > 0 ? 'Add More Images' : 'Upload Images'}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowImageUpload(false);
                                                            setData('new_images', []);
                                                        }}
                                                        className="text-sm text-gray-500 hover:text-gray-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <FileUpload
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(files) => setData('new_images', Array.from(files))}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Upload images for this section (max 5MB per image)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Embed Code Toggle & Section */}
                                <div>
                                    {!showEmbedCode && (
                                        <button
                                            type="button"
                                            onClick={() => setShowEmbedCode(true)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            <Code className="w-4 h-4" />
                                            Add Embed Code
                                        </button>
                                    )}

                                    {showEmbedCode && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Embed Code (iframe, etc.)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowEmbedCode(false);
                                                        setData('embed_code', '');
                                                    }}
                                                    className="text-sm text-gray-500 hover:text-gray-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <Textarea
                                                value={data.embed_code}
                                                onChange={(e) => setData('embed_code', e.target.value)}
                                                placeholder='<iframe src="..." width="600" height="450" ...></iframe>'
                                                rows={4}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Paste embed code for maps, videos, or other embeddable content
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Order */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            type="number"
                                            label="Display Order"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ms-3 text-sm font-medium text-gray-900">
                                                {data.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <SecondaryButton
                                onClick={onCloseModal}
                                disabled={processing}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </HeroModal>
    );
}
