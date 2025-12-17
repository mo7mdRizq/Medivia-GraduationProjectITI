<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import emailjs from '@emailjs/browser'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { EnvelopeIcon, CheckBadgeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { EMAILJS_CONFIG, RESET_PASSWORD_URL } from '../config'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const errors = ref({})

const validate = () => {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'Email address is required'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (errors.value.email) {
    toast.error(errors.value.email)
    return false
  }

  return true
}

const generateToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const handleResetRequest = async () => {
  if (!validate()) return

  // Check if EmailJS is configured
  const missingConfig = []
  if (!EMAILJS_CONFIG.SERVICE_ID) missingConfig.push('Service ID')
  if (!EMAILJS_CONFIG.TEMPLATE_ID) missingConfig.push('Template ID')
  if (!EMAILJS_CONFIG.PUBLIC_KEY) missingConfig.push('Public Key')
  
  if (missingConfig.length > 0) {
    toast.error(`Email service configuration missing: ${missingConfig.join(', ')}`)
    console.error('EmailJS Configuration:', {
      SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID ? 'Set' : 'Missing',
      TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID ? 'Set' : 'Missing',
      PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? 'Set' : 'Missing'
    })
    return
  }

  isLoading.value = true

  try {
    // Generate frontend-only token
    const token = generateToken()
    const resetLinkWithToken = `${RESET_PASSWORD_URL}?token=${token}&email=${encodeURIComponent(email.value)}`

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)

    // Prepare template parameters
    const templateParams = {
      to_email: email.value,
      reset_link: resetLinkWithToken,
      user_email: email.value
    }

    console.log('Sending email via EmailJS with params:', {
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      templateId: EMAILJS_CONFIG.TEMPLATE_ID,
      to_email: email.value,
      reset_link: resetLinkWithToken.substring(0, 50) + '...'
    })

    // Send email using EmailJS
    const emailjsResponse = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    )

    if (emailjsResponse && emailjsResponse.status === 200) {
      toast.success('Reset link has been sent to your email.')
      email.value = ''
    } else {
      throw new Error(`EmailJS returned unexpected status: ${emailjsResponse?.status || 'unknown'}`)
    }

  } catch (error) {
    console.error('EmailJS Error Details:', error)
    
    let errorMessage = 'Failed to send email via EmailJS.'
    
    if (error?.text) {
      errorMessage = `EmailJS Error: ${error.text}`
    } else if (error?.message) {
      errorMessage = `EmailJS Error: ${error.message}`
    } else if (error?.status) {
      errorMessage = `EmailJS Error: Status ${error.status}`
    } else if (typeof error === 'string') {
      errorMessage = `EmailJS Error: ${error}`
    }
    
    console.error('Full EmailJS error object:', JSON.stringify(error, null, 2))
    toast.error(errorMessage)
    
  } finally {
    isLoading.value = false
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
  >
    <template #description>
      We'll send you a secure link to reset your password.
    </template>

    <div class="w-full">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
      <p class="text-gray-500 mb-8">
        Enter the email associated with your account.
      </p>

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
        <router-link
          to="/login"
          class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Back to login
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>