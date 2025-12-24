import { ref, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  EllipsisVerticalIcon 
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const selectedRole = ref('All Roles')

const getRegisteredUsers = () => {
  const usersList = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  return usersList.map((user, index) => ({
    id: index + 1,
    name: user.fullName,
    email: user.email,
    role: 'Patient', // Default role
    status: 'Active',
    lastActive: 'Just now',
    avatar: `https://ui-avatars.com/api/?name=${user.fullName.split(' ').join('+')}&background=random`
  }))
}

const users = ref(getRegisteredUsers())

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = selectedRole.value === 'All Roles' || user.role === selectedRole.value
    
    return matchesSearch && matchesRole
  })
})

const roles = ['All Roles', 'Admin', 'Doctor', 'Patient', 'Staff']
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>
        <p class="mt-1 text-sm text-gray-500">Manage user access and permissions.</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton variant="primary">
          Add New User
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="w-full sm:w-96">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <MagnifyingGlassIcon class="h-5 w-5" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="block w-full rounded-lg border-gray-200 bg-gray-50 text-sm focus:border-brand-500 focus:ring-brand-500 pl-10 py-2.5"
          />
        </div>
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select 
          v-model="selectedRole"
          class="block w-full sm:w-40 rounded-lg border-gray-200 bg-white text-sm focus:border-brand-500 focus:ring-brand-500 py-2.5"
        >
          <option v-for="role in roles" :key="role">{{ role }}</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" :src="user.avatar" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-purple-100 text-purple-800': user.role === 'Admin',
                    'bg-blue-100 text-blue-800': user.role === 'Doctor',
                    'bg-green-100 text-green-800': user.role === 'Patient',
                    'bg-gray-100 text-gray-800': user.role === 'Staff',
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastActive }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button class="text-gray-400 hover:text-brand-600 transition-colors">
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button class="text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredUsers.length }}</span> of <span class="font-medium">{{ filteredUsers.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </a>
              <a href="#" aria-current="page" class="z-10 bg-brand-50 border-brand-500 text-brand-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </a>
              <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                2
              </a>
              <a href="#" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                3
              </a>
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
