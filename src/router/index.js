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
            meta: { requiresAuth: true, role: 'admin' },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: () => import('../views/admin/AdminDashboardView.vue'),
                    meta: { title: 'Dashboard - Medivia Admin' }
                },
                {
                    path: 'appointments',
                    name: 'admin-appointments',
                    component: () => import('../views/admin/AdminAppointmentsView.vue'),
                    meta: { title: 'Appointments - Medivia Admin' }
                },
            ]
        },
        // Patient Dashboard Routes
        {
            path: '/dashboard',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true, role: 'patient' },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue'),
                    meta: { title: 'My Dashboard - Medivia' }
                },
                {
                    path: 'history',
                    name: 'patient-history',
                    component: () => import('../views/MedicalHistory.vue'),
                    meta: { title: 'Medical History - Medivia' }
                },
                {
                    path: 'prescriptions',
                    name: 'patient-prescriptions',
                    component: () => import('../views/Prescriptions.vue'),
                    meta: { title: 'Prescriptions - Medivia' }
                },
                {
                    path: 'lab-results',
                    name: 'patient-lab-results',
                    component: () => import('../views/LabResults.vue'),
                    meta: { title: 'Lab Results - Medivia' }
                },
                {
                    path: 'appointments',
                    name: 'patient-appointments',
                    component: () => import('../views/Appointments.vue'),
                    meta: { title: 'My Appointments - Medivia' }
                },
                {
                    path: 'visits',
                    name: 'patient-visits',
                    component: () => import('../views/Visits.vue'),
                    meta: { title: 'My Visits - Medivia' }
                },
                {
                    path: 'profile',
                    name: 'patient-profile',
                    component: () => import('../views/ProfileSettings.vue'),
                    meta: { title: 'Profile Settings - Medivia' }
                }
            ]
        },

        // Doctor Routes (Nested under DashboardLayout)
        {
            path: '/doctor-space', // Virtual parent path for grouping
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true, role: 'doctor' },
            children: [
                {
                    path: '/doctor-dashboard',
                    name: 'doctor-dashboard-root',
                    component: () => import('../views/DoctorDashboard.vue'),
                    meta: { title: 'Doctor Dashboard - Medivia' }
                },
                {
                    path: '/patients',
                    name: 'patients',
                    component: () => import('../views/PatientsView.vue'),
                    meta: { title: 'Patients - Medivia' }
                },
                {
                    path: '/patients/:id',
                    name: 'patient-details',
                    component: () => import('../views/PatientProfileView.vue'),
                    meta: { title: 'Patient Profile - Medivia' }
                },
                {
                    path: '/visits',
                    name: 'visits',
                    component: () => import('../views/VisitsView.vue'),
                    meta: { title: 'Visits - Medivia' }
                },
                {
                    path: '/prescriptions',
                    name: 'doctor-prescriptions',
                    component: () => import('../views/PrescriptionsView.vue'),
                    meta: { title: 'Prescriptions - Medivia' }
                },
                {
                    path: '/appointments',
                    name: 'doctor-appointments',
                    component: () => import('../views/AppointmentsView.vue'),
                    meta: { title: 'Appointments - Medivia' }
                },
                {
                    path: '/profile',
                    name: 'doctor-profile',
                    component: () => import('../views/ProfileSettingsView.vue'),
                    meta: { title: 'Profile Settings - Medivia' }
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Medivia - Medical Story. One Platform.'

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const userRole = localStorage.getItem('userRole')
    const publicRoutes = ['landing', 'login', 'register', 'forgot-password', 'reset-password']

    // 1. If route requires auth and user is not authenticated
    if (!publicRoutes.includes(to.name) && !isAuthenticated && to.meta.requiresAuth) {
        return next({ name: 'login' })
    }

    // 2. Prevent logged-in users from visiting Auth pages
    const authPages = ['login', 'register', 'forgot-password', 'reset-password']
    if (isAuthenticated && authPages.includes(to.name)) {
        if (userRole === 'doctor') return next({ name: 'doctor-dashboard-root' })
        return next({ name: 'dashboard' })
    }

    // 3. Role Based Access Control
    if (to.meta.role && to.meta.role !== userRole && userRole !== 'admin') {
        // Prevent Patient from accessing Doctor routes AND vice versa
        if (userRole === 'doctor') return next({ name: 'doctor-dashboard-root' })
        return next({ name: 'dashboard' })
    }

    next()
})

export default router
