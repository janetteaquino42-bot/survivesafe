import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatOverview from '@/Components/Stats/StatOverview';
import Card from '@/Components/Cards/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
import ConfirmationModal from '@/Components/Modal/ConfirmationModal';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import SuccessButton from '@/Components/Buttons/SuccessButton';
import DangerButton from '@/Components/Buttons/DangerButton';
import { MapPin, Calendar, User, AlertCircle, Activity, CheckCircle, Trash2, XCircle, Navigation } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import {
    getIncidentTypeConfig,
    getIncidentStatusConfig,
    getIncidentSeverityConfig
} from '@/Utils/incidentHelper';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';

export default function HazardMapIndex({ incidents, allIncidents, canChangeStatus, canManage, isHeadOfficer, filters }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const userLocationMarkerRef = useRef(null);
    const userLocationCircleRef = useRef(null);
    const hasRequestedGeolocationRef = useRef(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [filter, setFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState(filters?.time_filter || 'all');
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [declineReason, setDeclineReason] = useState('');
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '',
        incident: null,
        newStatus: null,
        title: '',
        message: '',
    });

    // Filter incidents for map
    const filteredIncidents = incidents.filter(incident => {
        if (filter === 'all') return true;
        return incident.type === filter;
    });

    // Filter all incidents for list
    const filteredAllIncidents = allIncidents?.data?.filter(incident => {
        if (filter === 'all') return true;
        return incident.type === filter;
    }) || [];


    useEffect(() => {
        // Load Leaflet CSS and JS dynamically
        const loadLeaflet = async () => {
            // Load CSS
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Load JS
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

    const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
        const toRadians = (deg) => (deg * Math.PI) / 180;
        const earthRadiusKm = 6371;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    };

    const locateUser = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            return;
        }

        setIsLocating(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setUserLocation(location);
                setIsLocating(false);

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([location.lat, location.lng], 15);
                }
            },
            () => {
                setIsLocating(false);
                setLocationError('Unable to get your current location. Please allow location access.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    };

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

        if (!hasRequestedGeolocationRef.current) {
            hasRequestedGeolocationRef.current = true;
            locateUser();
        }

        // Clean up
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        const L = window.L;

        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.remove();
            userLocationMarkerRef.current = null;
        }

        if (userLocationCircleRef.current) {
            userLocationCircleRef.current.remove();
            userLocationCircleRef.current = null;
        }

        if (!userLocation) return;

        userLocationCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
            radius: 1000,
            color: '#2563eb',
            fillColor: '#60a5fa',
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '6, 6',
        }).addTo(mapInstanceRef.current);

        userLocationMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
            radius: 8,
            color: '#ffffff',
            weight: 3,
            fillColor: '#2563eb',
            fillOpacity: 1,
        }).addTo(mapInstanceRef.current);

        userLocationMarkerRef.current.bindTooltip('Your current location', {
            permanent: false,
            direction: 'top',
            offset: [0, -8],
        });
    }, [userLocation, mapLoaded]);

    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        const L = window.L;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for filtered incidents
        filteredIncidents.forEach(incident => {
            if (!incident.latitude || !incident.longitude) return;

            const typeConfig = getIncidentTypeConfig(incident.type);
            const color = typeConfig.color;

            // Map incident types to appropriate icons/symbols
            const iconMap = {
                fire: '🔥',
                flood: '💧',
                earthquake: '🏔️',
                landslide: '⛰️'
            };
            const iconSymbol = iconMap[incident.type] || '⚠️';

            // Create custom icon HTML with incident-specific symbol
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

            // Add hover effect
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

            // Add click event
            marker.on('click', () => {
                setSelectedIncident(incident);
            });

            marker.addTo(mapInstanceRef.current);
            markersRef.current.push(marker);
        });

        // Zoom behavior: prioritize nearby incidents around resident location when available.
        if (userLocation) {
            const nearbyBounds = filteredIncidents
                .filter(i => i.latitude && i.longitude)
                .filter(i => getDistanceInKm(userLocation.lat, userLocation.lng, i.latitude, i.longitude) <= 3)
                .map(i => [i.latitude, i.longitude]);

            nearbyBounds.push([userLocation.lat, userLocation.lng]);

            if (nearbyBounds.length > 1) {
                mapInstanceRef.current.fitBounds(nearbyBounds, {
                    padding: [50, 50],
                    maxZoom: 15,
                });
            } else {
                mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15);
            }

            return;
        }

        if (filteredIncidents.length > 0) {
            const bounds = filteredIncidents
                .filter(i => i.latitude && i.longitude)
                .map(i => [i.latitude, i.longitude]);

            if (bounds.length > 0) {
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [filteredIncidents, mapLoaded, userLocation]);

    // Prepare stats for StatOverview
    const stats = [
        {
            title: 'Total Verified',
            value: incidents.length,
            icon: Activity,
            color: 'secondary',
            className: `cursor-pointer hover:shadow-lg transition-shadow ${filter === 'all' ? 'ring-2 ring-secondary' : ''}`,
            onClick: () => setFilter('all')
        },
        {
            title: 'Fire',
            value: incidents.filter(i => i.type === 'fire').length,
            icon: getIncidentTypeConfig('fire').icon,
            color: 'danger',
            iconBgColor: getIncidentTypeConfig('fire').color,
            className: `cursor-pointer hover:shadow-lg transition-shadow ${filter === 'fire' ? 'ring-2 ring-red-500' : ''}`,
            onClick: () => setFilter('fire')
        },
        {
            title: 'Flood',
            value: incidents.filter(i => i.type === 'flood').length,
            icon: getIncidentTypeConfig('flood').icon,
            color: 'primary',
            iconBgColor: getIncidentTypeConfig('flood').color,
            className: `cursor-pointer hover:shadow-lg transition-shadow ${filter === 'flood' ? 'ring-2 ring-blue-500' : ''}`,
            onClick: () => setFilter('flood')
        },
        {
            title: 'Earthquake',
            value: incidents.filter(i => i.type === 'earthquake').length,
            icon: getIncidentTypeConfig('earthquake').icon,
            color: 'brown',
            iconBgColor: getIncidentTypeConfig('earthquake').color,
            className: `cursor-pointer hover:shadow-lg transition-shadow ${filter === 'earthquake' ? 'ring-2 ring-[#664b33]' : ''}`,
            onClick: () => setFilter('earthquake')
        },
        {
            title: 'Landslide',
            value: incidents.filter(i => i.type === 'landslide').length,
            icon: getIncidentTypeConfig('landslide').icon,
            color: 'warning',
            iconBgColor: getIncidentTypeConfig('landslide').color,
            className: `cursor-pointer hover:shadow-lg transition-shadow ${filter === 'landslide' ? 'ring-2 ring-yellow-500' : ''}`,
            onClick: () => setFilter('landslide')
        }
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Hazard Map', href: null },
            ]}
        >
            <Head title="Hazard Map" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hazard Map</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                View reported hazard incidents in the community.
                            </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <PrimaryButton
                                onClick={locateUser}
                                disabled={isLocating}
                                className="w-full sm:w-auto"
                            >
                                <Navigation size={16} className="mr-2" />
                                {isLocating ? 'Locating...' : 'Use My Location'}
                            </PrimaryButton>
                            {locationError ? (
                                <p className="text-xs text-red-600">{locationError}</p>
                            ) : userLocation ? (
                                <p className="text-xs text-blue-600">Location found. Showing nearby incidents.</p>
                            ) : null}
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <StatOverview stats={stats} columns={5} />

                    {/* Time Filter */}
                    <Card>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Time Period</h3>
                                <p className="text-sm text-gray-600">Filter incidents by time range</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setTimeFilter('24h');
                                        router.get(route('officer.hazard-map'), { time_filter: '24h' }, { preserveState: true, preserveScroll: true });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === '24h'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Past 24 Hours
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeFilter('3d');
                                        router.get(route('officer.hazard-map'), { time_filter: '3d' }, { preserveState: true, preserveScroll: true });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === '3d'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Past 3 Days
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeFilter('7d');
                                        router.get(route('officer.hazard-map'), { time_filter: '7d' }, { preserveState: true, preserveScroll: true });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === '7d'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Past 7 Days
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeFilter('31d');
                                        router.get(route('officer.hazard-map'), { time_filter: '31d' }, { preserveState: true, preserveScroll: true });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === '31d'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Past 31 Days
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeFilter('all');
                                        router.get(route('officer.hazard-map'), { time_filter: 'all' }, { preserveState: true, preserveScroll: true });
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === 'all'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All Time
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Map Card */}
                    <Card>
                        <div>
                            <div
                                ref={mapRef}
                                className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200 z-20"
                            >
                                {!mapLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                            <p className="text-gray-600">Loading map...</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                <div className="flex flex-col sm:flex-row text-start flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Map Legend:</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-600 border-2 border-white shadow-sm">
                                            <MapPin size={12} className="text-white" />
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600">Your Location</span>
                                    </div>
                                    {Object.entries({
                                        fire: getIncidentTypeConfig('fire'),
                                        flood: getIncidentTypeConfig('flood'),
                                        earthquake: getIncidentTypeConfig('earthquake'),
                                        landslide: getIncidentTypeConfig('landslide')
                                    }).map(([key, config]) => {
                                        const Icon = config.icon;
                                        return (
                                            <div key={key} className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: config.color }}
                                                >
                                                    <Icon size={14} className="text-white" />
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-600">{config.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Showing {filteredIncidents.length} verified incident{filteredIncidents.length !== 1 ? 's' : ''}
                                    {filter !== 'all' ? ` (${filter})` : ''}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* All Incidents List */}
                    {filteredAllIncidents.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between px-2">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                    All Incident Reports {filter !== 'all' && `(${filter})`}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Showing {filteredAllIncidents.length} incident{filteredAllIncidents.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredAllIncidents.map((incident) => {
                                    const typeConfig = getIncidentTypeConfig(incident.type);
                                    const severityConfig = getIncidentSeverityConfig(incident.severity);
                                    const TypeIcon = typeConfig.icon;

                                    return (
                                        <Card
                                            key={incident.id}
                                            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                                            style={{
                                                borderLeft: `4px solid ${severityConfig.color}`,
                                            }}
                                        >
                                            {/* Gradient Background Accent */}
                                            <div
                                                className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl transition-opacity group-hover:opacity-20"
                                                style={{ backgroundColor: typeConfig.color }}
                                            />

                                            {/* Icon and Type Header */}
                                            <div className="flex items-start justify-between mb-4 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="p-2.5 rounded-xl shadow-sm transition-transform group-hover:scale-110 cursor-pointer"
                                                        style={{
                                                            backgroundColor: typeConfig.bgColor,
                                                            boxShadow: `0 4px 12px ${typeConfig.bgColor}`
                                                        }}
                                                        onClick={() => setSelectedIncident(incident)}
                                                    >
                                                        <TypeIcon size={24} color={typeConfig.color} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <h3
                                                            className="font-bold text-lg text-gray-900 line-clamp-1 capitalize cursor-pointer hover:text-blue-600"
                                                            onClick={() => setSelectedIncident(incident)}
                                                        >
                                                            {incident.title || typeConfig.label}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                                            <Calendar size={12} />
                                                            <span>{incident.created_at}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <StatusBadge status={incident.type} />
                                                <StatusBadge status={incident.severity} />
                                                <StatusBadge status={incident.status} />
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                                                {incident.description}
                                            </p>

                                            {/* Location and Reporter Info */}
                                            <div className="border-t border-gray-100 pt-3 space-y-2.5 mb-4">
                                                {incident.location && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-500">Location:</span>
                                                        <span className="font-medium text-gray-700 ml-auto">{incident.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-xs">
                                                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                    <span className="text-gray-500">Barangay:</span>
                                                    <span className="font-medium text-gray-700 ml-auto">{incident.barangay}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <User size={14} className="text-gray-400 flex-shrink-0" />
                                                    <span className="text-gray-500">Reported by:</span>
                                                    <span className="font-medium text-gray-700 ml-auto">{incident.reported_by}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    {filter !== 'all'
                                        ? `No ${filter} incidents found.`
                                        : 'No incidents found.'}
                                </p>
                                {filter !== 'all' && (
                                    <button
                                        onClick={() => setFilter('all')}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Show All Incidents
                                    </button>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Incident Details Modal - HeroUI */}
            <Modal
                isOpen={selectedIncident !== null}
                onClose={() => setSelectedIncident(null)}
                size="xl"
                scrollBehavior="inside"
                classNames={{
                    base: `my-8 bg-white rounded-lg`,
                    backdrop: "bg-black/50",
                    wrapper: "overflow-y-auto",
                    body: "max-h-[70vh] overflow-y-auto",
                    header: "border-b border-gray-200",
                    footer: "border-t border-gray-200",

                }}
            >
                <ModalContent>
                    {(onClose) => selectedIncident && (
                        <>
                            <ModalHeader
                                className="flex items-center gap-3 border-b"
                                style={{ backgroundColor: getIncidentTypeConfig(selectedIncident.type).bgColor }}
                            >
                                {(() => {
                                    const TypeIcon = getIncidentTypeConfig(selectedIncident.type).icon;
                                    return <TypeIcon size={28} style={{ color: getIncidentTypeConfig(selectedIncident.type).color }} />;
                                })()}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {selectedIncident.title || getIncidentTypeConfig(selectedIncident.type).label}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        ID: #{selectedIncident.id}
                                    </p>
                                </div>
                            </ModalHeader>
                            <ModalBody className="py-6">
                                <div className="space-y-4">
                                    {/* Badges Row */}
                                    <div className="flex flex-wrap gap-2">
                                        <StatusBadge status={selectedIncident.type} />
                                        <StatusBadge status={selectedIncident.severity} />
                                        <StatusBadge status={selectedIncident.status} />
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <MapPin size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">Location</p>
                                            <p className="text-sm text-gray-600">{selectedIncident.barangay}</p>
                                            {selectedIncident.location && (
                                                <p className="text-xs text-gray-500 mt-1">{selectedIncident.location}</p>
                                            )}
                                            {selectedIncident.latitude && selectedIncident.longitude && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {selectedIncident.latitude}, {selectedIncident.longitude}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reporter */}
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">Reported By</p>
                                            <p className="text-sm text-gray-600">{selectedIncident.reported_by}</p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">Reported On</p>
                                            <p className="text-sm text-gray-600">{selectedIncident.created_at}</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {selectedIncident.description && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <AlertCircle size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Description</p>
                                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{selectedIncident.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <SecondaryButton color="default" variant="light" onPress={onClose}>
                                    Close
                                </SecondaryButton>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}
