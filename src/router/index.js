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
            path: '/select-role',
            name: 'select-role',
            component: () => import('../views/RoleSelectionView.vue'),
            meta: { title: 'Select Your Role - Medivia', requiresAuth: true }
        },
        // Admin Routes
        {
            path: '/admin',
            component: () => import('../layouts/AdminLayout.vue'),
            meta: { requiresAuth: true }, // Placeholder for auth guard
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
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue')
                },
                {
                    path: 'history',
                    name: 'history',
                    component: () => import('../views/MedicalHistory.vue')
                },
                {
                    path: 'prescriptions',
                    name: 'prescriptions',
                    component: () => import('../views/Prescriptions.vue')
                },
                {
                    path: 'lab-results',
                    name: 'lab-results',
                    component: () => import('../views/LabResults.vue')
                },
                {
                    path: 'appointments',
                    name: 'appointments',
                    component: () => import('../views/Appointments.vue')
                },
                {
                    path: 'visits',
                    name: 'visits',
                    component: () => import('../views/Visits.vue')
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('../views/ProfileSettings.vue')
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    // Set page title
    document.title = to.meta.title || 'Medivia - Medical Story. One Platform.'

    // Check authentication for protected routes
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const userRole = localStorage.getItem('userRole')
    const publicRoutes = ['landing', 'login', 'register', 'forgot-password', 'reset-password']

    // If user is not authenticated and trying to access protected route
    if (!publicRoutes.includes(to.name) && !isAuthenticated) {
        return next({ name: 'login' })
    }

    // If user is authenticated but hasn't selected a role yet
    if (isAuthenticated && !userRole && to.name !== 'select-role' && !publicRoutes.includes(to.name)) {
        return next({ name: 'select-role' })
    }

    // If user already selected a role and tries to go to role selection, redirect to appropriate dashboard
    if (to.name === 'select-role' && userRole) {
        if (userRole === 'admin') {
            return next({ name: 'admin-dashboard' })
        } else if (userRole === 'patient') {
            return next({ path: '/dashboard' })
        } else if (userRole === 'doctor') {
            return next({ path: '/doctor/dashboard' })
        }
    }

    // Role-based access control for admin routes
    if (to.path.startsWith('/admin') && userRole !== 'admin') {
        return next({ name: 'login' })
    }

    // Role-based access control for patient routes
    if (to.path.startsWith('/dashboard') && userRole !== 'patient' && userRole !== 'admin') {
        return next({ name: 'select-role' })
    }

    // Role-based access control for doctor routes
    if (to.path.startsWith('/doctor') && userRole !== 'doctor' && userRole !== 'admin') {
        return next({ name: 'select-role' })
    }

    next()
})

export default router
