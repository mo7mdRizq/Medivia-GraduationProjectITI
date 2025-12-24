<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { db } from '../util/storage'
import { toast } from 'vue3-toastify'
import { UserIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const selectedRole = ref(null)
const isTransitioning = ref(false)

const roles = [
  {
    id: 'patient',
    title: 'Patient',
    description: 'Access your medical records, appointments, and prescriptions',
    icon: UserIcon,
    gradient: 'from-blue-500 to-indigo-600',
    hoverGradient: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    route: '/dashboard'
  },
  {
    id: 'doctor',
    title: 'Doctor',
    description: 'Manage patients, view appointments, and update medical records',
    icon: UserGroupIcon,
    gradient: 'from-teal-500 to-emerald-600',
    hoverGradient: 'from-teal-600 to-emerald-700',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    route: '/doctor/dashboard'
  }
]

const selectRole = (role) => {
  if (isTransitioning.value) return
  
  selectedRole.value = role.id
  isTransitioning.value = true
  
  // Store the role as pending in the database
  db.set('pendingRole', role.id)
  
  toast.success(`Intent selected: ${role.title}. Proceeding to registration...`, {
    transition: toast.TRANSITIONS.ZOOM,
  })
  
  // Redirect to registration after a brief delay
  setTimeout(() => {
    router.push('/register')
  }, 800)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-5xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <RouterLink to="/" class="cursor-pointer">
            <img src="/logo.png" alt="Medivia" class="h-16 w-auto hover:opacity-80 transition-opacity" />
          </RouterLink>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span class="text-brand-600">Medivia</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Please select your role to continue
        </p>
      </div>

      <!-- Role Cards -->
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <div
          v-for="role in roles"
          :key="role.id"
          @click="selectRole(role)"
          class="relative group cursor-pointer"
          :class="{ 'scale-95 opacity-50': isTransitioning && selectedRole !== role.id }"
        >
          <!-- Card -->
          <div 
            class="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-gray-100 p-8"
            :class="{
              'ring-4 ring-brand-500 ring-offset-4': selectedRole === role.id,
              'transform hover:-translate-y-2': !isTransitioning
            }"
          >
            <!-- Gradient Background (visible on hover) -->
            <div 
              class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
              :class="role.gradient"
            ></div>

            <!-- Content -->
            <div class="relative z-10">
              <!-- Icon -->
              <div 
                class="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300"
                :class="role.iconBg"
              >
                <component 
                  :is="role.icon" 
                  class="w-10 h-10"
                  :class="role.iconColor"
                />
              </div>

              <!-- Title -->
              <h2 class="text-3xl font-bold text-gray-900 mb-3">
                {{ role.title }}
              </h2>

              <!-- Description -->
              <p class="text-gray-600 leading-relaxed mb-6">
                {{ role.description }}
              </p>

              <!-- Arrow Icon -->
              <div class="flex items-center text-brand-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Continue as {{ role.title }}</span>
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <!-- Selection Indicator -->
            <div 
              v-if="selectedRole === role.id"
              class="absolute top-4 right-4 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shadow-lg animate-pulse"
            >
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Logout Link -->
      <div class="text-center">
        <button 
          @click="() => { db.clear(); router.push('/login'); }"
          class="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
        >
          Reset Session
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
