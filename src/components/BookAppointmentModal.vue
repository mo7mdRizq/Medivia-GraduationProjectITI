
<script setup>
import { ref, computed } from 'vue'
import { useDoctorsStore } from '../stores/doctorsStore'
import { useUserStore } from '../stores/userStore'

const { currentUser } = useUserStore()

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'book-appointment'])

const formData = ref({
  type: 'General Consultation',
  doctor: '',
  date: '',
  time: '',
  notes: ''
})

// Reactive doctors list
const { doctors } = useDoctorsStore()
const doctorsOptions = computed(() => doctors.value.map(d => `${d.name} (${d.specialty})`))

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
  if (!formData.value.doctor) {
    alert('Please select a doctor')
    return
  }
  if (!formData.value.date || !formData.value.time) {
    alert('Please select date and time')
    return
  }

  const doctorPart = formData.value.doctor.split(' (')
  const doctorName = doctorPart[0]
  const specialty = doctorPart[1] ? doctorPart[1].replace(')', '') : 'General'

  const newAppointment = {
    id: Date.now(),
    type: formData.value.type,
    status: 'Pending',
    doctor: doctorName,
    specialty: specialty,
    patient: currentUser.value.name,
    patientName: currentUser.value.name, // for compatibility
    email: currentUser.value.email, // patient email
    date: new Date(formData.value.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: formData.value.time,
    location: 'Main Medical Center',
    notes: formData.value.notes,
    category: 'pending'
  }
  emit('book-appointment', newAppointment)
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="bg-[#5A4FF3] p-6 text-white text-center">
        <h2 class="text-xl font-bold">Book New Appointment</h2>
        <p class="text-indigo-100 text-sm mt-1">Schedule a visit with your healthcare provider</p>
      </div>

      <div class="p-6 overflow-y-auto space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Appointment Type</label>
          <select v-model="formData.type" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-2 focus:ring-indigo-100 bg-white">
            <option v-for="type in types" :key="type">{{ type }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Select Doctor</label>
          <select v-model="formData.doctor" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-2 focus:ring-indigo-100 bg-white">
            <option v-for="doc in doctorsOptions" :key="doc">{{ doc }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Date</label>
            <input v-model="formData.date" type="date" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-2 focus:ring-indigo-100">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Time</label>
            <input v-model="formData.time" type="time" class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-2 focus:ring-indigo-100">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Reason / Notes</label>
          <textarea v-model="formData.notes" rows="3" placeholder="Briefly describe the reason for your visit..." class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-2 focus:ring-indigo-100"></textarea>
        </div>
      </div>

      <div class="p-6 pt-0 flex gap-3">
        <button @click="closeModal" class="flex-1 py-3 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button @click="handleSubmit" class="flex-1 py-3 rounded-lg bg-[#5A4FF3] text-white font-semibold text-sm hover:bg-[#4F46E5] transition-colors shadow-lg shadow-indigo-600/20">
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
</template>
