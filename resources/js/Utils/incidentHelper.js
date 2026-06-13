import { Flame, Droplets, Mountain, AlertTriangle } from "lucide-react";

// Incident Types Configuration
export const INCIDENT_TYPES = {
    fire: {
        label: "Fire",
        icon: Flame,
        color: "#ef4444", // red
        bgColor: "#ef44441A", // red with opacity
    },
    flood: {
        label: "Flood",
        icon: Droplets,
        color: "#3b82f6", // blue
        bgColor: "#3b82f61A", // blue with opacity
    },
    earthquake: {
        label: "Earthquake",
        icon: Mountain,
        color: "#664b33", // brown
        bgColor: "#664b331A", // brown with opacity
    },
    landslide: {
        label: "Landslide",
        icon: AlertTriangle,
        color: "#eab308", // yellow
        bgColor: "#eab3081A", // yellow with opacity
    },
};

// Status Configuration
export const INCIDENT_STATUS = {
    active: {
        label: "Active",
        color: "#eab308", // yellow
        bgColor: "#eab3081A",
    },
    verified: {
        label: "Verified",
        color: "#3b82f6", // blue
        bgColor: "#3b82f61A",
    },
    resolved: {
        label: "Resolved",
        color: "#10b981", // green
        bgColor: "#10b9811A",
    },
};

// Severity Configuration
export const INCIDENT_SEVERITY = {
    low: {
        label: "Low",
        color: "#eab308", // yellow
        bgColor: "#eab3081A",
    },
    medium: {
        label: "Medium",
        color: "#f59e0b", // orange
        bgColor: "#f59e0b1A",
    },
    high: {
        label: "High",
        color: "#ef4444", // red
        bgColor: "#ef44441A",
    },
};

// Helper Functions
export const getIncidentTypeConfig = (type) => {
    return INCIDENT_TYPES[type?.toLowerCase()] || INCIDENT_TYPES.fire;
};

export const getIncidentStatusConfig = (status) => {
    return INCIDENT_STATUS[status?.toLowerCase()] || INCIDENT_STATUS.active;
};

export const getIncidentSeverityConfig = (severity) => {
    return INCIDENT_SEVERITY[severity?.toLowerCase()] || INCIDENT_SEVERITY.low;
};

// Get all types as array for filters
export const getIncidentTypesArray = () => {
    return Object.entries(INCIDENT_TYPES).map(([key, value]) => ({
        value: key,
        label: value.label,
    }));
};

// Get all statuses as array for filters
export const getIncidentStatusArray = () => {
    return Object.entries(INCIDENT_STATUS).map(([key, value]) => ({
        value: key,
        label: value.label,
    }));
};

// Get all severities as array for filters
export const getIncidentSeverityArray = () => {
    return Object.entries(INCIDENT_SEVERITY).map(([key, value]) => ({
        value: key,
        label: value.label,
    }));
};

// Chart Colors
export const CHART_COLORS = {
    fire: "#ef4444",
    flood: "#3b82f6",
    earthquake: "#664b33",
    landslide: "#eab308",
    active: "#eab308",
    verified: "#3b82f6",
    resolved: "#10b981",
    low: "#eab308",
    medium: "#f59e0b",
    high: "#ef4444",
};
