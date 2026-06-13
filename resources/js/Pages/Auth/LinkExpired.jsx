import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';

export default function LinkExpired({ reason }) {
    const getContent = () => {
        switch (reason) {
            case 'expired':
                return {
                    title: 'Link Has Expired',
                    description: 'This password reset link has expired for security reasons.',
                    icon: <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />,
                    iconBg: 'bg-amber-100'
                };
            case 'used':
                return {
                    title: 'Link Already Used',
                    description: 'This password reset link has already been used.',
                    icon: <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />,
                    iconBg: 'bg-amber-100'
                };
            case 'invalid':
                return {
                    title: 'Invalid Link',
                    description: 'This password reset link is invalid or has been tampered with.',
                    icon: <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />,
                    iconBg: 'bg-red-100'
                };
            default:
                return {
                    title: 'Link Error',
                    description: 'There was a problem with your password reset link.',
                    icon: <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />,
                    iconBg: 'bg-gray-100'
                };
        }
    };

    const content = getContent();

    return (
        <AuthLayout
            title={content.title}
            heading={content.title}
            description={content.description}
        >
            {/* Icon */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center mb-8"
            >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 ${content.iconBg} rounded-full flex items-center justify-center mb-4`}>
                    {content.icon}
                </div>
            </motion.div>

            {/* Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 mb-8"
            >
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2">
                        What happened?
                    </h3>
                    {reason === 'expired' && (
                        <p className="text-xs sm:text-sm text-blue-800">
                            Password reset links expire after 60 minutes for security purposes. This helps protect your account from unauthorized access.
                        </p>
                    )}
                    {reason === 'used' && (
                        <p className="text-xs sm:text-sm text-blue-800">
                            This link has already been used to reset your password. Each password reset link can only be used once for security.
                        </p>
                    )}
                    {reason === 'invalid' && (
                        <p className="text-xs sm:text-sm text-blue-800">
                            The link you clicked appears to be invalid or incomplete. This could happen if the link was not copied correctly.
                        </p>
                    )}
                </div>

                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-green-900 mb-2">
                        What should I do?
                    </h3>
                    <p className="text-xs sm:text-sm text-green-800 mb-3">
                        Don't worry! You can request a new password reset link by clicking the button below.
                    </p>
                    <ul className="space-y-1 text-xs sm:text-sm text-green-800">
                        <li>• The new link will be valid for 60 minutes</li>
                        <li>• Make sure to complete the reset process within that time</li>
                        <li>• Check your spam folder if you don't see the email</li>
                    </ul>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
            >
                <Link href={route('password.request')}>
                    <PrimaryButton className="w-full justify-center text-sm sm:text-base">
                        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="ml-2">Request New Reset Link</span>
                    </PrimaryButton>
                </Link>

                <Link
                    href={route('login')}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span>Back to Login</span>
                </Link>
            </motion.div>

            {/* Help Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <p className="text-xs sm:text-sm text-gray-500">
                    Still having issues? Contact{' '}
                    <a href="mailto:bdrrmosurvivesafe@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                        bdrrmosurvivesafe@gmail.com
                    </a>
                </p>
            </motion.div>
        </AuthLayout>
    );
}
