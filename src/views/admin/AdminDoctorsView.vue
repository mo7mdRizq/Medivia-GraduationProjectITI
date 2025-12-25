<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDoctorsStore } from '../../stores/doctorsStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  UserPlusIcon
} from '@heroicons/vue/24/outline'
import { toast } from 'vue3-toastify'

const doctorsStore = useDoctorsStore()
const { doctors, removeDoctor, addDoctor, updateDoctor } = doctorsStore

const searchQuery = ref('')
const filterStatus = ref('All')

const filteredDoctors = computed(() => {
  return doctors.value.filter(doc => {
    const matchesSearch = !searchQuery.value || 
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = filterStatus.value === 'All' || doc.status === filterStatus.value
    
    return matchesSearch && matchesStatus
  })
})

const handleApprove = (doc) => {
  doc.status = 'Approved'
  toast.success(`Dr. ${doc.name} approved successfully`)
}

const handleSuspend = (doc) => {
  doc.status = 'Suspended'
  toast.warn(`Dr. ${doc.name} suspended`)
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to remove this doctor?')) {
    removeDoctor(id)
    toast.error('Doctor removed from system')
  }
}

// Edit Modal
const showEditModal = ref(false)
const editingDoc = ref(null)

const openEditModal = (doc) => {
  editingDoc.value = { ...doc }
  showEditModal.value = true
}

const saveEdit = () => {
    updateDoctor(editingDoc.value)
    toast.success('Doctor details updated')
    showEditModal.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Doctors Management</h1>
        <p class="mt-1 text-sm text-gray-500">Approve registrations and manage doctor profiles.</p>
      </div>
      <div class="flex gap-2">
         <BaseButton variant="outline" class="flex items-center gap-2">
            <ArchiveBoxIcon class="w-5 h-5" />
            Export Data
         </BaseButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Waitlist</p>
          <p class="text-3xl font-bold text-orange-600 mt-1">{{ doctors.filter(d => d.status === 'Pending').length }}</p>
          <p class="text-xs text-gray-400 mt-1">Pending approvals</p>
       </div>
       <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Active Doctors</p>
          <p class="text-3xl font-bold text-green-600 mt-1">{{ doctors.filter(d => d.status === 'Approved' || d.status === 'Active').length }}</p>
          <p class="text-xs text-gray-400 mt-1">Available for booking</p>
       </div>
       <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Total Capacity</p>
          <p class="text-3xl font-bold text-blue-600 mt-1">{{ doctors.length }}</p>
          <p class="text-xs text-gray-400 mt-1">Total registered</p>
       </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by name or specialty..." 
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <select v-model="filterStatus" class="rounded-lg border-gray-200 bg-gray-50 px-4 py-2">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Suspended">Suspended</option>
        </select>
    </div>

    <!-- Doctors Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr v-for="doc in filteredDoctors" :key="doc.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <img :src="doc.image || `https://ui-avatars.com/api/?name=${doc.name}&background=random`" class="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p class="font-bold text-gray-900">{{ doc.name }}</p>
                                <p class="text-xs text-gray-500">{{ doc.email || 'N/A' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ doc.specialty }}</td>
                    <td class="px-6 py-4">
                        <span 
                          class="px-2 py-1 rounded-full text-xs font-medium"
                          :class="{
                            'bg-orange-100 text-orange-700': doc.status === 'Pending',
                            'bg-green-100 text-green-700': doc.status === 'Approved' || doc.status === 'Active',
                            'bg-red-100 text-red-700': doc.status === 'Suspended'
                          }"
                        >
                          {{ doc.status || 'Active' }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-1">
                            <span class="text-sm font-bold text-gray-900">{{ doc.rating || 'N/A' }}</span>
                            <span class="text-yellow-400">★</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button 
                              v-if="doc.status === 'Pending'"
                              @click="handleApprove(doc)"
                              class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Approve"
                            >
                                <CheckCircleIcon class="w-5 h-5" />
                            </button>
                            <button 
                              v-if="doc.status !== 'Suspended' && doc.status !== 'Pending'"
                              @click="handleSuspend(doc)"
                              class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                              title="Suspend"
                            >
                                <XCircleIcon class="w-5 h-5" />
                            </button>
                            <button @click="openEditModal(doc)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                <PencilSquareIcon class="w-5 h-5" />
                            </button>
                            <button @click="handleDelete(doc.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                <ArchiveBoxIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showEditModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 class="text-xl font-bold mb-4">Edit Doctor Profile</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input v-model="editingDoc.name" type="text" class="w-full rounded-lg border-gray-300 mt-1" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Specialty</label>
                    <input v-model="editingDoc.specialty" type="text" class="w-full rounded-lg border-gray-300 mt-1" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select v-model="editingDoc.status" class="w-full rounded-lg border-gray-300 mt-1">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button @click="showEditModal = false" class="px-4 py-2 text-gray-600">Cancel</button>
                <button @click="saveEdit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Changes</button>
            </div>
        </div>
    </div>
  </div>
</template>
