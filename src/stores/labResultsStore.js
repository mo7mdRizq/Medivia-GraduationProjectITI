import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_lab_results'

// Historical data for charts might still need structure, but we can empty the points if needed.
// For now, keeping the structure but resetting the main results list.
export const historicalData = {
    'Complete Blood Count (CBC)': {
        labels: [],
        datasets: []
    },
    'Lipid Panel': {
        labels: [],
        datasets: []
    }
}

const defaultLabResults = []

const getStoredLabResults = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultLabResults
}

export const labResults = ref(getStoredLabResults())

watch(labResults, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const totalTests = computed(() => labResults.value.length)
export const normalResultsCount = computed(() => labResults.value.filter(r => r.status === 'Normal').length)
export const attentionResultsCount = computed(() => labResults.value.filter(r => r.status === 'Attention').length)

export const addLabResult = (newResult) => {
    labResults.value.unshift(newResult)
}
