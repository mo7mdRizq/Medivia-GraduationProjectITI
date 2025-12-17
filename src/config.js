// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_URL}/auth/login`,
        REGISTER: `${API_URL}/auth/register`,
        RESET_PASSWORD: `${API_URL}/auth/reset-password`
    }
}

// EmailJS Configuration
export const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
}

// Reset Password Link
export const RESET_PASSWORD_URL = import.meta.env.VITE_RESET_PASSWORD_URL || 'http://localhost:5173/reset-password'

export default {
    API_URL,
    API_ENDPOINTS,
    EMAILJS_CONFIG,
    RESET_PASSWORD_URL
}
