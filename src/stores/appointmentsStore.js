import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_appointments'

// Load from localStorage or use default mock array
const getStoredAppointments = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)

    // Default mock data for first-time use
    return [
        {
            id: 1,
            type: 'General Consultation',
            status: 'Confirmed',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: 'Dec 28, 2025',
            time: '10:30 AM',
            location: 'Main Medical Center',
            notes: 'Follow-up for heart health check-up.',
            category: 'upcoming'
        },
        {
            id: 2,
            type: 'Lab Work',
            status: 'Pending',
            doctor: 'Dr. Michael Chen',
            specialty: 'Primary Care',
            date: 'Dec 30, 2025',
            time: '02:00 PM',
            location: 'Diagnostics Wing B',
            notes: 'Annual blood work and cholesterol screening.',
            category: 'pending'
        }
    ]
}

// Shared appointments state
export const appointments = ref(getStoredAppointments())

// Watch for changes and save to localStorage
watch(appointments, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper function to remove an appointment
export const removeAppointment = (id) => {
    appointments.value = appointments.value.filter(a => a.id !== id)
}

// Helper function to add a new appointment
export const addAppointment = (newAppointment) => {
    appointments.value.unshift(newAppointment)
}

// Computed properties for counts
export const upcomingCount = computed(() => appointments.value.filter(a => a.category === 'upcoming').length)
export const pendingCount = computed(() => appointments.value.filter(a => a.category === 'pending').length)
export const pastCount = computed(() => appointments.value.filter(a => a.category === 'past').length)
export const totalAppointments = computed(() => appointments.value.length)
