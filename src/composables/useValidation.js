import { ref } from 'vue';

/**
 * Composable for strict, production-ready form validation.
 * Logic is separated from UI.
 */
export function useValidation() {
    const errors = ref({});

    // 1. Name Fields: Alphabetic only, no numbers/special characters, non-empty.
    const validateName = (fieldName, value, label = 'Name') => {
        if (!value || !value.trim()) {
            errors.value[fieldName] = `${label} is required`;
            return false;
        }
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value.trim())) {
            errors.value[fieldName] = `${label} should contain only alphabetic characters`;
            return false;
        }
        delete errors.value[fieldName];
        return true;
    };

    // 2. Age: Numbers only, 1-90, no negative or unrealistic.
    const validateAge = (fieldName, value) => {
        if (value === undefined || value === null || value === '') {
            errors.value[fieldName] = 'Age is required';
            return false;
        }
        const age = Number(value);
        if (isNaN(age) || !Number.isInteger(age)) {
            errors.value[fieldName] = 'Age must be a whole number';
            return false;
        }
        if (age < 1 || age > 90) {
            errors.value[fieldName] = 'Age must be between 1 and 90';
            return false;
        }
        delete errors.value[fieldName];
        return true;
    };

    // 3. Date of Birth: No future dates, consistency with age.
    const validateDOB = (fieldName, dobValue, ageValue) => {
        if (!dobValue) {
            errors.value[fieldName] = 'Date of birth is required';
            return false;
        }

        const dob = new Date(dobValue);
        const today = new Date();

        if (isNaN(dob.getTime())) {
            errors.value[fieldName] = 'Invalid date format';
            return false;
        }

        if (dob > today) {
            errors.value[fieldName] = 'Date of birth cannot be in the future';
            return false;
        }

        // Logical consistency with age (if age is provided)
        if (ageValue !== undefined && ageValue !== null && ageValue !== '') {
            const age = Number(ageValue);
            let calculatedAge = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                calculatedAge--;
            }

            if (calculatedAge !== age) {
                errors.value[fieldName] = `Date of birth does not match provided age (${age})`;
                return false;
            }
        }

        delete errors.value[fieldName];
        return true;
    };

    // 4. Email: Valid format, no malformed patterns.
    const validateEmail = (fieldName, value) => {
        if (!value || !value.trim()) {
            errors.value[fieldName] = 'Email is required';
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
            errors.value[fieldName] = 'Please enter a valid email address';
            return false;
        }
        delete errors.value[fieldName];
        return true;
    };

    // 5. Phone Number: Egyptian Format (11 digits, starts with 010, 011, 012, 015)
    const validatePhone = (fieldName, value) => {
        if (!value) {
            errors.value[fieldName] = 'Phone number is required';
            return false;
        }

        // Remove common separators
        const cleanNumber = value.trim().replace(/[\s\-]/g, '');

        if (!/^\d+$/.test(cleanNumber)) {
            errors.value[fieldName] = 'Phone number must contain only digits';
            return false;
        }

        if (cleanNumber.length !== 11) {
            errors.value[fieldName] = 'Egyptian phone number must be exactly 11 digits';
            return false;
        }

        const validPrefixes = ['010', '011', '012', '015'];
        const prefix = cleanNumber.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
            errors.value[fieldName] = 'Phone must start with 010, 011, 012, or 015';
            return false;
        }

        delete errors.value[fieldName];
        return true;
    };

    // Generic Required
    const validateRequired = (fieldName, value, label = 'This field') => {
        if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
            errors.value[fieldName] = `${label} is required`;
            return false;
        }
        delete errors.value[fieldName];
        return true;
    };

    /**
     * Helper to validate multiple fields at once.
     * @param {Object} rules - Map of field names to validation functions/args.
     */
    const validateForm = (formData, config) => {
        errors.value = {}; // Reset
        let isValid = true;

        for (const [field, validateFn] of Object.entries(config)) {
            const result = validateFn(formData[field]);
            if (!result) isValid = false;
        }

        return isValid;
    };

    const clearErrors = () => {
        errors.value = {};
    };

    return {
        errors,
        validateName,
        validateAge,
        validateDOB,
        validateEmail,
        validatePhone,
        validateRequired,
        validateForm,
        clearErrors
    };
}
