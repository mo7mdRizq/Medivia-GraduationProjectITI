<template>
  <div>
    <!-- Header -->
        <header class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Visits Management</h2>
                <p class="text-gray-500 mt-1">Log and manage patient visits</p>
            </div>
            <button @click="openLogVisitModal"
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
        <div v-if="filteredVisits.length > 0" class="space-y-4">
            <div v-for="visit in filteredVisits" :key="visit.id" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden visit-card">
                 <!-- ... existing card content ... -->
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
        
        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm border-dashed">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No visits found</h3>
            <p class="text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your search terms.</p>
            <button class="mt-4 text-blue-600 font-medium text-sm hover:underline" @click="searchQuery = ''">Clear Search</button>
        </div>


    <!-- Log New Visit Modal -->
    <div v-if="showLogVisitModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closeLogVisitModal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-xl font-bold text-gray-900">Log New Visit</h3>
                <button @click="closeLogVisitModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <form @submit.prevent="submitNewVisit" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Patient Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                            <input v-model="newVisit.patientName" type="text" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                placeholder="e.g. John Doe">
                        </div>

                        <!-- Date -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                            <input v-model="newVisit.date" type="datetime-local" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                        </div>

                        <!-- Visit Type -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
                            <select v-model="newVisit.type" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                                <option value="" disabled>Select Type</option>
                                <option>Consultation</option>
                                <option>Follow-up</option>
                                <option>Checkup</option>
                                <option>Emergency</option>
                                <option>Sick Visit</option>
                            </select>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select v-model="newVisit.status" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                                <option>Completed</option>
                                <option>In Progress</option>
                            </select>
                        </div>
                    </div>

                    <!-- Diagnosis -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                        <input v-model="newVisit.diagnosis" type="text" required
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="Primary diagnosis">
                    </div>

                    <!-- Symptoms (Comma separated) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Symptoms (comma separated)</label>
                        <input v-model="newVisit.symptomsInput" type="text"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="e.g. Fever, Cough, Headache">
                    </div>

                     <!-- Treatment Plan -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Treatment Plan</label>
                        <textarea v-model="newVisit.treatment" rows="3"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="Describe the treatment plan..."></textarea>
                    </div>

                    <!-- Prescriptions -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Prescriptions</label>
                        <textarea v-model="newVisit.prescription" rows="2"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="List medications..."></textarea>
                    </div>

                    <!-- Follow Up -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Follow Up Date</label>
                        <input v-model="newVisit.followUp" type="date"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                    </div>
                
                    <!-- Visit Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea v-model="newVisit.notes" rows="3"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="Additional notes..."></textarea>
                    </div>

                    <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" @click="closeLogVisitModal"
                            class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center">
                            Save Visit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useVisitsStore } from '../stores/visitsStore';
const { visits, addVisit } = useVisitsStore();

const searchQuery = ref('');
const showLogVisitModal = ref(false);

const newVisit = reactive({
    patientName: '',
    date: '',
    type: '',
    status: 'Completed',
    diagnosis: '',
    symptomsInput: '',
    treatment: '',
    prescription: '',
    followUp: '',
    notes: ''
});

const openLogVisitModal = () => {
    // Reset form
    Object.assign(newVisit, {
        patientName: '',
        date: new Date().toISOString().slice(0, 16), // Current datetime default
        type: '',
        status: 'Completed',
        diagnosis: '',
        symptomsInput: '',
        treatment: '',
        prescription: '',
        followUp: '',
        notes: ''
    });
    showLogVisitModal.value = true;
};

const closeLogVisitModal = () => {
    showLogVisitModal.value = false;
};

const submitNewVisit = () => {
    const formattedDate = new Date(newVisit.date).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    });
    
    // Convert comma separated string to array
    const symptomsArray = newVisit.symptomsInput.split(',').map(s => s.trim()).filter(s => s);

    const visit = {
        id: Date.now(),
        patientName: newVisit.patientName,
        status: newVisit.status,
        date: formattedDate,
        type: newVisit.type,
        diagnosis: newVisit.diagnosis,
        diagnosisFull: newVisit.diagnosis,
        followUp: newVisit.followUp ? new Date(newVisit.followUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : 'None',
        expanded: false,
        symptoms: symptomsArray,
        treatment: newVisit.treatment,
        prescription: newVisit.prescription || 'None',
        notes: newVisit.notes
    };

    addVisit(visit);
    closeLogVisitModal();
};

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
