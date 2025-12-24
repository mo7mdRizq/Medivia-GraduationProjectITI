import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
    routes: [
        {
            path: '/',
            name: 'landing',
            component: () => import('../views/LandingView.vue'),
            meta: { title: 'Home - Medivia' }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { title: 'Login - Medivia' }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            meta: { title: 'Create Account - Medivia' }
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: () => import('../views/ForgotPasswordView.vue'),
            meta: { title: 'Recover Password - Medivia' }
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('../views/ResetPasswordView.vue'),
            meta: { title: 'Reset Password - Medivia' }
        },
        {
            path: '/admin',
            component: () => import('../layouts/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: () => import('../views/admin/AdminDashboardView.vue'),
                    meta: { title: 'Dashboard - Medivia Admin' }
                },
                {
                    path: 'patients',
                    name: 'admin-patients',
                    component: () => import('../views/admin/AdminPatientsView.vue'),
                    meta: { title: 'Patients Management - Medivia Admin' }
                },
                {
                    path: 'appointments',
                    name: 'admin-appointments',
                    component: () => import('../views/admin/AdminAppointmentsView.vue'),
                    meta: { title: 'Appointments Manager - Medivia Admin' }
                },
                {
                    path: 'settings',
                    name: 'admin-settings',
                    component: () => import('../views/admin/AdminSettingsView.vue'),
                    meta: { title: 'Settings - Medivia Admin' }
                },
                {
                    path: '',
                    redirect: { name: 'admin-dashboard' }
                }
            ]
        },
        // Patient Dashboard Routes
        {
            path: '/dashboard',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue'),
                    meta: { title: 'My Dashboard - Medivia' }
                },
                {
                    path: 'history',
                    name: 'history',
                    component: () => import('../views/MedicalHistory.vue'),
                    meta: { title: 'Medical History - Medivia' }
                },
                {
                    path: 'prescriptions',
                    name: 'prescriptions',
                    component: () => import('../views/Prescriptions.vue'),
                    meta: { title: 'Prescriptions - Medivia' }
                },
                {
                    path: 'lab-results',
                    name: 'lab-results',
                    component: () => import('../views/LabResults.vue'),
                    meta: { title: 'Lab Results - Medivia' }
                },
                {
                    path: 'appointments',
                    name: 'appointments',
                    component: () => import('../views/Appointments.vue'),
                    meta: { title: 'My Appointments - Medivia' }
                },
                {
                    path: 'visits',
                    name: 'visits',
                    component: () => import('../views/Visits.vue'),
                    meta: { title: 'My Visits - Medivia' }
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('../views/ProfileSettings.vue'),
                    meta: { title: 'Profile Settings - Medivia' }
                }
            ]
        },
        // Doctor Routes (from edit-doctor branch)
        {
            path: '/patients',
            name: 'patients',
            component: () => import('../views/PatientsView.vue'),
        },
        {
            path: '/visits',
            name: 'visits',
            component: () => import('../views/VisitsView.vue'),
        },
        {
            path: '/prescriptions',
            name: 'doctor-prescriptions',
            component: () => import('../views/PrescriptionsView.vue'),
        },
        {
            path: '/appointments',
            name: 'doctor-appointments',
            component: () => import('../views/AppointmentsView.vue'),
        },
        {
            path: '/profile',
            name: 'doctor-profile',
            component: () => import('../views/ProfileSettingsView.vue'),
        },
    ]
})

router.beforeEach((to, from, next) => {
    // Set page title
    document.title = to.meta.title || 'Medivia - Medical Story. One Platform.'

    // Check authentication for protected routes
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const publicRoutes = ['landing', 'login', 'register', 'forgot-password', 'reset-password']

    // If route requires auth and user is not authenticated, redirect to login
    if (!publicRoutes.includes(to.name) && !isAuthenticated && to.meta.requiresAuth) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
