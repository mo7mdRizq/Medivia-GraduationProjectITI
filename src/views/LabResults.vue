<script setup>
import { ref, computed, nextTick } from 'vue'
import UploadLabResultModal from '../components/UploadLabResultModal.vue'
import Swal from 'sweetalert2'
import { generatePDF } from '../utils/pdfGenerator'
import { Chart, registerables } from 'chart.js'
import { 
  labResults, 
  historicalData, 
  totalTests, 
  normalResultsCount, 
  attentionResultsCount, 
  addLabResult 
} from '../stores/labResultsStore'

// Register Chart.js components
Chart.register(...registerables)

const showModal = ref(false)
const query = ref('')

const filteredResults = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return labResults.value
  return labResults.value.filter(r => 
    (r.testName && r.testName.toLowerCase().includes(q)) ||
    (r.category && r.category.toLowerCase().includes(q)) ||
    (r.orderedBy && r.orderedBy.toLowerCase().includes(q)) ||
    (r.status && r.status.toLowerCase().includes(q))
  )
})

const toggleResult = (index) => {
  // Find the actual item in labResults based on the filtered result
  const result = filteredResults.value[index]
  const originalIndex = labResults.value.findIndex(r => r.id === result.id)
  if (originalIndex !== -1) {
    labResults.value[originalIndex].expanded = !labResults.value[originalIndex].expanded
  }
}

const handleAddResult = (newResult) => {
  addLabResult(newResult)
  Swal.fire({
    title: 'Result Uploaded!',
    text: 'Laboratory result has been processed and saved.',
    icon: 'success',
    confirmButtonColor: '#5A4FF3'
  })
}

let chartInstance = null

const viewTrend = async (result) => {
  const testData = historicalData[result.testName]
  
  if (!testData) {
    Swal.fire({
      title: 'No Historical Data',
      text: `No historical trend data available for ${result.testName} yet. Data will be collected over time.`,
      icon: 'info',
      confirmButtonColor: '#5A4FF3'
    })
    return
  }

  const { value: formValues } = await Swal.fire({
    title: `<div style="display: flex; align-items: center; gap: 10px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#5A4FF3">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <span>${result.testName} - Trend Analysis</span>
            </div>`,
    html: `
      <div style="text-align: left; margin-bottom: 15px;">
        <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
          Historical values tracked over time to monitor your health progress.
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">
          ${testData.datasets.map(ds => `
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: ${ds.backgroundColor}; border: 1px solid ${ds.borderColor}; border-radius: 20px; font-size: 11px; color: ${ds.borderColor}; font-weight: 600;">
              <span style="width: 8px; height: 8px; background: ${ds.borderColor}; border-radius: 50%;"></span>
              ${ds.label}
            </span>
          `).join('')}
        </div>
      </div>
      <div style="position: relative; height: 300px; width: 100%;">
        <canvas id="trendChart"></canvas>
      </div>
      <div style="margin-top: 15px; padding: 12px; background: #f0fdfa; border-radius: 8px; border: 1px solid #99f6e4;">
        <p style="font-size: 12px; color: #0d9488; margin: 0;">
          <strong>📊 Analysis:</strong> ${result.status === 'Normal' ? 'All values are within the normal range. Keep up the good work!' : 'Some values need attention. Please consult with your doctor for personalized advice.'}
        </p>
      </div>
    `,
    width: 700,
    showCloseButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Close',
    confirmButtonColor: '#5A4FF3',
    didOpen: () => {
      const ctx = document.getElementById('trendChart')
      if (ctx) {
        if (chartInstance) {
          chartInstance.destroy()
        }
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: testData.labels,
            datasets: testData.datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  label: function(context) {
                    return ` ${context.dataset.label}: ${context.parsed.y}`
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#64748b',
                  font: {
                    size: 11
                  }
                }
              },
              y: {
                grid: {
                  color: 'rgba(100, 116, 139, 0.1)'
                },
                ticks: {
                  color: '#64748b',
                  font: {
                    size: 11
                  }
                }
              }
            }
          }
        })
      }
    },
    willClose: () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }
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
      <button @click="showModal = true" class="flex items-center justify-center gap-2 rounded-xl bg-[#5A4FF3] px-6 py-2.5 text-white font-bold hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Result (AI)
      </button>
    </div>

    <div class="relative mb-6">
      <input type="text" 
             v-model="query"
             placeholder="Search by test, category, or doctor..." 
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
      <p class="text-xs text-slate-500 uppercase tracking-wide">Showing {{ filteredResults.length }} of {{ labResults.length }} test results</p>
    </div>

    <!-- Lab Results List -->
    <div class="space-y-4">
      <div v-for="(result, index) in filteredResults" 
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
