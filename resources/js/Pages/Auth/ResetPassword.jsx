import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import PasswordInput from '@/Components/Form/PasswordInput';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import LoadingSVG from '@/Components/Buttons/LoadingSVG';
import { useFlashMessages, useToast } from '@/Hooks/useToast';
import { validatePassword, validatePasswordConfirmation, validateForm } from '@/Utils/formValidation';
import InputError from '@/Components/Form/InputError';

export default function ResetPassword({ token, email }) {
    // useFlashMessages();
    const toast = useToast();
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const validateFormData = () => {
        const rules = {
            password: [validatePassword],
            password_confirmation: [(value) => validatePasswordConfirmation(data.password, value)],
        };

        const errors = validateForm(data, rules);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        // Client-side validation
        if (!validateFormData()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setValidationErrors({});

        post(route('password.store'), {
            onError: (serverErrors) => {
                Object.keys(serverErrors).forEach(field => {
                    toast.error(serverErrors[field]);
                });
            }
        });
    };

    const getError = (field) => {
        return validationErrors[field] || errors[field];
    };

    return (
        <AuthLayout
            title="Reset Password"
            heading="Create New Password"
            description="Your new password must be different from previously used passwords."
        >
            {/* Lock Icon */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center mb-8"
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
            </motion.div>

            {/* Information Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
            >
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2">
                        Password Requirements:
                    </h3>
                    <ul className="space-y-1 text-xs sm:text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>At least 8 characters long</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Must include uppercase and lowercase letters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Must include at least one number</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Must include a special character</span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Hidden email field for accessibility */}
            <input type="email" value={email} autoComplete="username" readOnly hidden />

            {/* Form */}
            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
            >
                <div>
                    <PasswordInput
                        id="password"
                        label="New Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter your new password"
                        autoFocus
                        autoComplete="new-password"
                        showStrengthIndicator
                    />
                    <InputError message={getError('password')} />
                </div>

                <div>
                    <PasswordInput
                        id="password_confirmation"
                        label="Confirm New Password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                    />
                    <InputError message={getError('password_confirmation')} />
                </div>

                <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="w-full justify-center text-sm sm:text-base"
                >
                    {processing ? (
                        <>
                            <LoadingSVG className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Resetting Password...</span>
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Reset Password</span>
                        </>
                    )}
                </PrimaryButton>
            </motion.form>

            {/* Security Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
            >
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-amber-900 mb-1">
                        🔒 Security Notice
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-800">
                        After resetting your password, you'll be logged out of all devices for security. Please log in again with your new password.
                    </p>
                </div>
            </motion.div>

            {/* Help Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
            >
                <p className="text-xs sm:text-sm text-gray-500">
                    Need help? Contact{' '}
                    <a href="mailto:bdrrmosurvivesafe@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                        bdrrmosurvivesafe@gmail.com
                    </a>
                </p>
            </motion.div>
        </AuthLayout>
    );
}
