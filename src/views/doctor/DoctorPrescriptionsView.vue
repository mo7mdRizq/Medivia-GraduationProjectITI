<template>
  <div>
    <!-- Header -->
        <header class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Prescriptions Management</h2>
                <p class="text-gray-500 mt-1">Create and manage patient prescriptions</p>
            </div>
            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                New Prescription
            </button>
        </header>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Total Prescriptions</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ prescriptions.length }}</h3>
                </div>
            </div>
            <div class="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <p class="text-sm font-medium text-green-600 mb-2">Active</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ activeCount }}</h3>
                </div>
            </div>
            <div class="bg-red-50 rounded-xl p-6 border border-red-100 shadow-sm">
                <p class="text-sm font-medium text-red-600 mb-2">Expired</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ expiredCount }}</h3>
                </div>
            </div>
        </div>

        <!-- Search -->
        <div class="mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <svg class="w-5 h-5 text-gray-400 ml-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by patient name, medication, or diagnosis..."
                class="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none h-10">
        </div>

        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">prescriptions</h3>

        <!-- Prescriptions List -->
        <div class="space-y-4">
            <div v-for="prescription in filteredPrescriptions" :key="prescription.id" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden prescription-card">
                <!-- Header / Trigger -->
                <div @click="togglePrescription(prescription.id)"
                    class="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors visit-header"
                    :class="{ 'bg-gray-50': prescription.expanded }">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h4 class="font-bold text-gray-900 text-base">{{ prescription.patientName }}</h4>
                                <span class="px-2 py-0.5 text-xs font-semibold rounded"
                                    :class="prescription.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                                    {{ prescription.status }}
                                </span>
                            </div>
                            <div class="flex items-center text-xs text-gray-500 mt-1">
                                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Issued: {{ prescription.dateIssued }}
                                <span class="mx-2">•</span>
                                Expires: {{ prescription.dateExpires }}
                                <span class="mx-2">•</span>
                                {{ prescription.medications.length }} medication(s)
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-medium text-gray-900">{{ prescription.diagnosis }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">Refills: {{ prescription.refills }}</p>
                    </div>
                    <div class="ml-4 flex items-center space-x-2">
                         <button
                            class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" @click.stop>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                        </button>
                        <div class="transform transition-transform duration-200 chevron" :class="{ 'rotate-180': prescription.expanded }">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Expanded Content -->
                <div v-show="prescription.expanded" class="p-6 border-t border-gray-100 visit-content">

                    <div class="bg-gray-50 p-4 rounded-lg flex items-center space-x-3 mb-6">
                        <div class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-500">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-900">{{ prescription.patientName }}</h4>
                            <p class="text-xs text-gray-500">Age: {{ prescription.patientAge }} years</p>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Prescribed Medications</h5>
                        </div>

                        <div v-for="(med, index) in prescription.medications" :key="index" class="bg-blue-50 bg-opacity-50 border border-blue-100 rounded-lg p-4 mb-3">
                            <div class="flex justify-between items-start mb-2">
                                <h6 class="text-sm font-bold text-gray-900">{{ med.name }}</h6>
                            </div>
                            <div class="grid grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
                                <div><span class="text-gray-400 block mb-0.5">Dosage:</span>{{ med.dosage }}</div>
                                <div><span class="text-gray-400 block mb-0.5">Frequency:</span>{{ med.frequency }}</div>
                                <div><span class="text-gray-400 block mb-0.5">Duration:</span>{{ med.duration }}</div>
                            </div>
                            <div class="bg-white p-2 rounded border border-blue-100 text-xs text-gray-700">
                                <span class="font-medium">Instructions:</span> {{ med.instructions }}
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex items-center mb-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Pharmacy Notes</h5>
                        </div>
                        <div class="bg-teal-50 p-3 rounded-lg text-gray-700 ml-3.5 border border-teal-100 cursor-text">
                            {{ prescription.pharmacyNotes }}
                        </div>
                    </div>

                    <div class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
                        <div class="text-xs">
                            <span class="text-gray-400 block mb-0.5">Date Issued</span>
                            <span class="font-medium text-gray-900">{{ prescription.dateIssued }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-400 block mb-0.5">Expiry Date</span>
                            <span class="font-medium text-gray-900">{{ prescription.dateExpires }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-400 block mb-0.5">Refills</span>
                            <span class="font-medium text-gray-900">{{ prescription.refills }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-400 block mb-0.5">Status</span>
                            <span class="font-medium px-2 py-0.5 rounded" :class="prescription.status === 'Active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'">{{ prescription.status }}</span>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center transition shadow-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download PDF
                        </button>
                        <button class="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded-lg font-medium text-sm transition">
                            Send to Pharmacy
                        </button>
                    </div>

                </div>
            </div>
        </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');

const prescriptions = ref([
    {
        id: 1,
        patientName: 'John Martinez',
        patientAge: 45,
        status: 'Active',
        dateIssued: 'Dec 5, 2025',
        dateExpires: 'Mar 5, 2026',
        diagnosis: 'Hypertension and Type 2 Diabetes',
        refills: 2,
        expanded: true,
        pharmacyNotes: 'Patient prefers generic medications',
        medications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take in the morning with or without food' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals to reduce stomach upset' }
        ]
    },
    {
        id: 2,
        patientName: 'Emily Johnson',
        patientAge: 32,
        status: 'Active',
        dateIssued: 'Dec 4, 2025',
        dateExpires: 'Jan 4, 2026',
        diagnosis: 'Seasonal Allergies',
        refills: 3,
        expanded: false,
        pharmacyNotes: 'None',
        medications: [
            { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the evening' }
        ]
    },
    {
        id: 3,
        patientName: 'Michael Brown',
        patientAge: 58,
        status: 'Active',
        dateIssued: 'Dec 3, 2025',
        dateExpires: 'Mar 3, 2026',
        diagnosis: 'High Cholesterol',
        refills: 2,
        expanded: false,
        pharmacyNotes: 'None',
        medications: [
            { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take in the evening' }
        ]
    },
    {
        id: 4,
        patientName: 'Jessica Lee',
        patientAge: 29,
        status: 'Active',
        dateIssued: 'Dec 7, 2025',
        dateExpires: 'Dec 14, 2025',
        diagnosis: 'Upper Respiratory Infection',
        refills: 0,
        expanded: false,
        pharmacyNotes: 'Check for penicillin allergy - none reported',
        medications: [
            { name: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', duration: '7 days', instructions: 'Finish all medication' }
        ]
    },
    {
        id: 5,
        patientName: 'Robert Wilson',
        patientAge: 67,
        status: 'Expired',
        dateIssued: 'Oct 15, 2025',
        dateExpires: 'Jan 15, 2026', // Wait, Jan 2026 is future. "Expired" status in data is odd if date is future. I'll stick to data.
        diagnosis: 'Cardiovascular Health Maintenance',
        refills: 0,
        expanded: false,
        pharmacyNotes: 'None',
        medications: [
            { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take with food' }
        ]
    }
]);

const activeCount = computed(() => prescriptions.value.filter(p => p.status === 'Active').length);
const expiredCount = computed(() => prescriptions.value.filter(p => p.status === 'Expired').length);

const togglePrescription = (id) => {
    const p = prescriptions.value.find(item => item.id === id);
    if (p) {
        p.expanded = !p.expanded;
    }
};

const filteredPrescriptions = computed(() => {
    if (!searchQuery.value) return prescriptions.value;
    const query = searchQuery.value.toLowerCase();
    return prescriptions.value.filter(p =>
        p.patientName.toLowerCase().includes(query) ||
        p.diagnosis.toLowerCase().includes(query) ||
        p.medications.some(m => m.name.toLowerCase().includes(query))
    );
});
</script>

