import { ref, computed } from 'vue'

// Shared appointments state
export const appointments = ref([
    {
        id: 1,
        type: 'Follow-up Consultation',
        status: 'Confirmed',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: 'Dec 12, 2025',
        time: '10:30 AM (30 min)',
        location: 'Cardiology Center, Room 304',
        notes: 'Bring recent blood pressure readings. Fasting not required.',
        category: 'upcoming'
    },
    {
        id: 2,
        type: 'Annual Physical Exam',
        status: 'Confirmed',
        doctor: 'Dr. Michael Chen',
        specialty: 'Primary Care',
        date: 'Dec 18, 2025',
        time: '2:00 PM (45 min)',
        location: 'Primary Care Clinic, Room 101',
        notes: 'Fasting required (12 hours). Blood work will be done.',
        category: 'upcoming'
    },
    {
        id: 3,
        type: 'Knee Follow-up',
        status: 'Confirmed',
        doctor: 'Dr. James Park',
        specialty: 'Orthopedics',
        date: 'Jan 5, 2026',
        time: '9:30 AM (30 min)',
        location: 'Orthopedic Center, Room 402',
        notes: 'Please bring your physical therapy progress notes.',
        category: 'upcoming'
    },
    {
        id: 4,
        type: 'Dermatology Consultation',
        status: 'Pending',
        doctor: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        date: 'Dec 20, 2025',
        time: '11:00 AM (30 min)',
        location: 'Dermatology Clinic, Room 205',
        notes: 'Waiting for insurance approval.',
        category: 'pending'
    },
    {
        id: 5,
        type: 'Cardiology Follow-up',
        status: 'Pending',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: 'Dec 25, 2025',
        time: '3:00 PM (30 min)',
        location: 'Cardiology Center, Room 304',
        notes: 'Pending confirmation.',
        category: 'pending'
    },
    {
        id: 6,
        type: 'Routine Check-up',
        status: 'Completed',
        doctor: 'Dr. Michael Chen',
        specialty: 'Primary Care',
        date: 'Nov 28, 2025',
        time: '10:00 AM (30 min)',
        location: 'Primary Care Clinic, Room 101',
        notes: 'Completed successfully.',
        category: 'past'
    },
    {
        id: 7,
        type: 'Cardiology Consultation',
        status: 'Completed',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: 'Oct 15, 2025',
        time: '2:30 PM (45 min)',
        location: 'Cardiology Center, Room 304',
        notes: 'Hypertension management review.',
        category: 'past'
    },
    {
        id: 8,
        type: 'Dermatology Visit',
        status: 'Completed',
        doctor: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        date: 'Sep 8, 2025',
        time: '9:00 AM (30 min)',
        location: 'Dermatology Clinic, Room 205',
        notes: 'Skin lesion examination.',
        category: 'past'
    },
    {
        id: 9,
        type: 'Orthopedic Consultation',
        status: 'Completed',
        doctor: 'Dr. James Park',
        specialty: 'Orthopedics',
        date: 'Jul 22, 2025',
        time: '11:30 AM (45 min)',
        location: 'Orthopedic Center, Room 402',
        notes: 'Knee pain evaluation.',
        category: 'past'
    },
    {
        id: 10,
        type: 'Primary Care Visit',
        status: 'Completed',
        doctor: 'Dr. Michael Chen',
        specialty: 'Primary Care',
        date: 'May 10, 2025',
        time: '3:00 PM (30 min)',
        location: 'Primary Care Clinic, Room 101',
        notes: 'General health check.',
        category: 'past'
    },
    {
        id: 11,
        type: 'Cardiology Initial Consultation',
        status: 'Completed',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: 'Mar 3, 2025',
        time: '10:00 AM (60 min)',
        location: 'Cardiology Center, Room 304',
        notes: 'Initial consultation for hypertension.',
        category: 'past'
    }
])

// Helper function to add a new appointment
export const addAppointment = (newAppointment) => {
    appointments.value.unshift(newAppointment)
}

// Computed properties for counts
export const upcomingCount = computed(() => appointments.value.filter(a => a.category === 'upcoming').length)
export const pendingCount = computed(() => appointments.value.filter(a => a.category === 'pending').length)
export const pastCount = computed(() => appointments.value.filter(a => a.category === 'past').length)
export const totalAppointments = computed(() => appointments.value.length)
