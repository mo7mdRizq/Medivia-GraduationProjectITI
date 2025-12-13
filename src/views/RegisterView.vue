<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SocialAuthButtons from '../components/auth/SocialAuthButtons.vue'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({})

const validate = () => {
  errors.value = {}
  
  // Full Name: No numbers allowed
  if (!fullName.value) {
    errors.value.fullName = 'Full Name is required'
  } else if (/\d/.test(fullName.value)) {
    errors.value.fullName = 'Full Name cannot contain numbers'
  }

  // Email: Strict validation
  if (!email.value) {
    errors.value.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
  }

  // Password
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }

  // Confirm Password
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  const isValid = Object.keys(errors.value).length === 0
  
  if (!isValid) {
      // Show first error as toast
      const firstError = Object.values(errors.value)[0]
      toast.error(firstError)
  }

  return isValid
}

const handleRegister = () => {
  if (validate()) {
    // Simulate API call
    toast.success('Registration successful! Please login.')
    router.push('/login')
  }
}
</script>

<template>
  <AuthLayout 
    title="Start your journey to" 
    subtitle="Better Health."
    badgeText="Join +1000 Patients"
     badgeColor="text-green-400 bg-green-400"
    tipTitle="Did you know?"
    tipText="Securely access your medical records anytime."
  >
    <template #description>
      Create your digital health vault today. Secure, accessible, and designed for your peace of mind.
    </template>

    <div class="w-full">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p class="text-gray-500 mb-8">Enter your data to register your patient profile.</p>

      <form @submit.prevent="handleRegister">
        <BaseInput 
          v-model="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          :icon="UserIcon"
          :error="errors.fullName"
        />

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

        <BaseInput 
          v-model="confirmPassword"
          label="Confirm Password"
          placeholder="Enter your password again"
          :type="showConfirmPassword ? 'text' : 'password'"
          :icon="LockClosedIcon"
          :error="errors.confirmPassword"
        >
          <template #append>
             <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="text-gray-400 hover:text-gray-600 focus:outline-none">
              <component :is="showConfirmPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5" />
            </button>
          </template>
        </BaseInput>

        <BaseButton block type="submit">Create Account</BaseButton>
      </form>

      <div class="relative mt-8 mb-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-400 uppercase">Or continue with</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseButton variant="outline">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="h-5 w-5 mr-2" alt="Google">
          Google
        </BaseButton>
        <BaseButton variant="outline">
           <img src="https://www.svgrepo.com/show/511330/apple-173.svg" class="h-5 w-5 mr-2" alt="Apple">
          Apple
        </BaseButton>
      </div>

      <p class="mt-8 text-center text-sm text-gray-500">
        have an account? 
        <router-link to="/login" class="font-semibold text-brand-600 hover:text-brand-500">
          login
        </router-link>
      </p>
    </div>
  </AuthLayout>
</template>
