// Color helper for dynamic Tailwind classes
// Tailwind requires complete class names to be present in the code for JIT compilation

const colorClasses = {
    red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        border: 'border-red-600'
    },
    orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-600'
    },
    amber: {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        border: 'border-amber-600'
    },
    yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        border: 'border-yellow-600'
    },
    lime: {
        bg: 'bg-lime-100',
        text: 'text-lime-600',
        border: 'border-lime-600'
    },
    green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-600'
    },
    emerald: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        border: 'border-emerald-600'
    },
    teal: {
        bg: 'bg-teal-100',
        text: 'text-teal-600',
        border: 'border-teal-600'
    },
    cyan: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-600',
        border: 'border-cyan-600'
    },
    sky: {
        bg: 'bg-sky-100',
        text: 'text-sky-600',
        border: 'border-sky-600'
    },
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-600'
    },
    indigo: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-600',
        border: 'border-indigo-600'
    },
    violet: {
        bg: 'bg-violet-100',
        text: 'text-violet-600',
        border: 'border-violet-600'
    },
    purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-600'
    },
    fuchsia: {
        bg: 'bg-fuchsia-100',
        text: 'text-fuchsia-600',
        border: 'border-fuchsia-600'
    },
    pink: {
        bg: 'bg-pink-100',
        text: 'text-pink-600',
        border: 'border-pink-600'
    },
    rose: {
        bg: 'bg-rose-100',
        text: 'text-rose-600',
        border: 'border-rose-600'
    },
    slate: {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-600'
    },
    gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-600'
    },
    zinc: {
        bg: 'bg-zinc-100',
        text: 'text-zinc-600',
        border: 'border-zinc-600'
    },
    neutral: {
        bg: 'bg-neutral-100',
        text: 'text-neutral-600',
        border: 'border-neutral-600'
    },
    stone: {
        bg: 'bg-stone-100',
        text: 'text-stone-600',
        border: 'border-stone-600'
    }
};

/**
 * Get Tailwind classes for a given color
 * @param {string} color - The color name (e.g., 'blue', 'red', 'emerald')
 * @returns {object} Object containing bg, text, and border classes
 */
export const getColorClasses = (color) => {
    return colorClasses[color] || colorClasses.blue; // Default to blue if color not found
};

/**
 * Get all available color names
 * @returns {array} Array of color names
 */
export const getAvailableColors = () => {
    return Object.keys(colorClasses);
};
