<script setup>
import { ref, computed } from 'vue'
import { 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  ComputerDesktopIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'
import { useAppointmentsStore } from '../../stores/appointmentsStore'
import { useDoctorsStore } from '../../stores/doctorsStore'
import { useLogsStore } from '../../stores/logsStore'

const { appointments, pendingCount } = useAppointmentsStore()
const { doctors } = useDoctorsStore()
const { logs } = useLogsStore()

// Dynamic data calculations
const appointmentsByMonth = computed(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map(month => {
        const total = appointments.value.filter(a => a.date.includes(month)).length
        const completed = appointments.value.filter(a => a.date.includes(month) && a.status === 'Completed').length
        return { month, total, completed }
    })
})

const patientsList = JSON.parse(localStorage.getItem('registeredUsers') || '[]').filter(u => u.role === 'patient' || !u.role)
const dbSize = computed(() => (JSON.stringify(localStorage).length / 1024 / 1024).toFixed(2))

const stats = computed(() => [
  { 
    name: 'Total Patients', 
    value: patientsList.length.toString(), 
    change: `${patientsList.filter(p => p.createdAt?.includes('2025-12')).length} new today`, 
    trend: '+12%', trendColor: 'text-green-500', 
    icon: UsersIcon, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' 
  },
  { 
    name: 'Total Doctors', 
    value: doctors.value.length.toString(), 
    change: 'Active specialties', 
    trend: '', trendColor: '', 
    icon: AcademicCapIcon, iconBg: 'bg-teal-50', iconColor: 'text-teal-600' 
  },
  { 
    name: 'Appointments Today', 
    value: appointments.value.filter(a => a.date.includes('Dec 25')).length.toString(), 
    change: `${pendingCount.value} pending approval`, 
    trend: '', trendColor: '', 
    icon: CalendarIcon, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' 
  },
  { 
    name: 'System Health', 
    value: '99.9%', 
    change: `DB Size: ${dbSize.value} MB`, 
    trend: 'Stable', trendColor: 'text-green-500', 
    icon: ChartBarIcon, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' 
  },
])

const upcomingAppointments = computed(() => {
    return appointments.value
        .filter(a => a.status !== 'Completed' && a.status !== 'Cancelled')
        .slice(0, 5)
        .map(a => ({
            id: a.id,
            patient: a.patient || a.patientName || 'Anonymous',
            doctor: a.doctor,
            time: a.time,
            status: a.status
        }))
})

const recentActivity = computed(() => {
    return logs.value.slice(0, 5).map(log => ({
        id: log.id,
        title: log.type,
        desc: log.action + (log.target ? ` (${log.target})` : ''),
        time: log.timestamp.split(', ')[1] || 'Just now',
        icon: log.type === 'CREATE' ? CheckCircleIcon : (log.type === 'DELETE' ? ExclamationCircleIcon : ClockIcon),
        bg: log.type === 'CREATE' ? 'bg-green-100' : (log.type === 'DELETE' ? 'bg-red-100' : 'bg-blue-100'),
        color: log.type === 'CREATE' ? 'text-green-600' : (log.type === 'DELETE' ? 'text-red-600' : 'text-blue-600')
    }))
})

const activeSessions = computed(() => Math.floor(patientsList.length * 0.4) + 1)
const responseTime = ref(124)
setInterval(() => {
    responseTime.value = 120 + Math.floor(Math.random() * 10)
}, 3000)

const patientGrowthData = computed(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let cumulative = 0
    return months.map((month, idx) => {
        const count = patientsList.filter(p => p.createdAt?.includes(`-0${idx + 7}`) || (month === 'Dec' && p.createdAt?.includes('-12'))).length
        cumulative += count || (idx + 1) * 2 // Fallback for mock visuals if no real data
        return { month, value: cumulative }
    })
})

const growthPath = computed(() => {
    const max = Math.max(...patientGrowthData.value.map(d => d.value)) || 1
    return patientGrowthData.value.map((d, i) => {
        const x = i * 20
        const y = 50 - (d.value / max) * 45
        return `${i === 0 ? 'M' : 'L'}${x},${y}`
    }).join(' ')
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500">Healthcare system overview and management</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-start justify-between">
            <div class="p-3 rounded-xl" :class="stat.iconBg">
                <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
            </div>
            <span v-if="stat.trend" class="text-xs font-bold" :class="stat.trendColor">
                {{ stat.trend }} <span class="text-gray-400 font-normal">↗</span>
            </span>
        </div>
        <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-500">{{ stat.name }}</h3>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ stat.change }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Section (Mock Visuals) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Appointments Overview -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-gray-900">Appointments Overview</h3>
            <p class="text-xs text-gray-500 mb-6">Monthly appointments vs completed</p>
            
            <div class="h-64 flex items-end justify-between gap-2 px-2">
                <div v-for="data in appointmentsByMonth" :key="data.month" class="flex flex-col items-center gap-2 flex-1">
                    <div class="flex items-end gap-1 w-full justify-center h-full">
                         <div class="w-3 rounded-t-sm bg-teal-400" :style="`height: ${(data.completed / (Math.max(...appointmentsByMonth.map(d => d.total)) || 1)) * 100}%`" :title="`Completed: ${data.completed}`"></div>
                         <div class="w-3 rounded-t-sm bg-indigo-500" :style="`height: ${(data.total / (Math.max(...appointmentsByMonth.map(d => d.total)) || 1)) * 100}%`" :title="`Total: ${data.total}`"></div>
                    </div>
                    <span class="text-xs text-gray-400">{{ data.month }}</span>
                </div>
            </div>
            <div class="mt-4 flex justify-center gap-4">
                <div class="flex items-center gap-2 text-xs text-gray-500"><div class="w-3 h-3 bg-teal-400"></div> Completed</div>
                <div class="flex items-center gap-2 text-xs text-gray-500"><div class="w-3 h-3 bg-indigo-500"></div> Total Appointments</div>
            </div>
        </div>

        <!-- Patient Growth -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="font-bold text-gray-900">Patient Growth</h3>
            <p class="text-xs text-gray-500 mb-6">Total registered patients over time</p>
            
            <div class="h-64 flex items-end relative px-4">
                 <!-- Dynamic Line Chart via SVG -->
                 <svg class="absolute inset-0 w-full h-full p-6" viewBox="0 0 100 50" preserveAspectRatio="none">
                     <path :d="growthPath" fill="none" stroke="#3B82F6" stroke-width="1.5" />
                     <circle 
                       v-for="(point, i) in patientGrowthData" 
                       :key="i"
                       :cx="i * 20" 
                       :cy="50 - (point.value / (Math.max(...patientGrowthData.map(d => d.value)) || 1)) * 45" 
                       r="2" 
                       fill="#3B82F6"
                       class="hover:r-3 transition-all cursor-pointer"
                     >
                        <title>{{ point.month }}: {{ point.value }} patients</title>
                     </circle>
                 </svg>
                 <!-- Grid Lines mock -->
                 <div class="w-full h-full border-l border-b border-gray-100 flex justify-between items-end pb-[-20px]">
                     <span v-for="data in patientGrowthData" :key="data.month" class="text-xs text-gray-400 translate-y-6">{{ data.month }}</span>
                 </div>
            </div>
             <div class="mt-4 flex justify-center gap-4">
                <div class="flex items-center gap-2 text-xs text-blue-500 font-bold">Total Patients ↗</div>
            </div>
        </div>
    </div>

    <!-- Bottom Split Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Upcoming Appointments -->
        <div class="bg-blue-50/30 p-6 rounded-xl border border-blue-100/50">
             <div class="flex items-center gap-3 mb-6">
                 <div class="p-2 bg-blue-100 rounded-lg text-blue-600"><CalendarIcon class="w-5 h-5"/></div>
                 <div>
                     <h3 class="font-bold text-gray-900">Upcoming Appointments</h3>
                     <p class="text-xs text-gray-500">Today's schedule</p>
                 </div>
             </div>
             
             <div class="space-y-3">
                 <div v-for="appt in upcomingAppointments" :key="appt.id" class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                     <div>
                         <h4 class="font-bold text-gray-900 text-sm">{{ appt.patient }} <span class="text-gray-400 font-normal">→ {{ appt.doctor }}</span></h4>
                         <p class="text-xs text-gray-400 mt-1 flex items-center gap-1"><ClockIcon class="w-3 h-3"/> {{ appt.time }}</p>
                     </div>
                     <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md" :class="appt.status === 'Pending' ? 'bg-orange-100 text-orange-600' : ''">{{ appt.status }}</span>
                 </div>
             </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-pink-50/30 p-6 rounded-xl border border-pink-100/50">
             <div class="flex items-center gap-3 mb-6">
                 <div class="p-2 bg-purple-100 rounded-lg text-purple-600"><ChartBarIcon class="w-5 h-5"/></div>
                 <div>
                     <h3 class="font-bold text-gray-900">Recent Activity</h3>
                     <p class="text-xs text-gray-500">Latest system events</p>
                 </div>
             </div>
             
             <div class="space-y-4">
                 <div v-for="item in recentActivity" :key="item.id" class="flex gap-4">
                     <div class="flex flex-col items-center">
                         <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="[item.bg, item.color]">
                             <component :is="item.icon" class="w-5 h-5" />
                         </div>
                         <div class="h-full w-px bg-gray-200 my-2" v-if="item.id !== recentActivity.length"></div>
                     </div>
                     <div class="pb-4">
                         <div class="flex justify-between items-start w-full">
                            <h4 class="font-bold text-gray-900 text-sm">{{ item.title }}</h4>
                            <span class="text-[10px] text-gray-400 ml-auto pl-4 whitespace-nowrap">{{ item.time }}</span>
                         </div>
                         <p class="text-xs text-gray-500 mt-0.5">{{ item.desc }}</p>
                     </div>
                 </div>
             </div>
        </div>
    </div>

    <!-- System Statistics Footer -->
    <div class="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
        <div class="flex items-center gap-3 mb-6">
             <div class="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><ComputerDesktopIcon class="w-5 h-5"/></div>
             <div>
                 <h3 class="font-bold text-gray-900">System Statistics</h3>
                 <p class="text-xs text-gray-500">Real-time system performance metrics</p>
             </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-500">Server Uptime</span>
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <p class="text-xl font-bold text-gray-900">99.9%</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-500">Database Size</span>
                    <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
                <p class="text-xl font-bold text-gray-900">{{ dbSize }} MB</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-500">Active Sessions</span>
                    <div class="w-2 h-2 rounded-full bg-orange-400"></div>
                </div>
                <p class="text-xl font-bold text-gray-900">{{ activeSessions }}</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-gray-500">Avg Response Time</span>
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <p class="text-xl font-bold text-gray-900">{{ responseTime }}ms</p>
            </div>
        </div>
    </div>
  </div>
</template>
