import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_appointments'

// Default initial data
const defaultAppointments = [
    {
        id: 1,
        patientId: 1,
        patientName: 'John Martinez',
        patientAge: 45,
        status: 'Confirmed',
        date: 'Dec 8, 2025',
        time: '9:30 AM',
        duration: '30 min',
        type: 'Follow-up',
        shortDescription: 'Blood pressure monitoring and medication review',
        description: 'Blood pressure monitoring and medication review',
        isUrgent: false,
        expanded: true,
        tags: ['Hypertension', 'Type 2 Diabetes'],
        phone: '(555) 123-4567',
        email: 'john.martinez@email.com',
        medicalHistory: ['Hypertension', 'Type 2 Diabetes']
    },
    {
        id: 2,
        patientId: 2,
        patientName: 'Emily Johnson',
        patientAge: 32,
        status: 'Confirmed',
        date: 'Dec 8, 2025',
        time: '10:00 AM',
        duration: '45 min',
        type: 'Initial Consultation',
        shortDescription: 'New patient consultation for seasonal allergies',
        description: 'New patient consultation for seasonal allergies',
        isUrgent: false,
        expanded: false,
        tags: ['Seasonal Allergies'],
        phone: '(555) 234-5678',
        email: 'emily.johnson@email.com',
        medicalHistory: ['Seasonal Allergies']
    },
    {
        id: 3,
        patientId: 3,
        patientName: 'Michael Brown',
        patientAge: 58,
        status: 'Pending',
        date: 'Dec 8, 2025',
        time: '11:00 AM',
        duration: '60 min',
        type: 'Annual Physical',
        shortDescription: 'Annual physical examination',
        description: 'Annual physical examination',
        isUrgent: false,
        expanded: false,
        tags: ['Hypertension', 'High Cholesterol'],
        phone: '(555) 345-6789',
        email: 'michael.brown@email.com',
        medicalHistory: ['Hypertension', 'High Cholesterol']
    },
    {
        id: 4,
        patientId: 4,
        patientName: 'Lisa Anderson',
        patientAge: 62,
        status: 'Pending',
        date: 'Dec 9, 2025',
        time: '9:30 AM',
        duration: '30 min',
        type: 'Follow-up',
        shortDescription: 'Joint pain assessment and treatment review',
        description: 'Joint pain assessment and treatment review',
        isUrgent: true,
        expanded: false,
        tags: ['Hypertension', 'Osteoarthritis'],
        phone: '(555) 987-6543',
        email: 'lisa.anderson@email.com',
        medicalHistory: ['Hypertension', 'Osteoarthritis']
    }
]

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
