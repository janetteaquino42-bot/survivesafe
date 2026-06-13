import { useForm } from "@inertiajs/react";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";

import AuthLayout from "@/Layouts/AuthLayout";
import InputError from "@/Components/Form/InputError";
import InputLabel from "@/Components/Form/InputLabel";

import { useFlashMessages, useToast } from '@/Hooks/useToast';
import TextInput from "@/Components/Form/TextInput";
import EmailInput from "@/Components/Form/EmailInput";
import PasswordInput from "@/Components/Form/PasswordInput";
import Select from "@/Components/Form/Select";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import LoadingSVG from "@/Components/Buttons/LoadingSVG";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";

import {
    validateEmail,
    validateRequired,
    validatePassword,
    validatePasswordConfirmation,
    validateForm
} from "@/Utils/formValidation";

export default function Register() {
    // useFlashMessages();
    const toast = useToast();
    const [barangays, setBarangays] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        barangay: "",
        password: "",
        password_confirmation: "",
    });

    // Fetch barangay list
    useEffect(() => {
        fetch('/barangay_list.json')
            .then(response => response.json())
            .then(data => {
                const options = data.barangay_list.map(barangay => ({
                    value: barangay,
                    label: barangay
                }));
                setBarangays(options);
            })
            .catch(error => {
                console.error('Error loading barangay list:', error);
                toast.error('Failed to load barangay list');
            });
    }, []);

    const validateFormData = () => {
        const rules = {
            first_name: [(value) => validateRequired(value, "First name")],
            last_name: [(value) => validateRequired(value, "Last name")],
            email: [validateEmail],
            barangay: [(value) => validateRequired(value, "Barangay")],
            password: [validatePassword],
            password_confirmation: [(value) => validatePasswordConfirmation(data.password, value)]
        };

        const errors = validateForm(data, rules);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();

        console.log('[Register] Form submitted', { data, processing });

        // Client-side validation
        if (!validateFormData()) {
            console.log('[Register] Client validation failed', validationErrors);
            toast.error('Please fix the errors in the form', { duration: 5000 });
            return;
        }

        // Clear ALL validation errors (both client and server)
        setValidationErrors({});
        clearErrors(); // Clear Inertia's server errors
        console.log('[Register] Client validation passed');
        console.log('[Register] Starting registration request...');

        post(route("register"), {
            onFinish: () => {
                console.log('[Register] Request finished');
                reset("password", "password_confirmation");
            },
            onSuccess: () => {
                console.log('[Register] Registration successful');
            },
            onError: (serverErrors) => {
                console.log('[Register] Server validation errors:', serverErrors);
                toast.validationErrors(serverErrors, {
                    duration: 5000,
                });
            },
        });
    };

    // Merge server and client validation errors
    const getError = (field) => {
        return validationErrors[field] || errors[field];
    };

    return (
        <AuthLayout
            title="Register"
            heading="Create Your Account"
            description="Join BDRRMO and help build a safer community together."
        >
            <form onSubmit={submit} className="m-auto flex flex-col p-2 gap-4 justify-center transition-all duration-300 rounded-none shadow-none drop-shadow-none">
                {/* First Name */}
                <div className="w-full">
                    <TextInput
                        name="first_name"
                        value={data.first_name}
                        onChange={(e) => {
                            setData("first_name", e.target.value);
                            if (validationErrors.first_name) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.first_name;
                                setValidationErrors(newErrors);
                            }
                        }}
                        placeholder="Enter your first name"
                        error={getError("first_name")}
                        label="First Name"
                        required
                    />
                    <InputError message={getError("first_name")} />

                </div>

                {/* Middle Name */}
                <div className="w-full">
                    <TextInput
                        name="middle_name"
                        value={data.middle_name}
                        onChange={(e) => setData("middle_name", e.target.value)}
                        placeholder="Enter your middle name"
                        label="Middle Name"
                    />
                    <InputError message={getError("middle_name")} />
                </div>

                {/* Last Name */}
                <div className="w-full">
                    <TextInput
                        name="last_name"
                        value={data.last_name}
                        onChange={(e) => {
                            setData("last_name", e.target.value);
                            if (validationErrors.last_name) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.last_name;
                                setValidationErrors(newErrors);
                            }
                        }}
                        placeholder="Enter your last name"
                        label="Last Name"
                        required
                    />
                    <InputError message={getError("last_name")} />
                </div>

                {/* Email */}
                <div className="w-full">
                    <EmailInput
                        name="email"
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                            if (validationErrors.email) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.email;
                                setValidationErrors(newErrors);
                            }
                        }}
                        label="Email Address"
                    />
                    <InputError message={getError("email")} />
                </div>

                {/* Barangay */}
                <div className="w-full">
                    <InputLabel htmlFor="barangay" required>Barangay</InputLabel>
                    <Select
                        name="barangay"
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
                        placeholder="Select your barangay"
                        label=""
                        aria-label="Select your barangay"
                    />
                    <InputError message={getError("barangay")} />
                </div>

                {/* Password */}
                <div className="w-full">
                    <PasswordInput
                        name="password"
                        value={data.password}
                        onChange={(e) => {
                            setData("password", e.target.value);
                            if (validationErrors.password) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.password;
                                setValidationErrors(newErrors);
                            }
                        }}
                        showStrengthIndicator
                        label="Password"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium mb-1">Password must contain:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter (A-Z)</li>
                            <li>One lowercase letter (a-z)</li>
                            <li>One number (0-9)</li>
                        </ul>
                    </div>
                    <InputError message={getError("password")} />
                </div>

                {/* Confirm Password */}
                <div className="w-full">
                    <PasswordInput
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => {
                            setData("password_confirmation", e.target.value);
                            if (validationErrors.password_confirmation) {
                                const newErrors = { ...validationErrors };
                                delete newErrors.password_confirmation;
                                setValidationErrors(newErrors);
                            }
                        }}
                        label="Confirm Password"
                        placeholder="Confirm your password"
                    />
                    <InputError message={getError("password_confirmation")} />
                </div>

                <PrimaryButton
                    type="submit"
                    className="mt-6 w-full"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <LoadingSVG />
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </PrimaryButton>

                <div className="flex items-center gap-4 w-full mt-4">
                    <hr className="flex-1 border-gray-300" />
                    <p className="text-sm text-gray-500 whitespace-nowrap">Or continue with</p>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <SecondaryButton
                    className="text-sm border space-x-2 inline-flex justify-center items-center px-2 py-2 font-normal w-full"
                    onClick={() => {
                        window.location.href = route("auth.google.redirect");
                    }}
                >
                    <FcGoogle className="mr-2" />
                    Sign Up with Google
                </SecondaryButton>

                <div className="text-center mt-4 w-full text-gray-500">
                    Already have an account?{" "}
                    <LinkButton href={route('login')} className="font-medium">
                        Login
                    </LinkButton>
                </div>
            </form>
        </AuthLayout>
    );
}
