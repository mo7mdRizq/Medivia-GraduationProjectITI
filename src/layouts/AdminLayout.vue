<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { 
  HomeIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const isSidebarOpen = ref(false)
const route = useRoute()

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', to: '/admin/users', icon: UsersIcon },
  { name: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden glass-backdrop"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-brand">
            M
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
            Medivia
          </span>
        </RouterLink>
        <button 
          class="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
          @click="isSidebarOpen = false"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Admin Panel
        </div>
        
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
          :class="[
            route.path.startsWith(item.to)
              ? 'bg-brand-50 text-brand-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
          @click="isSidebarOpen = false"
        >
          <component 
            :is="item.icon" 
            class="mr-3 h-5 w-5 transition-colors duration-200"
            :class="route.path.startsWith(item.to) ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'"
          />
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- User Profile Bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
        <div class="flex items-center gap-3">
          <img 
            src="https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff" 
            alt="Admin" 
            class="w-9 h-9 rounded-full shadow-sm"
          >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p class="text-xs text-gray-500 truncate">admin@medivia.com</p>
          </div>
          <button class="text-gray-400 hover:text-red-600 transition-colors">
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        <button 
          class="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
          @click="toggleSidebar"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-4 ml-auto">
          <div class="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          <span class="text-sm text-gray-500 hidden sm:block">
            {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.glass-backdrop {
  backdrop-filter: blur(4px);
}
.shadow-brand {
  box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
}
</style>
