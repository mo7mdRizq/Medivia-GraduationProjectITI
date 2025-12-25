import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'medivia_prescriptions'

// Load from localStorage or use empty array
const getStoredPrescriptions = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

// Shared prescriptions state
export const prescriptions = ref(getStoredPrescriptions())

// Watch for changes and save to localStorage
watch(prescriptions, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper function to add a new prescription
export const addPrescription = (newPrescription) => {
    prescriptions.value.unshift(newPrescription)
}

// Helper to remove prescription
export const removePrescription = (id) => {
    prescriptions.value = prescriptions.value.filter(p => p.id !== id)
}

// Stats for dashboard and prescriptions view
export const activeCount = computed(() => prescriptions.value.filter(p => p.status === 'Active').length)
export const completedCount = computed(() => prescriptions.value.filter(p => p.status === 'Completed').length)
export const refillSoonCount = computed(() => {
    // Logic for refill soon: active and next refill within 7 days
    const today = new Date()
    const soon = new Date()
    soon.setDate(today.getDate() + 7)

    return prescriptions.value.filter(p => {
        if (p.status !== 'Active' || !p.nextRefill) return false
        const refillDate = new Date(p.nextRefill)
        return refillDate >= today && refillDate <= soon
    }).length
})

