<template>
  <div>
    <!-- Mobile Backdrop -->
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"></div>

    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col h-full transform transition-transform duration-300 ease-in-out lg:transform-none"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
        <!-- Logo Area -->
        <div class="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center space-x-2 text-blue-600">
                <div class="p-2 bg-blue-50 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z">
                        </path>
                    </svg>
                </div>
                <span class="text-xl font-bold tracking-tight">Med<span class="text-gray-900">Care</span></span>
            </div>
            <!-- Mobile Close Button -->
            <button @click="$emit('close')" class="ml-auto lg:hidden text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4">
            <div class="px-4 mb-2">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Main</p>
                <div class="space-y-1">
                    <router-link to="/" @click="$emit('close')"
                        class="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg group hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        active-class="bg-blue-50 text-blue-600 font-medium">
                        <svg class="w-5 h-5 group-hover:text-blue-600 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                            </path>
                        </svg>
                        <span>Dashboard</span>
                    </router-link>

                    <router-link to="/patients" @click="$emit('close')"
                        class="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg group hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        active-class="bg-blue-50 text-blue-600 font-medium">
                        <svg class="w-5 h-5 group-hover:text-blue-600 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                            </path>
                        </svg>
                        <span>Patient List</span>
                    </router-link>

                    <router-link to="/visits" @click="$emit('close')"
                        class="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg group hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        active-class="bg-blue-50 text-blue-600 font-medium">
                        <svg class="w-5 h-5 group-hover:text-blue-600 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
                            </path>
                        </svg>
                        <span>Visits</span>
                    </router-link>

                    <router-link to="/prescriptions" @click="$emit('close')"
                        class="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg group hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        active-class="bg-blue-50 text-blue-600 font-medium">
                        <svg class="w-5 h-5 group-hover:text-blue-600 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                        </svg>
                        <span>Prescriptions</span>
                    </router-link>

                    <router-link to="/appointments" @click="$emit('close')"
                        class="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg group hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        active-class="bg-blue-50 text-blue-600 font-medium">
                        <svg class="w-5 h-5 group-hover:text-blue-600 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                            </path>
                        </svg>
                        <span>Appointments</span>
                    </router-link>
                </div>
            </div>

            <div class="px-4 mt-6">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Clinical</p>
                <div class="space-y-1">
                    <a href="#"
                        class="flex items-center space-x-3 px-3 py-2 text-gray-600 rounded-lg group hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <svg class="w-5 h-5 group-hover:text-blue-600 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                        </svg>
                        <span>Medical Files</span>
                    </a>
                </div>
            </div>
        </nav>

        <!-- User Profile (Bottom) -->
        <div class="border-t border-gray-100 p-4">
            <router-link to="/profile" @click="$emit('close')" class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-200 transition-colors">
                    DR
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">Dr. Sarah Wilson</p>
                    <p class="text-xs text-gray-500 truncate">Cardiologist</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </router-link>
        </div>
    </aside>
  </div>
</template>

<script setup>
defineOptions({
  name: 'DoctorSidebar'
})

defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
})

defineEmits(['close'])
</script>
