<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Squares2X2Icon, 
  UsersIcon, 
  CalendarIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Squares2X2Icon },
  { name: 'Patients Management', href: '/admin/patients', icon: UsersIcon },
  { name: 'Appointments Manager', href: '/admin/appointments', icon: CalendarIcon },
]

const currentRouteName = computed(() => route.name)

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    
    <!-- Mobile Menu Backdrop -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out"
      :class="[
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:transform-none'
      ]"
    >
      <!-- Logo App Section -->
      <div class="px-6 py-6 border-b border-gray-100 flex items-center gap-3">
         <div class="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheckIcon class="w-6 h-6 text-white" />
         </div>
         <div>
            <h1 class="font-bold text-gray-900 leading-tight">Admin Portal</h1>
            <p class="text-xs text-gray-500">Healthcare System</p>
         </div>
      </div>

      <!-- Admin Profile Badge -->
      <div class="px-4 py-6">
        <div class="bg-indigo-50 rounded-xl p-4 flex items-center gap-3 border border-indigo-100">
           <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
             AM
           </div>
           <div>
             <h3 class="font-bold text-gray-900 text-sm">Admin Manager</h3>
             <p class="text-xs text-indigo-600 font-medium">System Administrator</p>
           </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="isMobileMenuOpen = false"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group"
          :class="[
            route.path.startsWith(item.href)
              ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component 
            :is="item.icon" 
            class="mr-3 h-5 w-5 transition-colors"
            :class="route.path.startsWith(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'" 
          />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Logout (Bottom) -->
      <div class="p-4 border-t border-gray-100">
        <button 
          @click="handleLogout"
          class="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <ArrowRightOnRectangleIcon class="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Mobile Header -->
      <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-30">
         <div class="flex items-center gap-3">
             <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon class="w-5 h-5 text-white" />
             </div>
             <span class="font-bold text-gray-900">Admin Portal</span>
         </div>
         <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
           <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
           <XMarkIcon v-else class="w-6 h-6" />
         </button>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
