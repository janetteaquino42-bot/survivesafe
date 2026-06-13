import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Megaphone } from "lucide-react";
import Textarea from "@/Components/Form/Textarea";
import TextInput from "@/Components/Form/TextInput";
import FileUpload from "@/Components/Form/FileUpload";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

export default function AnnouncementModal({ isOpen, onClose, announcement = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
    });
    const [existingImages, setExistingImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (announcement) {
            setFormData({
                title: announcement.title || '',
                description: announcement.description || '',
                images: [],
            });
            setExistingImages(announcement.images || []);
            setRemovedImages([]);
        } else {
            setFormData({
                title: '',
                description: '',
                images: [],
            });
            setExistingImages([]);
            setRemovedImages([]);
        }
        setErrors({});
    }, [announcement, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (files) => {
        // Calculate total images (existing not removed + new)
        const remainingExisting = existingImages.length - removedImages.length;
        const totalImages = remainingExisting + files.length;

        // Validate total number of images
        if (totalImages > 5) {
            setErrors(prev => ({ ...prev, images: `Total images cannot exceed 5. You currently have ${remainingExisting} existing image(s).` }));
            return;
        }

        // Validate each file
        const validFiles = [];
        const errorMessages = [];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check if it's an allowed image type
            if (!allowedTypes.includes(file.type.toLowerCase())) {
                errorMessages.push(`${file.name} is not a valid image format. Only JPG, PNG, and GIF are allowed.`);
                continue;
            }

            // Check file size (2MB = 2 * 1024 * 1024 bytes)
            if (file.size > 2 * 1024 * 1024) {
                errorMessages.push(`${file.name} exceeds 2MB size limit (${(file.size / 1024 / 1024).toFixed(2)}MB).`);
                continue;
            }

            validFiles.push(file);
        }

        if (errorMessages.length > 0) {
            setErrors(prev => ({ ...prev, images: errorMessages.join(' ') }));
            // Don't update formData if there are errors
            return;
        }

        setFormData(prev => ({ ...prev, images: validFiles }));
        // Clear error
        setErrors(prev => ({ ...prev, images: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required.';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear any previous errors before validation
        setErrors({});

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);

        // Append new images
        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((image, index) => {
                submitData.append(`images[${index}]`, image);
            });
        }
        // Send removed images if editing
        if (announcement && removedImages.length > 0) {
            removedImages.forEach((imgUrl, index) => {
                submitData.append(`removed_images[${index}]`, imgUrl);
            });
        }

        if (announcement) {
            // Update existing announcement
            submitData.append('_method', 'PUT');
            router.post(`/officer/announcements/${announcement.id}`, submitData, {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } else {
            // Create new announcement
            router.post('/officer/announcements', submitData, {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
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
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: `my-8 bg-white rounded-lg`,
                backdrop: "bg-black/50",
                wrapper: "overflow-y-auto",
                body: "max-h-[60vh] overflow-y-auto",
                header: "border-b border-gray-200",
                footer: "border-t border-gray-200",

            }}
        >
            <ModalContent>
                {(onCloseModal) => (
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-100">
                                    <Megaphone size={24} className="text-blue-600" />
                                </div>
                                <span className="text-lg font-semibold">
                                    {announcement ? 'Edit Announcement' : 'Create New Announcement'}
                                </span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                {/* Title */}
                                <TextInput
                                    label="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    error={errors.title}
                                    placeholder="Enter announcement title"
                                    required
                                />

                                {/* Description */}
                                <Textarea
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={errors.description}
                                    placeholder="Enter announcement details..."
                                    rows={5}
                                    required
                                />

                                {/* Image Upload */}
                                <div>
                                    {existingImages.length > 0 && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Current Images ({existingImages.length - removedImages.length}/{existingImages.length})
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {existingImages.map((img, idx) => {
                                                    const isRemoved = removedImages.includes(img);
                                                    return (
                                                        <div key={idx} className="relative group">
                                                            <img
                                                                src={img}
                                                                alt={`Current ${idx + 1}`}
                                                                className={`w-full h-48 object-contain rounded-lg border-2 bg-gray-50 transition-all ${isRemoved ? 'border-red-300 opacity-40 grayscale' : 'border-gray-200'
                                                                    }`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (isRemoved) {
                                                                        setRemovedImages(prev => prev.filter(i => i !== img));
                                                                    } else {
                                                                        setRemovedImages(prev => [...prev, img]);
                                                                    }
                                                                }}
                                                                className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${isRemoved
                                                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                                                    }`}
                                                            >
                                                                {isRemoved ? 'Restore' : 'Remove'}
                                                            </button>
                                                            {isRemoved && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <span className="text-red-600 font-bold text-lg bg-white/80 px-3 py-1 rounded-lg">
                                                                        Will be removed
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <FileUpload
                                        label={existingImages.length > 0 ? "Add More Images (Optional)" : "Images (Optional)"}
                                        name="images"
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                        multiple={true}
                                        maxSize={2}
                                        onChange={handleImageChange}
                                        error={errors.images}
                                        description={`Upload up to ${5 - (existingImages.length - removedImages.length)} more image(s) (JPG, PNG, GIF - Max 2MB each)`}
                                        preview={true}
                                    />
                                </div>

                                {announcement?.status === 'declined' && announcement?.decline_reason && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm font-semibold text-red-800 mb-1">Previous Decline Reason:</p>
                                        <p className="text-sm text-red-700">{announcement.decline_reason}</p>
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <SecondaryButton
                                onClick={onCloseModal}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : announcement
                                        ? 'Update Announcement'
                                        : 'Create Announcement'}
                            </PrimaryButton>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </HeroModal>
    );
}
