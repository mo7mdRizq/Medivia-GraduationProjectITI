<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 text-gray-800">
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Mobile Header -->
        <header class="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 justify-between flex-shrink-0 z-20">
            <div class="flex items-center space-x-2 text-blue-600">
                 <div class="p-1.5 bg-blue-50 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z">
                        </path>
                    </svg>
                </div>
                <span class="font-bold">MedCare</span>
            </div>
            <button @click="isSidebarOpen = true" class="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </header>

        <main class="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            <router-view />
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';

const isSidebarOpen = ref(false);
</script>
