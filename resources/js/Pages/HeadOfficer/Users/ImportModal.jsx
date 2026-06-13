import { router } from "@inertiajs/react";
import { useState } from "react";
import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { useToast } from "@/Hooks/useToast";
import { Upload, FileText, AlertCircle, FileDown } from "lucide-react";

export default function ImportModal({ isOpen, onClose }) {
    const toast = useToast();
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            validateFile(file);
        }
    };

    const validateFile = (file) => {
        const validTypes = ["text/csv", "application/vnd.ms-excel"];
        const validExtensions = [".csv", ".txt"];
        const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            toast.error("Please upload a valid CSV file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setSelectedFile(file);
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
            validateFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error("Please select a file to import");
            return;
        }

        setProcessing(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        router.post(route("officer.users.import"), formData, {
            forceFormData: true,
            onSuccess: (page) => {
                toast.success("Users imported successfully");
                setSelectedFile(null);
                setProcessing(false);
                onClose();
            },
            onError: (errors) => {
                setProcessing(false);
                if (errors.file) {
                    toast.error(errors.file);
                } else {
                    toast.error("Import failed. Please check the file format and try again.");
                }
            },
        });
    };

    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    };

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={handleClose}
            backdrop="opaque"
            placement="center"
            size="lg"
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
                                <div className="p-2 rounded-full bg-green-100">
                                    <FileDown size={24} className="text-green-600" />
                                </div>
                                <span className="text-lg font-semibold">Import Users</span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                {/* Instructions */}
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-semibold mb-1">Import Instructions:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Download the CSV template first</li>
                                                <li>Fill in the user data following the format</li>
                                                <li>Upload the completed CSV file</li>
                                                <li>Officers will be automatically verified</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* File Upload Area */}
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center ${dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 bg-gray-50"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    {selectedFile ? (
                                        <div className="flex items-center justify-center">
                                            <FileText className="w-12 h-12 text-green-500 mr-3" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                Drag and drop your CSV file here, or click to browse
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Maximum file size: 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* CSV Format Example */}
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">
                                        CSV Format:
                                    </p>
                                    <code className="text-xs text-gray-600 block overflow-x-auto">
                                        first_name,middle_name,last_name,email,password,access,position,barangay
                                        <br />
                                        Juan,Dela,Cruz,juan@example.com,password123,officer,Barangay Tanod,Barangay Poblacion
                                    </code>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex justify-between items-center">
                            <a
                                href={route("officer.users.template")}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium"
                            >
                                <FileText className="w-4 h-4 mr-1" />
                                Download Template
                            </a>
                            <div className="flex gap-3">
                                <SecondaryButton
                                    onClick={onCloseModal}
                                    disabled={processing}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing || !selectedFile}
                                >
                                    {processing ? "Importing..." : "Import Users"}
                                </PrimaryButton>
                            </div>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </HeroModal>
    );
}
