import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/Form/TextInput";
import Textarea from "@/Components/Form/Textarea";
import Select from "@/Components/Form/Select";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { useToast } from "@/Hooks/useToast";
import { MapPin, AlertTriangle, Flame, Droplets, Home } from "lucide-react";
import { validateRequired, validateForm } from "@/Utils/formValidation";
import InputError from "@/Components/Form/InputError";

export default function Create() {
    const toast = useToast();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [barangayList, setBarangayList] = useState([]);
    const [barangayListLoaded, setBarangayListLoaded] = useState(false);
    const barangayListRef = useRef([]);

    // Get edit parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const isEditing = !!editId;

    // Load Bacoor barangays
    useEffect(() => {
        fetch('/barangay_list.json')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch barangay list: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const list = data.barangay_list || [];
                setBarangayList(list);
                barangayListRef.current = list; // Store in ref for closure access
                setBarangayListLoaded(true);
            })
            .catch(err => {
                console.error('Failed to load barangay list:', err);
                toast.error('Failed to load barangay list. Please refresh the page.');
            });
    }, []);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        type: urlParams.get('type') || "",
        barangay: urlParams.get('barangay') || "",
        latitude: urlParams.get('latitude') || "",
        longitude: urlParams.get('longitude') || "",
        description: urlParams.get('description') || "",
        severity: urlParams.get('severity') || "",
    });

    // Bacoor, Cavite boundaries (approximate)
    const BACOOR_BOUNDS = {
        north: 14.5000,
        south: 14.3626,
        east: 121.011285,
        west: 120.946974,
    };

    const BACOOR_CENTER = {
        lat: 14.4500,
        lng: 120.9500,
    };

    // Initialize map with Leaflet
    useEffect(() => {
        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }
        };
    }, []);

    // When editing, place marker on map after it's loaded
    useEffect(() => {
        if (isEditing && data.latitude && data.longitude && mapInstanceRef.current && window.L) {
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);

            // Custom marker icon
            const customIcon = window.L.divIcon({
                className: 'custom-marker',
                html: '<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            });

            // Remove existing marker if any
            if (markerRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
            }

            // Add marker at the incident location
            markerRef.current = window.L.marker([lat, lng], { icon: customIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup('Incident Location')
                .openPopup();

            // Center map on the marker
            mapInstanceRef.current.setView([lat, lng], 15);
        }
    }, [isEditing, data.latitude, data.longitude, mapInstanceRef.current]);

    const initMap = () => {
        if (!window.L || mapInstanceRef.current) return;

        // Initialize map
        const map = window.L.map(mapRef.current).setView(
            [BACOOR_CENTER.lat, BACOOR_CENTER.lng],
            13
        );

        // Add OpenStreetMap tiles (free)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Set max bounds to Bacoor area
        const bounds = window.L.latLngBounds(
            [BACOOR_BOUNDS.south, BACOOR_BOUNDS.west],
            [BACOOR_BOUNDS.north, BACOOR_BOUNDS.east]
        );
        map.setMaxBounds(bounds);
        map.on('drag', function () {
            map.panInsideBounds(bounds, { animate: false });
        });

        // Custom marker icon
        const customIcon = window.L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });

        // Add click handler
        map.on('click', async (e) => {
            const { lat, lng } = e.latlng;

            // Check if click is within Bacoor bounds
            if (
                lat < BACOOR_BOUNDS.south ||
                lat > BACOOR_BOUNDS.north ||
                lng < BACOOR_BOUNDS.west ||
                lng > BACOOR_BOUNDS.east
            ) {
                toast.error('Location is not in Bacoor, Cavite. Please select a location within Bacoor.');
                return;
            }

            // Remove existing marker
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
            }

            // Add new marker
            markerRef.current = window.L.marker([lat, lng], { icon: customIcon })
                .addTo(map)
                .bindPopup('Selected Location')
                .openPopup();

            // Update form data
            setData(data => ({
                ...data,
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6),
            }));

            // Fetch barangay name using reverse geocoding
            await fetchBarangayName(lat, lng);
        });

        mapInstanceRef.current = map;
    };

    const fetchBarangayName = async (lat, lng) => {
        setLoadingLocation(true);
        try {
            // Using Nominatim API (free OpenStreetMap geocoding service)
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

                // Validate that the location is in Bacoor
                const city = address.city || address.municipality || '';
                if (city.toUpperCase() !== 'BACOOR') {
                    toast.error('Location is not in Bacoor, Cavite. Please select a location within Bacoor.');
                    // Remove the marker
                    if (markerRef.current && mapInstanceRef.current) {
                        mapInstanceRef.current.removeLayer(markerRef.current);
                        markerRef.current = null;
                    }
                    // Clear coordinates
                    setData(prev => ({
                        ...prev,
                        latitude: '',
                        longitude: '',
                        barangay: '',
                    }));
                    return;
                }

                // Extract barangay from quarter field (Nominatim returns it here for PH addresses)
                const locationName = address.quarter || address.suburb || address.neighbourhood || address.village || address.city_district || '';

                const currentBarangayList = barangayListRef.current; // Use ref for current value

                // Match with barangay list from barangay_list.json
                let matchedBarangay = '';
                if (locationName && currentBarangayList.length > 0) {
                    let upperLocation = locationName.toUpperCase();

                    // Handle former barangay names
                    // PANAPAAN 1-8 → P.F. ESPIRITU I-VIII
                    const romanNumerals = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII' };
                    const panapaan = upperLocation.match(/PANAPAAN\s*(\d)/i);
                    if (panapaan) {
                        const romanNum = romanNumerals[panapaan[1]];
                        upperLocation = `P.F. ESPIRITU ${romanNum}`;
                    } else if (upperLocation.includes('PANAPAAN')) {
                        upperLocation = upperLocation.replace(/PANAPAAN/g, 'P.F. ESPIRITU');
                    }

                    // POBLACION → KAINGIN
                    if (upperLocation.includes('POBLACION')) {
                        upperLocation = 'KAINGIN (POB.)';
                    }

                    // First, try exact match
                    matchedBarangay = currentBarangayList.find(brgy => brgy === upperLocation) || '';

                    // If no exact match, try partial match
                    if (!matchedBarangay) {
                        matchedBarangay = currentBarangayList.find(brgy =>
                            brgy.includes(upperLocation) ||
                            upperLocation.includes(brgy) ||
                            brgy.includes(upperLocation.replace(/\s+(I|II|III|IV|V|VI|VII|VIII)$/, ''))
                        ) || '';
                    }
                }

                if (matchedBarangay) {
                    setData(prev => ({
                        ...prev,
                        barangay: matchedBarangay,
                    }));
                    toast.success(`Location set: ${matchedBarangay}`);
                } else {
                    toast.error('Barangay not found in list. Please select from the dropdown.');
                }
            } else {
                toast.error('Could not fetch location name. Please select barangay manually.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            toast.error('Could not fetch location name. Please select barangay manually.');
        } finally {
            setLoadingLocation(false);
        }
    };

    const incidentTypes = [
        { value: "", label: "Select Incident Type" },
        { value: "fire", label: "Fire" },
        { value: "flood", label: "Flood" },
        { value: "earthquake", label: "Earthquake" },
        { value: "landslide", label: "Landslide" },
    ];

    const severityLevels = [
        { value: "", label: "Select Severity" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];

    const validateFormData = () => {
        const rules = {
            type: [(value) => validateRequired(value, "Incident type")],
            barangay: [(value) => validateRequired(value, "Barangay")],
            latitude: [(value) => validateRequired(value, "Latitude")],
            longitude: [(value) => validateRequired(value, "Longitude")],
            severity: [(value) => validateRequired(value, "Severity")],
        };

        const errors = validateForm(data, rules);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        if (!validateFormData()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setValidationErrors({});

        if (isEditing && editId) {
            // Use PUT for editing
            router.put(route("officer.incidents.update", editId), data, {
                onSuccess: () => {
                    toast.success("Incident updated and resubmitted successfully");
                    router.get(route("officer.incidents.index"));
                },
                onError: (serverErrors) => {
                    Object.keys(serverErrors).forEach((key) => {
                        toast.error(serverErrors[key]);
                    });
                },
            });
        } else {
            // Use POST for creating
            post(route("officer.incidents.store"), {
                onSuccess: () => {
                    toast.success("Incident reported successfully");
                    reset();
                    if (markerRef.current && mapInstanceRef.current) {
                        mapInstanceRef.current.removeLayer(markerRef.current);
                        markerRef.current = null;
                    }
                },
                onError: (serverErrors) => {
                    Object.keys(serverErrors).forEach((key) => {
                        toast.error(serverErrors[key]);
                    });
                },
            });
        }
    };

    const getError = (field) => {
        return validationErrors[field] || errors[field];
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'fire':
                return Flame;
            case 'flood':
                return Droplets;
            case 'earthquake':
                return Home;
            case 'landslide':
                return AlertTriangle;
            default:
                return MapPin;
        }
    };

    const Icon = data.type ? getIconForType(data.type) : MapPin;

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Incidents", href: route("officer.hazard-map") },
                { label: isEditing ? "Edit Incident" : "Report Incident", href: null },
            ]}
        >
            <Head title={isEditing ? "Edit Incident" : "Report Incident"} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            {isEditing ? "Edit & Resubmit Incident" : "Report Incident"}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Click on the map to set the incident location, then fill out the required information.
                        </p>
                    </div>

                    {/* Map Section - Full Width */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                        <div className="p-4 bg-blue-50 border-b border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Select Location on Map
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Click anywhere within Bacoor, Cavite to place a marker. The barangay will be auto-detected.
                            </p>
                        </div>
                        <div
                            ref={mapRef}
                            className="w-full !z-30"
                            style={{ height: "600px", zIndex: 30 }}
                        ></div>
                        {loadingLocation && (
                            <div className="p-3 bg-blue-50 text-blue-800 text-sm text-center">
                                Fetching location name...
                            </div>
                        )}
                        {!barangayListLoaded && (
                            <div className="p-3 bg-yellow-50 text-yellow-800 text-sm text-center">
                                Loading barangay list...
                            </div>
                        )}
                    </div>

                    {/* Form Section - Full Width Below Map */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            Incident Details
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Incident Type */}
                            <div>
                                <Select
                                    label="Incident Type"
                                    value={data.type}
                                    onChange={(value) => {
                                        setData("type", value);
                                        if (validationErrors.type) {
                                            const newErrors = { ...validationErrors };
                                            delete newErrors.type;
                                            setValidationErrors(newErrors);
                                        }
                                    }}
                                    options={incidentTypes}
                                />
                                <InputError message={getError("type")} />
                            </div>

                            {/* Barangay */}
                            <div>
                                <Select
                                    label="Barangay"
                                    value={data.barangay}
                                    onChange={(value) => {
                                        setData("barangay", value);
                                        if (validationErrors.barangay) {
                                            const newErrors = { ...validationErrors };
                                            delete newErrors.barangay;
                                            setValidationErrors(newErrors);
                                        }
                                    }}
                                    options={[
                                        { value: "", label: "Select Barangay" },
                                        ...barangayList.map(brgy => ({ value: brgy, label: brgy }))
                                    ]}
                                />
                                <InputError message={getError("barangay")} />
                            </div>

                            {/* Coordinates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <TextInput
                                        label="Latitude"
                                        value={data.latitude}
                                        onChange={(e) => {
                                            setData("latitude", e.target.value);
                                            if (validationErrors.latitude) {
                                                const newErrors = { ...validationErrors };
                                                delete newErrors.latitude;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                        placeholder="Click on map"
                                        readOnly
                                    />
                                    <InputError message={getError("latitude")} />
                                </div>
                                <div>
                                    <TextInput
                                        label="Longitude"
                                        value={data.longitude}
                                        onChange={(e) => {
                                            setData("longitude", e.target.value);
                                            if (validationErrors.longitude) {
                                                const newErrors = { ...validationErrors };
                                                delete newErrors.longitude;
                                                setValidationErrors(newErrors);
                                            }
                                        }}
                                        error={getError("longitude")}
                                        placeholder="Click on map"
                                        readOnly
                                    />
                                    <InputError message={getError("longitude")} />
                                </div>
                            </div>

                            {/* Severity */}
                            <div>
                                <Select
                                    label="Severity Level"
                                    value={data.severity}
                                    onChange={(value) => {
                                        setData("severity", value);
                                        if (validationErrors.severity) {
                                            const newErrors = { ...validationErrors };
                                            delete newErrors.severity;
                                            setValidationErrors(newErrors);
                                        }
                                    }}
                                    options={severityLevels}
                                    error={getError("severity")}
                                />
                                <InputError message={getError("severity")} />
                            </div>

                            {/* Description */}
                            <div>
                                <Textarea
                                    label="Description (Optional)"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Provide additional details about the incident..."
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Instructions */}
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-semibold text-yellow-900 text-sm mb-2">
                                    Important Instructions:
                                </h4>
                                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                                    <li>Click on the map to set the incident location</li>
                                    <li>Location must be within Bacoor, Cavite boundaries</li>
                                    <li>Barangay name will be auto-filled from the map</li>
                                    <li>Provide accurate information for emergency response</li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing || !data.latitude || !data.longitude}
                                    className="flex-1"
                                >
                                    {processing ? (isEditing ? "Submitting..." : "Reporting...") : (isEditing ? "Submit for Review" : "Report Incident")}
                                </PrimaryButton>
                                <SecondaryButton
                                    type="button"
                                    onClick={() => router.visit(isEditing ? route("officer.incidents.index") : route("officer.hazard-map"))}
                                    disabled={processing}
                                >
                                    Cancel
                                </SecondaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
