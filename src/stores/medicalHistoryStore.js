import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_medical_history'

const getStoredItems = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const medicalHistory = ref(getStoredItems())

watch(medicalHistory, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const useMedicalHistoryStore = () => {
    const addMedicalHistory = (newRecord) => {
        medicalHistory.value.unshift(newRecord)
    }

    return {
        medicalHistory,
        addMedicalHistory
    }
}
