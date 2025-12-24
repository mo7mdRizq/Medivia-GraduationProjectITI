<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add-result'])


// Stepper state
const currentStep = ref(1)
const steps = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'Analysis' },
  { number: 3, label: 'Review' }
]

// File upload state
const uploadedFile = ref(null)
const filePreview = ref(null)
const isDragging = ref(false)
const fileInputRef = ref(null)

// AI Analysis state
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const analysisStatus = ref('')
const analysisError = ref(null)

// Extracted data (editable by user)
const extractedData = ref({
  testName: '',
  category: '',
  orderedBy: '',
  status: 'Normal',
  results: []
})

// Available categories
const categories = ['Hematology', 'Chemistry', 'Endocrinology', 'Vitamins', 'Immunology', 'Microbiology']

// Convert file to base64 for API
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// OpenAI API Integration
const analyzeLabResult = async () => {
  if (!uploadedFile.value) return
  
  isAnalyzing.value = true
  currentStep.value = 2
  analysisProgress.value = 0
  analysisError.value = null
  
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
      throw new Error('OpenAI API Key not configured in .env.local')
    }

    analysisStatus.value = 'Preparing image for AI...'
    analysisProgress.value = 20
    const base64Image = await fileToBase64(uploadedFile.value)
    
    analysisStatus.value = 'AI is analyzing your report...'
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
            content: "You are a medical lab assistant. You will analyze lab result images and extract data in JSON format only. Use empty strings for missing values."
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract: testName, category (Hematology, Chemistry, etc.), orderedBy, and a 'results' array (name, value, unit, range, status: 'normal'|'high'|'low'). Format as JSON." 
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
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI Lab Error:', errorData)
      throw new Error(errorData.error?.message || 'API request failed')
    }

    analysisProgress.value = 90
    analysisStatus.value = 'Finalizing results...'
    
    const data = await response.json()
    console.log('AI Lab Response:', data)
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('AI returned an empty response.')
    }

    const content = JSON.parse(data.choices[0].message.content)
    console.log('Parsed Lab Content:', content)
    
    extractedData.value = {
      testName: content.testName || 'Unknown Test',
      category: content.category || 'General',
      orderedBy: content.orderedBy || 'Unknown Doctor',
      status: (content.results || []).some(r => r.status && r.status !== 'normal') ? 'Attention' : 'Normal',
      results: content.results || []
    }

    analysisProgress.value = 100
    setTimeout(() => {
      isAnalyzing.value = false
      currentStep.value = 3
    }, 500)

  } catch (error) {
    console.error('AI Lab Analysis Error Detail:', error)
    analysisError.value = error.message
    isAnalyzing.value = false
    analysisStatus.value = 'Failed: ' + error.message
    
    setTimeout(() => {
      if (analysisError.value) {
        // Option to go back could be here
      }
    }, 6000)
  }
}



// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processSelectedFile(file)
  }
}

// Handle drag and drop
const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processSelectedFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

// Process the selected file
const processSelectedFile = (file) => {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Please upload a PDF or image file (JPG, PNG, WebP)')
    return
  }
  
  uploadedFile.value = file
  
  // Create preview for images
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    filePreview.value = null
  }
}

// Trigger file input
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Update a specific result value
const updateResultValue = (index, field, value) => {
  extractedData.value.results[index][field] = value
  
  // Re-evaluate status when value changes
  if (field === 'value') {
    evaluateResultStatus(index)
  }
}

// Evaluate if a result is within range
const evaluateResultStatus = (index) => {
  const result = extractedData.value.results[index]
  const range = result.range
  
  // Parse range (e.g., "4.5 - 11.0 K/┬╡L" -> [4.5, 11.0])
  const rangeMatch = range.match(/([\d.]+)\s*-\s*([\d.]+)/)
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1])
    const max = parseFloat(rangeMatch[2])
    const value = parseFloat(result.value)
    
    if (value < min) {
      result.status = 'low'
    } else if (value > max) {
      result.status = 'high'
    } else {
      result.status = 'normal'
    }
  }
  
  // Update overall status
  const hasAbnormal = extractedData.value.results.some(r => r.status !== 'normal')
  extractedData.value.status = hasAbnormal ? 'Attention' : 'Normal'
}

// Add a new result row
const addResultRow = () => {
  extractedData.value.results.push({
    name: '',
    value: '',
    unit: '',
    range: '',
    status: 'normal'
  })
}

// Remove a result row
const removeResultRow = (index) => {
  extractedData.value.results.splice(index, 1)
}

// Validation state
const validationError = ref(null)

// Save to records
const saveToRecords = () => {
  validationError.value = null
  
  // Validate basic fields
  if (!extractedData.value.testName.trim()) {
    validationError.value = 'Test Name is required'
    return
  }
  if (!extractedData.value.category) {
    validationError.value = 'Category is required'
    return
  }
  if (!extractedData.value.orderedBy.trim()) {
    validationError.value = 'Ordered By field is required'
    return
  }
  
  // Validate results
  if (extractedData.value.results.length === 0) {
    validationError.value = 'At least one result row is required'
    return
  }
  
  for (const result of extractedData.value.results) {
    if (!result.name.trim() || !String(result.value).trim()) {
      validationError.value = 'All result rows must have a name and value'
      return
    }
  }

  const newResult = {
    id: Date.now(),
    testName: extractedData.value.testName,
    category: extractedData.value.category,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    orderedBy: extractedData.value.orderedBy,
    status: extractedData.value.status,
    expanded: true,
    results: extractedData.value.results.map(r => ({
      name: r.name,
      value: `${r.value} ${r.unit}`,
      range: r.range,
      status: r.status
    }))
  }
  
  emit('add-result', newResult)
  closeModal()
}

// Count abnormal results
const abnormalCount = computed(() => {
  return (extractedData.value.results || []).filter(r => r.status && r.status !== 'normal').length
})

// Close modal and reset
const closeModal = () => {
  emit('close')
  setTimeout(() => {
    currentStep.value = 1
    uploadedFile.value = null
    filePreview.value = null
    analysisProgress.value = 0
    analysisStatus.value = ''
    extractedData.value = {
      testName: '',
      category: '',
      orderedBy: '',
      status: 'Normal',
      results: []
    }
  }, 300)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#5A4FF3] to-[#8B5CF6] p-6 text-white text-center relative flex-shrink-0">
        <button @click="closeModal" class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold">AI Lab Result Analyzer</h2>
        </div>

        <!-- Horizontal Stepper -->
        <div class="flex items-center justify-center gap-4 text-xs font-medium">
          <div class="flex items-center gap-2">
            <div :class="currentStep >= 1 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-indigo-100'" 
                 class="h-6 w-6 rounded-full flex items-center justify-center font-bold transition-all">
              <svg v-if="currentStep > 1" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>1</span>
            </div>
            <span :class="currentStep >= 1 ? 'text-white' : 'text-indigo-200'">Upload</span>
          </div>
          <div class="w-8 h-0.5 bg-indigo-400/50"></div>
          <div class="flex items-center gap-2">
            <div :class="currentStep >= 2 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-indigo-100'" 
                 class="h-6 w-6 rounded-full flex items-center justify-center font-bold transition-all">
              <svg v-if="currentStep > 2" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>2</span>
            </div>
            <span :class="currentStep >= 2 ? 'text-white' : 'text-indigo-200'">AI Analysis</span>
          </div>
          <div class="w-8 h-0.5 bg-indigo-400/50"></div>
          <div class="flex items-center gap-2">
            <div :class="currentStep >= 3 ? 'bg-white text-teal-600' : 'bg-teal-400 text-teal-100'" 
                 class="h-6 w-6 rounded-full flex items-center justify-center font-bold transition-all">3</div>
            <span :class="currentStep >= 3 ? 'text-white' : 'text-teal-200'">Review & Save</span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1">
        <!-- Step 1: Upload -->
        <div v-if="currentStep === 1">
          <p class="text-sm text-slate-600 mb-4 text-center">
            Upload your lab report (PDF or image) and our AI will automatically extract and analyze the results.
          </p>
          
          <!-- Hidden file input -->
          <input 
            ref="fileInputRef"
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            class="hidden"
            @change="handleFileSelect"
          />
          
          <!-- Drag & Drop Zone -->
          <div 
            :class="[
              'border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all',
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50',
              uploadedFile ? 'border-indigo-500 bg-indigo-50/50' : ''
            ]"
            @click="triggerFileInput"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
          >
            <template v-if="!uploadedFile">
              <div class="h-14 w-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-slate-900 mb-1">Drop your lab report here</p>
              <p class="text-xs text-slate-500">or click to browse files</p>
              <p class="text-xs text-slate-400 mt-2">Supports PDF, JPG, PNG, WebP</p>
            </template>
            
            <template v-else>
              <!-- File Preview -->
              <div class="flex items-center gap-4 w-full">
                <div v-if="filePreview" class="h-20 w-20 rounded-lg overflow-hidden border border-indigo-200 flex-shrink-0">
                  <img :src="filePreview" alt="Preview" class="h-full w-full object-cover" />
                </div>
                <div v-else class="h-16 w-16 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <p class="text-sm font-bold text-indigo-700 truncate">{{ uploadedFile.name }}</p>
                  <p class="text-xs text-slate-500">{{ (uploadedFile.size / 1024).toFixed(1) }} KB</p>
                  <p class="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Ready for analysis
                  </p>
                </div>
              </div>
            </template>
          </div>

          <!-- Supported formats info -->
          <div class="bg-slate-50 rounded-lg p-4 mb-6">
            <h4 class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI-Powered Analysis
            </h4>
            <ul class="text-xs text-slate-600 space-y-1">
              <li class="flex items-center gap-2">
                <span class="h-1 w-1 bg-indigo-500 rounded-full"></span>
                Automatic OCR text extraction from images & PDFs
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1 w-1 bg-indigo-500 rounded-full"></span>
                Smart detection of test names, values & reference ranges
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1 w-1 bg-teal-500 rounded-full"></span>
                Automatic flagging of abnormal values
              </li>
            </ul>
          </div>
          
          <button 
            :disabled="!uploadedFile" 
            @click="analyzeLabResult" 
            class="w-full py-3 rounded-lg bg-[#5A4FF3] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4F46E5] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Start AI Analysis
          </button>
        </div>

        <!-- Step 2: Analysis -->
        <div v-if="currentStep === 2" class="flex flex-col items-center justify-center py-8">
          <!-- Animated Brain/AI Icon -->
          <div class="relative h-24 w-24 mb-6">
            <div class="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-30"></div>
            <div class="absolute inset-2 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#5A4FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-slate-900 mb-2">AI Analyzing Your Lab Report</h3>
          <p class="text-slate-500 text-center text-sm mb-6">{{ analysisStatus }}</p>
          
          <!-- Progress Bar -->
          <div class="w-full max-w-xs bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-indigo-400 to-[#5A4FF3] h-full rounded-full transition-all duration-300"
              :style="{ width: `${analysisProgress}%` }"
            ></div>
          </div>
          <p class="text-xs text-slate-500">{{ analysisProgress }}% complete</p>
          
          <!-- Processing steps animation -->
          <div class="mt-6 space-y-2 w-full max-w-xs">
            <div v-for="(label, idx) in ['OCR Scanning', 'Data Extraction', 'Range Analysis']" :key="idx"
                 class="flex items-center gap-2 text-xs">
              <div :class="[
                'h-4 w-4 rounded-full flex items-center justify-center',
                analysisProgress > (idx + 1) * 30 ? 'bg-indigo-500' : 'bg-slate-200'
              ]">
                <svg v-if="analysisProgress > (idx + 1) * 30" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span :class="analysisProgress > (idx + 1) * 30 ? 'text-indigo-700 font-medium' : 'text-slate-400'">{{ label }}</span>
            </div>
          </div>
          
          <!-- Error Display -->
          <div v-if="analysisError" class="mt-6 w-full max-w-xs">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-semibold text-red-700">Analysis Failed</p>
              <p class="text-xs text-red-600 mt-1">{{ analysisError }}</p>
              <p class="text-xs text-slate-500 mt-2">Returning to upload...</p>
            </div>
          </div>
        </div>


        <!-- Step 3: Review & Edit -->
        <div v-if="currentStep === 3">
          <!-- Success Banner -->
          <div :class="[
            'rounded-lg p-4 mb-6 flex items-start gap-3',
            abnormalCount > 0 ? 'bg-orange-50 border border-orange-100' : 'bg-green-50 border border-green-100'
          ]">
            <svg v-if="abnormalCount === 0" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 :class="abnormalCount > 0 ? 'font-bold text-orange-800 text-sm' : 'font-bold text-green-800 text-sm'">
                {{ abnormalCount > 0 ? 'Attention Required' : 'Analysis Complete' }}
              </h4>
              <p :class="abnormalCount > 0 ? 'text-xs text-orange-700 mt-1' : 'text-xs text-green-700 mt-1'">
                Found {{ extractedData.results.length }} test results. 
                <span v-if="abnormalCount > 0">{{ abnormalCount }} value(s) are outside normal range.</span>
                <span v-else>All values appear to be within normal range.</span>
              </p>
            </div>
          </div>

          <!-- Test Info -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs font-semibold text-slate-600 mb-1 block">Test Name</label>
              <input 
                v-model="extractedData.testName"
                type="text" 
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4FF3] focus:border-transparent"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-600 mb-1 block">Category</label>
              <select 
                v-model="extractedData.category"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4FF3] focus:border-transparent"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="text-xs font-semibold text-slate-600 mb-1 block">Ordered By</label>
            <input 
              v-model="extractedData.orderedBy"
              type="text" 
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4FF3] focus:border-transparent"
            />
          </div>

          <!-- Results Table -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-slate-600">Extracted Results</label>
              <button @click="addResultRow" class="text-xs text-[#5A4FF3] hover:text-[#4F46E5] font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Row
              </button>
            </div>
            
            <div class="border border-slate-200 rounded-lg overflow-hidden">
              <table class="w-full text-xs">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600">Test</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600">Value</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600">Unit</th>
                    <th class="px-3 py-2 text-left font-semibold text-slate-600">Range</th>
                    <th class="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                    <th class="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(result, idx) in extractedData.results" :key="idx" 
                      :class="result.status !== 'normal' ? 'bg-orange-50/50' : 'bg-white'"
                      class="border-t border-slate-100">
                    <td class="px-3 py-2">
                      <input 
                        v-model="result.name" 
                        type="text"
                        class="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#5A4FF3]"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        :value="result.value"
                        @input="updateResultValue(idx, 'value', $event.target.value)"
                        type="text"
                        :class="[
                          'w-16 px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#5A4FF3]',
                          result.status === 'high' ? 'border-red-300 text-red-600 font-bold' : 
                          result.status === 'low' ? 'border-blue-300 text-blue-600 font-bold' : 
                          'border-slate-200'
                        ]"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        v-model="result.unit" 
                        type="text"
                        class="w-16 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#5A4FF3]"
                      />
                    </td>
                    <td class="px-3 py-2">
                      <input 
                        v-model="result.range" 
                        type="text"
                        class="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#5A4FF3]"
                      />
                    </td>
                    <td class="px-3 py-2 text-center">
                      <span :class="[
                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                        result.status === 'high' ? 'bg-red-100 text-red-700' :
                        result.status === 'low' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      ]">
                        {{ result.status === 'normal' ? 'Γ£ô' : result.status === 'high' ? 'Γåæ' : 'Γåô' }}
                      </span>
                    </td>
                    <td class="px-2 py-2">
                      <button @click="removeResultRow(idx)" class="text-slate-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Validation Error -->
          <div v-if="validationError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ validationError }}
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button 
              @click="currentStep = 1" 
              class="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Re-upload
            </button>
            <button 
              @click="saveToRecords" 
              class="flex-1 py-3 rounded-lg bg-[#5A4FF3] text-white font-semibold hover:bg-[#4F46E5] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Save to Records
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
