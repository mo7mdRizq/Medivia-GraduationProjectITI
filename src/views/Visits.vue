<script setup>
import { ref, computed } from 'vue'
import AddVisitModal from '../components/AddVisitModal.vue'
import Swal from 'sweetalert2'
import { generatePDF } from '../utils/pdfGenerator'
import { 
  visits, 
  totalVisits, 
  recentVisitsCount, 
  uniqueProvidersCount, 
  addVisit 
} from '../stores/visitsStore'

const showModal = ref(false)

const toggleVisit = (id) => {
  const visit = visits.value.find(v => v.id === id)
  if (visit) {
    visit.expanded = !visit.expanded
  }
}

const handleAddVisit = (newVisit) => {
  addVisit(newVisit)
  Swal.fire({
    title: 'Visit Logged!',
    text: 'New past visit has been added to your history.',
    icon: 'success',
    confirmButtonColor: '#5A4FF3'
  })
}

const downloadFile = (file) => {
  // Generate a dummy PDF for the file
  generatePDF(`File Content: ${file.name}`, [
    { label: 'File Name', value: file.name },
    { label: 'Size', value: file.size },
    ' ',
    'This is a placeholder content for the file download.'
  ], file.name)

  Swal.fire({
    title: 'Downloaded',
    text: `${file.name} has been downloaded.`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}

const downloadVisitSummary = (visit) => {
  const data = [
    { label: 'Date', value: visit.date },
    { label: 'Time', value: visit.time },
    { label: 'Doctor', value: visit.doctor },
    { label: 'Specialty', value: visit.specialty },
    { label: 'Chief Complaint', value: visit.chiefComplaint },
    { label: 'Diagnosis', value: visit.diagnosis },
    ' ',
    'Clinical Notes:',
    visit.clinicalNotes || 'No notes available.',
    ' ',
    'Plan:',
    visit.followUpPlan || 'No follow-up plan recorded.'
  ]

  generatePDF(`Visit Summary: ${visit.date}`, data, `VisitSummary_${visit.id}.pdf`)

  Swal.fire({
    title: 'Summary Downloaded',
    text: 'Complete visit summary PDF saved.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Visits</h1>
        <p class="text-slate-600">Complete record of all your medical visits and examinations</p>
      </div>
      <button @click="showModal = true" class="flex items-center justify-center gap-2 rounded-xl bg-[#5A4FF3] px-6 py-3 text-white font-bold hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Visit Record
      </button>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-6">
      <input type="text" 
             placeholder="Search by doctor, diagnosis, treatment, or visit type..." 
             class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pl-12 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100/50 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </svg>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <p class="text-sm font-medium text-slate-500 mb-2">Total Visits</p>
        <p class="text-3xl font-bold text-slate-900">{{ totalVisits }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <p class="text-sm font-medium text-slate-500 mb-2">Recent (3 months)</p>
        <p class="text-3xl font-bold text-slate-900">{{ recentVisitsCount }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <p class="text-sm font-medium text-slate-500 mb-2">Healthcare Providers</p>
        <p class="text-3xl font-bold text-slate-900">{{ uniqueProvidersCount }}</p>
      </div>
    </div>

    <!-- Showing Count -->
    <div class="mb-4">
      <p class="text-sm text-slate-500">Showing {{ visits.length }} of {{ totalVisits }} visits</p>
    </div>

    <!-- Visits List -->
    <div class="space-y-4">
      <div v-for="visit in visits" 
           :key="visit.id" 
           class="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
           :class="visit.expanded ? 'shadow-md ring-1 ring-slate-200' : 'hover:shadow-sm'">
        
        <!-- Collapsed/Header View -->
        <div class="p-6 cursor-pointer" @click="toggleVisit(visit.id)">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0"> <!-- min-w-0 allows truncate to work inside flex -->
              <div class="flex items-start gap-3 mb-2">
                <div class="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 border border-teal-100 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#5A4FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                   <h3 class="text-base font-bold text-slate-900 leading-snug">{{ visit.type }}</h3>
                   <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1">
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ visit.date }}
                      </span>
                      <span class="hidden sm:inline">•</span>
                      <span class="flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ visit.time }}
                      </span>
                   </div>
                </div>
              </div>

              <!-- Content indented on desktop, flush on mobile -->
              <div class="sm:ml-[52px]">
                <p class="text-sm text-slate-900 mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="flex items-center gap-1 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ visit.doctor }}
                  </span>
                  <span class="text-slate-300 hidden sm:inline">•</span> 
                  <span class="text-slate-500">{{ visit.specialty }}</span>
                </p>

                 <div class="bg-slate-50 rounded-lg p-4">
                    <div class="mb-3">
                      <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Chief Complaint</span>
                      <p class="text-sm text-slate-900">{{ visit.chiefComplaint }}</p>
                    </div>
                    <div>
                      <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Diagnosis</span>
                      <p class="text-sm text-slate-900">{{ visit.diagnosis }}</p>
                    </div>
                 </div>
              </div>
            </div>

            <!-- Expand Toggle -->
             <div class="ml-4 pt-1">
              <button class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" 
                     :class="visit.expanded ? 'rotate-180' : ''"
                     class="h-5 w-5 transition-transform duration-200" 
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Expanded Content (Simpler Wrapper) -->
        <div v-if="visit.expanded" class="px-6 pb-6 pt-4 border-t border-slate-5">
          
          <!-- Vital Signs Grid -->
          <div v-if="visit.vitalSigns" class="mb-6">
             <div class="flex items-center gap-2 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
               <h4 class="text-sm font-semibold text-slate-900">Vital Signs</h4>
             </div>
             <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
               <div v-for="(vital, idx) in visit.vitalSigns" :key="idx" 
                    :class="{
                      'bg-blue-50 text-blue-700': vital.color === 'blue',
                      'bg-emerald-50 text-emerald-700': vital.color === 'green',
                      'bg-teal-50 text-teal-700': vital.color === 'teal',
                      'bg-indigo-50 text-indigo-700': vital.color === 'indigo',
                      'bg-fuchsia-50 text-fuchsia-700': vital.color === 'purple'
                    }"
                    class="rounded-lg p-3">
                 <p class="text-xs font-medium mb-1 opacity-80">{{ vital.label }}</p>
                 <p class="text-sm font-bold">{{ vital.value }}</p>
               </div>
             </div>
          </div>

          <!-- Clinical Notes -->
          <div v-if="visit.clinicalNotes" class="mb-6">
             <div class="flex items-center gap-2 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <h4 class="text-sm font-semibold text-slate-900">Clinical Notes</h4>
             </div>
             <div class="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm text-slate-700 leading-relaxed">
               {{ visit.clinicalNotes }}
             </div>
          </div>

          <!-- Prescriptions -->
          <div v-if="visit.prescriptions && visit.prescriptions.length" class="mb-6">
             <div class="flex items-center gap-2 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
               <h4 class="text-sm font-semibold text-slate-900">Prescriptions Issued</h4>
             </div>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div v-for="(rx, idx) in visit.prescriptions" :key="idx" 
                    class="bg-sky-50 border border-sky-100 text-sky-900 rounded-lg px-4 py-3 text-sm font-medium">
                 {{ rx }}
               </div>
             </div>
          </div>

          <!-- Lab Tests -->
          <div v-if="visit.labTests && visit.labTests.length" class="mb-6">
             <div class="flex items-center gap-2 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
               <h4 class="text-sm font-semibold text-slate-900">Laboratory Tests Ordered</h4>
             </div>
             <div class="flex flex-wrap gap-3">
               <div v-for="(test, idx) in visit.labTests" :key="idx" 
                    class="bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-lg px-4 py-3 text-sm font-medium flex-1 min-w-[200px]">
                 {{ test }}
               </div>
             </div>
          </div>

          <!-- Follow Up -->
           <div v-if="visit.followUpPlan" class="mb-6">
             <div class="flex items-center gap-2 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <h4 class="text-sm font-semibold text-slate-900">Follow-up Plan</h4>
             </div>
             <div class="bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-lg p-4 text-sm font-medium">
               {{ visit.followUpPlan }}
             </div>
          </div>

           <!-- Attached Files -->
           <div v-if="visit.attachedFiles && visit.attachedFiles.length">
             <div class="flex items-center gap-2 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
               </svg>
               <h4 class="text-sm font-semibold text-slate-900">Attached Files</h4>
             </div>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div v-for="(file, idx) in visit.attachedFiles" :key="idx" 
                    @click="downloadFile(file)"
                    class="border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div class="flex items-center gap-3">
                     <div class="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                     </div>
                     <div>
                       <p class="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{{ file.name }}</p>
                       <p class="text-xs text-slate-500">{{ file.size }}</p>
                     </div>
                  </div>
                  <button class="text-slate-400 hover:text-slate-600">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                     </svg>
                  </button>
               </div>
             </div>
           </div>

           <!-- Download Button -->
           <div class="mt-8">
              <button @click="downloadVisitSummary(visit)" class="w-full bg-[#5A4FF3] text-white rounded-xl py-4 text-sm font-bold hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 active:scale-95">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 Download Complete Visit Summary
              </button>
           </div>

        </div>
      </div>
    </div>
    
    <AddVisitModal 
      :is-open="showModal"
      @close="showModal = false"
      @add-visit="handleAddVisit"
    />
  </div>
</template>
