/**
 * Mock Auth API
 * Simulates backend interaction for authentication using localStorage
 */

const LATENCY = 1500; // Simulated network delay

export const authApi = {
    /**
     * Request a password reset link
     * @param {string} email 
     * @returns {Promise<Object>}
     */
    async requestPasswordReset(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const storedUserJSON = localStorage.getItem('registeredUser');

                if (!storedUserJSON) {
                    reject(new Error("No account found. Please register first."));
                    return;
                }

                const user = JSON.parse(storedUserJSON);

                if (user.email === email) {
                    // "Confirm Account" logic passed
                    resolve({
                        success: true,
                        message: `Reset link sent to ${email}`
                    });
                } else {
                    // Account existence check failed for this specific email
                    reject(new Error("Email address does not match our records."));
                }
            }, LATENCY);
        });
    }
};
