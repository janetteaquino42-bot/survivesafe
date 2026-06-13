/**
 * Common Form Validation Utilities
 * Provides reusable validation functions for consistent form validation across the application
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return "Email is required";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address";
    }
    
    return null;
};

/**
 * Validates a required field
 * @param {any} value - The value to validate
 * @param {string} fieldName - The field name for error message
 * @returns {string|null} - Error message or null if valid
 */
export const validateRequired = (value, fieldName = "This field") => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`;
    }
    return null;
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum password length (default: 8)
 * @returns {string|null} - Error message or null if valid
 */
export const validatePassword = (password, minLength = 8) => {
    if (!password) return "Password is required";
    
    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters`;
    }
    
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    
    if (!/\d/.test(password)) {
        return "Password must contain at least one number";
    }
    
    return null;
};

/**
 * Validates password confirmation
 * @param {string} password - The original password
 * @param {string} confirmation - The confirmation password
 * @returns {string|null} - Error message or null if valid
 */
export const validatePasswordConfirmation = (password, confirmation) => {
    if (!confirmation) return "Password confirmation is required";
    
    if (password !== confirmation) {
        return "Passwords do not match";
    }
    
    return null;
};

/**
 * Validates file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5)
 * @returns {string|null} - Error message or null if valid
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
    if (!file) return null;
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size must not exceed ${maxSizeMB}MB`;
    }
    
    return null;
};

/**
 * Validates file type
 * @param {File} file - The file to validate
 * @param {Array} allowedTypes - Array of allowed file types/extensions
 * @returns {string|null} - Error message or null if valid
 */
export const validateFileType = (file, allowedTypes = ['jpeg', 'jpg', 'png']) => {
    if (!file) return null;
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileType = file.type.split('/')[1]?.toLowerCase();
    
    const isValidExtension = allowedTypes.some(type => 
        fileExtension === type || fileType === type
    );
    
    if (!isValidExtension) {
        return `File must be one of the following types: ${allowedTypes.join(', ')}`;
    }
    
    return null;
};

/**
 * Validates coordinates (latitude and longitude)
 * @param {number} latitude - The latitude value
 * @param {number} longitude - The longitude value
 * @returns {string|null} - Error message or null if valid
 */
export const validateCoordinates = (latitude, longitude) => {
    if (latitude === null || longitude === null || latitude === undefined || longitude === undefined) {
        return "Please select a location on the map";
    }
    
    if (latitude < -90 || latitude > 90) {
        return "Invalid latitude value";
    }
    
    if (longitude < -180 || longitude > 180) {
        return "Invalid longitude value";
    }
    
    return null;
};

/**
 * Utility to run multiple validators and return the first error
 * @param {any} value - The value to validate
 * @param {Array} validators - Array of validator functions
 * @returns {string|null} - First error message or null if all pass
 */
export const runValidators = (value, validators) => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }
    return null;
};

/**
 * Utility to validate an entire form object
 * @param {Object} data - The form data object
 * @param {Object} rules - Validation rules object where keys match data keys
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateForm = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const value = data[field];
        const validators = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
        
        const error = runValidators(value, validators);
        if (error) {
            errors[field] = error;
        }
    });
    
    return errors;
};