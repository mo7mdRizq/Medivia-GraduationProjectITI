<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { appointments, upcomingCount, pendingCount, pastCount, totalAppointments, removeAppointment } from '../stores/appointmentsStore'

const router = useRouter()
const searchQuery = ref('')
const showRescheduleModal = ref(false)
const selectedAppointment = ref(null)
const newDate = ref('')
const newTime = ref('')
const rescheduleReason = ref('')

// Use store computed values or derive local ones if needing specific logic
const todaysAppointmentsCount = computed(() => {
    // Assuming Dec 25, 2025 is "Today" or just matching some mock dates
    return appointments.value.filter(a => a.date === 'Dec 25, 2025').length
})

const pendingApprovalCount = computed(() => pendingCount.value)
const confirmedCount = computed(() => upcomingCount.value)

const filteredAppointments = computed(() => {
    if (!searchQuery.value) return appointments.value
    const query = searchQuery.value.toLowerCase()
    return appointments.value.filter(a => 
        (a.patientName || a.patient || '').toLowerCase().includes(query) || 
        a.type.toLowerCase().includes(query) ||
        (a.notes || a.description || '').toLowerCase().includes(query)
    )
})

const toggleAppointment = (id) => {
    const appt = appointments.value.find(a => a.id === id)
    if (appt) {
        appt.expanded = !appt.expanded
    }
}

const confirmAppointment = (id) => {
    const appt = appointments.value.find(a => a.id === id)
    if (appt) {
        appt.status = 'Confirmed'
        appt.category = 'upcoming'
    }
}

const rejectAppointment = (id) => {
    removeAppointment(id)
}

const openRescheduleModal = (appt) => {
    selectedAppointment.value = appt
    showRescheduleModal.value = true
    newDate.value = ''
    newTime.value = ''
    rescheduleReason.value = ''
}

const closeRescheduleModal = () => {
    showRescheduleModal.value = false
    selectedAppointment.value = null
}

const submitReschedule = () => {
    if (selectedAppointment.value && newDate.value && newTime.value) {
        selectedAppointment.value.date = new Date(newDate.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        selectedAppointment.value.time = newTime.value
        closeRescheduleModal()
    }
}
</script>

<template>
  <div class="relative">
    <!-- Header -->
        <header class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Appointments Management</h2>
            <p class="text-gray-500 mt-1">Manage your patient appointments and schedule</p>
        </header>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Total Appointments</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ appointments.length }}</h3>
                </div>
            </div>
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <p class="text-sm font-medium text-blue-600 mb-2">Today's Appointments</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ todaysAppointmentsCount }}</h3>
                </div>
            </div>
            <div class="bg-yellow-50 rounded-xl p-6 border border-yellow-100 shadow-sm">
                <p class="text-sm font-medium text-yellow-600 mb-2">Pending Approval</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ pendingApprovalCount }}</h3>
                </div>
            </div>
            <div class="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <p class="text-sm font-medium text-green-600 mb-2">Confirmed</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ confirmedCount }}</h3>
                </div>
            </div>
        </div>

        <!-- Search -->
        <div class="mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <svg class="w-5 h-5 text-gray-400 ml-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by patient name, appointment type, or reason..."
                class="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none h-10">
        </div>

        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">appointments</h3>

        <!-- Appointments List -->
        <div v-if="filteredAppointments.length > 0" class="space-y-4">
            <div v-for="appt in filteredAppointments" :key="appt.id" 
                 class="bg-white rounded-xl border shadow-sm overflow-hidden appointment-card transition-all"
                 :class="[
                    appt.isUrgent ? 'border-red-200 border-l-4 border-l-red-500' : 
                    appt.status === 'Pending' ? 'border-yellow-200 border-l-4 border-l-yellow-400' : 
                    'border-green-100'
                 ]"
            >
                <!-- ... existing card content ... -->
                <div @click="toggleAppointment(appt.id)"
                    class="p-4 flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-colors visit-header"
                     :class="[
                        appt.isUrgent ? 'bg-red-50 bg-opacity-30' : 
                        appt.status === 'Pending' ? 'bg-yellow-50 bg-opacity-30' : 
                        'bg-green-50'
                     ]"
                >
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h4 class="font-bold text-gray-900 text-base">{{ appt.patientName || appt.patient || 'Anonymous Patient' }}</h4>
                                <span v-if="appt.isUrgent" class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Urgent
                                </span>
                                <span class="px-2 py-0.5 text-xs font-semibold rounded"
                                    :class="[
                                        appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    ]"
                                >
                                    {{ appt.status }}
                                </span>
                            </div>
                            <div class="flex items-center text-xs text-gray-500 mt-1">
                                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {{ appt.date }}
                                <span class="mx-2">•</span>
                                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {{ appt.time }} ({{ appt.duration }})
                                <span class="mx-2">•</span>
                                {{ appt.type }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-6">
                        <div class="text-right hidden md:block">
                            <p class="font-medium text-gray-900 text-sm">{{ appt.shortDescription || appt.notes || 'No description' }}</p>
                            <div class="flex justify-end gap-2 mt-1">
                                <span v-for="tag in appt.tags" :key="tag" class="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-medium border border-red-100">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                         <!-- Quick Actions for Pending -->
                        <div v-if="appt.status === 'Pending'" class="flex items-center space-x-2">
                            <button @click.stop="confirmAppointment(appt.id)" class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </button>
                            <button @click.stop="rejectAppointment(appt.id)" class="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="transform transition-transform duration-200 chevron" :class="{ 'rotate-180': appt.expanded }">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Expanded Content -->
                <div v-show="appt.expanded" class="p-6 border-t border-gray-100 visit-content">
                    
                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Patient Information</h5>
                        </div>
                        <div class="bg-blue-50 bg-opacity-50 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Name & Age</p>
                                <p class="text-sm font-medium text-gray-900">{{ appt.patientName || appt.patient || 'Anonymous Patient' }}, {{ appt.patientAge || 'N/A' }} years</p>
                            </div>
                            <div>
                                <div class="flex items-center text-gray-600 text-xs mb-1">
                                    <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                    {{ appt.phone }}
                                </div>
                                <div class="flex items-center text-gray-600 text-xs">
                                     <svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    {{ appt.email }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Medical History</h5>
                        </div>
                        <div class="flex flex-wrap gap-2 ml-3.5">
                            <span v-for="hist in appt.medicalHistory" :key="hist" class="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs font-medium border border-red-100">{{ hist }}</span>
                        </div>
                    </div>

                    <div class="mb-6">
                         <div class="flex items-center mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Appointment Details</h5>
                        </div>
                         <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                <p class="text-xs text-teal-600 mb-1">Date</p>
                                <p class="text-sm font-medium text-gray-900">{{ appt.date }}</p>
                            </div>
                            <div class="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                <p class="text-xs text-teal-600 mb-1">Time</p>
                                <p class="text-sm font-medium text-gray-900">{{ appt.time }}</p>
                            </div>
                            <div class="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                <p class="text-xs text-teal-600 mb-1">Duration</p>
                                <p class="text-sm font-medium text-gray-900">{{ appt.duration }}</p>
                            </div>
                             <div class="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                <p class="text-xs text-teal-600 mb-1">Type</p>
                                <p class="text-sm font-medium text-gray-900">{{ appt.type }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <div class="flex items-center mb-3">
                            <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                            <h5 class="text-sm font-semibold text-gray-900">Reason for Visit</h5>
                        </div>
                            {{ appt.description || appt.notes || 'No description provided.' }}
                    </div>

                    <div class="flex gap-4 mt-6">
                        <template v-if="appt.status === 'Pending'">
                            <button @click="confirmAppointment(appt.id)" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center transition shadow-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Approve Appointment
                            </button>
                            <button @click="rejectAppointment(appt.id)" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center transition shadow-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Reject Appointment
                            </button>
                        </template>
                        <button @click="openRescheduleModal(appt)" class="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded-lg font-medium text-sm transition">
                             <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Reschedule
                        </button>
                        <button @click="$router.push({ name: 'patient-details', params: { id: appt.patientId || 1 } })"
                            class="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded-lg font-medium text-sm transition">
                            View Patient Profile
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm border-dashed">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No appointments found</h3>
            <p class="text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your filters.</p>
            <button class="mt-4 text-blue-600 font-medium text-sm hover:underline" @click="searchQuery = ''">Clear Filters</button>
        </div>

        <!-- Reschedule Modal -->
        <div v-if="showRescheduleModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closeRescheduleModal">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
                <!-- Modal Header -->
                <div class="bg-teal-600 p-4 flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                         <div class="bg-white rounded-lg p-2">
                            <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-white font-bold text-lg">Reschedule Appointment</h3>
                            <p class="text-teal-100 text-sm">{{ selectedAppointment?.patientName }}</p>
                        </div>
                    </div>
                     <button @click="closeRescheduleModal" class="text-white hover:text-gray-200 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                 <div class="p-6">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Current Appointment</p>
                        <p class="text-gray-900 font-bold">{{ selectedAppointment?.date }} at {{ selectedAppointment?.time }}</p>
                        <p class="text-sm text-gray-500">{{ selectedAppointment?.type }}</p>
                    </div>

                    <form @submit.prevent="submitReschedule">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">New Date <span class="text-red-500">*</span></label>
                            <input v-model="newDate" type="date" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">New Time <span class="text-red-500">*</span></label>
                            <input v-model="newTime" type="time" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>
                         <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Rescheduling</label>
                            <textarea v-model="rescheduleReason" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Optional note for patient"></textarea>
                        </div>
                         <div class="flex gap-3">
                            <button type="button" @click="closeRescheduleModal" class="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 rounded-lg font-medium text-sm transition">
                                Cancel
                            </button>
                            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition shadow-sm">
                                Confirm Reschedule
                            </button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
        
  </div>
</template>

