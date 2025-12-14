<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookAppointmentModal from '../components/BookAppointmentModal.vue'
import Swal from 'sweetalert2'
import { addAppointment } from '../stores/appointmentsStore'

const router = useRouter()
const showBookingModal = ref(false)

// Chart Data
const chartLabels = ['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Nov 29', 'Dec 6']

// Blood Pressure Data (Last 6 weeks)
const bpData = ref([
  { date: 'Nov 1', systolic: 138, diastolic: 88 },
  { date: 'Nov 8', systolic: 135, diastolic: 86 },
  { date: 'Nov 15', systolic: 130, diastolic: 84 },
  { date: 'Nov 22', systolic: 124, diastolic: 81 },
  { date: 'Nov 29', systolic: 120, diastolic: 79 },
  { date: 'Dec 6', systolic: 118, diastolic: 78 }
])

// Glucose Data (Last 6 weeks)
const glucoseData = ref([
  { date: 'Nov 1', fasting: 98, postMeal: 135 },
  { date: 'Nov 8', fasting: 95, postMeal: 128 },
  { date: 'Nov 15', fasting: 92, postMeal: 126 },
  { date: 'Nov 22', fasting: 96, postMeal: 130 },
  { date: 'Nov 29', fasting: 90, postMeal: 122 },
  { date: 'Dec 6', fasting: 88, postMeal: 118 }
])

// Helper to scale Y values to SVG coordinate space
// SVG Height is 60. Y-axis range is 60 to 160 (Total 100 units).
const scaleY = (value) => {
  const min = 60
  const max = 160
  const height = 60
  // Invert Y because SVG 0 is top
  return height - ((value - min) / (max - min) * height)
}

// Helper to scale X values
const scaleX = (index) => {
  const width = 100
  const count = 6
  return (index / (count - 1)) * width
}

// Generate simple polyline path
const getLinePath = (data, key) => {
  return data.map((point, i) => {
    const x = scaleX(i)
    const y = scaleY(point[key])
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`
  }).join(' ')
}

// Generate smooth Bezier curve path
const getSmoothPath = (data, key) => {
  const points = data.map((point, i) => ({
    x: scaleX(i),
    y: scaleY(point[key])
  }))

  if (points.length === 0) return ''

  // Start path
  let d = `M ${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    
    // Control points for simple smoothing
    const cp1x = p0.x + (p1.x - p0.x) * 0.5
    const cp1y = p0.y
    const cp2x = p0.x + (p1.x - p0.x) * 0.5
    const cp2y = p1.y

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
  }
  return d
}

// Generate Area path (closes the loop at the bottom)
const getAreaPath = (data, key) => {
  const linePath = getSmoothPath(data, key)
  return `${linePath} L 100,60 L 0,60 Z`
}

// Handle new appointment booking
const handleBookAppointment = (newAppointment) => {
  // Add to the shared store so it appears on the Appointments page
  addAppointment(newAppointment)

  Swal.fire({
    title: 'Appointment Booked!',
    text: `Your appointment with ${newAppointment.doctor} on ${newAppointment.date} has been scheduled.`,
    icon: 'success',
    confirmButtonColor: '#0d9488',
    confirmButtonText: 'View Appointments'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/dashboard/appointments')
    }
  })
}
</script>

<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Welcome back, John</h1>
      <p class="text-slate-600 text-lg mb-6">Here's an overview of your health information</p>
      <button @click="showBookingModal = true" class="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-white font-semibold hover:bg-teal-700 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Book New Appointment
      </button>
    </div>

    <!-- Book Appointment Modal -->
    <BookAppointmentModal 
      :is-open="showBookingModal"
      @close="showBookingModal = false"
      @book-appointment="handleBookAppointment"
    />

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Upcoming Appointments -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
           </div>
           <span class="text-3xl font-light text-slate-900">2</span>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 mb-1 leading-tight">Upcoming<br>Appointments</h3>
          <p class="text-sm text-slate-600 mb-1 font-medium mt-3">Dr. Sarah Johnson</p>
          <p class="text-sm text-slate-500">- Cardiology</p>
          <p class="text-xs text-slate-400 mt-2">Dec 12, 2025 at 10:30 AM</p>
        </div>
      </div>

      <!-- Latest Lab Results -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
           </div>
           <span class="text-3xl font-light text-slate-900">3</span>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 mb-1 leading-tight">Latest Lab Results</h3>
          <p class="text-sm text-slate-600 mb-1 mt-3">Complete Blood Count</p>
          <p class="text-xs text-slate-500 mt-1">Dec 5, 2025 • Normal</p>
        </div>
      </div>

      <!-- Active Prescriptions -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
           </div>
           <span class="text-3xl font-light text-slate-900">4</span>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 mb-1 leading-tight">Active Prescriptions</h3>
          <p class="text-sm text-slate-600 mb-1 mt-3">Lisinopril 10mg</p>
          <p class="text-xs text-slate-500 mt-1">Refill by Dec 20, 2025</p>
        </div>
      </div>

      <!-- Recent Visits -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
           </div>
           <span class="text-3xl font-light text-slate-900">5</span>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 mb-1 leading-tight">Recent Visits</h3>
          <p class="text-sm text-slate-600 mb-1 mt-3">Annual Physical Exam</p>
          <p class="text-xs text-slate-500 mt-1">Nov 28, 2025</p>
        </div>
      </div>
    </div>

    <!-- Trend Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      
      <!-- Blood Pressure Trend -->
      <div class="bg-white border border-slate-200 rounded-xl p-8 shadow-card hover:shadow-lg transition-shadow">
        <div class="flex items-start gap-4 mb-8">
           <div class="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
           </div>
           <div>
             <h3 class="text-xl font-bold text-slate-900">Blood Pressure Trend</h3>
             <p class="text-sm text-slate-500">Last 6 weeks monitoring</p>
           </div>
        </div>

        <div class="grid grid-cols-2 gap-6 mb-8">
           <div class="bg-blue-50 rounded-2xl p-5 relative">
              <div class="flex items-center justify-between mb-2">
                 <span class="text-sm font-medium text-blue-600">Systolic</span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div class="flex items-baseline gap-1">
                 <span class="text-4xl font-bold text-slate-900">{{ bpData[bpData.length - 1].systolic }}</span>
              </div>
              <span class="text-xs text-blue-600 font-medium">mmHg</span>
           </div>
           <div class="bg-teal-50 rounded-2xl p-5 relative">
              <div class="flex items-center justify-between mb-2">
                 <span class="text-sm font-medium text-teal-700">Diastolic</span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              </div>
              <div class="flex items-baseline gap-1">
                 <span class="text-4xl font-bold text-slate-900">{{ bpData[bpData.length - 1].diastolic }}</span>
              </div>
              <span class="text-xs text-teal-600 font-medium">mmHg</span>
           </div>
        </div>

        <div class="relative h-64 w-full mb-8">
           <!-- Chart -->
             <svg viewBox="0 0 100 60" class="w-full h-full overflow-visible" preserveAspectRatio="none">
             <!-- Grid Lines -->
             <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" stroke-width="0.5" />
             <line x1="0" y1="12" x2="100" y2="12" stroke="#f1f5f9" stroke-width="0.5" stroke-dasharray="2" />
             <line x1="0" y1="24" x2="100" y2="24" stroke="#f1f5f9" stroke-width="0.5" />
             <line x1="0" y1="36" x2="100" y2="36" stroke="#f1f5f9" stroke-width="0.5" stroke-dasharray="2" />
             <line x1="0" y1="48" x2="100" y2="48" stroke="#f1f5f9" stroke-width="0.5" />
             
             <!-- Reference Norm Lines -->
             <line x1="0" y1="18" x2="100" y2="18" stroke="#60a5fa" stroke-width="0.5" stroke-dasharray="1 1" opacity="0.5" /> 
             <line x1="0" y1="42" x2="100" y2="42" stroke="#2dd4bf" stroke-width="0.5" stroke-dasharray="1 1" opacity="0.5" />
             <text x="102" y="19" font-size="2.5" fill="#3b82f6">Norm</text>
             <text x="102" y="43" font-size="2.5" fill="#14b8a6">Norm</text>

             <!-- Labels Y -->
             <text x="-2" y="2" font-size="3" fill="#94a3b8" text-anchor="end">160</text>
             <text x="-2" y="14" font-size="3" fill="#94a3b8" text-anchor="end">135</text>
             <text x="-2" y="26" font-size="3" fill="#94a3b8" text-anchor="end">110</text>
             <text x="-2" y="38" font-size="3" fill="#94a3b8" text-anchor="end">85</text>
             <text x="-2" y="50" font-size="3" fill="#94a3b8" text-anchor="end">60</text>
             
             <!-- Systolic Line -->
             <path :d="getLinePath(bpData, 'systolic')" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
             <g v-for="(point, i) in bpData" :key="'systolic-'+i">
               <circle :cx="scaleX(i)" :cy="scaleY(point.systolic)" r="2" fill="#3b82f6" stroke="white" stroke-width="0.5" />
             </g>

             <!-- Diastolic Line -->
             <path :d="getLinePath(bpData, 'diastolic')" fill="none" stroke="#14b8a6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
             <g v-for="(point, i) in bpData" :key="'diastolic-'+i">
               <circle :cx="scaleX(i)" :cy="scaleY(point.diastolic)" r="2" fill="#14b8a6" stroke="white" stroke-width="0.5" />
             </g>

             <!-- Labels X -->
             <g v-for="(label, i) in chartLabels" :key="label">
               <text :x="scaleX(i)" y="58" font-size="3" fill="#94a3b8" text-anchor="middle">{{ label }}</text>
             </g>
           </svg>
        </div>
        
        <div class="flex items-center justify-center gap-8 mb-6">
           <div class="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <div class="flex items-center justify-center h-4 w-4 bg-teal-100 rounded-full">
                <div class="h-2 w-2 rounded-full bg-teal-500"></div>
              </div>
              Diastolic
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
           </div>
           <div class="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <div class="flex items-center justify-center h-4 w-4 bg-blue-100 rounded-full">
                 <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              </div>
              Systolic
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
           </div>
        </div>

        <div class="bg-green-50 border border-green-100 rounded-2xl p-5 relative overflow-hidden">
             <!-- Decorative bg circle -->
             <div class="absolute -right-6 -top-6 h-24 w-24 bg-green-100 rounded-full opacity-50"></div>

             <div class="flex gap-4 relative z-10">
               <span class="h-3 w-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
               <div>
                 <p class="text-base text-slate-900 font-semibold mb-1">Your blood pressure is well controlled.</p>
                 <p class="text-sm text-slate-600 mb-2 font-medium">Current reading: {{ bpData[bpData.length - 1].systolic }}/{{ bpData[bpData.length - 1].diastolic }} mmHg</p>
                 <p class="text-sm text-green-700 leading-relaxed">Keep up the good work! Continue taking your medication as prescribed and maintain a healthy lifestyle.</p>
               </div>
             </div>
        </div>

      </div>

      <!-- Blood Glucose Trend -->
       <div class="bg-white border border-slate-200 rounded-xl p-8 shadow-card hover:shadow-lg transition-shadow">
        <div class="flex items-start gap-4 mb-8">
           <div class="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
           </div>
           <div>
             <h3 class="text-xl font-bold text-slate-900">Blood Glucose Trend</h3>
             <p class="text-sm text-slate-500">Last 6 weeks monitoring</p>
           </div>
        </div>

        <div class="grid grid-cols-2 gap-6 mb-8">
           <div class="bg-purple-50 rounded-2xl p-5 relative">
              <div class="flex items-center justify-between mb-2">
                 <span class="text-sm font-medium text-purple-700">Fasting</span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div class="flex items-baseline gap-1">
                 <span class="text-4xl font-bold text-slate-900">{{ glucoseData[glucoseData.length - 1].fasting }}</span>
              </div>
               <span class="text-xs text-purple-600 font-medium">mg/dL</span>
           </div>
           <div class="bg-indigo-50 rounded-2xl p-5 relative">
              <div class="flex items-center justify-between mb-2">
                 <span class="text-sm font-medium text-indigo-700">Post-Meal</span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div class="flex items-baseline gap-1">
                 <span class="text-4xl font-bold text-slate-900">{{ glucoseData[glucoseData.length - 1].postMeal }}</span>
              </div>
               <span class="text-xs text-indigo-600 font-medium">mg/dL</span>
           </div>
        </div>

        <div class="relative h-64 w-full mb-8">
           <!-- Chart -->
             <svg viewBox="0 0 100 60" class="w-full h-full overflow-visible" preserveAspectRatio="none">
             <!-- Grid Lines -->
             <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" stroke-width="0.5" />
             <line x1="0" y1="12" x2="100" y2="12" stroke="#f1f5f9" stroke-width="0.5" stroke-dasharray="2" />
             <line x1="0" y1="24" x2="100" y2="24" stroke="#f1f5f9" stroke-width="0.5" />
             <line x1="0" y1="36" x2="100" y2="36" stroke="#f1f5f9" stroke-width="0.5" stroke-dasharray="2" />
             <line x1="0" y1="48" x2="100" y2="48" stroke="#f1f5f9" stroke-width="0.5" />
             
             <!-- Reference Norm Lines -->
             <line x1="0" y1="14" x2="100" y2="14" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="1 1" opacity="0.6" />
             <line x1="0" y1="33" x2="100" y2="33" stroke="#f87171" stroke-width="0.5" stroke-dasharray="1 1" opacity="0.6" />
             <text x="102" y="15" font-size="2.5" fill="#f59e0b">Norm</text>
             <text x="102" y="34" font-size="2.5" fill="#f87171">Norm</text>

             <!-- Labels Y -->
             <text x="-2" y="2" font-size="3" fill="#94a3b8" text-anchor="end">160</text>
             <text x="-2" y="14" font-size="3" fill="#94a3b8" text-anchor="end">135</text>
             <text x="-2" y="26" font-size="3" fill="#94a3b8" text-anchor="end">110</text>
             <text x="-2" y="38" font-size="3" fill="#94a3b8" text-anchor="end">85</text>
             <text x="-2" y="50" font-size="3" fill="#94a3b8" text-anchor="end">60</text>
             
             <!-- Fasting Glucose -->
             <path :d="getAreaPath(glucoseData, 'fasting')" fill="url(#purpleGradient)" opacity="0.4" />
             <defs>
               <linearGradient id="purpleGradient" x1="0" x2="0" y1="0" y2="1">
                 <stop offset="0%" stop-color="#a855f7" />
                 <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
               </linearGradient>
             </defs>
             <path :d="getSmoothPath(glucoseData, 'fasting')" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round" />

             <!-- Post Meal Glucose -->
             <path :d="getAreaPath(glucoseData, 'postMeal')" fill="url(#blueGradient)" opacity="0.3" />
            <defs>
               <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
                 <stop offset="0%" stop-color="#3b82f6" />
                 <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
               </linearGradient>
             </defs>
             <path :d="getSmoothPath(glucoseData, 'postMeal')" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />

             <!-- Labels X -->
             <g v-for="(label, i) in chartLabels" :key="label">
               <text :x="scaleX(i)" y="58" font-size="3" fill="#94a3b8" text-anchor="middle">{{ label }}</text>
             </g>
           </svg>
        </div>

        <div class="flex items-center justify-center gap-8 mb-6">
           <div class="flex items-center gap-2 text-sm text-slate-600 font-medium">
             <div class="w-4 h-0.5 bg-purple-500"></div>
              Fasting Glucose
           </div>
           <div class="flex items-center gap-2 text-sm text-slate-600 font-medium">
             <div class="w-4 h-0.5 bg-blue-500"></div>
              Post-Meal Glucose
           </div>
        </div>

         <div class="bg-green-50 border border-green-100 rounded-2xl p-5 relative overflow-hidden">
             <!-- Decorative bg circle -->
             <div class="absolute -right-6 -top-6 h-24 w-24 bg-green-100 rounded-full opacity-50"></div>

             <div class="flex gap-4 relative z-10">
               <span class="h-3 w-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
               <div>
                 <p class="text-base text-slate-900 font-semibold mb-1">Normal - Fasting glucose: {{ glucoseData[glucoseData.length - 1].fasting }} mg/dl</p>
                 <p class="text-sm text-green-700 leading-relaxed font-medium">Excellent! Your blood glucose levels are within the normal range. Keep maintaining your healthy habits.</p>
               </div>
             </div>
        </div>

      </div>

    </div>
  </div>
</template>
