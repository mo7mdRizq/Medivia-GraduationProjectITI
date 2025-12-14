<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add-history'])

const formData = ref({
  type: 'General Checkup',
  doctor: 'Dr. Michael Chen',
  specialty: 'Primary Care',
  date: new Date().toISOString().split('T')[0],
  title: '',
  summary: ''
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const newRecord = {
    id: Date.now(),
    type: formData.value.type,
    date: new Date(formData.value.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    title: formData.value.title,
    summary: formData.value.summary,
    doctor: formData.value.doctor,
    specialty: formData.value.specialty,
    files: [], // Init empty
    expanded: false
  }
  emit('add-history', newRecord)
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="bg-blue-600 p-6 text-white text-center">
        <h2 class="text-xl font-bold">Add Medical History Record</h2>
        <p class="text-blue-100 text-sm mt-1">Manually log a past medical event</p>
      </div>

      <div class="p-6 overflow-y-auto space-y-4">
        <div class="grid grid-cols-2 gap-4">
           <div>
             <label class="block text-sm font-semibold text-slate-700 mb-1">Date</label>
             <input v-model="formData.date" type="date" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
           </div>
           <div>
             <label class="block text-sm font-semibold text-slate-700 mb-1">Type</label>
             <input v-model="formData.type" type="text" placeholder="e.g. Surgery, Consultation" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
           </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Title / Brief Description</label>
          <input v-model="formData.title" type="text" placeholder="e.g. Appendectomy - Successful" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
        </div>

        <div class="grid grid-cols-2 gap-4">
           <div>
             <label class="block text-sm font-semibold text-slate-700 mb-1">Doctor</label>
             <input v-model="formData.doctor" type="text" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
           </div>
           <div>
             <label class="block text-sm font-semibold text-slate-700 mb-1">Specialty</label>
             <input v-model="formData.specialty" type="text" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
           </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Treatment Summary / Notes</label>
          <textarea v-model="formData.summary" rows="3" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"></textarea>
        </div>
      </div>

      <div class="p-6 pt-0 flex gap-3">
        <button @click="closeModal" class="flex-1 py-3 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button @click="handleSubmit" class="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
          Save Record
        </button>
      </div>
    </div>
  </div>
</template>
