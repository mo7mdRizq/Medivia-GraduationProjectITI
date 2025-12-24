import { createRouter, createWebHistory } from 'vue-router'
// We will import views as we create them
// import Landing from '../views/Landing.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
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

export default router
