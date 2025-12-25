import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_patients'

// Load from localStorage or use empty array
const getStoredPatients = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

// Shared patients state
export const patients = ref(getStoredPatients())

// Watch for changes and save to localStorage
watch(patients, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper function to add a new patient
export const addPatient = (newPatient) => {
    patients.value.unshift(newPatient)
}

// Helper to remove patient
export const removePatient = (id) => {
    patients.value = patients.value.filter(p => p.id !== id)
}
