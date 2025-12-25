import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_medical_history'

const getStoredItems = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

export const medicalHistory = ref(getStoredItems())

watch(medicalHistory, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const addMedicalHistory = (newRecord) => {
    medicalHistory.value.unshift(newRecord)
}
