<template>
  <div>
        <!-- Header -->
        <header class="mb-8 mt-2 lg:mt-0">
            <h2 class="text-xl md:text-2xl font-bold text-gray-900">Welcome back, {{ currentUser.name }}</h2>
            <p class="text-sm md:text-base text-gray-500 mt-1">Here's your practice overview for today</p>
        </header>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Stat Card 1 -->
            <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                    </div>
                </div>
                <div class="flex items-center space-x-2 mb-1">
                    <span class="text-3xl font-bold text-gray-900">{{ totalPatientsCount }}</span>
                    <span class="text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">↗ ~8%</span>
                </div>
                <p class="text-sm font-medium text-gray-900">Total Patients</p>
                <p class="text-xs text-gray-400 mt-1">12 new this month</p>
            </div>

            <!-- Stat Card 2 -->
            <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-green-50 rounded-lg text-green-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                            </path>
                        </svg>
                    </div>
                </div>
                <div class="flex items-center space-x-2 mb-1">
                    <span class="text-3xl font-bold text-gray-900">{{ todaysCount }}</span>
                </div>
                <p class="text-sm font-medium text-gray-900">Today's Appointments</p>
                <p class="text-xs text-gray-400 mt-1">2 pending confirmation</p>
            </div>

            <!-- Stat Card 3 -->
            <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-orange-50 rounded-lg text-orange-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <span class="text-orange-500"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"></path>
                        </svg></span>
                </div>
                <div class="flex items-center space-x-2 mb-1">
                    <span class="text-3xl font-bold text-gray-900">{{ approvalsCount }}</span>
                </div>
                <p class="text-sm font-medium text-gray-900">Pending Approvals</p>
                <p class="text-xs text-gray-400 mt-1">1 urgent request</p>
            </div>

            <!-- Stat Card 4 -->
            <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-cyan-50 rounded-lg text-cyan-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                        </svg>
                    </div>
                </div>
                <div class="flex items-center space-x-2 mb-1">
                    <span class="text-3xl font-bold text-gray-900">{{ visitsCount }}</span>
                </div>
                <p class="text-sm font-medium text-gray-900">Recent Visits</p>
                <p class="text-xs text-gray-400 mt-1">This week</p>
            </div>
        </div>

        <!-- Big Action Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Patient List Action -->
            <router-link to="/patients"
                class="bg-blue-600 rounded-xl p-6 text-white flex justify-between items-start relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] shadow-lg shadow-blue-200">
                <div class="relative z-10 w-full">
                    <div class="flex justify-between items-start w-full">
                        <div class="p-2 bg-blue-500 bg-opacity-30 rounded-lg mb-4 inline-block backdrop-blur-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                </path>
                            </svg>
                        </div>
                        <svg class="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-1">Patient List</h3>
                    <p class="text-blue-100 text-sm">View and manage all patients</p>
                </div>
                <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500 rounded-full opacity-20"></div>
            </router-link>

            <!-- Appointments Action -->
            <router-link to="/appointments"
                class="bg-teal-700 rounded-xl p-6 text-white flex justify-between items-start relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] shadow-lg shadow-teal-200">
                <div class="relative z-10 w-full">
                    <div class="flex justify-between items-start w-full">
                        <div class="p-2 bg-teal-600 bg-opacity-30 rounded-lg mb-4 inline-block backdrop-blur-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                </path>
                            </svg>
                        </div>
                        <svg class="w-5 h-5 text-teal-200 group-hover:translate-x-1 transition-transform" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-1">Appointments</h3>
                    <p class="text-teal-100 text-sm">Manage your schedule</p>
                </div>
                <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-teal-600 rounded-full opacity-20"></div>
            </router-link>
        </div>

        <!-- Lists Section (Appointments & Recent Visits) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Today's Appointments -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Today's Appointments</h3>
                            <p class="text-xs text-gray-500">Monday, Dec 8, 2025</p>
                        </div>
                    </div>
                    <a href="#" class="text-xs font-semibold text-blue-600 flex items-center hover:underline">
                        View All <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </a>
                </div>

                <!-- List Items -->
                <div class="space-y-4" v-if="todaysAppointments.length > 0">
                    <div v-for="appt in todaysAppointments" :key="appt.id"
                        class="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                        <div class="flex items-center space-x-4">
                            <div class="text-center">
                                <p class="text-xs font-bold text-blue-600">{{ appt.time }}</p>
                                <p class="text-xs text-gray-400">{{ appt.duration }}</p>
                            </div>
                            <div class="w-px h-8 bg-gray-200 group-hover:bg-blue-100 transition-colors"></div>
                            <div>
                                <h4 class="text-sm font-semibold text-gray-900">{{ appt.name }}</h4>
                                <p class="text-xs text-gray-500">{{ appt.type }}</p>
                            </div>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'">
                          {{ appt.status }}
                        </span>
                    </div>
                </div>
                <!-- Empty State for Appointments -->
                <div v-if="todaysAppointments.length === 0" class="text-center py-6 text-gray-500 text-sm">
                    No matching appointments found.
                </div>
            </div>

            <!-- Recent Visits -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="p-1.5 bg-cyan-50 text-cyan-600 rounded-md">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Recent Visits</h3>
                            <p class="text-xs text-gray-500">Last completed visits</p>
                        </div>
                    </div>
                    <a href="#" class="text-xs font-semibold text-blue-600 flex items-center hover:underline">
                        View All <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </a>
                </div>

                <div class="space-y-4" v-if="recentVisitsList.length > 0">
                    <div v-for="visit in recentVisitsList" :key="visit.id" class="group p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div class="flex justify-between items-start mb-1">
                            <h4 class="text-sm font-semibold text-gray-900">{{ visit.name }}</h4>
                            <span class="text-xs text-gray-500">{{ visit.date }}</span>
                        </div>
                        <p class="text-xs text-gray-500">{{ visit.condition }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pending Approvals -->
        <div class="bg-orange-50 rounded-xl border border-orange-100 p-6">
            <div class="flex items-center space-x-3 mb-6">
                <div class="p-1.5 bg-white text-orange-500 rounded-full shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Pending Approvals</h3>
                    <p class="text-xs text-gray-500">Items requiring your attention</p>
                </div>
            </div>

            <div class="space-y-4" v-if="pendingApprovalsList.length > 0">
                <div v-for="item in pendingApprovalsList" :key="item.id"
                    class="p-4 rounded-lg shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-500"
                    :class="[
                        item.urgent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'
                    ]"
                >
                    <div class="relative">
                        <div class="flex items-center space-x-2 mb-0.5">
                            <svg v-if="item.urgent" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <h4 class="text-sm font-semibold" :class="item.urgent ? 'text-red-900' : 'text-gray-900'">{{ item.title }}</h4>
                             <span v-if="item.urgent" class="bg-red-200 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Urgent</span>
                        </div>
                        <p class="text-xs mt-0.5" :class="item.urgent ? 'text-red-700' : 'text-gray-500'">Patient: {{ item.patient }} <span class="mx-1">•</span> {{ item.details }}</p>
                    </div>
                    <div class="flex space-x-3 w-full md:w-auto">
                        <button @click="approveItem(item.id)" class="flex-1 md:flex-none px-4 bg-blue-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow">Approve</button>
                        <button @click="$router.push({ name: 'patient-details', params: { id: item.patientId || 1 } })" class="flex-1 md:flex-none px-4 bg-gray-50 text-gray-600 text-xs font-medium py-2 rounded-lg hover:bg-gray-100 transition border border-gray-200" :class="item.urgent ? 'bg-white' : ''">Review</button>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { appointments } from '../stores/appointmentsStore';
import { visits } from '../stores/visitsStore';
import { approvals, removeApproval } from '../stores/approvalsStore';
import { patients } from '../stores/patientsStore';

const { currentUser, loadFromStorage } = useUserStore();

onMounted(() => {
    loadFromStorage();
});

// Computed Data for Dashboard
const todaysAppointments = computed(() => {
    // Attempt to match today's date or just show first 5 if none match strictly
    const todayStr = 'Dec 25, 2025'; // Mock today
    const matches = appointments.value.filter(a => a.date === todayStr);
    return matches.length > 0 ? matches : appointments.value.slice(0, 5);
});

const recentVisitsList = computed(() => {
    return visits.value.slice(0, 5);
});

const pendingApprovalsList = computed(() => {
    return approvals.value;
});

const totalPatientsCount = computed(() => patients.value.length);
const todaysCount = computed(() => todaysAppointments.value.length);
const approvalsCount = computed(() => approvals.value.length);
const visitsCount = computed(() => visits.value.length);


const approveItem = (id) => {
    removeApproval(id);
};
</script>
