import { createRouter, createWebHistory } from 'vue-router'
import { db } from '../util/storage'

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
            name: 'home',
            component: () => import('../views/HomeView.vue'),
            meta: { title: 'Welcome - Medivia', requiresAuth: true }
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
            meta: { title: 'Select Your Role - Medivia' }
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
        // Doctor Routes
        {
            path: '/doctor',
            component: () => import('../layouts/DoctorLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'doctor-dashboard',
                    component: () => import('../views/doctor/DoctorDashboardView.vue'),
                    meta: { title: 'Dashboard - Medivia Doctor' }
                },
                {
                    path: 'patients',
                    name: 'doctor-patients',
                    component: () => import('../views/doctor/DoctorPatientsView.vue'),
                    meta: { title: 'My Patients - Medivia Doctor' }
                },
                {
                    path: 'appointments',
                    name: 'doctor-appointments',
                    component: () => import('../views/doctor/DoctorAppointmentsView.vue'),
                    meta: { title: 'Appointments - Medivia Doctor' }
                },
                {
                    path: 'profile',
                    name: 'doctor-profile',
                    component: () => import('../views/doctor/DoctorProfileView.vue'),
                    meta: { title: 'Profile - Medivia Doctor' }
                },
                {
                    path: 'visits',
                    name: 'doctor-visits',
                    component: () => import('../views/doctor/DoctorVisitsView.vue'),
                    meta: { title: 'Visits - Medivia Doctor' }
                },
                {
                    path: 'prescriptions',
                    name: 'doctor-prescriptions',
                    component: () => import('../views/doctor/DoctorPrescriptionsView.vue'),
                    meta: { title: 'Prescriptions - Medivia Doctor' }
                },
                {
                    path: '',
                    redirect: { name: 'doctor-dashboard' }
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
                    component: () => import('../views/patient/Dashboard.vue')
                },
                {
                    path: 'history',
                    name: 'history',
                    component: () => import('../views/patient/MedicalHistory.vue')
                },
                {
                    path: 'prescriptions',
                    name: 'prescriptions',
                    component: () => import('../views/patient/Prescriptions.vue')
                },
                {
                    path: 'lab-results',
                    name: 'lab-results',
                    component: () => import('../views/patient/LabResults.vue')
                },
                {
                    path: 'appointments',
                    name: 'appointments',
                    component: () => import('../views/patient/Appointments.vue')
                },
                {
                    path: 'visits',
                    name: 'visits',
                    component: () => import('../views/patient/Visits.vue')
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('../views/patient/ProfileSettings.vue')
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    // Set page title
    document.title = to.meta.title || 'Medivia - Medical Story. One Platform.'

    // Get Auth State from db
    const isAuthenticated = db.get('isAuthenticated') === true
    const userRole = db.get('userRole')
    const pendingRole = db.get('pendingRole')

    const publicRoutes = ['login', 'register', 'forgot-password', 'reset-password', 'select-role']

    // 1. If unauthenticated user tries to access home, redirect to select-role
    if (to.name === 'home' && !isAuthenticated) {
        return next({ name: 'select-role' })
    }

    // 2. If user is on select-role and already authenticated with a role, send to home
    if (to.name === 'select-role') {
        if (isAuthenticated && userRole) {
            // Already logged in with a role, send to home page
            return next({ name: 'home' })
        }
        return next()
    }

    // 3. Auth Guard
    if (!publicRoutes.includes(to.name) && !isAuthenticated) {
        return next({ name: 'login' })
    }

    // 4. Flow Guard: Must select role before Register/Login
    if ((to.name === 'register' || to.name === 'login') && !isAuthenticated && !pendingRole) {
        return next({ name: 'select-role' })
    }

    // 4. Role-based access control
    if (to.path.startsWith('/admin') && userRole !== 'admin') {
        return next({ name: 'select-role' })
    }

    if (to.path.startsWith('/dashboard') && userRole !== 'patient' && userRole !== 'admin') {
        // Patients and Admins can see patient dashboard
        return next({ name: 'select-role' })
    }

    if (to.path.startsWith('/doctor') && userRole !== 'doctor' && userRole !== 'admin') {
        // Doctors and Admins can see doctor dashboard
        return next({ name: 'select-role' })
    }

    next()
})

export default router
