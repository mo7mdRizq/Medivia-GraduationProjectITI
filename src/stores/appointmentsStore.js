import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_appointments'

// Helper to generate mock appointments for the last 6 months
const generateHistoricalData = () => {
    const appts = []
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const doctors = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez']

    months.forEach((month, mIdx) => {
        const count = 10 + Math.floor(Math.random() * 20)
        for (let i = 0; i < count; i++) {
            appts.push({
                id: `hist-${mIdx}-${i}`,
                type: 'Consultation',
                status: Math.random() > 0.3 ? 'Completed' : 'Cancelled',
                doctor: doctors[Math.floor(Math.random() * doctors.length)],
                date: `${month} ${Math.floor(Math.random() * 28) + 1}, 2025`,
                time: '10:00 AM',
                category: 'past'
            })
        }
    })

    // Add some upcoming ones
    appts.push({
        id: 'up-1',
        type: 'General Checkup',
        status: 'Confirmed',
        doctor: 'Dr. Sarah Johnson',
        date: 'Dec 28, 2025',
        time: '09:30 AM',
        category: 'upcoming'
    })
    appts.push({
        id: 'up-2',
        type: 'Blood Test',
        status: 'Pending',
        doctor: 'Dr. Michael Chen',
        date: 'Dec 30, 2025',
        time: '11:00 AM',
        category: 'pending'
    })

    return appts
}

const getStoredAppointments = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
    return generateHistoricalData()
}

const appointments = ref(getStoredAppointments())

watch(appointments, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const useAppointmentsStore = () => {
    const addAppointment = (appt) => {
        appointments.value.unshift({
            id: Date.now(),
            ...appt
        })
    }

    const removeAppointment = (id) => {
        appointments.value = appointments.value.filter(a => a.id !== id)
    }

    const upcomingCount = computed(() => appointments.value.filter(a => a.category === 'upcoming').length)
    const pendingCount = computed(() => appointments.value.filter(a => a.category === 'pending').length)
    const pastCount = computed(() => appointments.value.filter(a => a.category === 'past' || a.status === 'Completed').length)
    const totalAppointments = computed(() => appointments.value.length)

    const updateAppointmentStatus = (id, status) => {
        const index = appointments.value.findIndex(a => a.id === id)
        if (index !== -1) {
            appointments.value[index].status = status
            if (status === 'Confirmed') {
                appointments.value[index].category = 'upcoming'
            } else if (status === 'Completed') {
                appointments.value[index].category = 'past'
            }
        }
    }

    return {
        appointments,
        addAppointment,
        removeAppointment,
        upcomingCount,
        pendingCount,
        pastCount,
        totalAppointments,
        updateAppointmentStatus
    }
}
