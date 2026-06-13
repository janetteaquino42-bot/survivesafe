import {
    Shield,
    AlertTriangle,
    Users,
    Target,
    Award,
    Heart,
    Activity,
    Zap,
    TrendingUp,
    MapPin,
    Phone,
    Mail,
    Clock,
    Calendar,
    FileText,
    Megaphone,
    Building,
    Home,
    Flame,
    Droplets,
    Wind,
    CloudRain,
    Siren,
    Ambulance,
    Truck,
    Radio,
    BookOpen,
    GraduationCap,
    Briefcase,
    Settings,
    CheckCircle,
    XCircle,
    Info,
    Search,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Key,
    UserCheck,
    UserX,
    UserPlus,
    Database,
    Server,
    HardDrive,
    Wifi,
    WifiOff,
    Bluetooth,
    BatteryCharging,
    Battery,
    Power,
    Lightbulb,
    Sun,
    Moon,
    Star,
    CloudLightning,
    Umbrella,
    Navigation
} from 'lucide-react';

// Map of icon names to components
export const iconMap = {
    // Disaster/Emergency Icons
    'shield': Shield,
    'alert-triangle': AlertTriangle,
    'flame': Flame,
    'droplets': Droplets,
    'wind': Wind,
    'cloud-rain': CloudRain,
    'cloud-lightning': CloudLightning,
    'siren': Siren,
    'ambulance': Ambulance,
    'truck': Truck,

    // People/Community Icons
    'users': Users,
    'user-check': UserCheck,
    'user-x': UserX,
    'user-plus': UserPlus,
    'heart': Heart,

    // Action/Response Icons
    'target': Target,
    'activity': Activity,
    'zap': Zap,
    'trending-up': TrendingUp,
    'radio': Radio,

    // Award/Achievement Icons
    'award': Award,
    'check-circle': CheckCircle,
    'star': Star,

    // Communication Icons
    'phone': Phone,
    'mail': Mail,
    'megaphone': Megaphone,

    // Location/Navigation Icons
    'map-pin': MapPin,
    'navigation': Navigation,

    // Building/Infrastructure Icons
    'building': Building,
    'home': Home,

    // Time/Schedule Icons
    'clock': Clock,
    'calendar': Calendar,

    // Documents/Education Icons
    'file-text': FileText,
    'book-open': BookOpen,
    'graduation-cap': GraduationCap,

    // Work/Organization Icons
    'briefcase': Briefcase,
    'settings': Settings,

    // Status Icons
    'info': Info,
    'x-circle': XCircle,
    'eye': Eye,
    'eye-off': EyeOff,
    'search': Search,

    // Security Icons
    'lock': Lock,
    'unlock': Unlock,
    'key': Key,

    // Tech/Data Icons
    'database': Database,
    'server': Server,
    'hard-drive': HardDrive,
    'wifi': Wifi,
    'wifi-off': WifiOff,
    'bluetooth': Bluetooth,

    // Power/Energy Icons
    'battery-charging': BatteryCharging,
    'battery': Battery,
    'power': Power,
    'lightbulb': Lightbulb,

    // Weather Icons
    'sun': Sun,
    'moon': Moon,
    'umbrella': Umbrella,
};

// Get icon component by name
export const getIcon = (iconName) => {
    if (!iconName) return Shield; // Default icon
    const Icon = iconMap[iconName.toLowerCase()];
    return Icon || Shield; // Fallback to Shield if not found
};

// Get all available icon names for dropdown
export const getIconOptions = () => {
    return Object.keys(iconMap).sort();
};

// Get categorized icons for better UX
export const getCategorizedIcons = () => {
    return {
        'Disaster & Emergency': [
            'shield', 'alert-triangle', 'flame', 'droplets', 'wind',
            'cloud-rain', 'cloud-lightning', 'siren', 'ambulance', 'truck'
        ],
        'People & Community': [
            'users', 'user-check', 'user-x', 'user-plus', 'heart'
        ],
        'Actions & Response': [
            'target', 'activity', 'zap', 'trending-up', 'radio',
            'award', 'check-circle', 'star'
        ],
        'Communication': [
            'phone', 'mail', 'megaphone'
        ],
        'Location': [
            'map-pin', 'navigation', 'building', 'home'
        ],
        'Time & Schedule': [
            'clock', 'calendar'
        ],
        'Education & Docs': [
            'file-text', 'book-open', 'graduation-cap', 'briefcase'
        ],
        'Status & Info': [
            'info', 'x-circle', 'eye', 'search', 'settings'
        ],
        'Weather': [
            'sun', 'moon', 'umbrella'
        ]
    };
};
