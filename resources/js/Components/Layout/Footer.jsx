import { Link } from "@inertiajs/react";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer({
    siteName = "BDRRMO",
    description = "Community Incident Reporting & Hazard Mapping System",
    links = [],
    socialLinks = [],
    contactInfo = {},
    className = "",
}) {
    const defaultLinks = [
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
    ];

    const defaultSocialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
    ];

    const displayLinks = links.length > 0 ? links : defaultLinks;
    const displaySocialLinks = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

    return (
        <footer className={`bg-gray-900 text-gray-300 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-blue-400 mb-3">
                            {siteName}
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-md leading-relaxed">{description}</p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {displaySocialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-gray-800 rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                        aria-label={social.label}
                                    >
                                        <Icon size={20} className="text-white" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            {displayLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-blue-400 transition-colors inline-flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 mr-0 group-hover:mr-2 transition-all"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            {contactInfo.email && (
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                                        <Mail size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <a
                                            href={`mailto:${contactInfo.email}`}
                                            className="hover:text-blue-400 transition-colors break-all"
                                        >
                                            {contactInfo.email}
                                        </a>
                                    </div>
                                </li>
                            )}
                            {contactInfo.phone && (
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                                        <Phone size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <a
                                            href={`tel:${contactInfo.phone}`}
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            {contactInfo.phone}
                                        </a>
                                    </div>
                                </li>
                            )}
                            {contactInfo.address && (
                                <li className="flex items-start gap-3 group">
                                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                                        <MapPin size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <span>{contactInfo.address}</span>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-10 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
