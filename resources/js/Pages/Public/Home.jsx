import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Shield, AlertTriangle, Phone, Megaphone, TrendingUp, MapPin, Clock, Users } from 'lucide-react';
import { getIncidentTypeConfig, getIncidentSeverityConfig } from '@/Utils/incidentHelper';
import { getIcon } from '@/Utils/iconHelper';

export default function Home({ hero, services, emergency, announcements, recentIncidents }) {
    return (
        <GuestLayout>
            <Head title="Home" />

            {/* Hero Section with Image Backdrop */}
            <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-gray-600 text-white py-20 overflow-hidden">
                {/* Background Image */}
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-gray-900/80"></div>
                    </div>
                )}
                {!hero?.images && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                            <div className="text-center text-gray-400 opacity-30">
                                <Shield className="w-48 h-48 mx-auto mb-4" />
                                <p className="text-lg font-medium">[Hero Background Image]</p>
                                <p className="text-sm mt-2">1920x600px recommended</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Shield className="w-5 h-5" />
                                <span className="font-semibold">Official BDRRMO Portal</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight line-clamp-3">
                                {hero?.title || 'Bacoor Disaster Risk Reduction & Management Office'}
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl mb-8 text-blue-50 leading-relaxed line-clamp-4">
                                {hero?.content || 'Committed to protecting lives, properties, and promoting disaster resilience in the City of Bacoor, Cavite.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/announcements"
                                    className="bg-blue-800/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800/70 transition inline-flex items-center gap-2 border border-white/30"
                                >
                                    <Megaphone className="w-5 h-5" />
                                    View Announcements
                                </Link>
                                <Link
                                    href="/contact"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition inline-flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M21.75 5.25a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 5.25v13.5A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V5.25Zm-2.25.75L12 12.525 4.5 6v-.75h15v.75Zm0 12H4.5a.75.75 0 0 1-.75-.75V7.574l8.1 6.075a1.5 1.5 0 0 0 1.8 0L21.75 7.574V17.25a.75.75 0 0 1-.75.75Zm-10.5-6.975L4.5 6.788v10.962l6.75-5.175Zm1.5.675 6.75 5.175V6.788l-6.75 4.712Z" />
                                    </svg>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            {hero?.images && hero.images.length > 0 ? (
                                <div className="aspect-video rounded-xl overflow-hidden">
                                    <img
                                        src={`/storage/${hero.images[hero.images.length > 1 ? 1 : 0]}`}
                                        alt="BDRRMO Command Center"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <Shield className="w-24 h-24 mx-auto mb-4 opacity-50" />
                                        <p className="text-white/70 font-medium">[Hero Image Placeholder]</p>
                                        <p className="text-white/50 text-sm mt-2">BDRRMO Command Center</p>
                                        <p className="text-white/40 text-xs mt-1">800x450px recommended</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Hotline Banner */}
            <section className="bg-blue-900 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Phone className="w-6 h-6 animate-pulse" />
                            <span className="font-bold text-lg">Emergency Hotline:</span>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-6 text-center md:text-left">
                            <div>
                                <p className="text-blue-200 text-sm">Bacoor DRRMO</p>
                                <p className="text-2xl font-bold">
                                    {emergency?.meta?.hotline || '(046) 417-1234'}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-blue-700 hidden md:block"></div>
                            <div>
                                <p className="text-blue-200 text-sm">Bacoor Emergency</p>
                                <p className="text-2xl font-bold">
                                    {emergency?.meta?.bacoor_hotline || '161'}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-blue-700 hidden md:block"></div>
                            <div>
                                <p className="text-blue-200 text-sm">National Emergency</p>
                                <p className="text-2xl font-bold">{emergency?.meta?.national_emergency || '911'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 line-clamp-2">Our Services</h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 line-clamp-2 sm:w-2/3 mx-auto">Helps LGUs and residents collaborate by marking hazard zones, sending verified alerts,and promoting disaster awareness — creating a safer, more resilient community.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services && services.length > 0 ? (
                            services.map((service, index) => {
                                const IconComponent = service.meta?.icon ? getIcon(service.meta.icon) : Shield;
                                return (
                                    <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition border-t-4 border-blue-600">
                                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                            <IconComponent className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{service.content}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition border-t-4 border-blue-600">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                        <AlertTriangle className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Response</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        24/7 rapid response team ready to assist during disasters and emergencies across all barangays in Bacoor.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition border-t-4 border-blue-600">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                        <Users className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Community Preparedness</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Training programs and drills to educate citizens on disaster preparedness and response protocols.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition border-t-4 border-blue-600">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                        <MapPin className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Hazard Mapping</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Comprehensive mapping and monitoring of disaster-prone areas to enhance community safety.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Recent Incidents & Announcements */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Recent Incidents */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Active Incidents</h2>
                                <Link href="/hazard-map" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentIncidents && recentIncidents.length > 0 ? (
                                    recentIncidents.map((incident, index) => {
                                        const typeConfig = getIncidentTypeConfig(incident.type);
                                        const severityConfig = getIncidentSeverityConfig(incident.severity);
                                        const TypeIcon = typeConfig.icon;

                                        return (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4" style={{ borderColor: severityConfig.color }}>
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className="p-2 rounded-lg"
                                                        style={{ backgroundColor: typeConfig.bgColor }}
                                                    >
                                                        <TypeIcon size={20} style={{ color: typeConfig.color }} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-gray-900 capitalize">{incident.type}</span>
                                                            <span
                                                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                                style={{
                                                                    backgroundColor: severityConfig.bgColor,
                                                                    color: severityConfig.color
                                                                }}
                                                            >
                                                                {incident.severity}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            {incident.barangay}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">{incident.created_at}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="bg-green-50 rounded-lg p-6 text-center border border-green-200">
                                        <p className="text-green-800 font-medium">No active incidents at this time</p>
                                        <p className="text-green-600 text-sm mt-1">Stay safe and prepared!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Latest Announcements */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Latest Announcements</h2>
                                <Link href="/announcements" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {announcements && announcements.length > 0 ? (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition">
                                            <div className="flex items-start gap-3 mb-2">
                                                <Megaphone className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                                                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {announcement.created_at}
                                                        </span>
                                                        <Link
                                                            href={`/announcements/${announcement.id}`}
                                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            Read More →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                                        <p className="text-gray-600">No announcements at this time</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
