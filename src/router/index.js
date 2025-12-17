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
        }
    ]
})

router.beforeEach((to, from, next) => {
    // Set page title
    document.title = to.meta.title || 'Medivia - Medical Story. One Platform.'

    // Check authentication for protected routes
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const publicRoutes = ['landing', 'login', 'register', 'forgot-password', 'reset-password']

    // If route requires auth and user is not authenticated, redirect to login
    if (!publicRoutes.includes(to.name) && !isAuthenticated) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
