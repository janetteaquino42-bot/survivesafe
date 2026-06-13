import { Head, Link, useForm, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Shield, MapPin, Phone, Mail, Clock, Facebook, Send, AlertTriangle, ArrowRight, Flame, Droplets, Home } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import TextInput from '@/Components/Form/TextInput';
import Textarea from '@/Components/Form/Textarea';
import Select from '@/Components/Form/Select';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import InputError from '@/Components/Form/InputError';
import { useToast, useFlashMessages } from '@/Hooks/useToast';
import { validateEmail, validateRequired, validateForm } from '@/Utils/formValidation';
import StatusBadge from '@/Components/Status/StatusBadge';
import { getIncidentTypeConfig } from '@/Utils/incidentHelper';

export default function Contact({ hero, contactInfo, officeHours, socialMedia, mapEmbed, incidents = [] }) {
    const toast = useToast();
    const [validationErrors, setValidationErrors] = useState({});
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    
    // Report incident form state
    const [reportIncidentErrors, setReportIncidentErrors] = useState({});
    const [barangayList, setBarangayList] = useState([]);
    const [reportIncidentMapRef, setReportIncidentMapRef] = useState(null);
    const [reportIncidentMapInstance, setReportIncidentMapInstance] = useState(null);
    const [reportIncidentMarker, setReportIncidentMarker] = useState(null);
    const [reportIncidentMapLoaded, setReportIncidentMapLoaded] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [reportProcessing, setReportProcessing] = useState(false);
    const reportMapRef = useRef(null);
    const reportMapInstanceRef = useRef(null);
    const reportMarkerRef = useRef(null);
    const barangayListRef = useRef([]);

    const [reportData, setReportData] = useState({
        type: '',
        barangay: '',
        latitude: '',
        longitude: '',
        severity: '',
        description: '',
    });

    const resetReport = () => {
        setReportData({
            type: '',
            barangay: '',
            latitude: '',
            longitude: '',
            severity: '',
            description: '',
        });
    };

    // Load Leaflet for the hazard map preview
    useEffect(() => {
        const loadLeaflet = async () => {
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (!window.L) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                document.head.appendChild(script);

                script.onload = () => {
                    setMapLoaded(true);
                };
            } else {
                setMapLoaded(true);
            }
        };

        loadLeaflet();
    }, []);

    // Initialize and update map with incidents
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

        const L = window.L;

        // Initialize map centered on Bacoor
        const map = L.map(mapRef.current, {
            center: [14.4326, 120.979057],
            zoom: 13,
            zoomControl: true,
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [mapLoaded]);

    // Add incident markers to map
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L || !incidents || incidents.length === 0) return;

        const L = window.L;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for incidents
        incidents.forEach(incident => {
            if (!incident.latitude || !incident.longitude) return;

            const typeConfig = getIncidentTypeConfig(incident.type);
            const color = typeConfig.color;

            const iconMap = {
                fire: '🔥',
                flood: '💧',
                earthquake: '🏔️',
                landslide: '⛰️'
            };
            const iconSymbol = iconMap[incident.type] || '⚠️';

            const iconHtml = `
                <div class="leaflet-marker-pin" style="
                    background-color: ${color};
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">
                    <div style="
                        font-size: 18px;
                        transform: rotate(45deg);
                        font-weight: normal;
                        color: white;
                        line-height: 1;
                    ">${iconSymbol}</div>
                </div>
            `;

            const divIcon = L.divIcon({
                html: iconHtml,
                className: '',
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            });

            const marker = L.marker([incident.latitude, incident.longitude], {
                icon: divIcon
            });

            marker.on('add', function () {
                const markerElement = marker.getElement();
                if (markerElement) {
                    const pinDiv = markerElement.querySelector('.leaflet-marker-pin');
                    if (pinDiv) {
                        markerElement.addEventListener('mouseenter', () => {
                            pinDiv.style.transform = 'rotate(-45deg) scale(1.15)';
                            pinDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                        });
                        markerElement.addEventListener('mouseleave', () => {
                            pinDiv.style.transform = 'rotate(-45deg) scale(1)';
                            pinDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                        });
                    }
                }
            });

            marker.addTo(mapInstanceRef.current);
            markersRef.current.push(marker);
        });

        // Fit bounds if there are incidents
        if (incidents.length > 0) {
            const bounds = incidents
                .filter(i => i.latitude && i.longitude)
                .map(i => [i.latitude, i.longitude]);

            if (bounds.length > 0) {
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [incidents, mapLoaded]);

    // Load barangay list
    useEffect(() => {
        fetch('/barangay_list.json')
            .then(res => res.json())
            .then(data => {
                const list = data.barangay_list || [];
                setBarangayList(list);
                barangayListRef.current = list;
            })
            .catch(err => console.error('Failed to load barangay list:', err));
    }, []);

    // Initialize report incident map
    useEffect(() => {
        // Load Leaflet CSS if not already loaded
        if (!document.getElementById('leaflet-css-report')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css-report';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS if not already loaded
        if (!window.L) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = () => {
                setReportIncidentMapLoaded(true);
            };
            document.body.appendChild(script);
        } else {
            setReportIncidentMapLoaded(true);
        }
    }, []);

    // Initialize and setup report incident map
    useEffect(() => {
        if (!reportIncidentMapLoaded || !reportMapRef.current || reportMapInstanceRef.current) return;

        const L = window.L;

        // Initialize map
        const map = L.map(reportMapRef.current, {
            center: [14.4326, 120.979057],
            zoom: 13,
            zoomControl: true,
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Handle map clicks to place marker
        const handleMapClick = async (e) => {
            const { lat, lng } = e.latlng;

            // Remove existing marker
            if (reportMarkerRef.current && map) {
                map.removeLayer(reportMarkerRef.current);
            }

            // Create new marker
            const marker = L.marker([lat, lng], {
                draggable: false,
            }).addTo(map);

            reportMarkerRef.current = marker;

            // Set coordinates
            setReportData(prev => ({
                ...prev,
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6),
            }));

            // Fetch barangay name
            await fetchBarangayNameForReport(lat, lng);
        };

        map.on('click', handleMapClick);

        reportMapInstanceRef.current = map;

        return () => {
            if (reportMapInstanceRef.current) {
                reportMapInstanceRef.current.remove();
                reportMapInstanceRef.current = null;
            }
        };
    }, [reportIncidentMapLoaded]);

    const fetchBarangayNameForReport = async (lat, lng) => {
        setLoadingLocation(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const address = data.address;

                // Validate location is in Bacoor
                const city = address.city || address.municipality || '';
                if (city.toUpperCase() !== 'BACOOR') {
                    toast.error('Location must be in Bacoor, Cavite. Please select a location within Bacoor.');
                    if (reportMarkerRef.current && reportMapInstanceRef.current) {
                        reportMapInstanceRef.current.removeLayer(reportMarkerRef.current);
                        reportMarkerRef.current = null;
                    }
                    setReportData(prev => ({
                        ...prev,
                        latitude: '',
                        longitude: '',
                        barangay: '',
                    }));
                    return;
                }

                // Extract barangay name
                const locationName = address.quarter || address.suburb || address.neighbourhood || address.village || address.city_district || '';

                let matchedBarangay = '';
                if (locationName && barangayListRef.current.length > 0) {
                    let upperLocation = locationName.toUpperCase();

                    // Handle former barangay names
                    const romanNumerals = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII' };
                    const panapaan = upperLocation.match(/PANAPAAN\s*(\d)/i);
                    if (panapaan) {
                        const romanNum = romanNumerals[panapaan[1]];
                        upperLocation = `P.F. ESPIRITU ${romanNum}`;
                    } else if (upperLocation.includes('PANAPAAN')) {
                        upperLocation = upperLocation.replace(/PANAPAAN/g, 'P.F. ESPIRITU');
                    }

                    if (upperLocation.includes('POBLACION')) {
                        upperLocation = 'KAINGIN (POB.)';
                    }

                    matchedBarangay = barangayListRef.current.find(brgy => brgy === upperLocation) || '';

                    if (!matchedBarangay) {
                        matchedBarangay = barangayListRef.current.find(brgy =>
                            brgy.includes(upperLocation) ||
                            upperLocation.includes(brgy) ||
                            brgy.includes(upperLocation.replace(/\s+(I|II|III|IV|V|VI|VII|VIII)$/, ''))
                        ) || '';
                    }
                }

                if (matchedBarangay) {
                    setReportData(prev => ({
                        ...prev,
                        barangay: matchedBarangay,
                    }));
                    toast.success(`Location set: ${matchedBarangay}`);
                } else {
                    toast.error('Barangay not found. Please select from dropdown.');
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            toast.error('Could not fetch location. Please select barangay manually.');
        } finally {
            setLoadingLocation(false);
        }
    };

    const incidentTypes = [
        { value: '', label: 'Select Incident Type' },
        { value: 'fire', label: 'Fire' },
        { value: 'flood', label: 'Flood' },
        { value: 'earthquake', label: 'Earthquake' },
        { value: 'landslide', label: 'Landslide' },
    ];

    const severityLevels = [
        { value: '', label: 'Select Severity' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const validateReportForm = () => {
        const rules = {
            type: [(value) => validateRequired(value, 'Incident type')],
            barangay: [(value) => validateRequired(value, 'Barangay')],
            latitude: [(value) => validateRequired(value, 'Latitude')],
            longitude: [(value) => validateRequired(value, 'Longitude')],
            severity: [(value) => validateRequired(value, 'Severity')],
        };

        const errors = validateForm(reportData, rules);
        setReportIncidentErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();

        if (!validateReportForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setReportIncidentErrors({});
        setReportProcessing(true);

        // Use Inertia router to post data with automatic CSRF handling
        router.post(route('incidents.store'), reportData, {
            onSuccess: () => {
                toast.success('Incident reported successfully!');
                resetReport();
                if (reportMarkerRef.current && reportMapInstanceRef.current) {
                    reportMapInstanceRef.current.removeLayer(reportMarkerRef.current);
                    reportMarkerRef.current = null;
                }
                setReportProcessing(false);
            },
            onError: (errors) => {
                toast.error('Failed to report incident. Please try again.');
                setReportProcessing(false);
            },
        });
    };

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        email: '',
        barangay: '',
        subject: '',
        message: '',
    });

    const validateFormData = () => {
        const rules = {
            name: [(value) => validateRequired(value, "Name")],
            email: [validateEmail],
            barangay: [(value) => validateRequired(value, "Barangay")],
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

        post(route('contact.submit'), {
            onSuccess: () => {
                toast.success('Thank you for your message! We will get back to you soon.');
                reset();
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
        <GuestLayout>
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
                                                onChange={(e) => {
                                                    setData('name', e.target.value);
                                                    if (validationErrors.name) {
                                                        const newErrors = { ...validationErrors };
                                                        delete newErrors.name;
                                                        setValidationErrors(newErrors);
                                                    }
                                                }}
                                                placeholder="Juan Dela Cruz"
                                                required
                                            />
                                            <InputError message={getError('name')} />
                                        </div>
                                        <div>
                                            <TextInput
                                                label="Email Address"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => {
                                                    setData('email', e.target.value);
                                                    if (validationErrors.email) {
                                                        const newErrors = { ...validationErrors };
                                                        delete newErrors.email;
                                                        setValidationErrors(newErrors);
                                                    }
                                                }}
                                                placeholder="juan@example.com"
                                                required
                                            />
                                            <InputError message={getError('email')} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Barangays</label>
                                        <select
                                            value={data.barangay}
                                            onChange={(e) => {
                                                setData('barangay', e.target.value);
                                                if (validationErrors.barangay) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.barangay;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a barangay</option>
                                            <option value="Anilao">Anilao</option>
                                            <option value="Anabu I">Anabu I</option>
                                            <option value="Anabu II">Anabu II</option>
                                            <option value="Banalo">Banalo</option>
                                            <option value="Barangka">Barangka</option>
                                            <option value="Bayan">Bayan</option>
                                            <option value="Buli">Buli</option>
                                            <option value="Daang Lungsod">Daang Lungsod</option>
                                            <option value="Langkaan I">Langkaan I</option>
                                            <option value="Langkaan II">Langkaan II</option>
                                            <option value="Molino Boulevard">Molino Boulevard</option>
                                            <option value="Panapaan">Panapaan</option>
                                            <option value="Patukaran">Patukaran</option>
                                            <option value="Salinas">Salinas</option>
                                            <option value="San Agustin">San Agustin</option>
                                            <option value="Santa Rosa">Santa Rosa</option>
                                            <option value="Talon">Talon</option>
                                            <option value="Talipapa">Talipapa</option>
                                            <option value="Tulong">Tulong</option>
                                            <option value="Zapote">Zapote</option>
                                        </select>
                                        <InputError message={getError('barangay')} />
                                    </div>

                                    <div>
                                        <TextInput
                                            label="How can hazards in your area be mitigated?"
                                            value={data.subject}
                                            onChange={(e) => {
                                                setData('subject', e.target.value);
                                                if (validationErrors.subject) {
                                                    const newErrors = { ...validationErrors };
                                                    delete newErrors.subject;
                                                    setValidationErrors(newErrors);
                                                }
                                            }}
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

                            {/* Quick Contact Cards */}
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                                    <h3 className="font-bold text-gray-900 mb-2">For Incident Reports</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        If you need to report an incident, please log in to the portal for faster processing.
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                    >
                                        Go to Portal →
                                    </Link>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                                    <h3 className="font-bold text-gray-900 mb-2">Latest Updates</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Stay informed with our latest announcements and advisories.
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                    >
                                        View Announcements →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hazard Map Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                                <span className="text-sm font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                    Real-Time Monitoring
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hazard Map</h2>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                Monitor verified disaster incidents in real-time across Bacoor City. Our interactive hazard map provides up-to-date information on fire, flood, earthquake, and landslide incidents to keep you informed and prepared.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Map Container */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                                    {/* Map */}
                                    <div
                                        ref={mapRef}
                                        className="w-full h-96 bg-gray-200 rounded-xl"
                                        style={{ minHeight: '400px' }}
                                    />
                                    
                                    {/* Map Info Footer */}
                                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                                        <p className="text-sm text-gray-600">
                                            <strong>{incidents.length}</strong> verified incident{incidents.length !== 1 ? 's' : ''} displayed on map
                                        </p>
                                    </div>
                                </div>

                                {/* View Full Map Button */}
                                <div className="mt-6">
                                    <Link
                                        href={route('public.hazard-map')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                                    >
                                        View Full Hazard Map
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Incidents List */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Incidents</h3>
                                    
                                    {incidents.length > 0 ? (
                                        <div className="space-y-4">
                                            {incidents.slice(0, 5).map((incident) => {
                                                const typeConfig = getIncidentTypeConfig(incident.type);
                                                return (
                                                    <div
                                                        key={incident.id}
                                                        className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 capitalize">
                                                                    {incident.type}
                                                                </p>
                                                                <p className="text-sm text-gray-600">{incident.barangay}</p>
                                                            </div>
                                                            <div>
                                                                <StatusBadge status={incident.status} />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: typeConfig.color }}></span>
                                                            <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">No incidents reported</p>
                                        </div>
                                    )}

                                    {incidents.length > 5 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <Link
                                                href={route('public.hazard-map')}
                                                className="block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                            >
                                                View all incidents →
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Legend */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Incident Types</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🔥</span>
                                            <span className="text-gray-700">Fire</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">💧</span>
                                            <span className="text-gray-700">Flood</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🏔️</span>
                                            <span className="text-gray-700">Earthquake</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">⛰️</span>
                                            <span className="text-gray-700">Landslide</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Report Incident Section */}
                <section className="py-16 bg-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                                <span className="text-sm font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                    Report Now
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Report an Incident</h2>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                Have you witnessed a disaster or emergency? Report it directly to us so we can respond quickly and effectively. Click on the map to select the incident location.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                            {/* Report Form */}
                            <form onSubmit={handleReportSubmit} className="p-8">
                                {/* Map Section */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                        <h3 className="text-xl font-semibold text-gray-900">Select Location on Map</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Click anywhere within Bacoor, Cavite to place a marker. The barangay will be auto-detected.
                                    </p>
                                    <div
                                        ref={reportMapRef}
                                        className="w-full rounded-lg"
                                        style={{ height: '500px', zIndex: 30 }}
                                    />
                                    {loadingLocation && (
                                        <div className="p-3 bg-blue-50 text-blue-800 text-sm text-center rounded-lg mt-3">
                                            Fetching location name...
                                        </div>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    {/* Incident Type & Severity */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Select
                                                label="Incident Type"
                                                value={reportData.type}
                                                onChange={(value) => {
                                                    setReportData('type', value);
                                                    if (reportIncidentErrors.type) {
                                                        const newErrors = { ...reportIncidentErrors };
                                                        delete newErrors.type;
                                                        setReportIncidentErrors(newErrors);
                                                    }
                                                }}
                                                options={incidentTypes}
                                                required
                                            />
                                            <InputError message={reportIncidentErrors.type} />
                                        </div>
                                        <div>
                                            <Select
                                                label="Severity Level"
                                                value={reportData.severity}
                                                onChange={(value) => {
                                                    setReportData('severity', value);
                                                    if (reportIncidentErrors.severity) {
                                                        const newErrors = { ...reportIncidentErrors };
                                                        delete newErrors.severity;
                                                        setReportIncidentErrors(newErrors);
                                                    }
                                                }}
                                                options={severityLevels}
                                                required
                                            />
                                            <InputError message={reportIncidentErrors.severity} />
                                        </div>
                                    </div>

                                    {/* Barangay */}
                                    <div>
                                        <Select
                                            label="Barangay"
                                            value={reportData.barangay}
                                            onChange={(value) => {
                                                setReportData('barangay', value);
                                                if (reportIncidentErrors.barangay) {
                                                    const newErrors = { ...reportIncidentErrors };
                                                    delete newErrors.barangay;
                                                    setReportIncidentErrors(newErrors);
                                                }
                                            }}
                                            options={[
                                                { value: '', label: 'Select Barangay' },
                                                ...barangayList.map(brgy => ({ value: brgy, label: brgy }))
                                            ]}
                                            required
                                        />
                                        <InputError message={reportIncidentErrors.barangay} />
                                    </div>

                                    {/* Coordinates */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <TextInput
                                                label="Latitude"
                                                value={reportData.latitude}
                                                onChange={(e) => {
                                                    setReportData('latitude', e.target.value);
                                                    if (reportIncidentErrors.latitude) {
                                                        const newErrors = { ...reportIncidentErrors };
                                                        delete newErrors.latitude;
                                                        setReportIncidentErrors(newErrors);
                                                    }
                                                }}
                                                placeholder="Click on map"
                                                readOnly
                                            />
                                            <InputError message={reportIncidentErrors.latitude} />
                                        </div>
                                        <div>
                                            <TextInput
                                                label="Longitude"
                                                value={reportData.longitude}
                                                onChange={(e) => {
                                                    setReportData('longitude', e.target.value);
                                                    if (reportIncidentErrors.longitude) {
                                                        const newErrors = { ...reportIncidentErrors };
                                                        delete newErrors.longitude;
                                                        setReportIncidentErrors(newErrors);
                                                    }
                                                }}
                                                placeholder="Click on map"
                                                readOnly
                                            />
                                            <InputError message={reportIncidentErrors.longitude} />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Textarea
                                            label="Description (Optional)"
                                            value={reportData.description}
                                            onChange={(e) => setReportData('description', e.target.value)}
                                            placeholder="Provide additional details about the incident..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Info Box */}
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 text-sm mb-2">
                                            Important Instructions:
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                            <li>Click on the map to set the incident location</li>
                                            <li>Location must be within Bacoor, Cavite boundaries</li>
                                            <li>Barangay will be auto-filled from the map</li>
                                            <li>Provide accurate information for emergency response</li>
                                            <li>You will receive a confirmation after submission</li>
                                        </ul>
                                    </div>

                                    {/* Submit Button */}
                                    <PrimaryButton
                                        type="submit"
                                        disabled={reportProcessing || !reportData.latitude || !reportData.longitude}
                                        className="w-full"
                                    >
                                        <AlertTriangle className="w-5 h-5 mr-2 inline" />
                                        {reportProcessing ? 'Reporting Incident...' : 'Report Incident'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </section>
        </GuestLayout>
    );
}
