import { ref, watch } from 'vue'

const logs = ref(JSON.parse(localStorage.getItem('medivia_logs') || '[]'))

watch(logs, (newLogs) => {
    localStorage.setItem('medivia_logs', JSON.stringify(newLogs))
}, { deep: true })

export const useLogsStore = () => {
    const addLog = (log) => {
        logs.value.unshift({
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            ...log
        })
        // Keep only last 100 logs
        if (logs.value.length > 100) {
            logs.value = logs.value.slice(0, 100)
        }
    }

    return {
        logs,
        addLog
    }
}
