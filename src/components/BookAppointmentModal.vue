<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'book-appointment'])

const formData = ref({
  type: 'General Consultation',
  doctor: 'Dr. Sarah Johnson',
  date: '',
  time: '',
  notes: ''
})

const doctors = [
  'Dr. Sarah Johnson (Cardiology)',
  'Dr. Michael Chen (Primary Care)',
  'Dr. Emily Rodriguez (Dermatology)',
  'Dr. James Park (Orthopedics)'
]

const types = [
  'General Consultation',
  'Follow-up',
  'Annual Physical',
  'Specialist Referral',
  'Lab Work'
]

const closeModal = () => {
  emit('close')
  // Reset form optionally
}

const handleSubmit = () => {
  const newAppointment = {
    id: Date.now(),
    type: formData.value.type,
    status: 'Pending',
    doctor: formData.value.doctor.split(' (')[0],
    specialty: formData.value.doctor.split(' (')[1].replace(')', ''),
    date: new Date(formData.value.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: formData.value.time,
    location: 'Main Medical Center',
    notes: formData.value.notes,
    category: 'upcoming'
  }
  emit('book-appointment', newAppointment)
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="bg-teal-600 p-6 text-white text-center">
        <h2 class="text-xl font-bold">Book New Appointment</h2>
        <p class="text-teal-100 text-sm mt-1">Schedule a visit with your healthcare provider</p>
      </div>

      <div class="p-6 overflow-y-auto space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Appointment Type</label>
          <select v-model="formData.type" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white">
            <option v-for="type in types" :key="type">{{ type }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Select Doctor</label>
          <select v-model="formData.doctor" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white">
            <option v-for="doc in doctors" :key="doc">{{ doc }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Date</label>
            <input v-model="formData.date" type="date" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Time</label>
            <input v-model="formData.time" type="time" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Reason / Notes</label>
          <textarea v-model="formData.notes" rows="3" placeholder="Briefly describe the reason for your visit..." class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"></textarea>
        </div>
      </div>

      <div class="p-6 pt-0 flex gap-3">
        <button @click="closeModal" class="flex-1 py-3 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button @click="handleSubmit" class="flex-1 py-3 rounded-lg bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
</template>
