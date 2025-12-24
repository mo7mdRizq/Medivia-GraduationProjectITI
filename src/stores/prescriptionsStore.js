import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_prescriptions'

const defaultPrescriptions = []

const getStoredPrescriptions = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultPrescriptions
}

export const prescriptions = ref(getStoredPrescriptions())

watch(prescriptions, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const activeCount = computed(() => prescriptions.value.filter(p => p.status === 'Active').length)
export const refillSoonCount = computed(() => prescriptions.value.filter(p => p.status === 'Active' && p.refillsRemaining <= 2).length)
export const completedCount = computed(() => prescriptions.value.filter(p => p.status === 'Completed').length)

export const addPrescription = (newPrescription) => {
    prescriptions.value.unshift(newPrescription)
}
