import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Modal as HeroModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import TextInput from "@/Components/Form/TextInput";
import Select from "@/Components/Form/Select";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { useToast } from "@/Hooks/useToast";
import { validateEmail, validateRequired, validateForm } from "@/Utils/formValidation";
import { UserPlus, UserCog } from "lucide-react";

export default function UserModal({ isOpen, onClose, user }) {
    const toast = useToast();
    const [barangays, setBarangays] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        password: "",
        access: "officer",
        position: "",
        custom_position: "",
        barangay: "",
    });

    useEffect(() => {
        fetch('/barangay_list.json')
            .then(response => response.json())
            .then(data => {
                const options = data.barangay_list.map(barangay => ({
                    value: barangay,
                    label: barangay
                }));

                // If editing user with barangay not in list, add it
                if (user?.barangay && !options.find(opt => opt.value === user.barangay)) {
                    options.unshift({ value: user.barangay, label: user.barangay });
                }

                setBarangays(options);
            })
            .catch(error => {
                console.error('Error loading barangay list:', error);
                toast.error('Failed to load barangay list');
            });
    }, [user]);

    useEffect(() => {
        if (user) {
            // Check if position is in the predefined list
            const isPredefinedPosition = positionOptions.some(opt => opt.value === user.position);

            setData({
                first_name: user.first_name || "",
                middle_name: user.middle_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                password: "",
                access: user.access || "officer",
                position: isPredefinedPosition ? user.position : "Other",
                custom_position: isPredefinedPosition ? "" : (user.position || ""),
                barangay: user.barangay || "",
            });
        } else {
            reset();
        }
        clearErrors();
        setValidationErrors({});
    }, [user, isOpen]);

    const accessLevels = [
        { value: "pending", label: "Pending" },
        { value: "resident", label: "Resident" },
        { value: "officer", label: "Officer" },
        { value: "head_officer", label: "Head Officer" },
    ];

    const positionOptions = [
        { value: "", label: "Select Position (for Officers)" },
        { value: "Barangay Captain", label: "Barangay Captain" },
        { value: "Barangay Kagawad", label: "Barangay Kagawad" },
        { value: "Barangay Secretary", label: "Barangay Secretary" },
        { value: "Barangay Treasurer", label: "Barangay Treasurer" },
        { value: "Barangay Tanod", label: "Barangay Tanod" },
        { value: "SK Chairman", label: "SK Chairman" },
        { value: "SK Kagawad", label: "SK Kagawad" },
        { value: "Reporter", label: "Reporter" },
        { value: "Other", label: "Other" },
    ];

    const validateFormData = () => {
        const rules = {
            first_name: [(value) => validateRequired(value, "First name")],
            last_name: [(value) => validateRequired(value, "Last name")],
            email: [validateEmail],
            access: [(value) => validateRequired(value, "Access level")],
            barangay: [(value) => validateRequired(value, "Barangay")],
        };

        // Only validate password if creating new user or if password field is filled
        if (!user || data.password) {
            rules.password = [(value) => validateRequired(value, "Password")];
        }

        // Validate custom position if "Other" is selected
        if ((data.access === "officer" || data.access === "head_officer") && data.position === "Other") {
            rules.custom_position = [(value) => validateRequired(value, "Custom position")];
        }

        const errors = validateForm(data, rules);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const capitalizeWords = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        // Client-side validation
        if (!validateFormData()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setValidationErrors({});

        // Prepare submission data
        const submitData = { ...data };

        // If "Other" is selected, use the custom position with capitalization
        if (data.position === "Other" && data.custom_position) {
            submitData.position = capitalizeWords(data.custom_position);
        }

        // Remove custom_position from submission data
        delete submitData.custom_position;

        if (user) {
            // Update existing user
            put(route("officer.users.update", user.user_id), {
                data: submitData,
                onSuccess: () => {
                    // toast.success("User updated successfully");
                    onClose();
                    reset();
                },
                onError: (serverErrors) => {
                    Object.keys(serverErrors).forEach((key) => {
                        toast.error(serverErrors[key]);
                    });
                },
            });
        } else {
            // Create new user
            post(route("officer.users.store"), {
                data: submitData,
                onSuccess: () => {
                    // toast.success("User created successfully");
                    onClose();
                    reset();
                },
                onError: (serverErrors) => {
                    Object.keys(serverErrors).forEach((key) => {
                        toast.error(serverErrors[key]);
                    });
                },
            });
        }
    };

    // Merge server and client validation errors
    const getError = (field) => {
        return validationErrors[field] || errors[field];
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
                                    {user ? (
                                        <UserCog size={24} className="text-blue-600" />
                                    ) : (
                                        <UserPlus size={24} className="text-blue-600" />
                                    )}
                                </div>
                                <span className="text-lg font-semibold">
                                    {user ? "Edit User" : "Add New User"}
                                </span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {/* Display validation errors */}
                            {(Object.keys(validationErrors).length > 0 || Object.keys(errors).length > 0) && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                        {Object.entries({ ...validationErrors, ...errors }).map(([field, message]) => (
                                            <li key={field}>{message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <div>
                                        <TextInput
                                            label={<>First Name <span className="text-red-500">*</span></>}
                                            value={data.first_name}
                                            onChange={(e) => {
                                                setData("first_name", e.target.value);
                                                if (validationErrors.first_name) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.first_name;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            error={getError("first_name")}
                                        />
                                    </div>

                                    {/* Middle Name */}
                                    <div>
                                        <TextInput
                                            label="Middle Name"
                                            value={data.middle_name}
                                            onChange={(e) => setData("middle_name", e.target.value)}
                                            error={errors.middle_name}
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <TextInput
                                            label={<>Last Name <span className="text-red-500">*</span></>}
                                            value={data.last_name}
                                            onChange={(e) => {
                                                setData("last_name", e.target.value);
                                                if (validationErrors.last_name) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.last_name;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            error={getError("last_name")}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <TextInput
                                            label={<>Email <span className="text-red-500">*</span></>}
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => {
                                                setData("email", e.target.value);
                                                if (validationErrors.email) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.email;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            error={getError("email")}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <TextInput
                                            label={
                                                user ? (
                                                    "Password (optional)"
                                                ) : (
                                                    <>Password <span className="text-red-500">*</span></>
                                                )
                                            }
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => {
                                                setData("password", e.target.value);
                                                if (validationErrors.password) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.password;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            error={getError("password")}
                                            placeholder={user ? "Leave blank to keep current password" : "Enter password"}
                                        />
                                        {user && (
                                            <p className="text-xs text-gray-500 mt-1">Leave empty if you don't want to change the password</p>
                                        )}
                                        {!user && (
                                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters required</p>
                                        )}
                                    </div>

                                    {/* Access Level */}
                                    <div>
                                        <Select
                                            label={<>Access Level <span className="text-red-500">*</span></>}
                                            value={data.access}
                                            onChange={(value) => {
                                                setData("access", value);
                                                if (validationErrors.access) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.access;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            options={accessLevels}
                                            error={getError("access")}
                                        />
                                    </div>

                                    {/* Position */}
                                    {(data.access === "officer" || data.access === "head_officer") && (
                                        <>
                                            <div>
                                                <Select
                                                    label="Position"
                                                    value={data.position}
                                                    onChange={(value) => {
                                                        setData("position", value);
                                                        // Clear custom position when changing from "Other"
                                                        if (value !== "Other") {
                                                            setData("custom_position", "");
                                                        }
                                                        if (validationErrors.position) {
                                                            const newErrors = { ...validationErrors };
                                                            delete newErrors.position;
                                                            setValidationErrors(newErrors);
                                                        }
                                                    }}
                                                    options={positionOptions}
                                                    error={getError("position")}
                                                />
                                            </div>

                                            {/* Custom Position Input - shown when "Other" is selected */}
                                            {data.position === "Other" && (
                                                <div>
                                                    <TextInput
                                                        label={<>Specify Position <span className="text-red-500">*</span></>}
                                                        value={data.custom_position}
                                                        onChange={(e) => {
                                                            setData("custom_position", e.target.value);
                                                            if (validationErrors.custom_position) {
                                                                const newErrors = { ...validationErrors };
                                                                delete newErrors.custom_position;
                                                                setValidationErrors(newErrors);
                                                            }
                                                        }}
                                                        error={getError("custom_position")}
                                                        placeholder="Enter custom position"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Barangay */}
                                    <div className={(data.access === "officer" || data.access === "head_officer") && data.position !== "Other" ? "" : "md:col-span-2"}>
                                        <Select
                                            label={<>Barangay <span className="text-red-500">*</span></>}
                                            value={data.barangay}
                                            onChange={(value) => {
                                                setData("barangay", value);
                                                if (validationErrors.barangay) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.barangay;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            options={barangays}
                                            error={getError("barangay")}
                                        />
                                    </div>
                                </div>

                                {/* Auto-verify notice */}
                                {(data.access === "officer" || data.access === "head_officer") && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> Email will be automatically verified for officers. No verification email will be sent.
                                        </p>
                                    </div>
                                )}
                            </div>
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
                                disabled={processing}
                            >
                                {processing ? "Saving..." : user ? "Update User" : "Create User"}
                            </PrimaryButton>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </HeroModal>
    );
}
