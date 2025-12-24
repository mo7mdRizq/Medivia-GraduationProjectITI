<script setup>
import { ref, computed } from 'vue'
import BookAppointmentModal from '../components/BookAppointmentModal.vue'
import Swal from 'sweetalert2'
import { appointments, addAppointment, upcomingCount, pendingCount, pastCount, totalAppointments } from '../stores/appointmentsStore'

const showModal = ref(false)
const query = ref('')

const activeTab = ref('upcoming')

const tabs = computed(() => [
  { id: 'upcoming', label: 'Upcoming', count: upcomingCount.value },
  { id: 'pending', label: 'Pending', count: pendingCount.value },
  { id: 'past', label: 'Past', count: pastCount.value },
  { id: 'all', label: 'All', count: totalAppointments.value }
])

const filteredAppointments = computed(() => {
  let filtered = appointments.value
  
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(apt => apt.category === activeTab.value)
  }

  const q = query.value.toLowerCase()
  if (!q) return filtered

  return filtered.filter(apt => 
    apt.doctor.toLowerCase().includes(q) ||
    (apt.specialty && apt.specialty.toLowerCase().includes(q))
  )
})

const handleBookAppointment = (newAppointment) => {
  addAppointment(newAppointment)
  
  // Switch to correct tab to see it
  activeTab.value = newAppointment.category

  Swal.fire({
    title: 'Appointment Booked!',
    text: `Your appointment with ${newAppointment.doctor} on ${newAppointment.date} is pending confirmation.`,
    icon: 'success',
    confirmButtonColor: '#5A4FF3'
  })
}

const rescheduleAppointment = async (apt) => {
  const { value: date } = await Swal.fire({
    title: 'Reschedule Appointment',
    text: `Enter new date for appointment with ${apt.doctor}:`,
    input: 'date',
    inputValue: new Date(apt.date).toISOString().split('T')[0],
    showCancelButton: true,
    confirmButtonColor: '#5A4FF3',
    cancelButtonColor: '#d33',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to choose a date!'
      }
    }
  })

  if (date) {
    const newDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    apt.date = newDate
    Swal.fire({
      title: 'Rescheduled!',
      text: `Appointment requested for ${newDate}.`,
      icon: 'success',
      confirmButtonColor: '#5A4FF3'
    })
  }
}

const cancelAppointment = async (apt) => {
  const result = await Swal.fire({
    title: 'Cancel Appointment?',
    text: `Are you sure you want to cancel with ${apt.doctor}? This cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it!'
  })

  if (result.isConfirmed) {
    appointments.value = appointments.value.filter(a => a.id !== apt.id)
    Swal.fire(
      'Cancelled!',
      'Your appointment has been cancelled.',
      'success'
    )
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Appointments</h1>
        <p class="text-slate-600">Manage your healthcare appointments</p>
      </div>
      <button @click="showModal = true" class="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#5A4FF3] px-6 py-3 text-white font-bold hover:bg-[#4F46E5] transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Book Appointment
      </button>
    </div>

    <div class="relative mb-6">
      <input type="text" 
             v-model="query"
             placeholder="Search by doctor or specialty..." 
             class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pl-12 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100/50 placeholder:text-slate-400 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
      </svg>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 md:gap-8 mb-6 border-b border-b-slate-200 overflow-x-auto pb-1 scrollbar-hide">
      <button v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="activeTab === tab.id ? 'tab-active' : 'tab-inactive'"
              class="pb-3 text-sm font-bold transition-colors relative whitespace-nowrap flex-shrink-0">
        {{ tab.label }} <span :class="activeTab === tab.id ? 'text-[#5A4FF3]' : 'text-slate-400'">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Upcoming -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#5A4FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium">Upcoming</p>
            <p class="text-2xl font-bold text-slate-900">{{ upcomingCount }}</p>
          </div>
        </div>
      </div>

      <!-- Pending -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium">Pending</p>
            <p class="text-2xl font-bold text-slate-900">{{ pendingCount }}</p>
          </div>
        </div>
      </div>

      <!-- Past -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-slate-500 font-medium">Past</p>
            <p class="text-2xl font-bold text-slate-900">{{ pastCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-sm text-slate-600">Showing {{ filteredAppointments.length }} of {{ totalAppointments }} appointments</p>
    </div>

    <!-- Appointment Cards -->
    <div class="space-y-6">
      <div v-for="appointment in filteredAppointments" 
           :key="appointment.id" 
           class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        
        <!-- Top Section -->
        <div class="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <div class="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-[#5A4FF3]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-1">
              <h3 class="text-lg font-bold text-slate-900">{{ appointment.type }}</h3>
              <span v-if="appointment.status === 'Confirmed'" class="bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Confirmed
              </span>
               <span v-else-if="appointment.status === 'Pending'" class="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {{ appointment.status }}
              </span>
              <span v-else class="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {{ appointment.status }}
              </span>
            </div>
            <p class="text-sm text-slate-500 flex flex-wrap items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {{ appointment.doctor }} <span class="text-slate-300 mx-1">•</span> {{ appointment.specialty }}
            </p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/80 rounded-lg p-5 mb-4 border border-slate-100">
           <div>
             <p class="text-xs text-slate-400 font-medium mb-1">Date</p>
             <p class="text-sm font-semibold text-slate-900 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               {{ appointment.date }}
             </p>
           </div>
           <div>
             <p class="text-xs text-slate-400 font-medium mb-1">Time</p>
             <p class="text-sm font-semibold text-slate-900 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {{ appointment.time }}
             </p>
           </div>
           <div>
             <p class="text-xs text-slate-400 font-medium mb-1">Location</p>
             <p class="text-sm font-semibold text-slate-900 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               {{ appointment.location }}
             </p>
           </div>
        </div>

        <!-- Instructions -->
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
           <p class="text-sm text-blue-800 font-medium">{{ appointment.notes }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button @click="rescheduleAppointment(appointment)" class="flex-1 bg-[#5A4FF3] hover:bg-[#4F46E5] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reschedule
          </button>
          <button @click="cancelAppointment(appointment)" class="w-full sm:w-32 bg-white border border-red-200 text-red-600 font-semibold py-2.5 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>

      </div>
    </div>
    
    <BookAppointmentModal 
      :is-open="showModal"
      @close="showModal = false"
      @book-appointment="handleBookAppointment"
    />
  </div>
</template>

<style scoped>
.tab-active {
  color: #5A4FF3; /* BRAND_INDIGO */
  border-bottom: 3px solid #5A4FF3;
}
.tab-inactive {
  color: #94a3b8; /* slate-400 */
  border-bottom: 3px solid transparent;
}
.tab-inactive:hover {
  color: #5A4FF3;
}
</style>
