<template>
  <div>
    <!-- Header -->
        <header class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Prescriptions Management</h2>
                <p class="text-gray-500 mt-1">Create and manage patient prescriptions</p>
            </div>
            <button @click="openPrescriptionModal"
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
        <div class="space-y-4" v-if="filteredPrescriptions.length > 0">
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

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm border-dashed">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No prescriptions found</h3>
            <p class="text-gray-500 mt-1 max-w-sm mx-auto">Click "New Prescription" to create one.</p>
        </div>


    <!-- New Prescription Modal -->
    <div v-if="showPrescriptionModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closePrescriptionModal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-xl font-bold text-gray-900">New Prescription</h3>
                <button @click="closePrescriptionModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <form @submit.prevent="submitPrescription" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Patient Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                            <input v-model="newPrescription.patientName" type="text" @input="validateRequired('patientName', newPrescription.patientName)" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': errors.patientName}"
                                placeholder="e.g. John Doe">
                             <p v-if="errors.patientName" class="text-xs text-red-500 mt-1">{{ errors.patientName }}</p>
                        </div>

                        <!-- Patient Age -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Patient Age</label>
                            <input v-model="newPrescription.patientAge" type="number" @input="validateAge('patientAge', newPrescription.patientAge)" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': errors.patientAge}"
                                placeholder="e.g. 45">
                             <p v-if="errors.patientAge" class="text-xs text-red-500 mt-1">{{ errors.patientAge }}</p>
                        </div>
                    </div>

                    <!-- Diagnosis -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                        <input v-model="newPrescription.diagnosis" type="text" @input="validateRequired('diagnosis', newPrescription.diagnosis)" required
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': errors.diagnosis}"
                            placeholder="e.g. Hypertension">
                        <p v-if="errors.diagnosis" class="text-xs text-red-500 mt-1">{{ errors.diagnosis }}</p>
                    </div>

                    <!-- Medications List -->
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="block text-sm font-medium text-gray-700">Medications</label>
                            <button type="button" @click="addMedication" class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors border border-blue-100">
                                + Add Medication
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <div v-for="(med, index) in newPrescription.medications" :key="index" class="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                <button v-if="newPrescription.medications.length > 1" type="button" @click="removeMedication(index)" class="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Drug Name</label>
                                        <input v-model="med.name" type="text" required placeholder="e.g. Amoxicillin"
                                            class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                                        <input v-model="med.dosage" type="text" required placeholder="e.g. 500mg"
                                            class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                                        <input v-model="med.frequency" type="text" required placeholder="e.g. Twice daily"
                                            class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                                        <input v-model="med.duration" type="text" required placeholder="e.g. 7 days"
                                            class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Instructions</label>
                                    <input v-model="med.instructions" type="text" placeholder="e.g. Take with food"
                                        class="w-full rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Expiration -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                            <input v-model="newPrescription.dateExpires" type="date" @input="validateRequired('dateExpires', newPrescription.dateExpires)" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': errors.dateExpires}">
                             <p v-if="errors.dateExpires" class="text-xs text-red-500 mt-1">{{ errors.dateExpires }}</p>
                        </div>

                        <!-- Refills -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Refills</label>
                            <input v-model="newPrescription.refills" type="number" min="0" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                        </div>
                    </div>

                    <!-- Pharmacy Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Pharmacy Notes</label>
                        <textarea v-model="newPrescription.pharmacyNotes" rows="2"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="Any special instructions for the pharmacist..."></textarea>
                    </div>

                    <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" @click="closePrescriptionModal"
                            class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center">
                            Issue Prescription
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
import { useValidation } from '../composables/useValidation';
import { usePrescriptionsStore } from '../stores/prescriptionsStore';
const { prescriptions, addPrescription } = usePrescriptionsStore();

const searchQuery = ref('');
const showPrescriptionModal = ref(false);
const { errors, validateRequired, validateAge, clearErrors } = useValidation();

const newPrescription = reactive({
    patientName: '',
    patientAge: '',
    diagnosis: '',
    dateExpires: '',
    refills: 0,
    pharmacyNotes: '',
    medications: [
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]
});

const openPrescriptionModal = () => {
    // Reset form
    Object.assign(newPrescription, {
        patientName: '',
        patientAge: '',
        diagnosis: '',
        dateExpires: '',
        refills: 0,
        pharmacyNotes: '',
        medications: [
            { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
        ]
    });
    clearErrors();
    showPrescriptionModal.value = true;
};

const closePrescriptionModal = () => {
    showPrescriptionModal.value = false;
    clearErrors();
};

const addMedication = () => {
    newPrescription.medications.push({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
};

const removeMedication = (index) => {
    newPrescription.medications.splice(index, 1);
};

const submitPrescription = () => {
    // Validation
    const isNameValid = validateRequired('patientName', newPrescription.patientName);
    const isAgeValid = validateAge('patientAge', newPrescription.patientAge);
    const isDiagnosisValid = validateRequired('diagnosis', newPrescription.diagnosis);
    const isDateValid = validateRequired('dateExpires', newPrescription.dateExpires);

    if (!isNameValid || !isAgeValid || !isDiagnosisValid || !isDateValid) return;

    // Check at least one medication has a name
    const hasMedication = newPrescription.medications.some(m => m.name.trim() !== '');
    if (!hasMedication) {
        alert('Please add at least one medication.'); // Fallback simple alert for array validation
        return;
    }

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const expires = new Date(newPrescription.dateExpires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const p = {
        id: Date.now(),
        patientName: newPrescription.patientName,
        patientAge: newPrescription.patientAge,
        status: 'Active',
        dateIssued: today,
        dateExpires: expires,
        diagnosis: newPrescription.diagnosis,
        refills: newPrescription.refills,
        expanded: false,
        pharmacyNotes: newPrescription.pharmacyNotes || 'None',
        medications: JSON.parse(JSON.stringify(newPrescription.medications)) // deep copy
    };

    addPrescription(p);
    closePrescriptionModal();
};

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
