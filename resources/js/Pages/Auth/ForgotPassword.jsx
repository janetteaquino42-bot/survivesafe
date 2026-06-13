import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import EmailInput from '@/Components/Form/EmailInput';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import LoadingSVG from '@/Components/Buttons/LoadingSVG';
import { useFlashMessages, useToast } from '@/Hooks/useToast';
import { validateEmail, validateForm } from '@/Utils/formValidation';
import InputError from '@/Components/Form/InputError';

export default function ForgotPassword({ status }) {
    // useFlashMessages();
    const toast = useToast();
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
    });

    const validateFormData = () => {
        const rules = {
            email: [validateEmail],
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
            toast.error('Please enter a valid email address');
            return;
        }

        setValidationErrors({});

        post(route('password.email'), {
            onError: (serverErrors) => {
                if (serverErrors.email) {
                    toast.error(serverErrors.email);
                }
            }
        });
    };

    const getError = (field) => {
        return validationErrors[field] || errors[field];
    };

    return (
        <AuthLayout
            title="Forgot Password"
            heading="Forgot Your Password?"
            description="No worries! Enter your email address and we'll send you a link to reset your password."
        >
            {/* Success Message */}
            {status && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-800">
                            Password reset link sent! Please check your email.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Email Icon and Main Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center mb-8"
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
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
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-1">
                                Password Reset Process
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-800">
                                Enter your registered email address below. We'll send you a secure link to create a new password. The link will be valid for 60 minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
            >
                <div>
                    <EmailInput
                        id="email"
                        label="Email Address"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter your registered email"
                        autoFocus
                    />
                    <InputError message={getError('email')} />
                </div>

                <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="w-full justify-center text-sm sm:text-base"
                >
                    {processing ? (
                        <>
                            <LoadingSVG className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Sending Reset Link...</span>
                        </>
                    ) : (
                        <>
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Send Reset Link</span>
                        </>
                    )}
                </PrimaryButton>

                <Link
                    href={route('login')}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span>Back to Login</span>
                </Link>
            </motion.form>

            {/* Help Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign up here
                    </Link>
                </p>
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
