<template>
  <div>
    <!-- Header -->
        <header class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Visits Management</h2>
                <p class="text-gray-500 mt-1">Log and manage patient visits</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Log New Visit
            </button>
        </header>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Total Visits</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ visits.length }}</h3>
                </div>
            </div>
            <div class="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <p class="text-sm font-medium text-green-600 mb-2">Completed</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ completedCount }}</h3>
                </div>
            </div>
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <p class="text-sm font-medium text-blue-600 mb-2">In Progress</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ inProgressCount }}</h3>
                </div>
            </div>
        </div>

        <!-- Search -->
        <div class="mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <svg class="w-5 h-5 text-gray-400 ml-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by patient name, diagnosis, or visit type..."
                class="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none h-10">
        </div>

        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">visits</h3>

        <!-- Visits List -->
        <div class="space-y-4">
            <div v-for="visit in filteredVisits" :key="visit.id" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden visit-card">
                <!-- Header / Trigger -->
                <div @click="toggleVisit(visit.id)"
                    class="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors visit-header"
                    :class="{ 'bg-gray-50': visit.expanded }">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h4 class="font-bold text-gray-900 text-base">{{ visit.patientName }}</h4>
                                <span class="px-2 py-0.5 text-xs font-semibold rounded"
                                    :class="visit.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                                    {{ visit.status }}
                                </span>
                            </div>
                            <div class="flex items-center text-xs text-gray-500 mt-1">
                                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {{ visit.date }}
                                <span class="mx-2">•</span>
                                {{ visit.type }}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-medium text-gray-900">{{ visit.diagnosis }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">Follow-up: {{ visit.followUp }}</p>
                    </div>
                    <div class="ml-4 transform transition-transform duration-200 chevron" :class="{ 'rotate-180': visit.expanded }">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>

                <!-- Expanded Content -->
                <div v-show="visit.expanded" class="p-6 border-t border-gray-100 visit-content">
                    <div class="mb-4">
                        <div class="flex items-center mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Symptoms</h5>
                        </div>
                        <div class="flex flex-wrap gap-2 ml-3.5">
                            <span v-for="symptom in visit.symptoms" :key="symptom"
                                class="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium border border-red-100">
                                {{ symptom }}
                            </span>
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Diagnosis</h5>
                        </div>
                        <div class="bg-blue-50 p-3 rounded-lg text-gray-700 ml-3.5 border border-blue-100">
                            {{ visit.diagnosisFull }}
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Treatment Plan</h5>
                        </div>
                        <div class="bg-teal-50 p-3 rounded-lg text-gray-700 ml-3.5 border border-teal-100">
                            {{ visit.treatment }}
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Prescriptions</h5>
                        </div>
                        <div class="bg-purple-50 p-3 rounded-lg text-gray-700 ml-3.5 border border-purple-100 flex items-center">
                            <svg class="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            {{ visit.prescription }}
                        </div>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Visit Notes</h5>
                        </div>
                        <div class="bg-gray-50 p-3 rounded-lg text-gray-600 ml-3.5 border border-gray-100">
                            {{ visit.notes }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');

const visits = ref([]);

const completedCount = computed(() => visits.value.filter(v => v.status === 'Completed').length);
const inProgressCount = computed(() => visits.value.filter(v => v.status === 'In Progress').length);

const toggleVisit = (id) => {
    const visit = visits.value.find(v => v.id === id);
    if (visit) {
        visit.expanded = !visit.expanded;
    }
};

const filteredVisits = computed(() => {
    if (!searchQuery.value) return visits.value;
    const query = searchQuery.value.toLowerCase();
    return visits.value.filter(visit =>
        visit.patientName.toLowerCase().includes(query) ||
        visit.diagnosis.toLowerCase().includes(query) ||
        visit.type.toLowerCase().includes(query)
    );
});
</script>
