<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { EnvelopeIcon, ArrowLeftIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const email = ref('')
const errors = ref({})
const isLoading = ref(false)

const validate = () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
  }

  const isValid = Object.keys(errors.value).length === 0
  if (!isValid) {
      toast.error(Object.values(errors.value)[0])
  }
  return isValid
}

const handleResetRequest = async () => {
  if (validate()) {
    // Frontend-only simulation of email sending
    isLoading.value = true
    
    // Store email in sessionStorage for the reset page
    sessionStorage.setItem('resetPasswordEmail', email.value)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    isLoading.value = false
    
    // Show success notification
    toast.success(`Password reset link sent to ${email.value}`, {
      autoClose: 3000,
    })
    
    // Redirect to reset password page after short delay
    setTimeout(() => {
      router.push('/reset-password')
    }, 1000)
  }
}
</script>

<template>
  <AuthLayout 
    title="Secure Account" 
    subtitle="Recovery."
    badgeText="Account Security"
    badgeColor="text-green-400"
    :badgeIcon="CheckBadgeIcon"
    tipTitle="Health Insight"
    tipText="'Start your day with a glass of water to boost hydration and energy, setting a positive tone for health.'"
  >
    <template #description>
      We use bank-grade encryption to ensure your medical data and account credentials remain private and secure.
    </template>

    <div class="w-full">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
      <p class="text-gray-500 mb-8">Enter the email address associated with your account and we'll send you a link to reset your password.</p>

      <form @submit.prevent="handleResetRequest">
        <BaseInput 
          v-model="email"
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          :icon="EnvelopeIcon"
          :error="errors.email"
        />

        <BaseButton block type="submit" :disabled="isLoading">
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Send reset link</span>
        </BaseButton>
      </form>

      <div class="mt-8 text-center">
        <router-link to="/login" class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Back to login
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>
