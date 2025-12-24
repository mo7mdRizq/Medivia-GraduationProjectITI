import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_appointments'

// Default initial data
const defaultAppointments = []

// Load from localStorage or use default
const getStoredAppointments = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultAppointments
}

// Shared appointments state
export const appointments = ref(getStoredAppointments())

// Watch for changes and save to localStorage
watch(appointments, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper function to add a new appointment
export const addAppointment = (newAppointment) => {
    appointments.value.unshift(newAppointment)
}

// Computed properties for counts
export const upcomingCount = computed(() => appointments.value.filter(a => a.category === 'upcoming').length)
export const pendingCount = computed(() => appointments.value.filter(a => a.category === 'pending').length)
export const pastCount = computed(() => appointments.value.filter(a => a.category === 'past').length)
export const totalAppointments = computed(() => appointments.value.length)
