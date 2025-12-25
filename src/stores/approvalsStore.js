import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_approvals'

// Load from localStorage or use empty array
const getStoredApprovals = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

// Shared approvals state
export const approvals = ref(getStoredApprovals())

// Watch for changes and save to localStorage
watch(approvals, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Helper function to add a new approval item
export const addApproval = (item) => {
    approvals.value.unshift(item)
}

// Helper to remove approval (approve/reject)
export const removeApproval = (id) => {
    approvals.value = approvals.value.filter(a => a.id !== id)
}
