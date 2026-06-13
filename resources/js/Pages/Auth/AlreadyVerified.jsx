import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, LogIn } from 'lucide-react';

import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import { usePage } from '@inertiajs/react';

export default function AlreadyVerified() {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;

    return (
        <AuthLayout
            title="Email Already Verified"
            heading="Already Verified!"
            description="Good news! Your email address has already been verified."
        >
            {/* Success Icon */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center text-center mb-8"
            >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </div>
            </motion.div>

            {/* Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 mb-8"
            >
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-green-900 mb-2">
                        ✓ Your Email is Verified
                    </h3>
                    <p className="text-xs sm:text-sm text-green-800">
                        Your email address was verified previously. You have full access to all features of your BACOOR DRRMO account.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2">
                        What can you do now?
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                            <span>Access all community features and resources</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                            <span>View announcements and awareness materials</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                            <span>Report incidents and emergencies</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                            <span>Receive important safety notifications</span>
                        </li>
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
                {isLoggedIn ? (
                    <Link href={route('dashboard')}>
                        <PrimaryButton className="w-full justify-center text-sm sm:text-base">
                            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Go to Dashboard</span>
                        </PrimaryButton>
                    </Link>
                ) : (
                    <Link href={route('login')}>
                        <PrimaryButton className="w-full justify-center text-sm sm:text-base">
                            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">Login to Your Account</span>
                        </PrimaryButton>
                    </Link>
                )}

                <Link
                    href={route('home')}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span>Back to Home</span>
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
                    Having issues? Contact{' '}
                    <a href="mailto:bdrrmosurvivesafe@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                        bdrrmosurvivesafe@gmail.com
                    </a>
                </p>
            </motion.div>
        </AuthLayout>
    );
}
