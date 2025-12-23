<script setup>
import { ref, computed } from 'vue'
import UploadLabResultModal from '../components/UploadLabResultModal.vue'
import Swal from 'sweetalert2'
import { generatePDF } from '../utils/pdfGenerator'

const showModal = ref(false)

const labResults = ref([
  {
    id: 1,
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    date: 'Dec 5, 2025',
    orderedBy: 'Dr. Michael Chen',
    status: 'Normal',
    expanded: true,
    results: [
      { name: 'White Blood Cells', value: '7.2 K/µL', range: '4.8 - 11 K/µL', status: 'normal' },
      { name: 'Red Blood Cells', value: '4.8 M/uL', range: '4.5 - 6.5 M/uL', status: 'normal' },
      { name: 'Hemoglobin', value: '14.5 g/dL', range: '13.5 - 17.5 g/dL', status: 'normal' },
      { name: 'Hematocrit', value: '43.2 %', range: '38.0 - 50 %', status: 'normal' },
      { name: 'Platelets', value: '245 K/µL', range: '150 - 450 K/µL', status: 'normal' }
    ]
  },
  {
    id: 2,
    testName: 'Lipid Panel',
    category: 'Chemistry',
    date: 'Nov 20, 2025',
    orderedBy: 'Dr. Sarah Johnson',
    status: 'Attention',
    expanded: true,
    results: [
      { name: 'Total Cholesterol', value: '206 mg/dL', range: '0 - 200 mg/dL', status: 'high' },
      { name: 'LDL Cholesterol', value: '135 mg/dL', range: '0 - 100 mg/dL', status: 'high' },
      { name: 'HDL Cholesterol', value: '52 mg/dL', range: '40 - 599 mg/dL', status: 'normal' },
      { name: 'Triglycerides', value: '145 mg/dL', range: '0 - 150 mg/dL', status: 'normal' },
      { name: 'VLDL Cholesterol', value: '29 mg/dL', range: '5 - 40 mg/dL', status: 'normal' }
    ]
  },
  {
    id: 3,
    testName: 'Comprehensive Metabolic Panel',
    category: 'Chemistry',
    date: 'Nov 28, 2025',
    orderedBy: 'Dr. Michael Chen',
    status: 'Normal',
    expanded: false,
    results: []
  },
  {
    id: 4,
    testName: 'Thyroid Function Panel',
    category: 'Endocrinology',
    date: 'Oct 10, 2025',
    orderedBy: 'Dr. Michael Chen',
    status: 'Normal',
    expanded: false,
    results: []
  },
  {
    id: 5,
    testName: 'Hemoglobin A1C',
    category: 'Chemistry',
    date: 'Nov 28, 2025',
    orderedBy: 'Dr. Michael Chen',
    status: 'Normal',
    expanded: false,
    results: []
  },
  {
    id: 6,
    testName: 'Vitamin D',
    category: 'Vitamins',
    date: 'Nov 28, 2025',
    orderedBy: 'Dr. Michael Chen',
    status: 'Attention',
    expanded: false,
    results: []
  },
  {
    id: 7,
    testName: 'Liver Function Panel',
    category: 'Chemistry',
    date: 'Oct 15, 2025',
    orderedBy: 'Dr. Sarah Johnson',
    status: 'Normal',
    expanded: false,
    results: []
  }
])
/* Computed Properties for Dynamic Counts */
const totalTests = computed(() => labResults.value.length)
const normalResultsCount = computed(() => labResults.value.filter(r => r.status === 'Normal').length)
const attentionResultsCount = computed(() => labResults.value.filter(r => r.status === 'Attention').length)

const toggleResult = (index) => {
  labResults.value[index].expanded = !labResults.value[index].expanded
}

const handleAddResult = (newResult) => {
  labResults.value.unshift(newResult)
  Swal.fire({
    title: 'Result Uploaded!',
    text: 'Laboratory result has been processed and saved.',
    icon: 'success',
    confirmButtonColor: '#0d9488'
  })
}

const viewTrend = (result) => {
  Swal.fire({
    title: 'Trend Analysis',
    text: `Trend chart feature for ${result.testName} is coming in the next update!`,
    icon: 'info',
    confirmButtonColor: '#0d9488'
  })
}

const downloadPDF = (result) => {
  const data = [
    { label: 'Test Name', value: result.testName },
    { label: 'Category', value: result.category },
    { label: 'Date', value: result.date },
    { label: 'Ordered By', value: result.orderedBy },
    { label: 'Status', value: result.status },
    ' ',
    'Detailed Results:'
  ]

  if (result.results && result.results.length > 0) {
    result.results.forEach(r => {
      data.push({ label: r.name, value: `${r.value} (Range: ${r.range})` })
    })
  } else {
    data.push('No detailed numeric data available for this summary.')
  }

  generatePDF(`Lab Result: ${result.testName}`, data, `LabResult_${result.date}.pdf`)

  Swal.fire({
    title: 'Downloaded',
    text: 'Lab Report PDF has been downloaded.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Lab Results</h1>
        <p class="text-slate-600">View and track your laboratory test results over time</p>
      </div>
      <button @click="showModal = true" class="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-white font-semibold hover:bg-teal-700 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Result (AI)
      </button>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-6">
      <input type="text" 
             placeholder="Search by doctor, diagnosis, treatment, or visit type..." 
             class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400 font-sans">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </svg>
    </div>

     <div class="mb-8">
       <button class="flex items-center gap-1 text-slate-400 text-sm hover:text-slate-600">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
         </svg>
         Filter
       </button>
     </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500 mb-1">Total Tests</p>
        <p class="text-2xl font-bold text-slate-900">{{ totalTests }}</p>
      </div>

      <div class="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-green-700 mb-1">Normal Results</p>
        <p class="text-2xl font-bold text-green-700">{{ normalResultsCount }}</p>
      </div>

      <div class="bg-orange-50 border border-orange-100 rounded-xl p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-orange-700 mb-1">Need Attention</p>
        <p class="text-2xl font-bold text-orange-700">{{ attentionResultsCount }}</p>
      </div>
    </div>

    <!-- Results Count -->
    <div class="mb-4">
      <p class="text-xs text-slate-500 uppercase tracking-wide">Showing {{ labResults.length }} of {{ labResults.length }} test results</p>
    </div>

    <!-- Lab Results List -->
    <div class="space-y-4">
      <div v-for="(result, index) in labResults" 
           :key="result.id" 
           :class="result.status === 'Attention' ? 'bg-orange-50/30 border-orange-200' : 'bg-teal-50/30 border-teal-100'"
           class="border rounded-xl overflow-hidden shadow-sm transition-all duration-200">
        
        <!-- Header -->
        <div class="p-5 cursor-pointer hover:bg-opacity-80" @click="toggleResult(index)"
             :class="result.status === 'Attention' ? 'bg-orange-50/50' : 'bg-teal-50/50'">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
               <div :class="result.status === 'Attention' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'"
                  class="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
               </div>
               
               <div>
                 <h3 class="text-sm font-bold text-slate-900">{{ result.testName }}</h3>
                 <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                   <span class="font-medium">{{ result.category }}</span> 
                   <span class="text-slate-300">|</span>
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   {{ result.date }}
                 </div>
                 <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   Ordered by {{ result.orderedBy }}
                 </div>
               </div>
            </div>

            <div class="flex items-center justify-between sm:justify-start gap-4">
              <span :class="result.status === 'Attention' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'"
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <svg v-if="result.status === 'Normal'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {{ result.status }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" 
                   :class="result.expanded ? 'rotate-180' : ''"
                   class="h-5 w-5 text-slate-400 transition-transform duration-200 ml-auto sm:ml-0" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Expanded Details -->
        <div v-if="result.expanded" class="p-5 bg-white border-t border-slate-100">
           <!-- Result Rows -->
           <div v-if="result.results && result.results.length > 0">
             <div v-for="(item, idx) in result.results" :key="idx" 
                  class="bg-white border rounded-lg p-4 mb-3 last:mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow"
                  :class="item.status === 'high' ? 'border-red-100 bg-red-50/10' : 'border-slate-100'">
                <div class="flex-1 mb-3 sm:mb-0">
                  <p class="text-sm font-semibold text-slate-800">{{ item.name }}</p>
                  <p :class="item.status === 'high' ? 'text-2xl font-bold text-red-600' : 'text-2xl font-bold text-slate-900'">
                    {{ item.value.split(' ')[0] }}
                    <span class="text-sm font-medium text-slate-500">{{ item.value.split(' ')[1] }}</span>
                  </p>
                  <div class="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                     <div class="h-full rounded-full" 
                          :class="item.status === 'high' ? 'bg-red-500 w-[90%]' : 'bg-green-500 w-[60%]'"></div>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">Reference Range: {{ item.range }}</p>
                </div>
                 
                 <div v-if="item.status === 'high'" class="sm:ml-4 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded self-start sm:self-center">High</div>
             </div>
           </div>
           
           <!-- Actions -->
           <div class="flex flex-col sm:flex-row gap-4">
             <button @click="viewTrend(result)" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               View Trend
             </button>
             <button @click="downloadPDF(result)" class="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
               Download PDF
             </button>
           </div>
        </div>
      </div>
    </div>

    <!-- Upload Lab Result Modal -->
    <UploadLabResultModal 
      :is-open="showModal"
      @close="showModal = false"
      @add-result="handleAddResult"
    />
  </div>
</template>
