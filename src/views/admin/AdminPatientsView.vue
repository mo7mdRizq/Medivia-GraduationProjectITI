<script setup>
import { ref, computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')

const filteredPatients = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return patients.value
  return patients.value.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q) ||
    p.phone.toLowerCase().includes(q)
  )
})

const getRegisteredPatients = () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    return users.map((user, index) => ({
        id: index + 100,
        name: user.fullName,
        age: 'Not specified',
        gender: 'Not specified',
        status: 'Active',
        phone: 'Not provided',
        email: user.email,
        lastVisit: 'Never',
        doctor: 'Unassigned',
        tags: [],
        avatarColor: 'bg-indigo-600'
    }))
}

const patients = ref(getRegisteredPatients());
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Patients Management</h1>
        <p class="mt-1 text-sm text-gray-500">Manage all patients in the healthcare system</p>
      </div>
      <BaseButton class="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
        <PlusIcon class="w-5 h-5" />
        Add New Patient
      </BaseButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm" :class="stat.bg || 'bg-white'">
        <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
        <dd class="mt-2 text-3xl font-bold tracking-tight text-gray-900" :class="stat.color">{{ stat.value }}</dd>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input 
                v-model="searchQuery"
                type="text" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Search by name, email, or phone..." 
            />
        </div>
    </div>

    <h2 class="text-lg font-medium text-gray-900">Patients</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="patient in filteredPatients" :key="patient.id" class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="p-6">
              <!-- Header -->
              <div class="flex items-start justify-between mb-6">
                  <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" :class="patient.avatarColor">
                          <UserIcon class="w-6 h-6" />
                      </div>
                      <div>
                          <h3 class="font-bold text-gray-900">{{ patient.name }}</h3>
                          <p class="text-xs text-gray-500">{{ patient.age }} • {{ patient.gender }}</p>
                      </div>
                  </div>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ patient.status }}
                  </span>
              </div>

              <!-- Contact Info -->
              <div class="space-y-3 mb-6">
                  <div class="flex items-center text-sm text-gray-600">
                      <PhoneIcon class="w-4 h-4 mr-3 text-gray-400" />
                      {{ patient.phone }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon class="w-4 h-4 mr-3 text-gray-400" />
                      {{ patient.email }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon class="w-4 h-4 mr-3 text-gray-400" />
                      Last Visit: {{ patient.lastVisit }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                      <UserIcon class="w-4 h-4 mr-3 text-gray-400" />
                      {{ patient.doctor }}
                  </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-6 min-h-[1.5rem]">
                  <span 
                    v-for="tag in patient.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-red-50 text-red-600 text-xs rounded border border-red-100"
                  >
                    {{ tag }}
                  </span>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <button class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      <PencilSquareIcon class="w-4 h-4" />
                      Edit
                  </button>
                  <button class="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      <TrashIcon class="w-4 h-4" />
                      Delete
                  </button>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
