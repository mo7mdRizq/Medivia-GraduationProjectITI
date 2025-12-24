import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_visits'

const defaultVisits = []

const getStoredVisits = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultVisits
}

export const visits = ref(getStoredVisits())

watch(visits, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

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

export const addVisit = (newVisit) => {
    visits.value.unshift(newVisit)
}
