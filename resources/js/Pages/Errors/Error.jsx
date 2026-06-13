import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { AlertTriangle, Home, Lock, FileQuestion, ServerCrash } from "lucide-react";

export default function Error({ status }) {
    const errorConfig = {
        401: {
            title: "401 - Unauthorized",
            message: "Unauthorized Access",
            description: "You must be logged in to access this page. Please log in and try again.",
            icon: Lock,
        },
        403: {
            title: "403 - Access Forbidden",
            message: "Sorry, you don't have permission to access this page.",
            description: "You are not authorized to view this resource. If you believe this is a mistake, please contact the administrator.",
            icon: Lock,
        },
        404: {
            title: "404 - Page Not Found",
            message: "Oops! The page you're looking for doesn't exist.",
            description: "The page you are trying to access may have been moved, deleted, or never existed. Please check the URL or return to the home page.",
            icon: FileQuestion,
        },
        500: {
            title: "500 - Server Error",
            message: "Something went wrong on our end.",
            description: "We're experiencing technical difficulties. Our team has been notified and is working to fix the issue. Please try again later.",
            icon: ServerCrash,
        },
        503: {
            title: "503 - Service Unavailable",
            message: "The service is temporarily unavailable.",
            description: "We're currently performing maintenance or experiencing high traffic. Please check back in a few minutes.",
            icon: AlertTriangle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    };

    const config = errorConfig[status] || errorConfig[500];
    const Icon = config.icon;

    return (
        <GuestLayout>
            <Head title={config.title} />

            <div className="minflex items-center justify-center px-4 pt-12">
                <div className="max-w-2xl w-full text-center mx-auto">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-8`}>
                        <Icon className={`w-12 h-12 text-blue-600`} />
                    </div>

                    {/* Status Code */}
                    <h1 className={`text-8xl font-bold text-blue-600 mb-4`}>
                        {status}
                    </h1>

                    {/* Error Message */}
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                        {config.message}
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                        {config.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/">
                            <PrimaryButton className="inline-flex items-center">
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </PrimaryButton>
                        </Link>

                        {status !== 500 && status !== 503 && (
                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Go Back
                            </button>
                        )}
                    </div>

                    {/* Additional Help */}
                    {(status === 500 || status === 503) && (
                        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                Need immediate assistance?
                            </h3>
                            <p className="text-sm text-gray-600">
                                If this problem persists, please contact our support team with the error code <span className="font-mono font-semibold">{status}</span>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
