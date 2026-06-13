import React, { useEffect, useState } from 'react';
import { 
    FiCheckCircle, 
    FiXCircle, 
    FiAlertTriangle, 
    FiInfo, 
    FiX 
} from 'react-icons/fi';

const Toast = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300); // Match animation duration
    };

    const getToastStyles = () => {
        const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm transition-all duration-300 transform max-w-md w-full";
        
        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50/95 border-green-500 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50/95 border-red-500 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50/95 border-yellow-500 text-yellow-800`;
            case 'info':
            default:
                return `${baseStyles} bg-blue-50/95 border-blue-500 text-blue-800`;
        }
    };

    const getIcon = () => {
        const iconStyles = "w-5 h-5 flex-shrink-0 mt-0.5";
        
        switch (toast.type) {
            case 'success':
                return <FiCheckCircle className={`${iconStyles} text-green-500`} />;
            case 'error':
                return <FiXCircle className={`${iconStyles} text-red-500`} />;
            case 'warning':
                return <FiAlertTriangle className={`${iconStyles} text-yellow-500`} />;
            case 'info':
            default:
                return <FiInfo className={`${iconStyles} text-blue-500`} />;
        }
    };

    const getAnimationClasses = () => {
        if (isRemoving) {
            return "opacity-0 scale-95 translate-x-full";
        }
        if (isVisible) {
            return "opacity-100 scale-100 translate-x-0";
        }
        return "opacity-0 scale-95 translate-x-full";
    };

    return (
        <div className={`${getToastStyles()} ${getAnimationClasses()}`}>
            {/* Icon */}
            {getIcon()}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5 break-words">
                    {toast.message}
                </p>
                
                {/* Action button if provided */}
                {toast.action && (
                    <button
                        onClick={toast.action.onClick}
                        className="mt-2 text-xs font-medium underline hover:no-underline transition-colors"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>
            
            {/* Close button */}
            <button
                onClick={handleRemove}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close notification"
            >
                <FiX className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;