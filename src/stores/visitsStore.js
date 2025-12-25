import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'medivia_visits'

// Load from localStorage or use empty array
const getStoredVisits = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

// Shared visits state
export const visits = ref(getStoredVisits())

// Watch for changes and save to localStorage
watch(visits, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper function to add a new visit
export const addVisit = (newVisit) => {
    visits.value.unshift(newVisit)
}

// Stats for dashboard and visits view
export const totalVisits = computed(() => visits.value.length)

export const recentVisitsCount = computed(() => {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return visits.value.filter(v => new Date(v.date) >= threeMonthsAgo).length
})

export const uniqueProvidersCount = computed(() => {
    const providers = new Set(visits.value.map(v => v.doctor))
    return providers.size
})

