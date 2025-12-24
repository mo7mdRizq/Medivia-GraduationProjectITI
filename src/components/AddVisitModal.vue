<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add-visit'])

const formData = ref({
  type: 'General Checkup',
  doctor: 'Dr. Michael Chen',
  specialty: 'Primary Care',
  date: new Date().toISOString().split('T')[0],
  items: []
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const newVisit = {
    id: Date.now(),
    type: formData.value.type,
    date: new Date(formData.value.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: '10:00 AM', // Default
    doctor: formData.value.doctor,
    specialty: formData.value.specialty,
    chiefComplaint: 'Routine follow-up',
    diagnosis: 'Healthy checkup. No issues reported.',
    expanded: true
  }
  emit('add-visit', newVisit)
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-indigo-600 p-6 text-white">
        <h2 class="text-xl font-bold">Add Past Visit Record</h2>
      </div>

      <div class="p-6 space-y-4">
        <div>
           <label class="block text-sm font-semibold text-slate-700 mb-1">Visit Type</label>
           <input v-model="formData.type" type="text" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500">
        </div>
        
        <div>
           <label class="block text-sm font-semibold text-slate-700 mb-1">Doctor Name</label>
           <input v-model="formData.doctor" type="text" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500">
        </div>

        <div>
           <label class="block text-sm font-semibold text-slate-700 mb-1">Specialty</label>
           <input v-model="formData.specialty" type="text" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500">
        </div>

        <div>
           <label class="block text-sm font-semibold text-slate-700 mb-1">Date</label>
           <input v-model="formData.date" type="date" class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500">
        </div>
      </div>

      <div class="p-6 pt-0 flex gap-3">
         <button @click="closeModal" class="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
         <button @click="handleSubmit" class="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Add Record</button>
      </div>
    </div>
  </div>
</template>
