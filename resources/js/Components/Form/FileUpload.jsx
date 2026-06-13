import { useState, useRef } from "react";
import { Upload, X, File, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@heroui/react";

export default function FileUpload({
    label = "Upload File",
    name,
    accept = "*",
    multiple = false,
    maxSize = 5, // MB
    onChange,
    error = "",
    required = false,
    disabled = false,
    className = "",
    description = "",
    preview = true,
    ...props
}) {
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleFiles = (fileList) => {
        const filesArray = Array.from(fileList);
        const validFiles = filesArray.filter((file) => {
            const sizeMB = file.size / 1024 / 1024;
            return sizeMB <= maxSize;
        });

        if (validFiles.length !== filesArray.length) {
            alert(`Some files exceed the ${maxSize}MB size limit`);
        }

        const newFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(newFiles);
        onChange?.(newFiles);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onChange?.(newFiles);
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith("image/")) {
            return <ImageIcon size={20} className="text-blue-500" />;
        }
        return <FileText size={20} className="text-gray-500" />;
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${dragActive
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : error
                        ? "border-red-400 bg-red-50"
                        : "border-gray-400 hover:border-blue-400 hover:bg-gray-50"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    disabled={disabled}
                    className="hidden"
                    {...props}
                />

                <div className="text-center">
                    <div className="inline-flex p-3 bg-blue-500 rounded-lg mb-3">
                        <Upload className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-700 mb-1 font-medium">
                        <span className="text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        {accept !== "*" ? accept : "Any file type"} (Max {maxSize}MB{multiple ? " each" : ""})
                    </p>
                </div>
            </div>

            {description && !error && (
                <p className="mt-2 text-xs text-gray-500">{description}</p>
            )}

            {error && <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>}

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div key={index}>
                            {/* Large Image Preview for images */}
                            {preview && file.type.startsWith("image/") && (
                                <div className="mb-2">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-64 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                                    />
                                </div>
                            )}

                            {/* File Info Card */}
                            <div
                                className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {getFileIcon(file)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                    radius="lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    className="ml-3"
                                >
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
