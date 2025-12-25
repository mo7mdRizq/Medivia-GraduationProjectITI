import { ref } from 'vue'

const doctors = ref([
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', email: 'sarah.j@medivia.com' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Primary Care', email: 'michael.c@medivia.com' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Dermatology', email: 'emily.r@medivia.com' },
    { id: 4, name: 'Dr. James Park', specialty: 'Orthopedics', email: 'james.p@medivia.com' }
])

// Load from localStorage if available
const savedDoctors = localStorage.getItem('medivia_doctors')
if (savedDoctors) {
    doctors.value = JSON.parse(savedDoctors)
}

const saveDoctors = () => {
    localStorage.setItem('medivia_doctors', JSON.stringify(doctors.value))
}

export const useDoctorsStore = () => {
    const addDoctor = (doctor) => {
        doctors.value.push({
            id: Date.now(),
            ...doctor
        })
        saveDoctors()
    }

    const removeDoctor = (id) => {
        doctors.value = doctors.value.filter(d => d.id !== id)
        saveDoctors()
    }

    // Helper to get formatted name for dropdowns
    const getDoctorOptions = () => {
        return doctors.value.map(d => `${d.name} (${d.specialty})`)
    }

    return {
        doctors,
        addDoctor,
        removeDoctor,
        getDoctorOptions
    }
}
