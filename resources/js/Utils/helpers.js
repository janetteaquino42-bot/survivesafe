/**
 * Format date to a readable string
 */
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

/**
 * Format date to short format
 */
export const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number || 0);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text) => {
    if (!text) return "";
    return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Get time ago string (e.g., "2 hours ago")
 */
export const timeAgo = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return count === 1
                ? `1 ${interval.label} ago`
                : `${count} ${interval.label}s ago`;
        }
    }

    return "just now";
};
