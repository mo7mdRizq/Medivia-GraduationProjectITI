import { ref } from 'vue';

const currentUser = ref({
    name: 'Guest',
    email: '',
    role: 'patient',
    isAuthenticated: false
});

export const useUserStore = () => {
    const login = (user) => {
        currentUser.value = {
            name: user.name,
            email: user.email,
            role: user.role,
            isAuthenticated: true
        };
        // Persist to localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
    };

    const logout = () => {
        currentUser.value = {
            name: 'Guest',
            email: '',
            role: 'patient',
            isAuthenticated: false
        };
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
    };

    const loadFromStorage = () => {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuthenticated) {
            currentUser.value = {
                name: localStorage.getItem('userName') || 'User',
                email: localStorage.getItem('userEmail') || '',
                role: localStorage.getItem('userRole') || 'patient',
                isAuthenticated: true
            };
        }
    };

    return {
        currentUser,
        login,
        logout,
        loadFromStorage
    };
};
