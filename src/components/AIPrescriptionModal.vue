<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add-prescription'])

const currentStep = ref(1)
const steps = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'AI Reading' },
  { number: 3, label: 'Review' },
  { number: 4, label: 'Complete' }
]

// Mocked file state to match the design
const uploadedFile = ref({
  name: '418a58e80158ad2e561a84744fcf4973.jpg',
  size: '23.9 KB',
  preview: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' // Using a placeholder image similar to mock
})

// Review Form Data
const extractedData = ref({
  medication: '',
  dosage: '',
  frequency: '',
  instructions: '',
  doctor: 'Dr. Sarah Johnson' // Default mocked doctor
})

const removeFile = () => {
  uploadedFile.value = null
}

const closeModal = () => {
  emit('close')
  // Reset state after close
  setTimeout(() => {
    currentStep.value = 1
    // Keep file for demo purposes, or can reset
  }, 300)
}

const processFile = () => {
  if (!uploadedFile.value) return
  
  // Move to AI Reading Step
  currentStep.value = 2
  
  // Simulate AI Processing delay
  setTimeout(() => {
    // Mock extraction
    extractedData.value = {
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: '3 times daily',
      instructions: 'Take with food. Complete full course.',
      doctor: 'Dr. Sarah Johnson'
    }
    currentStep.value = 3
  }, 2000)
}

const savePrescription = () => {
  // Simulate saving
  const newPrescription = {
    id: Date.now(),
    medication: extractedData.value.medication,
    dosage: extractedData.value.dosage,
    status: 'Active',
    condition: 'New Prescribed Condition',
    frequency: extractedData.value.frequency,
    duration: '10 days',
    instructions: extractedData.value.instructions,
    doctor: extractedData.value.doctor,
    lastRefill: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    nextRefill: 'N/A',
    refillsRemaining: 0
  }
  
  emit('add-prescription', newPrescription)
  currentStep.value = 4
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-center justify-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h2 class="text-lg font-semibold">AI Prescription Reader</h2>
        </div>

        <!-- Stepper -->
        <div class="flex items-center justify-center gap-2 text-xs font-medium">
          <template v-for="(step, index) in steps" :key="step.number">
            <!-- Step Item -->
            <div class="flex items-center gap-2">
              <div :class="currentStep >= step.number ? 'bg-white text-blue-600' : 'bg-blue-400 text-blue-100'" 
                   class="h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors duration-300">
                <span v-if="currentStep > step.number">✓</span>
                <span v-else>{{ step.number }}</span>
              </div>
              <span :class="currentStep >= step.number ? 'text-white' : 'text-blue-200'" class="transition-colors duration-300">{{ step.label }}</span>
            </div>
            <!-- Connector Line -->
            <div v-if="index < steps.length - 1" class="w-4 h-0.5 bg-blue-400/50"></div>
          </template>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto">
        
        <!-- Step 1: Upload -->
        <div v-if="currentStep === 1">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-slate-900">Upload Your Prescription</h3>
            <p class="text-sm text-slate-500 mt-1">Our AI will extract medication details automatically</p>
          </div>

          <!-- Upload Preview Card -->
          <div v-if="uploadedFile" class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div class="flex flex-col items-center">
              <div class="relative w-48 h-56 mb-3 rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-white">
                <img :src="uploadedFile.preview" alt="Prescription Preview" class="w-full h-full object-cover">
              </div>
              <p class="text-xs font-medium text-slate-700 truncate max-w-full px-4">{{ uploadedFile.name }}</p>
              <p class="text-[10px] text-slate-400 mt-0.5">{{ uploadedFile.size }}</p>
              <button @click="removeFile" class="text-xs text-red-500 font-medium mt-2 hover:text-red-700 hover:underline">
                Remove file
              </button>
            </div>
          </div>

          <!-- Empty Upload State -->
          <div v-else class="border-2 border-dashed border-slate-200 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer ring-offset-2 focus-within:ring-2 focus-within:ring-blue-500"
               @click="uploadedFile = { name: 'demo_script.jpg', size: '1.2 MB', preview: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' }">
             <div class="h-12 w-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
             </div>
             <p class="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
             <p class="text-xs text-slate-500 mt-1">JPG, PNG or PDF (max 10MB)</p>
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-blue-900 mb-1">Ready to analyze:</h4>
              <p class="text-xs text-blue-700 leading-relaxed">
                Our AI will extract medication name, dosage, frequency, and instructions. You'll be able to review and edit the extracted information before saving.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: AI Reading -->
        <div v-if="currentStep === 2" class="flex flex-col items-center justify-center py-12">
           <div class="relative h-24 w-24 mb-6">
             <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
             <div class="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
             <div class="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
             </div>
           </div>
           <h3 class="text-lg font-semibold text-slate-900 mb-2">Analyzing Prescription...</h3>
           <p class="text-sm text-slate-500 text-center max-w-xs">Connecting to Neural Engine processing nodes. Extracting text and validating medical entities.</p>
        </div>

        <!-- Step 3: Review -->
        <div v-if="currentStep === 3">
           <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-slate-900">Review Extracted Data</h3>
            <p class="text-sm text-slate-500 mt-1">Please verify the information below matches your prescription.</p>
          </div>

          <div class="space-y-4">
             <div>
               <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Medication Name</label>
               <input v-model="extractedData.medication" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
             </div>
             
             <div class="grid grid-cols-2 gap-4">
               <div>
                 <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Dosage</label>
                 <input v-model="extractedData.dosage" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
               </div>
               <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Frequency</label>
                 <input v-model="extractedData.frequency" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none">
               </div>
             </div>

             <div>
               <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Instructions</label>
               <textarea v-model="extractedData.instructions" rows="3" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"></textarea>
             </div>
          </div>
        </div>

        <!-- Step 4: Complete -->
        <div v-if="currentStep === 4" class="py-8 text-center">
           <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500 mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
             </svg>
           </div>
           <h3 class="text-2xl font-bold text-slate-900 mb-2">Prescription Added!</h3>
           <p class="text-slate-500 max-w-sm mx-auto">Your prescription has been successfully digitized and added to your active list.</p>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="p-6 pt-0 flex gap-3">
        <!-- Step 1 Footer -->
        <template v-if="currentStep === 1">
          <button @click="closeModal" class="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="processFile" :disabled="!uploadedFile" :class="!uploadedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600 shadow-teal-500/20'" class="flex-1 py-2.5 rounded-lg bg-teal-500 text-white font-semibold text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Process with AI
          </button>
        </template>
        
        <!-- Step 2 Footer (Processing) -->
         <template v-if="currentStep === 2">
           <div class="w-full text-center text-xs text-slate-400 font-medium pt-2">Processing... Please wait.</div>
         </template>

        <!-- Step 3 Footer (Review) -->
        <template v-if="currentStep === 3">
          <button @click="currentStep = 1" class="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
            Back
          </button>
          <button @click="savePrescription" class="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Confirm & Save
          </button>
        </template>

        <!-- Step 4 Footer (Complete) -->
        <template v-if="currentStep === 4">
          <button @click="closeModal" class="w-full py-3 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-lg">
            Close
          </button>
        </template>

      </div>

    </div>
  </div>
</template>
