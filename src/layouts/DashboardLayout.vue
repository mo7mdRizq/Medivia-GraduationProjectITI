<script setup>
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const isSidebarOpen = ref(false)
const route = useRoute()

// Close sidebar on route change (for mobile)
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
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
        <span class="font-bold text-lg text-slate-900">HealthPortal</span>
      </div>
      <div class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        J
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
        <RouterLink to="/" class="flex items-center space-x-3 border-b border-slate-800 px-6 h-16 hover:bg-slate-800/50 transition-colors">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-900/50">HP</div>
          <span class="text-xl font-bold tracking-tight">HealthPortal</span>
          
           <!-- Close button for mobile inside sidebar -->
           <button @click.stop="isSidebarOpen = false" class="lg:hidden ml-auto text-slate-400 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </RouterLink>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          <RouterLink to="/dashboard" class="nav-item" active-class="nav-item-active" exact-active-class="exact-active-fix">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink to="/dashboard/history" class="nav-item" active-class="nav-item-active">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Medical History</span>
          </RouterLink>

          <RouterLink to="/dashboard/prescriptions" class="nav-item" active-class="nav-item-active">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>Prescriptions</span>
          </RouterLink>

          <RouterLink to="/dashboard/lab-results" class="nav-item" active-class="nav-item-active">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Lab Results</span>
          </RouterLink>

          <RouterLink to="/dashboard/appointments" class="nav-item" active-class="nav-item-active">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Appointments</span>
          </RouterLink>

          <RouterLink to="/dashboard/visits" class="nav-item" active-class="nav-item-active">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Visits</span>
          </RouterLink>

          <RouterLink to="/dashboard/profile" class="nav-item" active-class="nav-item-active">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile Settings</span>
          </RouterLink>
        </nav>

        <!-- Logout -->
        <div class="border-t border-slate-800 px-4 py-4">
          <RouterLink to="/" class="nav-item text-slate-400 hover:bg-slate-800 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </RouterLink>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 w-full lg:pl-64 transition-all duration-300">
      <main class="px-4 py-6 lg:px-8 lg:py-8 pt-20 lg:pt-8">
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
</style>
