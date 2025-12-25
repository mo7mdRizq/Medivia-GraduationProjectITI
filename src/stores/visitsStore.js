import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'medivia_visits'

// Load from localStorage or use empty array
const getStoredVisits = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const visits = ref(getStoredVisits())

watch(visits, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const useVisitsStore = () => {
    const addVisit = (newVisit) => {
        visits.value.unshift(newVisit)
    }

    const totalVisits = computed(() => visits.value.length)

    const recentVisitsCount = computed(() => {
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        return visits.value.filter(v => new Date(v.date) >= threeMonthsAgo).length
    })

    const uniqueProvidersCount = computed(() => {
        const providers = new Set(visits.value.map(v => v.doctor))
        return providers.size
    })

    return {
        visits,
        addVisit,
        totalVisits,
        recentVisitsCount,
        uniqueProvidersCount
    }
}

