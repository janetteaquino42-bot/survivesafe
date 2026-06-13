export default function Avatar({ user, size = "md" }) {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
    };

    const sizeClass = sizes[size] || sizes.md;

    if (user.profile_image) {
        return (
            <img
                src={user.profile_image}
                alt={user.full_name || `${user.first_name} ${user.last_name}`}
                className={`${sizeClass} rounded-full object-cover`}
            />
        );
    }

    // Fallback to initials
    const initials = user.first_name && user.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`
        : (user.first_name || user.last_name || "U")[0];

    return (
        <div className={`${sizeClass} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold uppercase`}>
            {initials}
        </div>
    );
}
