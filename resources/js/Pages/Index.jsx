import { Head, Link } from '@inertiajs/react';
import { Shield, AlertTriangle, MapPin, Users, FileText, Megaphone, ArrowRight } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Index() {
    return (
        <GuestLayout >
            <Head title="Home" />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white -mx-4 -mt-8">
                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <Shield size={80} className="text-blue-200" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to SurviveSafe
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8">
                            Barangay Disaster Risk Reduction & Management Office
                        </p>
                        <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
                            Building resilient communities through preparedness, education, and rapid response.
                            Stay informed, stay safe, and help protect your barangay.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/awareness"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                <FileText size={20} />
                                View Awareness Materials
                            </Link>
                            <Link
                                href="/announcements"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors border-2 border-blue-500"
                            >
                                <Megaphone size={20} />
                                Latest Announcements
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white -mx-4">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Our Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive disaster management services to keep our community safe
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <AlertTriangle className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Emergency Response
                            </h3>
                            <p className="text-gray-600">
                                24/7 rapid response team ready to assist during disasters and emergencies
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Safety Education
                            </h3>
                            <p className="text-gray-600">
                                Educational materials and training programs for disaster preparedness
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                <MapPin className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Hazard Mapping
                            </h3>
                            <p className="text-gray-600">
                                Identify and monitor high-risk areas in our barangay
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <Users className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Community Support
                            </h3>
                            <p className="text-gray-600">
                                Building resilience through community engagement and volunteer programs
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 -mx-4">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Stay Prepared, Stay Safe
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Access important safety information and stay updated with the latest announcements
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/awareness"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Learn More
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Contact Section */}
            <section className="py-16 bg-gray-50 -mx-4">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-red-600 text-white rounded-2xl p-8 text-center shadow-xl">
                            <AlertTriangle size={48} className="mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-4">
                                Emergency Hotline
                            </h3>
                            <p className="text-3xl md:text-4xl font-bold mb-2">
                                (02) 8888-0000
                            </p>
                            <p className="text-red-100">
                                Available 24/7 for emergency situations
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
