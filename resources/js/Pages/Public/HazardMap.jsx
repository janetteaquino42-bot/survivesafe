import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { MapPin, Calendar, User, Filter, X, ChevronLeft, ChevronRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import StatusBadge from '@/Components/Status/StatusBadge';
import Select from '@/Components/Form/Select';
import { getIncidentTypeConfig } from '@/Utils/incidentHelper';
import { formatDate } from '@/Utils/helpers';
import { MdOutlineDescription } from "react-icons/md";


export default function HazardMap({ incidents, filters, hero }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [barangayList, setBarangayList] = useState([]);
    const [localFilters, setLocalFilters] = useState({
        type: filters?.type || '',
        severity: filters?.severity || '',
        barangay: filters?.barangay || '',
    });

    // Fetch barangay list
    useEffect(() => {
        fetch('/barangay_list.json')
            .then(response => response.json())
            .then(data => {
                setBarangayList(data.barangay_list || []);
            })
            .catch(error => console.error('Error loading barangay list:', error));
    }, []);

    useEffect(() => {
        // Load Leaflet CSS and JS dynamically
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

    useEffect(() => {
        if (!mapInstanceRef.current || !window.L || !incidents?.data) return;

        const L = window.L;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for incidents
        incidents.data.forEach(incident => {
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

            marker.on('click', () => {
                setSelectedIncident(incident);
            });

            marker.addTo(mapInstanceRef.current);
            markersRef.current.push(marker);
        });

        // Fit bounds if there are incidents
        if (incidents.data.length > 0) {
            const bounds = incidents.data
                .filter(i => i.latitude && i.longitude)
                .map(i => [i.latitude, i.longitude]);

            if (bounds.length > 0) {
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [incidents, mapLoaded]);

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('public.hazard-map'), localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
        setShowFilters(false);
    };

    const clearFilters = () => {
        setLocalFilters({
            type: '',
            severity: '',
            barangay: '',
        });
        router.get(route('public.hazard-map'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

    return (
        <GuestLayout>
            <Head title={hero?.title || "Hazard Map"} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-gray-600 text-white py-16 md:py-20 overflow-hidden">
                {hero?.images && hero.images.length > 0 && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`/storage/${hero.images[0]}`}
                            alt="Hazard Map Hero Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-gray-900/85"></div>
                    </div>
                )}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-medium transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8" />
                        <span className="text-sm sm:text-base font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {hero?.meta?.badge_text || 'Real-Time Monitoring'}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        {hero?.title || 'Hazard Map - Verified Incidents'}
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl">
                        {hero?.content || 'Interactive map showing verified disaster incidents in Bacoor City. Stay informed and prepared.'}
                    </p>
                </div>
            </section>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Showing {incidents.total} verified {incidents.total === 1 ? 'incident' : 'incidents'} • Real-time disaster monitoring
                                </p>
                            </div>
                            {/* <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <Filter size={16} className="mr-2" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                            {Object.values(localFilters).filter(v => v !== '').length}
                                        </span>
                                    )}
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {/*  {showFilters && (
                    <div className="bg-white border-b border-gray-200 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Type Filter 
                                <Select
                                    label="Incident Type"
                                    value={localFilters.type}
                                    onChange={(value) => handleFilterChange('type', value)}
                                    options={[
                                        { value: '', label: 'All Types' },
                                        { value: 'fire', label: 'Fire' },
                                        { value: 'flood', label: 'Flood' },
                                        { value: 'earthquake', label: 'Earthquake' },
                                        { value: 'landslide', label: 'Landslide' },
                                    ]}
                                />

                                {/* Severity Filter 
                                <Select
                                    label="Severity Level"
                                    value={localFilters.severity}
                                    onChange={(value) => handleFilterChange('severity', value)}
                                    options={[
                                        { value: '', label: 'All Levels' },
                                        { value: 'low', label: 'Low' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'high', label: 'High' },
                                    ]}
                                />

                                {/* Barangay Filter 
                                <Select
                                    label="Barangay"
                                    value={localFilters.barangay}
                                    onChange={(value) => handleFilterChange('barangay', value)}
                                    options={[
                                        { value: '', label: 'All Barangays' },
                                        ...barangayList.map(brgy => ({
                                            value: brgy,
                                            label: brgy
                                        }))
                                    ]}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-4">
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    <X size={16} className="mr-1" />
                                    Clear All
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}*/}

                {/* Map and Incident List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Map */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div
                                    ref={mapRef}
                                    className="w-full h-[600px] z-20"
                                    style={{ minHeight: '600px' }}
                                />
                                {!mapLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-4 text-gray-600">Loading map...</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['fire', 'flood', 'earthquake', 'landslide'].map(type => {
                                        const config = getIncidentTypeConfig(type);
                                        const Icon = config.icon;
                                        return (
                                            <div key={type} className="flex items-center gap-2">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: config.bgColor }}
                                                >
                                                    <Icon size={16} style={{ color: config.color }} />
                                                </div>
                                                <span className="text-sm text-gray-700 capitalize">{type}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Incident List */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Verified Incidents ({incidents.total})
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Click on a marker or card to view details
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                    {incidents.data.length > 0 ? (
                                        incidents.data.map((incident) => {
                                            const typeConfig = getIncidentTypeConfig(incident.type);
                                            const TypeIcon = typeConfig.icon;
                                            const isSelected = selectedIncident?.incident_id === incident.incident_id;

                                            return (
                                                <div
                                                    key={incident.incident_id}
                                                    className={`p-4 cursor-pointer transition ${isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => setSelectedIncident(incident)}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className="p-2 rounded-lg flex-shrink-0"
                                                            style={{ backgroundColor: typeConfig.bgColor }}
                                                        >
                                                            <TypeIcon size={20} style={{ color: typeConfig.color }} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-gray-900 capitalize">
                                                                    {incident.type}
                                                                </span>
                                                                <StatusBadge status={incident.severity} />
                                                            </div>
                                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                {incident.barangay}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatDate(incident.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-8 text-center">
                                            <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                                            <p className="text-gray-600 font-medium">No verified incidents found</p>
                                            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {incidents.last_page > 1 && (
                                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                                        <Link
                                            href={incidents.prev_page_url || '#'}
                                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${incidents.prev_page_url
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={!incidents.prev_page_url}
                                        >
                                            <ChevronLeft size={16} className="mr-1" />
                                            Previous
                                        </Link>
                                        <span className="text-sm text-gray-600">
                                            Page {incidents.current_page} of {incidents.last_page}
                                        </span>
                                        <Link
                                            href={incidents.next_page_url || '#'}
                                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${incidents.next_page_url
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={!incidents.next_page_url}
                                        >
                                            Next
                                            <ChevronRight size={16} className="ml-1" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Incident Details Modal */}
                {selectedIncident && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="p-3 rounded-lg"
                                            style={{ backgroundColor: getIncidentTypeConfig(selectedIncident.type).bgColor }}
                                        >
                                            {(() => {
                                                const Icon = getIncidentTypeConfig(selectedIncident.type).icon;
                                                return <Icon size={24} style={{ color: getIncidentTypeConfig(selectedIncident.type).color }} />;
                                            })()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 capitalize">
                                                {selectedIncident.type} Incident
                                            </h2>
                                            <StatusBadge
                                                status={selectedIncident.severity}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedIncident(null)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Location</p>
                                            <p className="text-base text-gray-900">{selectedIncident.barangay}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {selectedIncident.latitude}, {selectedIncident.longitude}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedIncident.description && (
                                        <div className="flex items-start gap-2">
                                            <MdOutlineDescription className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                                                <p className="text-base text-gray-900">{selectedIncident.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-2">
                                        <User className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Reported By</p>
                                            <p className="text-base text-gray-900">
                                                {selectedIncident.reporter.first_name} {selectedIncident.reporter.last_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Calendar className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Reported On</p>
                                            <p className="text-base text-gray-900">{formatDate(selectedIncident.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            This incident has been verified by BDRRMO officials and is confirmed to be accurate.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
