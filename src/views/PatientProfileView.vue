<template>
  <div>
    <!-- Back Button & Header -->
    <div class="mb-6">
        <button @click="$router.push({ name: 'patients' })" class="flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Patients
        </button>
        <div class="flex justify-between items-start">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold border-2 border-white shadow-sm">
                    {{ patientInitials }}
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ patient.name }}</h1>
                    <div class="flex items-center text-sm text-gray-500 mt-1">
                        <span class="mr-3">ID: #{{ patient.id }}</span>
                        <span class="px-2 py-0.5 rounded text-xs font-semibold"
                            :class="patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                            {{ patient.status }}
                        </span>
                    </div>
                </div>
            </div>
            <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm flex items-center text-sm">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit Profile
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
            <!-- Contact Info -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Information</h3>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Phone</p>
                            <p class="text-sm text-gray-600">{{ patient.phone }}</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Email</p>
                            <p class="text-sm text-gray-600">{{ patient.email }}</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Address</p>
                            <p class="text-sm text-gray-600">{{ patient.address }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Demographics -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                 <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Demographics</h3>
                 <div class="grid grid-cols-2 gap-4">
                     <div>
                         <p class="text-xs text-gray-500">Age</p>
                         <p class="text-sm font-medium text-gray-900">{{ patient.age }} Years</p>
                     </div>
                     <div>
                         <p class="text-xs text-gray-500">Gender</p>
                         <p class="text-sm font-medium text-gray-900">{{ patient.gender }}</p>
                     </div>
                     <div>
                         <p class="text-xs text-gray-500">Blood Type</p>
                         <p class="text-sm font-medium text-gray-900">{{ patient.bloodType }}</p>
                     </div>
                     <div>
                         <p class="text-xs text-gray-500">Date of Birth</p>
                         <p class="text-sm font-medium text-gray-900">{{ patient.dob }}</p>
                     </div>
                 </div>
            </div>

            <!-- Emergency Contact -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Emergency Contact</h3>
                <div>
                     <p class="text-sm font-bold text-gray-900">{{ patient.emergencyContact.name }}</p>
                     <p class="text-xs text-gray-500 mb-1">{{ patient.emergencyContact.relation }}</p>
                     <p class="text-sm text-gray-600">{{ patient.emergencyContact.phone }}</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
            <!-- Tabs -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="-mb-px flex space-x-8">
                    <button v-for="tab in tabs" :key="tab"
                        @click="currentTab = tab"
                        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                        :class="currentTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                        {{ tab }}
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <!-- Overview Tab -->
            <div v-if="currentTab === 'Overview'" class="space-y-6">
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Medical Summary</h3>
                    
                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                            <span class="text-sm font-semibold text-gray-700">Conditions</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="condition in patient.conditions" :key="condition" class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100">
                                {{ condition }}
                            </span>
                        </div>
                    </div>

                    <div class="mb-6">
                         <div class="flex items-center mb-3">
                            <span class="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                            <span class="text-sm font-semibold text-gray-700">Allergies</span>
                        </div>
                         <div class="flex flex-wrap gap-2">
                            <span v-for="allergy in patient.allergies" :key="allergy" class="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium border border-yellow-100">
                                {{ allergy }}
                            </span>
                             <span v-if="patient.allergies.length === 0" class="text-sm text-gray-500 italic">No known allergies</span>
                        </div>
                    </div>

                     <div>
                         <div class="flex items-center mb-3">
                            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                            <span class="text-sm font-semibold text-gray-700">Current Medications</span>
                        </div>
                         <div class="space-y-2">
                            <div v-for="med in patient.currentMedications" :key="med" class="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-100 flex justify-between items-center">
                                <span>{{ med.name }} <span class="text-xs text-blue-500 font-normal">({{ med.dosage }})</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visits Tab (Placeholder) -->
            <div v-if="currentTab === 'Visits'">
                 <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                     <div class="p-4 border-b border-gray-100 bg-gray-50">
                         <h3 class="font-semibold text-gray-900">Recent Visits</h3>
                     </div>
                     <div class="divide-y divide-gray-100">
                         <div v-for="visit in patient.recentVisits" :key="visit.id" class="p-4 hover:bg-gray-50 transition">
                             <div class="flex justify-between items-start">
                                 <div>
                                     <p class="font-semibold text-gray-900 text-sm">{{ visit.date }}</p>
                                     <p class="text-sm text-gray-600">{{ visit.reason }}</p>
                                 </div>
                                 <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ visit.type }}</span>
                             </div>
                             <p class="text-xs text-gray-500 mt-2">Dr. {{ visit.doctor }}</p>
                         </div>
                     </div>
                 </div>
            </div>

             <!-- Prescriptions Tab (Placeholder) -->
             <div v-if="currentTab === 'Prescriptions'">
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-gray-900 font-medium">Prescription History</h3>
                    <p class="text-gray-500 text-sm mt-1">Full prescription history will be available here.</p>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentTab = ref('Overview');
const tabs = ['Overview', 'Visits', 'Prescriptions', 'Lab Results'];

// Mock Data - In a real app this would fetch based on route.params.id
const patient = ref({
    id: route.params.id || '1',
    name: 'John Martinez',
    status: 'Active',
    age: 45,
    gender: 'Male',
    dob: 'May 15, 1978',
    bloodType: 'O+',
    phone: '(555) 123-4567',
    email: 'john.martinez@email.com',
    address: '123 Maple Street, Springfield, IL 62704',
    emergencyContact: {
        name: 'Maria Martinez',
        relation: 'Spouse',
        phone: '(555) 987-6543'
    },
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    currentMedications: [
        { name: 'Lisinopril', dosage: '10mg' },
        { name: 'Metformin', dosage: '500mg' }
    ],
    recentVisits: [
        { id: 101, date: 'Dec 05, 2025', reason: 'Routine Follow-up', type: 'Office Visit', doctor: 'Smith' },
        { id: 102, date: 'Nov 12, 2025', reason: 'Flu Symptoms', type: 'Urgent Care', doctor: 'Doe' },
    ]
});

const patientInitials = computed(() => {
    return patient.value.name.split(' ').map(n => n[0]).join('').substring(0, 2);
});

onMounted(() => {
    // Simulate fetching data
    console.log('Fetching data for patient ID:', route.params.id);
    // If you had a store or API, you'd call it here
});
</script>
