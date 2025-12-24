<template>
  <div>
    <!-- Header -->
        <header class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Patient List</h2>
            <p class="text-gray-500 mt-1">Manage and view all your patients</p>
        </header>

        <!-- Search and Filter -->
        <div class="mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <svg class="w-5 h-5 text-gray-400 ml-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by name, email, or condition..."
                class="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none h-10">
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Total Patients</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ patients.length }}</h3>
                </div>
            </div>
            <div class="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <p class="text-sm font-medium text-green-600 mb-2">Active Patients</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ activePatientsCount }}</h3>
                </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Inactive Patients</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ inactivePatientsCount }}</h3>
                </div>
            </div>
        </div>

        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">patients</h3>

        <!-- Patient Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div v-for="patient in filteredPatients" :key="patient.id" class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-sm">{{ patient.name }}</h4>
                            <p class="text-xs text-gray-500">{{ patient.age }} years • {{ patient.gender }}</p>
                        </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold"
                        :class="patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                        {{ patient.status }}
                    </span>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Last Visit: <span class="text-gray-900 font-medium ml-1">{{ patient.lastVisit }}</span>
                    </div>
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        {{ patient.phone }}
                    </div>
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ patient.email }}
                    </div>
                </div>

                <div class="mb-4">
                    <p class="text-[10px] text-gray-400 mb-1.5 uppercase font-medium">Conditions:</p>
                    <div class="flex flex-wrap gap-2 min-h-[1.5rem]">
                        <span v-for="condition in patient.conditions" :key="condition"
                            class="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium border border-red-100">
                            {{ condition }}
                        </span>
                    </div>
                </div>

                <div class="bg-blue-50 text-blue-700 text-xs font-medium py-1.5 px-3 rounded-lg text-center mb-4 border border-blue-100">
                    Next: {{ patient.nextAppointment }}
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <button class="bg-blue-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">
                        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Profile
                    </button>
                    <button class="bg-white text-gray-700 text-xs font-medium py-2 rounded-lg hover:bg-gray-50 transition border border-gray-200 flex justify-center items-center">
                        <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Schedule
                    </button>
                </div>
            </div>
        </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');

const patients = ref([
    {
        id: 1,
        name: 'John Martinez',
        age: 45,
        gender: 'Male',
        status: 'Active',
        lastVisit: 'Dec 5, 2025',
        phone: '(555) 123-4567',
        email: 'john.martinez@email.com',
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        nextAppointment: 'Dec 15, 2025'
    },
    {
        id: 2,
        name: 'Emily Johnson',
        age: 32,
        gender: 'Female',
        status: 'Active',
        lastVisit: 'Dec 4, 2025',
        phone: '(555) 234-5678',
        email: 'emily.johnson@email.com',
        conditions: ['Seasonal Allergies'],
        nextAppointment: 'Dec 10, 2025'
    },
    {
        id: 3,
        name: 'Michael Brown',
        age: 58,
        gender: 'Male',
        status: 'Active',
        lastVisit: 'Dec 3, 2025',
        phone: '(555) 345-6789',
        email: 'michael.brown@email.com',
        conditions: ['Hypertension', 'High Cholesterol'],
        nextAppointment: 'Dec 18, 2025'
    },
    {
        id: 4,
        name: 'Sarah Davis',
        age: 41,
        gender: 'Female',
        status: 'Active',
        lastVisit: 'Nov 28, 2025',
        phone: '(555) 456-7890',
        email: 'sarah.davis@email.com',
        conditions: ['Asthma'],
        nextAppointment: 'Dec 20, 2025'
    },
    {
        id: 5,
        name: 'Robert Wilson',
        age: 67,
        gender: 'Male',
        status: 'Active',
        lastVisit: 'Dec 1, 2025',
        phone: '(555) 567-8901',
        email: 'robert.wilson@email.com',
        conditions: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol'],
        nextAppointment: 'Jan 5, 2026'
    },
    {
        id: 6,
        name: 'Jessica Lee',
        age: 29,
        gender: 'Female',
        status: 'Active',
        lastVisit: 'Dec 7, 2025',
        phone: '(555) 678-9012',
        email: 'jessica.lee@email.com',
        conditions: [],
        nextAppointment: 'Dec 28, 2025'
    }
]);

const activePatientsCount = computed(() => patients.value.filter(p => p.status === 'Active').length);
const inactivePatientsCount = computed(() => patients.value.length - activePatientsCount.value);

const filteredPatients = computed(() => {
    if (!searchQuery.value) return patients.value;
    const query = searchQuery.value.toLowerCase();
    return patients.value.filter(patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.conditions.some(c => c.toLowerCase().includes(query))
    );
});
</script>

