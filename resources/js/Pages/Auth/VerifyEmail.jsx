import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import LoadingSVG from '@/Components/Buttons/LoadingSVG';
import { useFlashMessages, useToast } from '@/Hooks/useToast';

export default function VerifyEmail({ status }) {
    // useFlashMessages();
    const toast = useToast();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () => {
                toast.success('Verification link sent! Please check your email.');
            },
            onError: () => {
                toast.error('Failed to send verification email. Please try again.');
            }
        });
    };

    return (
        <AuthLayout
            title="Verify Email"
            heading="Verify Your Email"
            description="We've sent a verification link to your email address. Please check your inbox to activate your account."
        >
            {/* Success Message */}
            {status === 'verification-link-sent' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-800">
                            A new verification link has been sent to your email address.
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

                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Check Your Email
                </h2>

                <p className="text-sm sm:text-base text-gray-600 max-w-md text-balance">
                    Before getting started, please verify your email address by clicking on the link we just emailed to you. This helps us ensure the security of your account.
                </p>
            </motion.div>

            {/* Information Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mb-8"
            >
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2">
                        What to do next:
                    </h3>
                    <ol className="space-y-2 text-xs sm:text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                            <span>Open your email inbox</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                            <span>Find the verification email from BDRRMO</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                            <span>Click the verification link to activate your account</span>
                        </li>
                    </ol>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-amber-900 mb-2">
                        Didn't receive the email?
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-800 mb-3">
                        Check your spam or junk folder. If you still can't find it, click the button below to resend the verification email.
                    </p>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
            >
                <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="w-full justify-center text-sm sm:text-base"
                >
                    {processing ? (
                        <>
                            <LoadingSVG className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Sending...</span>
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Resend Verification Email</span>
                        </>
                    )}
                </PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <span>Sign Out</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
            </motion.form>

            {/* Help Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
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
