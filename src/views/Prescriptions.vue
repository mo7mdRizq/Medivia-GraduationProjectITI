<script setup>
import { ref, computed } from 'vue'
import AIPrescriptionModal from '../components/AIPrescriptionModal.vue'
import Swal from 'sweetalert2'
import { generatePDF } from '../utils/pdfGenerator'

const showAIModal = ref(false)

const prescriptions = ref([
  {
    id: 1,
    medication: 'Metformin',
    dosage: '500mg',
    status: 'Active',
    condition: 'Endocrinology',
    frequency: 'Twice daily',
    duration: '3 months',
    instructions: 'Take with meals to reduce stomach upset. Monitor blood sugar levels regularly. Avoid excessive alcohol consumption.',
    doctor: 'Dr. Sarah Johnson',
    lastRefill: 'Dec 10, 2025',
    nextRefill: 'Jan 9, 2026',
    refillsRemaining: 3
  },
  {
    id: 2,
    medication: 'Lisinopril',
    dosage: '10mg',
    status: 'Active',
    condition: 'Hypertension Management',
    frequency: 'Once daily',
    duration: 'Ongoing',
    instructions: 'Take in the morning with or without food. Monitor blood pressure regularly. Avoid potassium supplements without consulting your doctor.',
    doctor: 'Dr. Sarah Johnson',
    lastRefill: 'Dec 1, 2025',
    nextRefill: 'Dec 31, 2025',
    refillsRemaining: 2
  },
  {
    id: 3,
    medication: 'Atorvastatin',
    dosage: '20mg',
    status: 'Active',
    condition: 'Cholesterol Management',
    frequency: 'Once daily at bedtime',
    duration: 'Ongoing',
    instructions: 'Take at bedtime with or without food. Avoid grapefruit and grapefruit juice. Report any unexplained muscle pain.',
    doctor: 'Dr. Sarah Johnson',
    lastRefill: 'Nov 20, 2025',
    nextRefill: 'Dec 20, 2025',
    refillsRemaining: 1
  },
  {
    id: 4,
    medication: 'Vitamin D3',
    dosage: '2000 IU',
    status: 'Active',
    condition: 'Vitamin D Deficiency',
    frequency: 'Once daily',
    duration: '6 months',
    instructions: 'Take with fatty meal for better absorption. Can be taken at any time of the day.',
    doctor: 'Dr. Michael Chen',
    lastRefill: 'Nov 28, 2025',
    nextRefill: 'Jan 28, 2026',
    refillsRemaining: 2
  },
  {
    id: 5,
    medication: 'Omeprazole',
    dosage: '20mg',
    status: 'Active',
    condition: 'Acid Reflux',
    frequency: 'Once daily before breakfast',
    duration: '3 months',
    instructions: 'Take 30 minutes before breakfast. Swallow whole, do not crush or chew. May take 1-4 days for full effect.',
    doctor: 'Dr. Emily Davis',
    lastRefill: 'Oct 10, 2025',
    nextRefill: 'Nov 10, 2025',
    refillsRemaining: 0
  },
  {
    id: 6,
    medication: 'Amoxicillin',
    dosage: '500mg',
    status: 'Completed',
    condition: 'Acute Respiratory Infection',
    frequency: 'Every three times daily',
    duration: '10 days',
    instructions: 'Take every 8 hours for 10 days. Complete the entire course even if symptoms improve. Take with food if stomach upset occurs.',
    doctor: 'Dr. Emily Davis',
    completionDate: 'Aug 5, 2025'
  },
  {
    id: 7,
    medication: 'Ibuprofen',
    dosage: '400mg',
    status: 'Completed',
    condition: 'Acute Pain Reliever',
    frequency: 'Every six hours as needed',
    duration: 'As needed',
    instructions: 'Take with food or milk to avoid stomach irritation. Do not exceed 1200mg in 24 hours. Stop if pain persists for more than 10 days.',
    doctor: 'Dr. Michael Chen',
    completionDate: 'May 24, 2025'
  },
  {
    id: 8,
    medication: 'Aspirin',
    dosage: '81mg',
    status: 'Active',
    condition: 'Cardiovascular Protection',
    frequency: 'Once daily',
    duration: 'Ongoing',
    instructions: 'Take with food to reduce risk of stomach upset. Low-dose aspirin for heart health. Do not stop suddenly without consulting your doctor.',
    doctor: 'Dr. Sarah Johnson',
    lastRefill: 'Oct 10, 2025',
    nextRefill: 'Feb 15, 2026',
    refillsRemaining: 4
  },
  {
    id: 9,
    medication: 'Cetirizine',
    dosage: '10mg',
    status: 'Active',
    condition: 'Seasonal Allergies',
    frequency: 'Once daily',
    duration: 'As needed',
    instructions: 'Take once daily in the morning or evening. Can be taken with or without food. Avoid alcohol while taking this medication.',
    doctor: 'Dr. Emily Davis',
    lastRefill: 'Oct 1, 2025',
    nextRefill: 'Not applicable',
    refillsRemaining: 6
  }
])
/* Computed Properties for Dynamic Counts */
const activeCount = computed(() => prescriptions.value.filter(p => p.status === 'Active').length)
const refillSoonCount = computed(() => prescriptions.value.filter(p => p.status === 'Active' && p.refillsRemaining <= 2).length)
const completedCount = computed(() => prescriptions.value.filter(p => p.status === 'Completed').length)

const handleAddPrescription = (newPrescription) => {
  prescriptions.value.unshift(newPrescription)
  Swal.fire({
    title: 'Success!',
    text: 'Prescription added successfully',
    icon: 'success',
    confirmButtonColor: '#0d9488'
  })
}

const downloadPDF = (item) => {
  const data = [
    { label: 'Medication', value: item.medication },
    { label: 'Dosage', value: item.dosage },
    { label: 'Doctor', value: item.doctor },
    { label: 'Frequency', value: item.frequency },
    { label: 'Duration', value: item.duration },
    { label: 'Status', value: item.status },
    { label: 'Instructions', value: item.instructions }
  ]
  generatePDF(`Prescription: ${item.medication}`, data, `Prescription_${item.medication}.pdf`)
  
  Swal.fire({
    title: 'Downloaded!',
    text: 'Your prescription PDF has been downloaded.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}

const requestRefill = async (item) => {
  if (item.status !== 'Active') return

  const result = await Swal.fire({
    title: 'Request Refill?',
    text: `Do you want to request a refill for ${item.medication}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0d9488',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, request it!'
  })

  if (result.isConfirmed) {
    Swal.fire({
      title: 'Request Sent!',
      text: 'Your refill request has been sent to the pharmacy.',
      icon: 'success',
      confirmButtonColor: '#0d9488'
    })
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Prescriptions</h1>
        <p class="text-slate-600">Manage and view all your current and past prescriptions</p>
      </div>
      <button @click="showAIModal = true" class="flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-2.5 text-white font-semibold hover:bg-teal-600 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Prescription (AI)
      </button>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-8">
      <input type="text" 
             placeholder="Search by doctor, medication, or treatment type..." 
             class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </svg>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Active Prescriptions -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500 mb-1">Active Prescriptions</p>
        <p class="text-3xl font-bold text-slate-900">{{ activeCount }}</p>
      </div>

      <!-- Need Refill Soon -->
      <div class="bg-yellow-50 border border-yellow-100 rounded-xl p-5 shadow-sm">
        <p class="text-sm font-medium text-yellow-700 mb-1">Need Refill Soon</p>
        <p class="text-3xl font-bold text-yellow-800">{{ refillSoonCount }}</p>
      </div>

      <!-- Completed -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500 mb-1">Completed</p>
        <p class="text-3xl font-bold text-slate-900">{{ completedCount }}</p>
      </div>
    </div>

    <!-- Prescriptions Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="prescription in prescriptions" :key="prescription.id" class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        
        <!-- Card Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex gap-4">
            <div :class="prescription.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'" 
                 class="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900 text-lg">{{ prescription.medication }}</h3>
                <span :class="prescription.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'" 
                      class="px-2 py-0.5 rounded-full text-xs font-semibold">
                  {{ prescription.status }}
                </span>
              </div>
              <p class="text-sm font-medium text-slate-500">{{ prescription.dosage }}</p>
              
              <div class="mt-2 text-xs text-slate-500">
                <p class="font-medium text-slate-900">{{ prescription.doctor }}</p>
                <p>{{ prescription.condition }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-6 mb-4">
          <div>
            <p class="text-xs text-slate-400 font-medium mb-1">Frequency</p>
            <p class="text-sm font-semibold text-slate-900">{{ prescription.frequency }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium mb-1">Duration</p>
            <p class="text-sm font-semibold text-slate-900">{{ prescription.duration }}</p>
          </div>
        </div>

        <!-- Instructions -->
        <div class="mb-4">
          <p class="text-xs text-slate-400 font-medium mb-1">Instructions</p>
          <p class="text-sm text-slate-700 leading-relaxed">{{ prescription.instructions }}</p>
        </div>

        <!-- Refill Info / Completion Date -->
        <div class="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
          <div v-if="prescription.status === 'Active'" class="flex items-center justify-between">
            <div>
               <p class="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 Refill Information
               </p>
               <div class="flex gap-6 mt-2">
                 <div>
                   <p class="text-[10px] text-slate-400 uppercase tracking-wide">Last Refill</p>
                   <p class="text-sm font-bold text-slate-900">{{ prescription.lastRefill }}</p>
                 </div>
                 <div>
                   <p class="text-[10px] text-slate-400 uppercase tracking-wide">Next Refill</p>
                   <p class="text-sm font-bold text-slate-900">{{ prescription.nextRefill }}</p>
                 </div>
               </div>
            </div>
          </div>
          <div v-else>
             <p class="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Status Information
             </p>
             <div class="flex gap-6 mt-2">
                 <div>
                   <p class="text-[10px] text-slate-400 uppercase tracking-wide">Completion Date</p>
                   <p class="text-sm font-bold text-slate-900">{{ prescription.completionDate }}</p>
                 </div>
                 <div>
                   <p class="text-[10px] text-slate-400 uppercase tracking-wide">Next Refill</p>
                   <p class="text-sm font-bold text-slate-900">Not applicable</p>
                 </div>
             </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button @click="downloadPDF(prescription)" class="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <button v-if="prescription.status === 'Active'" @click="requestRefill(prescription)" class="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Request Refill
          </button>
          <button v-else class="flex-1 bg-slate-50 border border-slate-200 text-slate-400 text-sm font-semibold py-2.5 rounded-lg cursor-not-allowed">
            Request Refill
          </button>
        </div>

      </div>
    </div>

    <!-- AI Prescription Modal -->
    <AIPrescriptionModal 
      :is-open="showAIModal" 
      @close="showAIModal = false" 
      @add-prescription="handleAddPrescription"
    />
  </div>
</template>

<style scoped>
/* No custom css needed, utilizing tailwind classes */
</style>
