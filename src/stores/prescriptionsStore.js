import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'medivia_prescriptions'

// Load from localStorage or use empty array
const getStoredPrescriptions = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const prescriptions = ref(getStoredPrescriptions())

watch(prescriptions, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const usePrescriptionsStore = () => {
    const addPrescription = (newPrescription) => {
        prescriptions.value.unshift(newPrescription)
    }

    const removePrescription = (id) => {
        prescriptions.value = prescriptions.value.filter(p => p.id !== id)
    }

    const activeCount = computed(() => prescriptions.value.filter(p => p.status === 'Active').length)
    const completedCount = computed(() => prescriptions.value.filter(p => p.status === 'Completed').length)

    const refillSoonCount = computed(() => {
        const today = new Date()
        const soon = new Date()
        soon.setDate(today.getDate() + 7)

        return prescriptions.value.filter(p => {
            if (p.status !== 'Active' || !p.nextRefill) return false
            const refillDate = new Date(p.nextRefill)
            return refillDate >= today && refillDate <= soon
        }).length
    })

    return {
        prescriptions,
        addPrescription,
        removePrescription,
        activeCount,
        completedCount,
        refillSoonCount
    }
}

