<script setup>
import { ref, computed } from 'vue'
import { 
  MagnifyingGlassIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import { useAppointmentsStore } from '../../stores/appointmentsStore'

const { 
  appointments, 
  upcomingCount, 
  pendingCount, 
  pastCount, 
  totalAppointments, 
  removeAppointment,
  updateAppointmentStatus 
} = useAppointmentsStore()

const expandedIds = ref(new Set())

const stats = computed(() => [
  { name: 'Total Appointments', value: totalAppointments.value, bg: 'bg-white' },
  { name: 'Pending Approval', value: pendingCount.value, bg: 'bg-orange-50', color: 'text-orange-600' },
  { name: 'Confirmed', value: upcomingCount.value, bg: 'bg-green-50', color: 'text-green-600' },
  { name: 'Past/Completed', value: pastCount.value, bg: 'bg-blue-50', color: 'text-blue-600' },
])

const searchQuery = ref('')

const filteredAppointments = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return appointments.value
  return appointments.value.filter(a => 
    a.patient?.toLowerCase().includes(q) ||
    a.doctor.toLowerCase().includes(q) ||
    a.type.toLowerCase().includes(q)
  )
})

const toggleExpand = (id) => {
    if (expandedIds.value.has(id)) {
        expandedIds.value.delete(id)
    } else {
        expandedIds.value.add(id)
    }
}

const isExpanded = (id) => expandedIds.value.has(id)

const confirmAppointment = (id) => {
    updateAppointmentStatus(id, 'Confirmed')
}

const rejectAppointment = (id) => {
    removeAppointment(id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Appointments Manager</h1>
      <p class="mt-1 text-sm text-gray-500">Manage and oversee all healthcare appointments</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.name" class="p-6 rounded-xl border border-gray-100 shadow-sm" :class="stat.bg">
        <dt class="text-xs font-medium text-gray-400 uppercase tracking-wide">{{ stat.name }}</dt>
        <dd class="mt-2 text-3xl font-bold tracking-tight text-gray-900" :class="stat.color">{{ stat.value }}</dd>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input 
                v-model="searchQuery"
                type="text" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Search by patient, doctor, or appointment type..." 
            />
        </div>
    </div>
    
    <h2 class="text-lg font-medium text-gray-900">Appointments</h2>

    <div class="space-y-4">
      <div v-for="appt in filteredAppointments" :key="appt.id" class="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden mb-6">
         <!-- Summary Row -->
         <div class="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" @click="toggleExpand(appt.id)">
             <div class="flex items-center gap-5 flex-1">
                 <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                     {{ appt.initial }}
                 </div>
                 <div class="min-w-0">
                     <div class="flex items-center gap-3">
                         <h4 class="font-bold text-gray-900 text-base">{{ appt.patient || appt.patientName || 'Anonymous Patient' }}</h4>
                        <span 
                          class="px-2.5 py-1 rounded-[6px] text-[11px] uppercase font-bold tracking-wide"
                          :class="{
                             'bg-green-100 text-green-700': appt.status === 'Confirmed',
                             'bg-orange-100 text-orange-700': appt.status === 'Pending',
                             'bg-blue-100 text-blue-700': appt.status === 'Completed',
                             'bg-red-100 text-red-700': appt.urgent
                          }"
                        >
                          {{ appt.urgent ? 'Urg - ' : '' }}{{ appt.status }}
                        </span>
                     </div>
                     <div class="text-sm text-gray-500 flex items-center gap-3 mt-1">
                         <span class="flex items-center gap-1"><CalendarDaysIcon class="w-4 h-4 text-gray-400"/> {{ appt.date }}</span>
                         <span>•</span>
                         <span>{{ appt.time }}</span>
                         <span>•</span>
                         <span>{{ appt.doctor }}</span>
                         <span>•</span>
                         <span>{{ appt.type }}</span>
                     </div>
                 </div>
             </div>
             
             <div class="flex items-center gap-3">
                  <div v-if="appt.status === 'Pending'" class="flex gap-2 mr-6">
                  <button @click.stop="confirmAppointment(appt.id)" class="p-2 bg-green-500 text-white rounded-[8px] hover:bg-green-600 shadow-sm transition-colors"><CheckCircleIcon class="w-6 h-6"/></button>
                      <button @click.stop="rejectAppointment(appt.id)" class="p-2 bg-red-500 text-white rounded-[8px] hover:bg-red-600 shadow-sm transition-colors"><XCircleIcon class="w-6 h-6"/></button>
                  </div>
                 <button class="p-2 bg-blue-500 text-white rounded-[8px] hover:bg-blue-600 shadow-sm transition-colors"><PencilSquareIcon class="w-6 h-6"/></button>
                 <button class="p-1 rounded-full hover:bg-gray-100 transition-colors">
                     <ChevronUpIcon v-if="isExpanded(appt.id)" class="w-6 h-6 text-gray-400" />
                     <ChevronDownIcon v-else class="w-6 h-6 text-gray-400" />
                 </button>
             </div>
         </div>

         <!-- Expanded Details -->
         <div v-if="isExpanded(appt.id)" class="p-8 border-t border-gray-100 bg-gray-50/30">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <!-- Patient Information -->
                 <div>
                     <h4 class="text-xs font-bold text-indigo-600 uppercase mb-4 flex items-center gap-2">
                         <div class="w-2 h-2 rounded-full bg-indigo-600"></div> 
                         Patient Information
                     </h4>
                     <div class="bg-indigo-50/30 rounded-[10px] p-5 space-y-4 border border-indigo-100/50">
                         <div>
                             <span class="block text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Name</span>
                              <span class="text-base font-semibold text-gray-900">{{ appt.patient || appt.patientName || 'Anonymous Patient' }}</span>
                         </div>
                         <div>
                             <span class="block text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Phone</span>
                             <span class="text-sm text-gray-700">{{ appt.phone || '(555) 000-0000' }}</span>
                         </div>
                         <div>
                             <span class="block text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">Email</span>
                             <span class="text-sm text-gray-700">{{ appt.email || 'patient@email.com' }}</span>
                         </div>
                     </div>
                 </div>

                 <!-- Appointment Details -->
                 <div>
                     <h4 class="text-xs font-bold text-teal-600 uppercase mb-4 flex items-center gap-2">
                         <div class="w-2 h-2 rounded-full bg-teal-600"></div>
                         Appointment Details
                     </h4>
                     <div class="bg-teal-50/30 rounded-[10px] p-5 space-y-4 border border-teal-100/50">
                         <div>
                             <span class="block text-xs font-medium text-teal-500 uppercase tracking-wider mb-1">Doctor</span>
                             <span class="text-base font-semibold text-gray-900">{{ appt.doctor }}</span>
                         </div>
                         <div class="grid grid-cols-2 gap-4">
                             <div>
                                 <span class="block text-xs font-medium text-teal-500 uppercase tracking-wider mb-1">Type</span>
                                 <span class="text-sm text-gray-700">{{ appt.type }}</span>
                             </div>
                             <div>
                                 <span class="block text-xs font-medium text-teal-500 uppercase tracking-wider mb-1">Duration</span>
                                 <span class="text-sm text-gray-700">{{ appt.duration || '30 min' }}</span>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>

             <!-- Reason for Visit -->
             <div class="mt-8">
                 <h4 class="text-xs font-bold text-purple-600 uppercase mb-4 flex items-center gap-2">
                     <div class="w-2 h-2 rounded-full bg-purple-600"></div>
                     Reason for Visit
                 </h4>
                 <div class="bg-purple-50/30 rounded-[10px] p-5 border border-purple-100/50">
                     <p class="text-sm text-gray-700 leading-relaxed">{{ appt.reason || 'No description provided.' }}</p>
                 </div>
             </div>

             <!-- Action Bar -->
              <div class="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4" v-if="appt.status === 'Pending'">
                  <button @click="confirmAppointment(appt.id)" class="bg-[#10B981] hover:bg-[#059669] text-white border-transparent w-full sm:w-auto h-12 px-6 rounded-[10px] flex items-center justify-center shadow-sm order-1 sm:order-none font-semibold text-sm transition-all duration-200">
                      <CheckCircleIcon class="w-5 h-5 mr-2" /> Approve Appointment
                  </button>
                  <button @click="rejectAppointment(appt.id)" class="bg-[#EF4444] hover:bg-[#DC2626] text-white border-transparent w-full sm:w-auto h-12 px-6 rounded-[10px] flex items-center justify-center shadow-sm order-2 sm:order-none font-semibold text-sm transition-all duration-200">
                      <XCircleIcon class="w-5 h-5 mr-2" /> Reject Appointment
                  </button>
                   <button class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 w-full sm:w-auto h-12 px-6 rounded-[10px] flex items-center justify-center shadow-sm order-3 sm:order-none font-semibold text-sm transition-all duration-200">
                      <PencilSquareIcon class="w-5 h-5 mr-2"/> Edit Appointment
                  </button>
              </div>
             <div class="mt-8 pt-8 border-t border-gray-100 flex justify-center sm:justify-end w-full" v-else>
                  <BaseButton class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 h-11 px-6 rounded-[10px] flex items-center gap-2 font-medium text-sm transition-all duration-200">
                      <PencilSquareIcon class="w-4 h-4"/> Edit Appointment
                  </BaseButton>
             </div>
         </div>
      </div>
    </div>
  </div>
</template>
