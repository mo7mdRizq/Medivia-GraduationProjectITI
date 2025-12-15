<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon, KeyIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSuccess = ref(false)
const errors = ref({})
const token = ref('')
const isLoading = ref(false)

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    toast.error("Invalid link: Missing reset token.")
  }
})

const validate = () => {
  errors.value = {}
  
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  const isValid = Object.keys(errors.value).length === 0
  if (!isValid) {
      toast.error(Object.values(errors.value)[0])
  }
  return isValid
}

const handleResetPassword = async () => {
  if (!token.value) {
      toast.error("Cannot reset: Missing token.")
      return
  }

  if (validate()) {
    isLoading.value = true
    try {
        const response = await fetch('http://localhost:3000/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token.value,
                password: password.value
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Reset failed");
        }

        toast.success(data.message);
        isSuccess.value = true;
        
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    } finally {
        isLoading.value = false;
    }
  }
}
</script>

<template>
  <AuthLayout 
    title="Set a strong" 
    subtitle="Password."
    badgeText="New Credentials"
    badgeColor="text-blue-400"
    :badgeIcon="KeyIcon"
    tipTitle="Security Tip"
    tipText="'Prioritize sleep tonight for a healthier, more vibrant tomorrow.'"
  >
    <template #description>
      Ensure your account stays secure with a unique password. We recommend using a mix of letters, numbers, and symbols.
    </template>

    <div class="w-full">
      
      <!-- Form State -->
      <div v-if="!isSuccess">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p class="text-gray-500 mb-8">Please enter your new password below.</p>

        <form @submit.prevent="handleResetPassword">
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

          <!-- The reference image said "Go to gmail" which is weird for this step. Using "Reset Password" -->
           <BaseButton block type="submit">Reset Password</BaseButton>
        </form>

        <div class="mt-8 text-center">
          <router-link to="/login" class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Back to login
          </router-link>
        </div>
      </div>

      <!-- Success State -->
      <div v-else>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Password Reset!</h2>
        <p class="text-gray-500 mb-8">Your password has been successfully updated. You can now log in with your new credentials.</p>

        <BaseButton block variant="primary" @click="$router.push('/login')">Continue to login</BaseButton>
      </div>

    </div>
  </AuthLayout>
</template>
