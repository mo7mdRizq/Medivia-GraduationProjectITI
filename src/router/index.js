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
    // 1. Update Title
    document.title = to.meta.title || 'Medivia - Medical Story. One Platform.'

    // 2. Access Control
    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true'

    if (authRequired && !loggedIn) {
        return next('/login')
    }

    // 3. Prevent logged-in users from visiting Auth pages
    if (loggedIn && publicPages.includes(to.path) && to.path !== '/reset-password') {
        return next('/')
    }

    next()
})

export default router
