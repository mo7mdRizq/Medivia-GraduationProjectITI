<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add-result'])

// Mock similar AI flow to items
const currentStep = ref(1)
const steps = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'Analysis' },
  { number: 3, label: 'Result' }
]

const uploadedFile = ref(null)

const processFile = () => {
  currentStep.value = 2
  setTimeout(() => {
    currentStep.value = 3
  }, 2000)
}

const addResult = () => {
  const newResult = {
    id: Date.now(),
    testName: 'Complete Metabolic Panel',
    category: 'Chemistry',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    orderedBy: 'Dr. Sarah Johnson',
    status: 'Normal',
    expanded: true,
    results: [
        { name: 'Glucose', value: '88 mg/dL', range: '65 - 99 mg/dL', status: 'normal' },
        { name: 'Calcium', value: '9.5 mg/dL', range: '8.6 - 10.3 mg/dL', status: 'normal' },
        { name: 'Sodium', value: '140 mmol/L', range: '135 - 146 mmol/L', status: 'normal' },
        { name: 'Potassium', value: '4.2 mmol/L', range: '3.5 - 5.3 mmol/L', status: 'normal' }
    ]
  }
  emit('add-result', newResult)
  closeModal()
}

const closeModal = () => {
  emit('close')
  setTimeout(() => {
    currentStep.value = 1
    uploadedFile.value = null
  }, 300)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
       <div class="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white text-center relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-lg font-semibold mb-6">Upload Lab Result</h2>

        <!-- Horizontal Stepper -->
        <div class="flex items-center justify-center gap-4 text-xs font-medium">
          <div class="flex items-center gap-2">
            <div :class="currentStep >= 1 ? 'bg-white text-teal-600' : 'bg-teal-400 text-teal-100'" 
                 class="h-6 w-6 rounded-full flex items-center justify-center font-bold">1</div>
            <span :class="currentStep >= 1 ? 'text-white' : 'text-teal-200'">Upload</span>
          </div>
          <div class="w-8 h-0.5 bg-teal-400/50"></div>
           <div class="flex items-center gap-2">
            <div :class="currentStep >= 2 ? 'bg-white text-teal-600' : 'bg-teal-400 text-teal-100'" 
                 class="h-6 w-6 rounded-full flex items-center justify-center font-bold">2</div>
            <span :class="currentStep >= 2 ? 'text-white' : 'text-teal-200'">Analyze</span>
          </div>
          <div class="w-8 h-0.5 bg-teal-400/50"></div>
           <div class="flex items-center gap-2">
            <div :class="currentStep >= 3 ? 'bg-white text-teal-600' : 'bg-teal-400 text-teal-100'" 
                 class="h-6 w-6 rounded-full flex items-center justify-center font-bold">3</div>
            <span :class="currentStep >= 3 ? 'text-white' : 'text-teal-200'">Review</span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-8">
        <!-- Step 1 Upload -->
        <div v-if="currentStep === 1">
           <div class="border-2 border-dashed border-slate-200 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer ring-offset-2 focus-within:ring-2 focus-within:ring-teal-500"
                @click="uploadedFile = { name: 'lab_report.pdf' }">
             <div class="h-12 w-12 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
             </div>
             <p v-if="!uploadedFile" class="text-sm font-medium text-slate-900">Click to upload lab report</p>
             <p v-else class="text-sm font-bold text-teal-600">File Selected: {{ uploadedFile.name }}</p>
           </div>
           
           <button :disabled="!uploadedFile" @click="processFile" 
                   class="w-full py-3 rounded-lg bg-teal-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors">
              Start Analysis
           </button>
        </div>

        <!-- Step 2 Analysis -->
        <div v-if="currentStep === 2" class="flex flex-col items-center justify-center py-8">
           <div class="relative h-20 w-20 mb-6">
             <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
             <div class="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
           </div>
           <h3 class="text-lg font-bold text-slate-900 mb-2">Analyzing Data...</h3>
           <p class="text-slate-500 text-center text-sm">Extracting values, ranges, and flagging abnormalities.</p>
        </div>

        <!-- Step 3 Review -->
        <div v-if="currentStep === 3">
           <div class="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-start gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <div>
               <h4 class="font-bold text-green-800 text-sm">Extraction Successful</h4>
               <p class="text-xs text-green-700 mt-1">We found 4 test results in the "Metabolic Panel". All appear to be within normal range.</p>
             </div>
           </div>
           
           <button @click="addResult" class="w-full py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors">
             Save to Records
           </button>
        </div>

      </div>
    </div>
  </div>
</template>
