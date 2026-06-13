import { useToast as useToastContext } from '@/Contexts/ToastContext';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

// Main toast hook
export const useToast = () => {
    return useToastContext();
};

// Hook that automatically handles Inertia flash messages
export const useFlashMessages = () => {
    const { props } = usePage();
    const { handleFlashMessage } = useToast();

    useEffect(() => {
        // Handle Laravel flash messages from session
        if (props.flash && Object.keys(props.flash).length > 0) {
            handleFlashMessage(props.flash);
        }
    }, [props.flash]); // Remove handleFlashMessage from deps to prevent loops
};

// Hook for handling form errors
export const useFormToast = () => {
    const toast = useToast();

    const handleFormErrors = (errors, options = {}) => {
        if (errors && typeof errors === 'object') {
            toast.validationErrors(errors, options);
        }
    };

    const handleFormSuccess = (message = 'Operation completed successfully!', options = {}) => {
        toast.success(message, options);
    };

    return {
        ...toast,
        handleFormErrors,
        handleFormSuccess
    };
};

// Hook for API responses
export const useApiToast = () => {
    const toast = useToast();

    const handleApiResponse = (response, options = {}) => {
        if (response.success) {
            toast.success(response.message || 'Operation completed successfully!', options);
        } else if (response.error) {
            toast.error(response.message || 'An error occurred', options);
        } else if (response.errors) {
            toast.validationErrors(response.errors, options);
        }
    };

    const handleApiError = (error, options = {}) => {
        if (error.response?.data?.message) {
            toast.error(error.response.data.message, options);
        } else if (error.response?.data?.errors) {
            toast.validationErrors(error.response.data.errors, options);
        } else if (error.message) {
            toast.error(error.message, options);
        } else {
            toast.error('An unexpected error occurred', options);
        }
    };

    return {
        ...toast,
        handleApiResponse,
        handleApiError
    };
};

export default useToast;