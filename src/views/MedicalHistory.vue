<script setup>
import { ref, computed } from 'vue'
import AddMedicalHistoryModal from '../components/AddMedicalHistoryModal.vue'
import Swal from 'sweetalert2'
import { generatePDF } from '../utils/pdfGenerator'
import { medicalHistory, addMedicalHistory } from '../stores/medicalHistoryStore'

const showModal = ref(false)
const query = ref('')

const filteredItems = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return medicalHistory.value
  return medicalHistory.value.filter(item =>
    item.type.toLowerCase().includes(q) ||
    item.title.toLowerCase().includes(q) ||
    item.doctor.toLowerCase().includes(q) ||
    item.specialty.toLowerCase().includes(q)
  )
})

const toggleExpand = (item) => {
  item.expanded = !item.expanded
}

const handleAddHistory = (newRecord) => {
  addMedicalHistory(newRecord)
  Swal.fire({
    title: 'Record Added!',
    text: 'History record successfully added.',
    icon: 'success',
    confirmButtonColor: '#2563eb' // blue-600
  })
}

const downloadFile = (file) => {
  generatePDF(`Medical History File: ${file.name}`, [
    { label: 'File Name', value: file.name },
    { label: 'File Size', value: file.size },
    { label: 'Type', value: file.type },
    ' ',
    'This document is a placeholder for the actual medical file.'
  ], file.name)
  
  Swal.fire({
    title: 'Downloaded',
    text: `File ${file.name} downloaded successfully.`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  })
}
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-bold text-slate-900">Medical History</h1>
        <div class="text-slate-500">Complete record of your medical visits and treatments</div>
      </div>
      <button @click="showModal = true" class="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Record
      </button>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
      <input 
        class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400" 
        type="text" 
        placeholder="Search by doctor, diagnosis, treatment, or visit type..." 
        v-model="query"
      >
    </div>

    <div class="mb-4 text-slate-500 text-sm font-medium">Visits</div>

    <div class="flex flex-col gap-4 mb-8">
      <div v-for="item in filteredItems" :key="item.id" class="history-card bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        
        <!-- Header Section -->
        <div class="p-6 cursor-pointer" @click="toggleExpand(item)">
          <div class="flex justify-between items-start gap-4">
             <!-- Left Side -->
             <div class="flex-1">
               <div class="flex flex-wrap items-center gap-3 mb-2">
                 <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                   {{ item.type }}
                 </span>
                 <span class="text-slate-500 text-sm">{{ item.date }}</span>
               </div>
               <div class="font-bold text-slate-900 text-lg mb-3">{{ item.title }}</div>
               
               <div class="flex items-center gap-x-6 gap-y-2 flex-wrap text-slate-500 text-sm">
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                       <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                       <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                    {{ item.doctor }}
                  </span>
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                       <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2z"/>
                    </svg>
                    {{ item.specialty }}
                  </span>
               </div>
             </div>
             
             <!-- Right Side (Chevron) -->
             <div class="flex-shrink-0 pt-1">
               <svg xmlns="http://www.w3.org/2000/svg" 
                   :class="item.expanded ? 'rotate-180' : ''"
                   class="h-5 w-5 text-slate-400 transition-transform duration-200" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
               </svg>
             </div>
          </div>
        </div>

        <!-- Expanded Content -->
        <div v-if="item.expanded" class="px-6 pb-6 pt-2 border-t border-slate-50">
           <!-- Treatment Notes -->
           <div class="mb-5">
             <div class="flex items-center gap-2 mb-2 text-slate-700 font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Treatment Notes
             </div>
             <p class="text-slate-600 text-sm leading-relaxed pl-6">
               {{ item.summary }}
             </p>
           </div>

           <!-- Attached Files -->
           <div v-if="item.files && item.files.length > 0">
             <div class="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attached Files
             </div>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div v-for="(file, idx) in item.files" :key="idx" 
                     @click="downloadFile(file)"
                     class="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer">
                   <div class="flex items-center gap-3 overflow-hidden">
                      <div class="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="flex flex-col overflow-hidden">
                        <span class="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">{{ file.name }}</span>
                        <span class="text-xs text-slate-500">{{ file.size }}</span>
                      </div>
                   </div>
                    <button class="text-slate-400 hover:text-slate-600 flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                     </svg>
                  </button>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
    
    <AddMedicalHistoryModal 
      :is-open="showModal"
      @close="showModal = false"
      @add-history="handleAddHistory"
    />
  </div>
</template>

<style scoped>
/* history-card styles handled by tailwind classes directly */
</style>
