<script setup>
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { toast } from 'vue3-toastify'
import { useLogsStore } from '../../stores/logsStore'

const { addLog } = useLogsStore()
const activeTab = ref('profile')

const profile = ref({
  name: localStorage.getItem('userName') || 'Admin User',
  email: localStorage.getItem('userEmail') || 'admin@medivia.com',
  role: 'Super Admin'
})

const saveProfile = () => {
    localStorage.setItem('userName', profile.value.name)
    localStorage.setItem('userEmail', profile.value.email)
    addLog({ type: 'UPDATE', action: 'Updated admin profile information' })
    toast.success('Profile updated successfully')
    // Trigger a page reload or event to refresh layout name if needed, 
    // but usually user expects it to persist on next visit or refresh.
}

const systemSettings = ref({
  bookingLimit: 5,
  workingHours: '08:00 - 20:00',
  cancellationPolicy: '24 hours',
  specialties: JSON.parse(localStorage.getItem('medivia_specialties') || '["Cardiology", "Dermatology", "Pediatrics", "Neurology", "Orthopedics"]')
})

const newSpecialty = ref('')

const addSpecialty = () => {
  if (newSpecialty.value && !systemSettings.value.specialties.includes(newSpecialty.value)) {
    systemSettings.value.specialties.push(newSpecialty.value)
    localStorage.setItem('medivia_specialties', JSON.stringify(systemSettings.value.specialties))
    addLog({ type: 'UPDATE', action: 'Added new medical specialty', target: newSpecialty.value })
    newSpecialty.value = ''
    toast.success('Specialty added')
  }
}

const removeSpecialty = (index) => {
  const removed = systemSettings.value.specialties.splice(index, 1)
  localStorage.setItem('medivia_specialties', JSON.stringify(systemSettings.value.specialties))
  addLog({ type: 'UPDATE', action: 'Removed medical specialty', target: removed[0] })
  toast.error('Specialty removed')
}

const saveSystemSettings = () => {
    localStorage.setItem('medivia_system_config', JSON.stringify(systemSettings.value))
    addLog({ type: 'UPDATE', action: 'Updated system-wide configuration' })
    toast.success('System settings saved')
}

// Password Logic
const showPasswordForm = ref(false)
const newPassword = ref('')
const updatePassword = () => {
    if (!newPassword.value) {
        toast.error("Please enter a new password")
        return
    }
    const storedAdmin = JSON.parse(localStorage.getItem('adminCredentials') || '{"username": "admin@gmail.com", "password": "Adminadmin207#"}')
    storedAdmin.password = newPassword.value
    localStorage.setItem('adminCredentials', JSON.stringify(storedAdmin))
    addLog({ type: 'AUTH', action: 'Changed admin password' })
    toast.success("Password updated successfully!")
    showPasswordForm.value = false
    newPassword.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your profile and system-wide configurations.</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
        <button 
          @click="activeTab = 'profile'"
          class="px-6 py-3 text-sm font-medium transition-colors border-b-2"
          :class="activeTab === 'profile' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Profile & Security
        </button>
        <button 
          @click="activeTab = 'system'"
          class="px-6 py-3 text-sm font-medium transition-colors border-b-2"
          :class="activeTab === 'system' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          System Config
        </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'profile'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Profile -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon class="w-5 h-5 text-gray-400" />
            Admin Profile
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <BaseInput v-model="profile.name" label="Full Name" :icon="UserIcon" />
             <BaseInput v-model="profile.email" label="Email Address" type="email" :icon="EnvelopeIcon" />
          </div>
          <div class="mt-6 flex justify-end">
             <BaseButton variant="primary" @click="saveProfile">Save Changes</BaseButton>
          </div>
        </div>

        <!-- Security -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
             <LockClosedIcon class="w-5 h-5 text-gray-400" />
             Security
           </h2>
           <div class="space-y-4">
             <div class="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
               <div>
                 <p class="font-medium text-gray-900">Admin Password</p>
                 <p class="text-sm text-gray-500">Last changed: Today</p>
               </div>
               <BaseButton variant="outline" @click="showPasswordForm = !showPasswordForm">
                 {{ showPasswordForm ? 'Cancel' : 'Update' }}
               </BaseButton>
             </div>
             <div v-if="showPasswordForm" class="p-4 border border-gray-200 rounded-lg space-y-4">
                <BaseInput v-model="newPassword" type="password" label="New Password" />
                <BaseButton block @click="updatePassword">Save Password</BaseButton>
             </div>
           </div>
        </div>
      </div>
      
      <!-- Quick Info -->
      <div class="lg:col-span-1">
        <div class="bg-indigo-600 p-6 rounded-xl shadow-lg text-white">
           <ShieldCheckIcon class="w-12 h-12 mb-4 opacity-50" />
           <h3 class="font-bold text-xl mb-2">Secure Access</h3>
           <p class="text-indigo-100 text-sm leading-relaxed">
             You are logged in as a Super Admin. Your actions are audited for security compliance.
           </p>
        </div>
      </div>
    </div>

    <!-- System Config Tab -->
    <div v-else class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Specialties Management -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Cog6ToothIcon class="w-5 h-5 text-gray-400" />
                    Medical Specialties
                </h2>
                <div class="flex gap-2 mb-6">
                    <input 
                      v-model="newSpecialty" 
                      type="text" 
                      placeholder="Add specialty..." 
                      class="flex-1 rounded-lg border-gray-200 text-sm px-4 py-2 bg-gray-50 focus:ring-brand-500"
                    />
                    <button @click="addSpecialty" class="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                        <PlusIcon class="w-5 h-5" />
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(spec, index) in systemSettings.specialties" 
                      :key="spec"
                      class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2 border border-gray-200"
                    >
                        {{ spec }}
                        <button @click="removeSpecialty(index)" class="text-gray-400 hover:text-red-500">
                            <TrashIcon class="w-3 h-3" />
                        </button>
                    </span>
                </div>
            </div>

            <!-- Booking Rules -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ClockIcon class="w-5 h-5 text-gray-400" />
                    Booking Rules
                </h2>
                <div class="space-y-4">
                    <BaseInput v-model="systemSettings.bookingLimit" type="number" label="Max Daily Appointments per Doctor" />
                    <BaseInput v-model="systemSettings.workingHours" label="Global Working Hours" placeholder="e.g. 09:00 - 18:00" />
                    <BaseInput v-model="systemSettings.cancellationPolicy" label="Cancellation Deadline" placeholder="e.g. 12 hours" />
                </div>
                <div class="mt-6 flex justify-end">
                    <BaseButton @click="saveSystemSettings" variant="primary">Save Config</BaseButton>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
