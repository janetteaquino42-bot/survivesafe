import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timeoutsRef = useRef(new Map());

    // Cleanup all timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((timeoutId) => {
                clearTimeout(timeoutId);
            });
            timeoutsRef.current.clear();
        };
    }, []);

    const removeToast = useCallback((id) => {
        // Clear timeout if it exists
        if (timeoutsRef.current.has(id)) {
            clearTimeout(timeoutsRef.current.get(id));
            timeoutsRef.current.delete(id);
        }

        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', options = {}) => {
        const id = Date.now() + Math.random();
        const duration = options.duration || (type === 'error' ? 6000 : 4000);

        const toast = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            duration,
            persistent: options.persistent || false,
            action: options.action || null,
            ...options
        };

        setToasts(prev => [...prev, toast]);

        // Auto-remove toast if not persistent
        if (!toast.persistent) {
            const timeoutId = setTimeout(() => {
                setToasts(currentToasts => {
                    const filtered = currentToasts.filter(t => t.id !== id);
                    return filtered;
                });

                // Clean up timeout reference
                if (timeoutsRef.current.has(id)) {
                    timeoutsRef.current.delete(id);
                }
            }, duration);

            // Store timeout reference
            timeoutsRef.current.set(id, timeoutId);
        }

        return id;
    }, []);

    const clearAllToasts = useCallback(() => {
        // Clear all timeouts
        timeoutsRef.current.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        timeoutsRef.current.clear();

        setToasts([]);
    }, []);

    // Convenience methods for different toast types
    const success = useCallback((message, options = {}) => {
        return addToast(message, 'success', options);
    }, [addToast]);

    const error = useCallback((message, options = {}) => {
        return addToast(message, 'error', options);
    }, [addToast]);

    const warning = useCallback((message, options = {}) => {
        return addToast(message, 'warning', options);
    }, [addToast]);

    const info = useCallback((message, options = {}) => {
        return addToast(message, 'info', options);
    }, [addToast]);

    // Handle validation errors
    const validationErrors = useCallback((errors, options = {}) => {
        if (typeof errors === 'object' && errors !== null) {
            // Handle Inertia validation errors object
            Object.entries(errors).forEach(([field, messages]) => {
                const errorMessages = Array.isArray(messages) ? messages : [messages];
                errorMessages.forEach(message => {
                    addToast(message, 'error', {
                        duration: 6000,
                        ...options
                    });
                });
            });
        } else if (typeof errors === 'string') {
            error(errors, options);
        }
    }, [addToast, error]);

    // Handle Laravel flash messages
    const handleFlashMessage = useCallback((flash) => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            error(flash.error);
        }
        if (flash.warning) {
            warning(flash.warning);
        }
        if (flash.info) {
            info(flash.info);
        }
        if (flash.status) {
            success(flash.status); // Laravel password reset uses 'status'
        }
        if (flash.message) {
            info(flash.message); // Generic messages as info
        }
    }, [success, error, warning, info]);

    const value = {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info,
        validationErrors,
        handleFlashMessage
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};