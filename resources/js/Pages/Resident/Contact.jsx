import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Shield, MapPin, Phone, Mail, Clock, Facebook, Send } from 'lucide-react';
import { useState } from 'react';
import TextInput from '@/Components/Form/TextInput';
import Textarea from '@/Components/Form/Textarea';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import InputError from '@/Components/Form/InputError';
import { useToast, useFlashMessages } from '@/Hooks/useToast';
import { validateEmail, validateRequired, validateForm } from '@/Utils/formValidation';

export default function Contact({ auth, hero, contactInfo, officeHours, socialMedia, mapEmbed }) {
    const toast = useToast();
    const [validationErrors, setValidationErrors] = useState({});

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: `${auth.user.first_name} ${auth.user.last_name}`,
        email: auth.user.email,
        subject: '',
        message: '',
    });

    const validateFormData = () => {
        const rules = {
            subject: [(value) => validateRequired(value, "Subject")],
            message: [(value) => validateRequired(value, "Message")],
        };

        const errors = validateForm(data, rules);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation
        if (!validateFormData()) {
            toast.error('Please fill in all required fields', { duration: 5000 });
            return;
        }

        // Clear validation errors
        setValidationErrors({});
        clearErrors();

        post(route('resident.contact.submit'), {
            onSuccess: () => {
                toast.success('Thank you for your message! We will get back to you soon.');
                setData('subject', '');
                setData('message', '');
            },
            onError: (serverErrors) => {
                toast.validationErrors(serverErrors, { duration: 5000 });
            },
        });
    };

    // Merge server and client validation errors
    const getError = (field) => {
        return validationErrors[field] || errors[field];
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Contact Us - Bacoor DRRMO" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-700 to-slate-600 text-white py-16 overflow-hidden">
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="Contact Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-gray-900/80"></div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 line-clamp-2">Contact Us</h1>
                    <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto line-clamp-3">
                        Get in touch with Bacoor DRRMO for assistance, inquiries, or emergency response
                    </p>
                </div>
            </section>

            {/* Contact Information & Form */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Information Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Emergency Hotline */}
                            <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Phone className="w-8 h-8 animate-pulse" />
                                    <h3 className="text-xl font-bold">Emergency Hotline</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-3xl font-bold">
                                        {contactInfo?.meta?.emergency_hotline || '(046) 417-1234'}
                                    </p>
                                    <p className="text-blue-100 text-sm">Available 24/7 for emergencies</p>
                                </div>
                            </div>

                            {/* Office Location */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Office Location</h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    {contactInfo?.meta?.address || 'BDRRMO Office, City Hall Complex, Bacoor, Cavite'}
                                </p>
                                {mapEmbed?.embed_code ? (
                                    <div
                                        className="rounded-xl overflow-hidden h-48"
                                        dangerouslySetInnerHTML={{ __html: mapEmbed.embed_code }}
                                    />
                                ) : (
                                    <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                                        <div className="text-center text-gray-600">
                                            <MapPin className="w-12 h-12 mx-auto mb-2" />
                                            <p className="text-sm">[Map Placeholder]</p>
                                            <p className="text-xs mt-1">Add map embed in Content Management</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Office Hours */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Office Hours</h3>
                                </div>
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Monday - Friday</span>
                                        <span>{officeHours?.meta?.weekdays || '8:00 AM - 5:00 PM'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Saturday</span>
                                        <span>{officeHours?.meta?.saturday || '8:00 AM - 12:00 PM'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Sunday</span>
                                        <span className="text-blue-600">{officeHours?.meta?.sunday || 'Closed'}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    * Emergency services available 24/7
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Other Contacts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900 font-medium">
                                                {contactInfo?.meta?.email || 'bdrrmo@bacoor.gov.ph'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Telephone</p>
                                            <p className="text-gray-900 font-medium">
                                                {contactInfo?.meta?.telephone || '(046) 123-4567'}
                                            </p>
                                        </div>
                                    </div>
                                    {socialMedia?.meta?.facebook && (
                                        <div className="flex items-center gap-3">
                                            <Facebook className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Facebook</p>
                                                <a
                                                    href={socialMedia.meta.facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Visit our page
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                                    <p className="text-gray-600">
                                        Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <TextInput
                                                label="Your Name"
                                                value={data.name}
                                                placeholder="Juan Dela Cruz"
                                                required
                                                readOnly
                                                className="bg-gray-50"
                                            />
                                            <InputError message={getError('name')} />
                                        </div>
                                        <div>
                                            <TextInput
                                                label="Email Address"
                                                type="email"
                                                value={data.email}
                                                placeholder="juan@example.com"
                                                required
                                                readOnly
                                                className="bg-gray-50"
                                            />
                                            <InputError message={getError('email')} />
                                        </div>
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Subject"
                                            value={data.subject}
                                            onChange={(e) => {
                                                setData('subject', e.target.value);
                                                if (validationErrors.subject) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.subject;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            placeholder="What is this regarding?"
                                            required
                                        />
                                        <InputError message={getError('subject')} />
                                    </div>

                                    <div>
                                        <Textarea
                                            label="Message"
                                            value={data.message}
                                            onChange={(e) => {
                                                setData('message', e.target.value);
                                                if (validationErrors.message) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.message;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            placeholder="Tell us more about your inquiry or concern..."
                                            rows={6}
                                            required
                                        />
                                        <InputError message={getError('message')} />
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> For emergencies, please call our 24/7 hotline at{' '}
                                            <strong>{contactInfo?.meta?.emergency_hotline || '(046) 417-1234'}</strong> instead of using this form.
                                        </p>
                                    </div>

                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        className="w-full md:w-auto"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
