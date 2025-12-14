<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { authApi } from '../api/mockAuth'
import emailjs from '@emailjs/browser'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const errors = ref({})

const validate = () => {
  errors.value = {}
  
  // Strict Email Regex: Name + Numbers before @, .com end
  const emailRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+@[a-zA-Z]+\.com$/

  if (!email.value) {
    errors.value.email = 'Email address is required'
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Email must contain letters AND numbers before @, and end in .com'
  }

  const isValid = Object.keys(errors.value).length === 0
  if (!isValid) {
      toast.error(Object.values(errors.value)[0])
  }
  return isValid
}

const handleResetRequest = async () => {
  if (validate()) {
    isLoading.value = true
    try {
      // 1. Validate Account Existence
      const response = await authApi.requestPasswordReset(email.value)
      
      // 2. Prepare EmailJS Parameters
      // TODO: Replace these placeholders with your actual EmailJS credentials
      const serviceID = 'service_2xvwukn';
      const templateID = 'template_ur3zlqu';
      const publicKey = 'fnJIAKWvrKg1eD-Hn';

      const templateParams = {
        // Target Recipient (Admin) - Exhaustive list of potential keys to match your Template 'To Email' field
        to_email: 'ahmedmakled2004@gmail.com',
        recipient: 'ahmedmakled2004@gmail.com',
        email: 'ahmedmakled2004@gmail.com',     // Common default
        to: 'ahmedmakled2004@gmail.com',        // Common default
        admin_email: 'ahmedmakled2004@gmail.com',

        // Context
        user_email: email.value,
        reset_link: `${window.location.origin}/reset-password`,
        message: `User (${email.value}) requested a password reset.`,
        
        // Standard fields
        to_name: 'Admin',
        from_name: 'Medivia System',
        reply_to: email.value
      };

      // 3. Send Email
      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      toast.success(`Request sent to system admin for ${email.value}`)

    } catch (error) {
      console.error("EmailJS Error details:", error)
      // Check if it's our API error or EmailJS error
      const errorMsg = error.text || error.message || JSON.stringify(error)
      toast.error(`Send Failed: ${errorMsg}`)
    } finally {
      isLoading.value = false
    }
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
          <span v-if="isLoading">Sending...</span>
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
