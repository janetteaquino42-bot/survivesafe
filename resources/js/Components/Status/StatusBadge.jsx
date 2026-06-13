import { Chip } from "@heroui/react";
import {
    getIncidentTypeConfig,
    getIncidentStatusConfig,
    getIncidentSeverityConfig
} from "@/Utils/incidentHelper";

export default function StatusBadge({
    status,
    label,
    size = "md",
    variant = "flat",
    className = "",
    customColors = {},
    ...props
}) {
    const getConfigAndColor = () => {
        const statusLower = status?.toLowerCase();

        // Try to get from incident helper first
        let config = null;

        // Check if it's a type
        if (['fire', 'flood', 'earthquake', 'landslide'].includes(statusLower)) {
            config = getIncidentTypeConfig(statusLower);
        }
        // Check if it's a status
        else if (['active', 'verified', 'resolved'].includes(statusLower)) {
            config = getIncidentStatusConfig(statusLower);
        }
        // Check if it's a severity
        else if (['low', 'medium', 'high'].includes(statusLower)) {
            config = getIncidentSeverityConfig(statusLower);
        }

        if (config) {
            return {
                bg: config.bgColor,
                text: config.color,
                label: config.label
            };
        }

        // Fallback colors for other statuses
        const fallbackColors = {
            pending: { bg: '#eab3081A', text: '#eab308' },
            approved: { bg: '#10b9811A', text: '#10b981' },
            declined: { bg: '#ef44441A', text: '#ef4444' },
            deleted: { bg: '#ef44441A', text: '#ef4444' },
            resident: { bg: '#10b9811A', text: '#10b981' },
            officer: { bg: '#8b5cf61A', text: '#8b5cf6' },
            head_officer: { bg: '#3b82f61A', text: '#3b82f6' },

            ...customColors,
        };

        const fallback = fallbackColors[statusLower] || { bg: '#6b72801A', text: '#6b7280' };
        return {
            bg: fallback.bg,
            text: fallback.text,
            label: status?.charAt(0).toUpperCase() + status?.slice(1).replace(/_/g, " ")
        };
    };

    const { bg, text, label: configLabel } = getConfigAndColor();
    const displayLabel = label || configLabel;

    return (
        <Chip
            variant={variant}
            size={size}
            radius="lg"
            style={{
                backgroundColor: bg,
                color: text,
            }}
            className={`uppercase font-semibold text-xs ${className}`}
            classNames={{
                base: "px-3 py-1",
                content: "font-semibold",
            }}
            {...props}
        >
            {displayLabel}
        </Chip>
    );
}
