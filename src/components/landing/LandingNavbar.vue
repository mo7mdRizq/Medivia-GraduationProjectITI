<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from '../ui/BaseButton.vue'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')

onMounted(() => {
    checkLoginStatus()
})

const checkLoginStatus = () => {
    isLoggedIn.value = localStorage.getItem('isAuthenticated') === 'true'
    if (isLoggedIn.value) {
        userName.value = localStorage.getItem('userName') || 'User'
    }
}

const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userName')
    isLoggedIn.value = false
    router.push('/login')
}

const navigation = [
  { name: 'Home', href: '#' },
  { name: 'Dashboard', href: '#' },
  { name: 'Appointment', href: '#' },
  { name: 'Visits', href: '#' },
  { name: 'About', href: '#' },
]
</script>

<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex-shrink-0 flex items-center gap-2">
            <img class="h-10 w-auto" src="/logo.png" alt="Medivia" />
          </RouterLink>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center space-x-8">
          <a v-for="item in navigation" :key="item.name" :href="item.href" 
             class="text-sm font-medium transition-colors relative py-1"
             :class="item.name === 'Home' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-900'"
          >
            {{ item.name }}
          </a>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <div v-if="!isLoggedIn" class="hidden md:flex md:items-center md:space-x-4">
             <BaseButton variant="primary" class="h-10 px-6" @click="$router.push('/login')">Login</BaseButton>
          </div>
          
          <div v-else class="flex items-center gap-3">
             <div class="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <UserCircleIcon class="w-6 h-6 text-gray-500" />
                <span>{{ userName }}</span>
             </div>
             <button @click="handleLogout" class="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <ArrowRightOnRectangleIcon class="w-6 h-6" />
             </button>
          </div>

          <!-- Mobile menu button placeholder -->
        </div>
      </div>
    </div>
  </nav>
</template>
