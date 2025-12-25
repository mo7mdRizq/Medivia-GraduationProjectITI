import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_vitals'

const getStoredVitals = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {
        bp: [],
        glucose: []
    }
}

const vitals = ref(getStoredVitals())

watch(vitals, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const useVitalsStore = () => {
    const addBPRecord = (record) => {
        vitals.value.bp.push(record)
    }

    const addGlucoseRecord = (record) => {
        vitals.value.glucose.push(record)
    }

    return {
        vitals,
        addBPRecord,
        addGlucoseRecord
    }
}
