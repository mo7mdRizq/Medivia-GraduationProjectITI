<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BookAppointmentModal from '../../components/BookAppointmentModal.vue'
import Swal from 'sweetalert2'
import { 
  addAppointment, 
  pendingCount as appointmentsPendingCount 
} from '../../stores/appointmentsStore'
import { totalTests } from '../../stores/labResultsStore'
import { activeCount as activePrescriptionsCount } from '../../stores/prescriptionsStore'
import { totalVisits } from '../../stores/visitsStore'
import { 
  Chart, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  CategoryScale, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js'

// Register Chart.js components
Chart.register(
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
)

const router = useRouter()
const showBookingModal = ref(false)

// Canvas Refs
const bpChartCanvas = ref(null)
const glucoseChartCanvas = ref(null)

let bpChart = null
let glucoseChart = null

// Brand Colors (Matching the Indigo/Purple theme from your screenshot)
const BRAND_INDIGO = '#5A4FF3'
const BRAND_PURPLE = '#8B5CF6'
const BRAND_SKY = '#3B82F6'

// Chart Data
const chartLabels = ['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Nov 29', 'Dec 6']

// Blood Pressure Data
const bpData = [
  { date: 'Nov 1', systolic: 138, diastolic: 88 },
  { date: 'Nov 8', systolic: 135, diastolic: 86 },
  { date: 'Nov 15', systolic: 130, diastolic: 84 },
  { date: 'Nov 22', systolic: 124, diastolic: 81 },
  { date: 'Nov 29', systolic: 120, diastolic: 79 },
  { date: 'Dec 6', systolic: 118, diastolic: 78 }
]

// Glucose Data
const glucoseData = [
  { date: 'Nov 1', fasting: 98, postMeal: 135 },
  { date: 'Nov 8', fasting: 95, postMeal: 128 },
  { date: 'Nov 15', fasting: 92, postMeal: 126 },
  { date: 'Nov 22', fasting: 96, postMeal: 130 },
  { date: 'Nov 29', fasting: 90, postMeal: 122 },
  { date: 'Dec 6', fasting: 88, postMeal: 118 }
]

const initCharts = () => {
  // BP Chart
  if (bpChartCanvas.value) {
    const ctx = bpChartCanvas.value.getContext('2d')
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400)
    gradient1.addColorStop(0, 'rgba(90, 79, 243, 0.2)')
    gradient1.addColorStop(1, 'rgba(90, 79, 243, 0)')

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400)
    gradient2.addColorStop(0, 'rgba(59, 130, 246, 0.15)')
    gradient2.addColorStop(1, 'rgba(59, 130, 246, 0)')

    bpChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Systolic',
            data: bpData.map(d => d.systolic),
            borderColor: BRAND_INDIGO,
            backgroundColor: gradient1,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: BRAND_INDIGO
          },
          {
            label: 'Diastolic',
            data: bpData.map(d => d.diastolic),
            borderColor: BRAND_SKY,
            backgroundColor: gradient2,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: BRAND_SKY
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1e293b',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.raw} mmHg`
            }
          }
        },
        scales: {
          y: {
            min: 60,
            max: 160,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          }
        }
      }
    })
  }

  // Glucose Chart
  if (glucoseChartCanvas.value) {
    const ctx = glucoseChartCanvas.value.getContext('2d')
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400)
    gradient1.addColorStop(0, 'rgba(139, 92, 246, 0.2)')
    gradient1.addColorStop(1, 'rgba(139, 92, 246, 0)')

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400)
    gradient2.addColorStop(0, 'rgba(90, 79, 243, 0.15)')
    gradient2.addColorStop(1, 'rgba(90, 79, 243, 0)')

    glucoseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Fasting',
            data: glucoseData.map(d => d.fasting),
            borderColor: BRAND_PURPLE,
            backgroundColor: gradient1,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: BRAND_PURPLE
          },
          {
            label: 'Post-Meal',
            data: glucoseData.map(d => d.postMeal),
            borderColor: BRAND_INDIGO,
            backgroundColor: gradient2,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: BRAND_INDIGO
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1e293b',
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.raw} mg/dL`
            }
          }
        },
        scales: {
          y: {
            min: 60,
            max: 160,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } }
          }
        }
      }
    })
  }
}

onMounted(() => {
  initCharts()
})

onUnmounted(() => {
  if (bpChart) bpChart.destroy()
  if (glucoseChart) glucoseChart.destroy()
})

const handleBookAppointment = (newAppointment) => {
  addAppointment(newAppointment)
  Swal.fire({
    title: 'Appointment Booked!',
    text: `Your appointment with ${newAppointment.doctor} on ${newAppointment.date} has been scheduled.`,
    icon: 'success',
    confirmButtonColor: BRAND_INDIGO,
    confirmButtonText: 'View Appointments'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/dashboard/appointments')
    }
  })
}
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, John</h1>
        <p class="text-slate-500 mt-1 font-medium">Here's your latest health activity overview.</p>
      </div>
      <button @click="showBookingModal = true" class="flex items-center justify-center gap-2 rounded-2xl bg-[#5A4FF3] px-7 py-4 text-white font-bold hover:bg-[#4F46E5] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Appointment
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1 -->
      <div class="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-indigo-50 text-[#5A4FF3] rounded-2xl flex items-center justify-center group-hover:bg-[#5A4FF3] group-hover:text-white transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
           </div>
           <span class="text-4xl font-black text-slate-900">{{ appointmentsPendingCount }}</span>
        </div>
        <h3 class="font-bold text-slate-800 text-lg">Pending</h3>
        <p class="text-sm text-slate-500 mt-1 font-medium">Appointments</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
           </div>
           <span class="text-4xl font-black text-slate-900">{{ totalTests }}</span>
        </div>
        <h3 class="font-bold text-slate-800 text-lg">Results</h3>
        <p class="text-sm text-slate-500 mt-1 font-medium">Lab Reports</p>
      </div>

      <!-- Card 3 -->
      <div class="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
        <div class="flex items-start justify-between mb-4 text-sky-600">
           <div class="h-12 w-12 bg-sky-50 rounded-2xl flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
           </div>
           <span class="text-4xl font-black text-slate-900">{{ activePrescriptionsCount }}</span>
        </div>
        <h3 class="font-bold text-slate-800 text-lg">Medicine</h3>
        <p class="text-sm text-slate-500 mt-1 font-medium">Active Rx</p>
      </div>

      <!-- Card 4 -->
      <div class="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
        <div class="flex items-start justify-between mb-4">
           <div class="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
           </div>
           <span class="text-4xl font-black text-slate-900">{{ totalVisits }}</span>
        </div>
        <h3 class="font-bold text-slate-800 text-lg">Visits</h3>
        <p class="text-sm text-slate-500 mt-1 font-medium">Past Logs</p>
      </div>
    </div>

    <!-- Trend Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Blood Pressure Chart Card -->
      <div class="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500">
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-5">
            <div class="h-14 w-14 bg-indigo-50 text-[#5A4FF3] rounded-3xl flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">Blood Pressure</h2>
              <p class="text-sm text-slate-400 font-bold uppercase tracking-wider">Historical Trend</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-black text-[#5A4FF3]">118/78</div>
            <div class="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase inline-block">Optimal</div>
          </div>
        </div>

        <div class="h-72 relative">
          <canvas ref="bpChartCanvas"></canvas>
        </div>

        <div class="grid grid-cols-2 gap-6 mt-10">
          <div class="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-[#5A4FF3]"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Systolic</span>
            </div>
            <div class="text-2xl font-black text-slate-900">126.7 <span class="text-xs font-bold text-slate-400">mmHg</span></div>
          </div>
          <div class="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-[#3B82F6]"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Diastolic</span>
            </div>
            <div class="text-2xl font-black text-slate-900">82.6 <span class="text-xs font-bold text-slate-400">mmHg</span></div>
          </div>
        </div>
      </div>

      <!-- Glucose Chart Card -->
      <div class="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500">
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-5">
            <div class="h-14 w-14 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">Glucose Levels</h2>
              <p class="text-sm text-slate-400 font-bold uppercase tracking-wider">Historical Trend</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-black text-purple-600">88</div>
            <div class="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase inline-block">Normal</div>
          </div>
        </div>

        <div class="h-72 relative">
          <canvas ref="glucoseChartCanvas"></canvas>
        </div>

        <div class="grid grid-cols-2 gap-6 mt-10">
          <div class="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-purple-600"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Fasting</span>
            </div>
            <div class="text-2xl font-black text-slate-900">92.8 <span class="text-xs font-bold text-slate-400">mg/dL</span></div>
          </div>
          <div class="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full bg-[#5A4FF3]"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Post-Meal</span>
            </div>
            <div class="text-2xl font-black text-slate-900">126.5 <span class="text-xs font-bold text-slate-400">mg/dL</span></div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modals -->
    <BookAppointmentModal 
      :is-open="showBookingModal"
      @close="showBookingModal = false"
      @book-appointment="handleBookAppointment"
    />
  </div>
</template>

<style scoped>
/* Advanced smoothness for dashboard interactions */
.shadow-card {
  box-shadow: 0 10px 50px -12px rgba(90, 79, 243, 0.08);
}
</style>
