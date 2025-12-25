import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_vitals'

const getStoredVitals = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {
        bp: [],
        glucose: []
    }
}

export const vitals = ref(getStoredVitals())

watch(vitals, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const addBPRecord = (record) => {
    vitals.value.bp.push(record)
}

export const addGlucoseRecord = (record) => {
    vitals.value.glucose.push(record)
}
