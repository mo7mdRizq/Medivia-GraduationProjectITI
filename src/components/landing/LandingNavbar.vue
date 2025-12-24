<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { db } from '../../util/storage'
import BaseButton from '../ui/BaseButton.vue'
import { UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')
const isMobileMenuOpen = ref(false)

onMounted(() => {
    checkLoginStatus()
})

const checkLoginStatus = () => {
    isLoggedIn.value = db.get('isAuthenticated') === true
    if (isLoggedIn.value) {
        userName.value = db.get('userName') || 'User'
    }
}

const handleLogout = () => {
    db.remove('isAuthenticated')
    db.remove('userName')
    db.remove('userRole')
    isLoggedIn.value = false
    isMobileMenuOpen.value = false
    router.push('/login')
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Appointment', href: '/dashboard/appointments' },
  { name: 'Visits', href: '/dashboard/visits' },
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
          <RouterLink v-for="item in navigation" :key="item.name" :to="item.href" 
             class="text-sm font-medium transition-colors relative py-1"
             active-class="text-gray-900 border-b-2 border-gray-900"
             :class="'text-gray-500 hover:text-gray-900'"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <div v-if="!isLoggedIn" class="hidden md:flex md:items-center md:space-x-4">
             <BaseButton variant="primary" class="h-10 px-6" @click="$router.push('/login')">Login</BaseButton>
          </div>
          
          <div v-else class="hidden md:flex items-center gap-3">
             <div class="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <UserCircleIcon class="w-6 h-6 text-gray-500" />
                <span>{{ userName }}</span>
             </div>
             <button @click="handleLogout" class="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <ArrowRightOnRectangleIcon class="w-6 h-6" />
             </button>
          </div>

          <!-- Mobile menu button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Bars3Icon v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white shadow-lg">
        <div class="px-4 pt-2 pb-4 space-y-1">
          <RouterLink 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.href"
            @click="isMobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            active-class="text-brand-600 bg-brand-50"
          >
            {{ item.name }}
          </RouterLink>
          
          <div class="pt-4 border-t border-gray-100">
            <div v-if="!isLoggedIn">
              <BaseButton variant="primary" block class="mb-2" @click="$router.push('/login'); isMobileMenuOpen = false">
                Login
              </BaseButton>
              <BaseButton variant="outline" block @click="$router.push('/register'); isMobileMenuOpen = false">
                Sign Up
              </BaseButton>
            </div>
            
            <div v-else class="space-y-3">
              <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-md">
                <UserCircleIcon class="w-8 h-8 text-gray-500" />
                <span class="text-sm font-medium text-gray-900">{{ userName }}</span>
              </div>
              <BaseButton variant="outline" block @click="handleLogout" class="text-red-600 hover:text-red-700 hover:bg-red-50">
                Logout
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>
