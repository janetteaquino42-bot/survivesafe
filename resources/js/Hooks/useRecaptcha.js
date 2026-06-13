import { useEffect, useState } from 'react';

/**
 * Custom hook for Google reCAPTCHA v3
 * @param {string} siteKey - Your Google reCAPTCHA site key
 * @returns {Object} - { executeRecaptcha, recaptchaLoaded }
 */
export const useRecaptcha = (siteKey) => {
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

    useEffect(() => {
        // Check if reCAPTCHA script is already loaded
        if (window.grecaptcha && window.grecaptcha.ready) {
            setRecaptchaLoaded(true);
            return;
        }

        // Load reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            if (window.grecaptcha) {
                window.grecaptcha.ready(() => {
                    setRecaptchaLoaded(true);
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup: remove script on unmount
            const existingScript = document.querySelector(`script[src*="google.com/recaptcha"]`);
            if (existingScript) {
                existingScript.remove();
            }
            // Clean up grecaptcha badge
            const badge = document.querySelector('.grecaptcha-badge');
            if (badge) {
                badge.remove();
            }
        };
    }, [siteKey]);

    /**
     * Execute reCAPTCHA and get token
     * @param {string} action - The action name for this reCAPTCHA execution
     * @returns {Promise<string>} - Returns the reCAPTCHA token
     */
    const executeRecaptcha = async (action = 'submit') => {
        if (!recaptchaLoaded || !window.grecaptcha) {
            throw new Error('reCAPTCHA not loaded yet');
        }

        try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            return token;
        } catch (error) {
            console.error('reCAPTCHA execution failed:', error);
            throw error;
        }
    };

    return { executeRecaptcha, recaptchaLoaded };
};
