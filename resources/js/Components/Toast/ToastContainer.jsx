import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/Contexts/ToastContext';
import Toast from './Toast';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    // Create portal to render toasts at the document body level
    const toastContainer = (
        <div 
            className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none"
            aria-live="polite"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast 
                        toast={toast} 
                        onRemove={removeToast}
                    />
                </div>
            ))}
        </div>
    );

    // Render portal if document is available (client-side)
    if (typeof document !== 'undefined') {
        return createPortal(toastContainer, document.body);
    }

    return null;
};

export default ToastContainer;