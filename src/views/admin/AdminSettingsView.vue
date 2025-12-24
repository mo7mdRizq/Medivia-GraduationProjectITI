<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { db } from '@/util/storage'
import { toast } from 'vue3-toastify'

const profile = ref({
  name: 'Admin User',
  email: 'admin@medivia.com',
  role: 'Super Admin'
})

const notifications = ref({
  email: true,
  push: false,
  weekly_digest: true
})

const security = ref({
  two_factor: true,
  session_timeout: false
})

const showPasswordForm = ref(false)
const newPassword = ref('')

const updatePassword = () => {
    if (!newPassword.value) {
        toast.error("Please enter a new password")
        return
    }
    
    // Update admin credentials in the database
    const storedAdmin = db.get('adminCredentials') || { username: 'admin@gmail.com', password: 'Adminadmin207#' }
    storedAdmin.password = newPassword.value
    db.set('adminCredentials', storedAdmin)
    
    toast.success("Password updated successfully!")
    showPasswordForm.value = false
    newPassword.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="mt-1 text-sm text-gray-500">Manage your profile and application preferences.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Profile Settings -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon class="w-5 h-5 text-gray-400" />
            Profile Information
          </h2>
          <div class="flex items-center gap-6 mb-8">
            <div class="relative">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff" 
                alt="Profile" 
                class="w-20 h-20 rounded-full ring-4 ring-brand-50"
              >
              <button class="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                <UserIcon class="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">Admin User</h3>
              <p class="text-sm text-gray-500">Super Administrator</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <BaseInput 
               v-model="profile.name" 
               label="Full Name" 
               :icon="UserIcon"
             />
             <BaseInput 
               v-model="profile.email" 
               label="Email Address" 
               type="email"
               :icon="EnvelopeIcon"
             />
             <BaseInput 
               label="Role" 
               modelValue="Super Admin"
               :icon="ShieldCheckIcon"
               readonly
               class="opacity-70 cursor-not-allowed"
             />
          </div>

          <div class="mt-6 flex justify-end">
             <BaseButton variant="primary">Save Changes</BaseButton>
          </div>
        </div>

        <!-- Security -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
             <LockClosedIcon class="w-5 h-5 text-gray-400" />
             Security
           </h2>
           
           <div class="space-y-4">
             <!-- Change Password Section -->
             <div class="p-4 bg-gray-50 rounded-lg">
               <div class="flex items-center justify-between mb-4">
                 <div>
                   <p class="font-medium text-gray-900">Change Password</p>
                   <p class="text-sm text-gray-500">Update your admin password</p>
                 </div>
                 <BaseButton variant="outline" class="!py-2" @click="showPasswordForm = !showPasswordForm">
                   {{ showPasswordForm ? 'Cancel' : 'Update' }}
                 </BaseButton>
               </div>
               
               <div v-if="showPasswordForm" class="space-y-4 pt-4 border-t border-gray-200">
                  <BaseInput 
                    v-model="newPassword" 
                    type="password" 
                    label="New Password" 
                    placeholder="Enter new password"
                  />
                  <BaseButton block @click="updatePassword">Save New Password</BaseButton>
               </div>
             </div>
             
             <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
               <div>
                 <p class="font-medium text-gray-900">Two-Factor Authentication</p>
                 <p class="text-sm text-gray-500">Add an extra layer of security</p>
               </div>
               <!-- Simple Toggle Mock -->
               <button 
                 @click="security.two_factor = !security.two_factor"
                 class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                 :class="security.two_factor ? 'bg-brand-600' : 'bg-gray-200'"
               >
                 <span 
                   class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                   :class="security.two_factor ? 'translate-x-5' : 'translate-x-0'" 
                 />
               </button>
             </div>
           </div>
        </div>
      </div>

      <!-- Notifications Side Panel -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
           <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
             <BellIcon class="w-5 h-5 text-gray-400" />
             Notifications
           </h2>
           <div class="space-y-6">
             <div class="flex items-start justify-between">
               <div>
                 <p class="font-medium text-gray-900">Email Notifications</p>
                 <p class="text-sm text-gray-500">Receive emails about account activity.</p>
               </div>
               <input type="checkbox" v-model="notifications.email" class="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 mt-1">
             </div>
             <div class="flex items-start justify-between">
               <div>
                 <p class="font-medium text-gray-900">Push Notifications</p>
                 <p class="text-sm text-gray-500">Receive push notifications on your device.</p>
               </div>
               <input type="checkbox" v-model="notifications.push" class="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 mt-1">
             </div>
             <div class="flex items-start justify-between">
               <div>
                 <p class="font-medium text-gray-900">Weekly Digest</p>
                 <p class="text-sm text-gray-500">Get a weekly summary of system stats.</p>
               </div>
               <input type="checkbox" v-model="notifications.weekly_digest" class="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 mt-1">
             </div>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>
