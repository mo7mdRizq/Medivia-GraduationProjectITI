<script setup>
import { useLogsStore } from '../../stores/logsStore'
import { 
  ClipboardDocumentListIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const { logs } = useLogsStore()

const getLogIconClass = (type) => {
  switch (type) {
    case 'CREATE': return 'bg-green-100 text-green-700'
    case 'UPDATE': return 'bg-blue-100 text-blue-700'
    case 'DELETE': return 'bg-red-100 text-red-700'
    case 'AUTH': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">Activity Logs</h1>
        <p class="text-sm text-gray-500 mt-1">Audit trail of all administrative actions in the system.</p>
      </div>
      <div class="flex gap-2">
         <button class="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
            <ArrowPathIcon class="w-6 h-6" />
         </button>
      </div>
    </div>

    <!-- Logs List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ul class="divide-y divide-gray-100">
            <li v-for="log in logs" :key="log.id" class="p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start gap-4">
                    <div :class="['px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider', getLogIconClass(log.type)]">
                        {{ log.type }}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-gray-400">{{ log.timestamp }}</span>
                            <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span class="text-xs text-indigo-500 font-medium">{{ log.user || 'Admin' }}</span>
                        </div>
                    </div>
                    <div v-if="log.target" class="text-right">
                        <span class="text-xs text-gray-400 block uppercase">Target</span>
                        <span class="text-xs font-bold text-gray-700">{{ log.target }}</span>
                    </div>
                </div>
            </li>
            <li v-if="logs.length === 0" class="p-12 text-center">
                <ClipboardDocumentListIcon class="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p class="text-gray-500">No activity logs found. All actions will appear here.</p>
            </li>
        </ul>
    </div>
  </div>
</template>
