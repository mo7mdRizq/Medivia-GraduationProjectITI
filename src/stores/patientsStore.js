import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_patients'

// Load from localStorage or use empty array
const getStoredPatients = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const patients = ref(getStoredPatients())

watch(patients, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const usePatientsStore = () => {
    const addPatient = (newPatient) => {
        patients.value.unshift(newPatient)
    }

    const removePatient = (id) => {
        patients.value = patients.value.filter(p => p.id !== id)
    }

    return {
        patients,
        addPatient,
        removePatient
    }
}
