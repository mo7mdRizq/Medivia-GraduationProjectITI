<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AuthLayout from '../components/layout/AuthLayout.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SocialAuthButtons from '../components/auth/SocialAuthButtons.vue'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, PhoneIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const dob = ref('')
const gender = ref('')
const role = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref({})

const validate = () => {
  errors.value = {}
  
  if (!fullName.value) {
    errors.value.fullName = 'Full Name is required'
  } else if (!/^[A-Za-z\s]+$/.test(fullName.value)) {
    errors.value.fullName = 'Full Name must contain letters only'
  }

  const emailRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+@[a-zA-Z]+\.com$/
  if (!email.value) {
    errors.value.email = 'Email address is required'
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Email must contain letters AND numbers before @, and end in .com (e.g., user123@gmail.com)'
  }

  if (!phone.value) {
    errors.value.phone = 'Phone number is required'
  }

  if (!dob.value) {
    errors.value.dob = 'Date of birth is required'
  }

  if (!gender.value) {
    errors.value.gender = 'Gender is required'
  }

  if (!role.value) {
    errors.value.role = 'Account Type is required'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(password.value)) {
    errors.value.password = 'Password must contain at least one uppercase letter'
  } else if (!/[a-z]/.test(password.value)) {
    errors.value.password = 'Password must contain at least one lowercase letter'
  } else if (!/\d/.test(password.value)) {
    errors.value.password = 'Password must contain at least one number'
  } else if (!/[!@#$%^&*]/.test(password.value)) {
    errors.value.password = 'Password must contain at least one symbol (!@#$%^&*)'
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  const isValid = Object.keys(errors.value).length === 0
  if (!isValid) {
      const firstError = Object.values(errors.value)[0]
      toast.error(firstError)
  }
  return isValid
}

const handleRegister = () => {
  if (validate()) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const userExists = users.some(user => user.email === email.value)
    
    if (userExists) {
      toast.error('An account with this email already exists')
      return
    }
    
    users.push({
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      dob: dob.value,
      dob: dob.value,
      gender: gender.value,
      role: role.value,
      password: password.value
    })
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    
    const keysToClear = [
      'medivia_appointments',
      'medivia_visits',
      'medivia_prescriptions',
      'medivia_lab_results',
      'medivia_medical_history'
    ]
    keysToClear.forEach(key => localStorage.removeItem(key))
    
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput 
            v-model="phone"
            label="Phone Number"
            placeholder="Enter your phone"
            type="tel"
            :icon="PhoneIcon"
            :error="errors.phone"
          />

          <BaseInput 
            v-model="dob"
            label="Date of Birth"
            type="date"
            :icon="CalendarDaysIcon"
            :error="errors.dob"
          />
        </div>

        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-800 mb-2">Gender</label>
          <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon class="h-5 w-5" />
             </div>
             <select v-model="gender" class="block w-full rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm py-3 pl-11 pr-4" :class="errors.gender ? 'border-red-300' : 'border-gray-200'">
                <option value="" disabled selected>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
             </select>
          </div>
          <p v-if="errors.gender" class="mt-1.5 text-sm text-red-600">{{ errors.gender }}</p>
        </div>

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

        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-800 mb-2">Role</label>
          <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon class="h-5 w-5" />
             </div>
             <select v-model="role" class="block w-full rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm py-3 pl-11 pr-4" :class="errors.role ? 'border-red-300' : 'border-gray-200'">
                <option value="" disabled selected>Select Account Type</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
             </select>
          </div>
          <p v-if="errors.role" class="mt-1.5 text-sm text-red-600">{{ errors.role }}</p>
        </div>

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
