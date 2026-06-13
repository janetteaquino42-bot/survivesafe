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
        barangay: "",
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
            barangay: [(value) => validateRequired(value, "Barangay")],
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

        post(route("register.updateBarangay"), {
            onFinish: () => {
                console.log('[Register] Request finished');
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
            title="Barangay Registration"
            heading="Choose your Barangay"
            description="Please provide the following details to complete your registration."
        >
            <form onSubmit={submit} className="m-auto flex flex-col p-2 gap-4 justify-center transition-all duration-300 rounded-none shadow-none drop-shadow-none">
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
            </form>
        </AuthLayout>
    );
}
