import { ref, watch } from 'vue'

const STORAGE_KEY = 'medivia_approvals'

// Load from localStorage or use empty array
const getStoredApprovals = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

const approvals = ref(getStoredApprovals())

watch(approvals, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const useApprovalsStore = () => {
    const addApproval = (item) => {
        approvals.value.unshift(item)
    }

    const removeApproval = (id) => {
        approvals.value = approvals.value.filter(a => a.id !== id)
    }

    return {
        approvals,
        addApproval,
        removeApproval
    }
}
