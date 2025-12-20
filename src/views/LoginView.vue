<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SocialAuthButtons from '../components/auth/SocialAuthButtons.vue'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const errors = ref({})

const validate = () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = 'Email address is required'
  } else if (email.value !== 'admin' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    // Allow 'admin' as a valid username, otherwise require valid email
    errors.value.email = 'Please enter a valid email address'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  }

  const isValid = Object.keys(errors.value).length === 0
  
  if (!isValid) {
      // Show first error as toast
      const firstError = Object.values(errors.value)[0]
      toast.error(firstError)
  }

  return isValid
}

const handleLogin = () => {
  if (validate()) {
    // Check for Admin Credentials
    if (email.value === 'admin' && password.value === 'admin207') {
       toast.success("Welcome, Administrator", {
          transition: toast.TRANSITIONS.ZOOM,
       })
       localStorage.setItem('isAuthenticated', 'true')
       localStorage.setItem('userRole', 'admin')
       localStorage.setItem('userName', 'Administrator')
       
       setTimeout(() => {
           router.push('/admin/dashboard')
       }, 500)
       return
    }

    // Normal User Login Simulation
    toast.success("Welcome back!", {
        transition: toast.TRANSITIONS.ZOOM,
    })
    
    // Set persistent auth state
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userRole', 'user')
    // Extract name from email for demo user profile
    const nameFromEmail = email.value.split('@')[0]
    // Capitalize first letter
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
    localStorage.setItem('userName', formattedName)
    
    // Slight delay to see the toast before redirect
    setTimeout(() => {
        router.push('/')
    }, 500)
  }
}
</script>

<template>
  <AuthLayout 
    title="Complete your" 
    subtitle="Medical Story. One Platform."
    badgeText="Everything is Running Smoothly"
    badgeColor="text-green-400 bg-green-400"
    tipTitle="Daily Tip"
    tipText="Drink water throughout the day to boost energy and support overall health."
  >
    <template #description>
      Track your results, view your records, and manage everything in one seamless experience.
    </template>

    <!-- Right Side Content -->
    <div class="w-full">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p class="text-gray-500 mb-8">Access your personal medical record securely.</p>

      <form @submit.prevent="handleLogin">
        <BaseInput 
          v-model="email"
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          :icon="EnvelopeIcon"
          :error="errors.email"
        />

        <BaseInput 
          v-model="password"
          label="Password"
          placeholder="Enter your password"
          :type="showPassword ? 'text' : 'password'"
          :icon="LockClosedIcon"
          :error="errors.password"
        >
          <template #append>
            <button type="button" @click="showPassword = !showPassword" class="text-gray-400 hover:text-gray-600 focus:outline-none">
              <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5" />
            </button>
          </template>
        </BaseInput>

        <div class="flex items-center justify-between mb-6">
          <label class="flex items-center">
            <input type="checkbox" v-model="rememberMe" class="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500">
            <span class="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <router-link to="/forgot-password" class="text-sm font-medium text-brand-600 hover:text-brand-500">
            Forget password?
          </router-link>
        </div>

        <BaseButton block type="submit">Login</BaseButton>
      </form>

      <div class="relative mt-8 mb-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-400 uppercase">Or continue with</span>
        </div>
      </div>

      <SocialAuthButtons />


      <p class="mt-8 text-center text-sm text-gray-500">
        New patient? 
        <router-link to="/register" class="font-semibold text-brand-600 hover:text-brand-500">
          sign up for free
        </router-link>
      </p>
    </div>
  </AuthLayout>
</template>
