<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  BeakerIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  UsersIcon,
  DocumentTextIcon 
} from '@heroicons/vue/24/outline'

const isSidebarOpen = ref(false)
const route = useRoute()
const router = useRouter()

// Close sidebar on route change (for mobile)
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const userRole = localStorage.getItem('userRole') || 'patient'

const navItems = computed(() => {
  if (userRole === 'doctor') {
    return [
      { name: 'dashboard', routeName: 'doctor-dashboard-root', label: 'Dashboard', icon: HomeIcon },
      { name: 'patients', routeName: 'patients', label: 'Patients', icon: UsersIcon },
      { name: 'appointments', routeName: 'doctor-appointments', label: 'Appointments', icon: CalendarIcon },
      { name: 'prescriptions', routeName: 'doctor-prescriptions', label: 'Prescriptions', icon: DocumentTextIcon },
      { name: 'visits', routeName: 'visits', label: 'Visits', icon: ClipboardDocumentListIcon },
      { name: 'profile', routeName: 'doctor-profile', label: 'Profile', icon: UserIcon },
    ]
  }
  
  // Default to Patient
  return [
    { name: 'dashboard', routeName: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { name: 'history', routeName: 'patient-history', label: 'Medical History', icon: ClipboardDocumentListIcon },
    { name: 'prescriptions', routeName: 'patient-prescriptions', label: 'Prescriptions', icon: DocumentTextIcon },
    { name: 'lab-results', routeName: 'patient-lab-results', label: 'Lab Results', icon: BeakerIcon },
    { name: 'appointments', routeName: 'patient-appointments', label: 'Appointments', icon: CalendarIcon },
    { name: 'visits', routeName: 'patient-visits', label: 'Visits', icon: ClockIcon },
    { name: 'profile', routeName: 'patient-profile', label: 'Profile Settings', icon: UserIcon },
  ]
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userName')
  router.push('/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-neutral-50 text-slate-900">
     <!-- Mobile Header/Toggle -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-40 flex items-center justify-between shadow-sm h-16">
      <div class="flex items-center gap-3">
        <button @click="toggleSidebar" class="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/logo.png" alt="Medivia" class="h-10 w-auto" />
      </div>
      <div class="h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm">
        {{ userRole[0].toUpperCase() }}
      </div>
    </div>

    <!-- Sidebar Overlay for Mobile -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-xl z-50 transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex items-center space-x-3 border-b border-slate-800 px-6 h-16">
          <img src="/logo.png" alt="Medivia" class="h-12 w-auto bg-white rounded-lg p-1.5" />
          
           <!-- Close button for mobile inside sidebar -->
           <button @click="isSidebarOpen = false" class="lg:hidden ml-auto text-slate-400 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.name"
            :to="{ name: item.routeName }" 
            class="nav-item" 
            active-class="nav-item-active"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- Logout -->
        <div class="border-t border-slate-800 px-4 py-4 mt-auto">
          <button @click="handleLogout" class="nav-item w-full text-left text-slate-400 hover:bg-slate-800 hover:text-white group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="group-hover:text-red-400 transition-colors">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 w-full lg:pl-64 transition-all duration-300">
      <main class="px-4 py-6 lg:px-8 lg:py-8 pt-20 lg:pt-8 min-h-screen">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  margin-bottom: 4px;
}
.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}
.nav-item-active {
  background-color: #1e293b; /* slate-800 */
  color: #60a5fa; /* blue-400 */
}
.nav-item-active svg {
  color: #60a5fa;
}
/* Exact active fix for strict dashboard home check if needed, 
but name-based matching usually avoids partial matching issues on root path */
</style>
