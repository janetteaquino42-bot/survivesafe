import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { FileText, X } from "lucide-react";
import Textarea from "@/Components/Form/Textarea";
import TextInput from "@/Components/Form/TextInput";
import FileUpload from "@/Components/Form/FileUpload";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

export default function AwarenessMaterialModal({ isOpen, onClose, material = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file: null,
        video_link: '',
        video_orientation: 'landscape',
        remove_file: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadType, setUploadType] = useState('file'); // 'file' or 'video_link'

    useEffect(() => {
        if (material) {
            setFormData({
                title: material.title || '',
                description: material.description || '',
                file: null,
                video_link: material.video_link || '',
                video_orientation: material.video_orientation || 'landscape',
                remove_file: false,
            });
            setUploadType(material.file_type === 'video_link' ? 'video_link' : 'file');
        } else {
            setFormData({
                title: '',
                description: '',
                file: null,
                video_link: '',
                video_orientation: 'landscape',
                remove_file: false,
            });
            setUploadType('file');
        }
        setErrors({});
    }, [material, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (files) => {
        if (files && files.length > 0) {
            const file = files[0];

            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, file: `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB).` }));
                return;
            }

            // Validate file type
            const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif'];
            const extension = file.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(extension)) {
                setErrors(prev => ({ ...prev, file: 'Invalid file type. Allowed: PDF, Word, PowerPoint, or Image files.' }));
                return;
            }

            setFormData(prev => ({ ...prev, file, remove_file: false }));
            setErrors(prev => ({ ...prev, file: null }));
        }
    };

    const handleRemoveFile = () => {
        setFormData(prev => ({ ...prev, file: null, remove_file: true }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required.';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required.';
        }

        // For new materials, require either file or video link
        if (!material) {
            if (uploadType === 'file' && !formData.file) {
                newErrors.file = 'Please upload a file.';
            }
            if (uploadType === 'video_link' && !formData.video_link.trim()) {
                newErrors.video_link = 'Please provide a video link.';
            }
        }

        // Validate video link format if provided
        if (uploadType === 'video_link' && formData.video_link) {
            try {
                new URL(formData.video_link);
            } catch {
                newErrors.video_link = 'Please provide a valid URL.';
            }
        }

        if (uploadType === 'video_link' && !formData.video_orientation) {
            newErrors.video_orientation = 'Please select a video orientation.';
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

        if (uploadType === 'file') {
            if (formData.file) {
                submitData.append('file', formData.file);
            }
            if (formData.remove_file) {
                submitData.append('remove_file', '1');
            }
        } else if (uploadType === 'video_link') {
            submitData.append('video_link', formData.video_link);
            submitData.append('video_orientation', formData.video_orientation);
            if (material?.file_path) {
                submitData.append('remove_file', '1');
            }
        }

        if (material) {
            // Update existing material
            submitData.append('_method', 'PUT');
            router.post(`/officer/awareness-materials/${material.id}`, submitData, {
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
            // Create new material
            router.post('/officer/awareness-materials', submitData, {
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

    const getFileTypeLabel = (fileType) => {
        const labels = {
            'pdf': 'PDF Document',
            'docx': 'Word Document',
            'pptx': 'PowerPoint Presentation',
            'image': 'Image',
            'video_link': 'Video Link',
        };
        return labels[fileType] || fileType;
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
                                    <FileText size={24} className="text-blue-600" />
                                </div>
                                <span className="text-lg font-semibold">
                                    {material ? 'Edit Awareness Material' : 'Create New Awareness Material'}
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
                                    placeholder="Enter material title"
                                    required
                                />

                                {/* Description */}
                                <Textarea
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={errors.description}
                                    placeholder="Enter material description..."
                                    rows={5}
                                    required
                                />

                                {/* Upload Type Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Material Type
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setUploadType('file')}
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${uploadType === 'file'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadType('video_link')}
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${uploadType === 'video_link'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            Video Link
                                        </button>
                                    </div>
                                </div>

                                {/* File Upload or Video Link */}
                                {uploadType === 'file' ? (
                                    <div>
                                        {/* Current File Display */}
                                        {material?.file_path && !formData.remove_file && !formData.file && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Current File
                                                </label>
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <FileText size={24} className="text-gray-600" />
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{material.title}</p>
                                                            <p className="text-sm text-gray-600">{getFileTypeLabel(material.file_type)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveFile}
                                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <FileUpload
                                            label={material?.file_path && !formData.remove_file && !formData.file ? "Upload New File (Optional)" : "Upload File"}
                                            name="file"
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                                            multiple={false}
                                            maxSize={10}
                                            onChange={handleFileChange}
                                            error={errors.file}
                                            description="Supported formats: PDF, Word, PowerPoint, or Image (Max 10MB)"
                                            preview={true}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <TextInput
                                            label="Video Link"
                                            name="video_link"
                                            value={formData.video_link}
                                            onChange={handleChange}
                                            error={errors.video_link}
                                            placeholder="Paste Youtube or Facebook video URL here"
                                            required={!material}
                                        />

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Video Orientation
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, video_orientation: 'portrait' }))}
                                                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${formData.video_orientation === 'portrait'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                        }`}
                                                >
                                                    Portrait
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, video_orientation: 'landscape' }))}
                                                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${formData.video_orientation === 'landscape'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                        }`}
                                                >
                                                    Landscape
                                                </button>
                                            </div>
                                            {errors.video_orientation && (
                                                <p className="mt-2 text-sm text-red-600">{errors.video_orientation}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {material?.status === 'declined' && material?.decline_reason && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm font-semibold text-red-800 mb-1">Previous Decline Reason:</p>
                                        <p className="text-sm text-red-700">{material.decline_reason}</p>
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
                                    : material
                                        ? 'Update Material'
                                        : 'Create Material'}
                            </PrimaryButton>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </HeroModal>
    );
}
