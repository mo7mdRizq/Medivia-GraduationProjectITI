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

// File handling
const uploadedFile = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedFile.value = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
      preview: e.target.result,
      file: file
    }
  }
  reader.readAsDataURL(file)
}

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

// Analysis state
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const analysisStatus = ref('')

// Helper to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

const analysisError = ref(null)

const processFile = async () => {
  if (!uploadedFile.value) return
  
  currentStep.value = 2
  isAnalyzing.value = true
  analysisProgress.value = 0
  analysisError.value = null
  
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
      throw new Error('OpenAI API Key not configured in .env.local')
    }

    analysisStatus.value = 'Preparing prescription image...'
    analysisProgress.value = 20
    const base64Image = await fileToBase64(uploadedFile.value.file)
    
    analysisStatus.value = 'AI is reading the prescription...'
    analysisProgress.value = 50

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant. You will analyze medical prescription images and extract specific details in JSON format only. If a detail is missing, use an empty string."
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract the following from this prescription: medication name, dosage, frequency, instructions, and doctor name. Format as JSON with keys: medication, dosage, frequency, instructions, doctor." 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${uploadedFile.value.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI Error:', errorData)
      throw new Error(errorData.error?.message || 'API request failed')
    }

    analysisProgress.value = 90
    analysisStatus.value = 'Digitizing instructions...'
    
    const data = await response.json()
    console.log('AI Response:', data)
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('AI returned an empty response.')
    }

    const content = JSON.parse(data.choices[0].message.content)
    console.log('Parsed Content:', content)
    
    extractedData.value = {
      medication: content.medication || '',
      dosage: content.dosage || '',
      frequency: content.frequency || '',
      instructions: content.instructions || '',
      doctor: content.doctor || 'Dr. Sarah Johnson'
    }

    // Fallback check: if medication is still empty, let user know
    if (!extractedData.value.medication) {
      console.warn('Medication name was not found in the extraction.')
    }

    analysisProgress.value = 100
    setTimeout(() => {
      isAnalyzing.value = false
      currentStep.value = 3
    }, 500)

  } catch (error) {
    console.error('AI Analysis Error Detail:', error)
    analysisError.value = error.message
    isAnalyzing.value = false
    analysisStatus.value = 'Failed: ' + error.message
    
    // Instead of resetting immediately, keep the error visible
    // Wait longer so user can read it
    setTimeout(() => {
      if (analysisError.value) {
        // Option to go back could be here
      }
    }, 6000)
  }
}

// Validation state
const validationError = ref(null)

const savePrescription = () => {
  validationError.value = null
  
  // Validate fields
  if (!extractedData.value.medication.trim()) {
    validationError.value = 'Medication name is required'
    return
  }
  if (!extractedData.value.dosage.trim()) {
    validationError.value = 'Dosage is required'
    return
  }
  if (!extractedData.value.frequency.trim()) {
    validationError.value = 'Frequency is required'
    return
  }
  if (!extractedData.value.doctor.trim()) {
    validationError.value = 'Doctor name is required'
    return
  }

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
      <div class="bg-gradient-to-r from-[#5A4FF3] to-[#8B5CF6] p-6 text-white text-center relative">
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
              <div :class="currentStep >= step.number ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-indigo-100'" 
                   class="h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors duration-300">
                <span v-if="currentStep > step.number">Γ£ô</span>
                <span v-else>{{ step.number }}</span>
              </div>
              <span :class="currentStep >= step.number ? 'text-white' : 'text-indigo-200'" class="transition-colors duration-300">{{ step.label }}</span>
            </div>
            <!-- Connector Line -->
            <div v-if="index < steps.length - 1" class="w-4 h-0.5 bg-indigo-400/50"></div>
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
          <div v-else class="border-2 border-dashed border-slate-200 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer ring-offset-2 focus-within:ring-2 focus-within:ring-indigo-500"
               @click="$refs.fileInput.click()">
             <input type="file" ref="fileInput" class="hidden" accept="image/png, image/jpeg, image/jpg, application/pdf" @change="handleFileUpload">
             <div class="h-12 w-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
             </div>
             <p class="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
             <p class="text-xs text-slate-500 mt-1">JPG, PNG or PDF (max 10MB)</p>
          </div>

          <!-- Info Box -->
          <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#5A4FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-indigo-900 mb-1">Ready to analyze:</h4>
              <p class="text-xs text-indigo-700 leading-relaxed">
                Our AI will extract medication name, dosage, frequency, and instructions. You'll be able to review and edit the extracted information before saving.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: AI Reading -->
        <div v-if="currentStep === 2" class="flex flex-col items-center justify-center py-12">
            <!-- Progress Circle -->
            <div class="relative h-28 w-28 mb-6">
              <svg class="h-full w-full -rotate-90 text-slate-100" viewBox="0 0 36 36">
                <!-- Background Circle -->
                <path class="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
                <!-- Progress Circle -->
                <path class="text-indigo-500 transition-all duration-300 ease-out" :stroke-dasharray="`${analysisProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
              </svg>
              <!-- Percentage Text -->
              <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="text-xl font-bold text-blue-600">{{ analysisProgress }}%</span>
              </div>
            </div>
            
            <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ analysisStatus }}</h3>
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
               <input v-model="extractedData.medication" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none">
             </div>
             
             <div class="grid grid-cols-2 gap-4">
               <div>
                 <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Dosage</label>
                 <input v-model="extractedData.dosage" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none">
               </div>
               <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Frequency</label>
                 <input v-model="extractedData.frequency" type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none">
               </div>
             </div>

             <div>
               <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Instructions</label>
               <textarea v-model="extractedData.instructions" rows="3" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"></textarea>
             </div>

             <!-- Validation Error -->
             <div v-if="validationError" class="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm mt-4">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {{ validationError }}
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
          <button @click="processFile" :disabled="!uploadedFile" :class="!uploadedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4F46E5] shadow-indigo-500/20'" class="flex-1 py-2.5 rounded-lg bg-[#5A4FF3] text-white font-semibold text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
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
          <button @click="savePrescription" class="flex-1 py-2.5 rounded-lg bg-[#5A4FF3] text-white font-semibold text-sm hover:bg-[#4F46E5] transition-colors shadow-lg shadow-indigo-500/20">
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
