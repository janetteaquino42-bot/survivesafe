import { useFlashMessages } from '@/Hooks/useToast';

/**
 * FlashMessageHandler - Component that automatically handles Laravel flash messages
 * Include this in your layouts or pages to automatically show flash messages as toasts
 */
const FlashMessageHandler = () => {
    useFlashMessages();
    return null; // This component doesn't render anything
};

export default FlashMessageHandler;