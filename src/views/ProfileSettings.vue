<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { usePatientProfileStore } from '../stores/patientProfileStore'

const { currentUser, loadFromStorage } = useUserStore()
loadFromStorage()

const { 
  personalInfo, 
  medicalInfo, 
  emergencyContact, 
  loadProfile, 
  saveProfile 
} = usePatientProfileStore(currentUser.value.email)

onMounted(() => {
  loadProfile()
})

const saveProfileToLocal = () => {
  saveProfile()
}

// --- Edit States ---
const isEditingPersonal = ref(false)
const isEditingMedical = ref(false)
const isEditingContact = ref(false)
const isEditingSecurity = ref(false)

// --- Edit Buffers ---
const personalInfoBuffer = ref({})
const medicalInfoBuffer = ref({ allergies: [], conditions: [] })
const emergencyContactBuffer = ref({})

const newAllergy = ref('')
const newCondition = ref('')

const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// --- Actions ---

// Personal Info
const startEditingPersonal = () => {
  personalInfoBuffer.value = JSON.parse(JSON.stringify(personalInfo.value))
  isEditingPersonal.value = true
}
const cancelEditingPersonal = () => {
  personalInfo.value = JSON.parse(JSON.stringify(personalInfoBuffer.value))
  isEditingPersonal.value = false
}
const savePersonal = () => {
  saveProfileToLocal()
  isEditingPersonal.value = false
}

// Medical Info
const startEditingMedical = () => {
  medicalInfoBuffer.value = JSON.parse(JSON.stringify(medicalInfo.value))
  isEditingMedical.value = true
}
const cancelEditingMedical = () => {
  medicalInfo.value = JSON.parse(JSON.stringify(medicalInfoBuffer.value))
  newAllergy.value = ''
  newCondition.value = ''
  isEditingMedical.value = false
}
const saveMedical = () => {
  saveProfileToLocal()
  isEditingMedical.value = false
}
const addAllergy = () => {
  if (newAllergy.value.trim()) {
    medicalInfo.value.allergies.push(newAllergy.value.trim())
    newAllergy.value = ''
  }
}
const removeAllergy = (index) => {
  medicalInfo.value.allergies.splice(index, 1)
}
const addCondition = () => {
  if (newCondition.value.trim()) {
    medicalInfo.value.conditions.push(newCondition.value.trim())
    newCondition.value = ''
  }
}
const removeCondition = (index) => {
  medicalInfo.value.conditions.splice(index, 1)
}

// Emergency Contact
const startEditingContact = () => {
  emergencyContactBuffer.value = JSON.parse(JSON.stringify(emergencyContact.value))
  isEditingContact.value = true
}
const cancelEditingContact = () => {
  emergencyContact.value = JSON.parse(JSON.stringify(emergencyContactBuffer.value))
  isEditingContact.value = false
}
const saveContact = () => {
  saveProfileToLocal()
  isEditingContact.value = false
}

// Security
const startEditingSecurity = () => {
  securityForm.currentPassword = ''
  securityForm.newPassword = ''
  securityForm.confirmPassword = ''
  isEditingSecurity.value = true
}
const cancelEditingSecurity = () => {
  isEditingSecurity.value = false
}
const saveSecurity = () => {
  isEditingSecurity.value = false
}
const calculateAge = computed(() => {
  if (!personalInfo.value.dob) return ''
  const birthDate = new Date(personalInfo.value.dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return `(${age} years old)`
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
      <p class="text-slate-600">Manage your personal information and account settings</p>
    </div>

    <!-- Personal Information -->
    <div class="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
      <div class="p-6 bg-sky-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-sky-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Personal Information</h2>
            <p class="text-sm text-slate-500">Your basic profile details</p>
          </div>
        </div>
        
        <div v-if="!isEditingPersonal" class="self-start sm:self-auto">
          <button @click="startEditingPersonal" class="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>
        <div v-else class="flex gap-3 self-start sm:self-auto">
          <button @click="cancelEditingPersonal" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="savePersonal" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Display Mode -->
        <div v-if="!isEditingPersonal" class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div><p class="text-sm text-slate-500 mb-1">First Name</p><p class="font-medium text-slate-900">{{ personalInfo.firstName }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Last Name</p><p class="font-medium text-slate-900">{{ personalInfo.lastName }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Date of Birth</p><p class="font-medium text-slate-900">{{ personalInfo.dob }} {{ calculateAge }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Gender</p><p class="font-medium text-slate-900">{{ personalInfo.gender }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Email</p><p class="font-medium text-slate-900">{{ personalInfo.email }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Phone</p><p class="font-medium text-slate-900">{{ personalInfo.phone }}</p></div>
          <div class="md:col-span-2"><p class="text-sm text-slate-500 mb-1">Address</p><p class="font-medium text-slate-900">{{ personalInfo.address }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">City</p><p class="font-medium text-slate-900">{{ personalInfo.city }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">State</p><p class="font-medium text-slate-900">{{ personalInfo.state }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Zip Code</p><p class="font-medium text-slate-900">{{ personalInfo.zip }}</p></div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div><label class="block text-sm text-slate-500 mb-1">First Name</label><input v-model="personalInfo.firstName" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">Last Name</label><input v-model="personalInfo.lastName" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">Date of Birth</label><input v-model="personalInfo.dob" type="date" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">Gender</label><select v-model="personalInfo.gender" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label class="block text-sm text-slate-500 mb-1">Email</label><input v-model="personalInfo.email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">Phone</label><input v-model="personalInfo.phone" type="tel" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div class="md:col-span-2"><label class="block text-sm text-slate-500 mb-1">Address</label><input v-model="personalInfo.address" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">City</label><input v-model="personalInfo.city" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">State</label><input v-model="personalInfo.state" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
          <div><label class="block text-sm text-slate-500 mb-1">Zip Code</label><input v-model="personalInfo.zip" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
        </div>
      </div>
    </div>

    <!-- Medical Information -->
    <div class="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
      <div class="p-6 bg-red-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Medical Information</h2>
            <p class="text-sm text-slate-500">Important health details for your care team</p>
          </div>
        </div>
        <div v-if="!isEditingMedical" class="self-start sm:self-auto">
          <button @click="startEditingMedical" class="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>
         <div v-else class="flex gap-3 self-start sm:self-auto">
          <button @click="cancelEditingMedical" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="saveMedical" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
        </div>
      </div>
      <div class="p-6">
        <!-- Display Mode -->
        <div v-if="!isEditingMedical">
          <div class="mb-6"><p class="text-sm text-slate-500 mb-2">Blood Type</p><p class="font-medium text-slate-900">{{ medicalInfo.bloodType }}</p></div>
          <div class="mb-6"><p class="text-sm text-slate-500 mb-2">Allergies</p><div class="flex flex-wrap gap-2"><span v-for="allergy in medicalInfo.allergies" :key="allergy" class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100">{{ allergy }}</span></div></div>
          <div><p class="text-sm text-slate-500 mb-2">Chronic Conditions</p><div class="flex flex-wrap gap-2"><span v-for="condition in medicalInfo.conditions" :key="condition" class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">{{ condition }}</span></div></div>
        </div>

        <!-- Edit Mode -->
        <div v-else>
           <div class="mb-6"><label class="block text-sm text-slate-500 mb-1">Blood Type</label><input v-model="medicalInfo.bloodType" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           
           <!-- Allergies Edit -->
           <div class="mb-6">
             <label class="block text-sm text-slate-500 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Allergies
             </label>
             <div class="flex flex-wrap gap-2 mb-3">
               <span v-for="(allergy, index) in medicalInfo.allergies" :key="index" class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100 flex items-center gap-2">
                 {{ allergy }}
                 <button @click="removeAllergy(index)" class="hover:text-red-900"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
               </span>
             </div>
             <div class="flex gap-2">
               <input v-model="newAllergy" type="text" placeholder="Add new allergy" class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none">
               <button @click="addAllergy" class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">Add</button>
             </div>
           </div>

           <!-- Conditions Edit -->
           <div>
             <label class="block text-sm text-slate-500 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Chronic Conditions
             </label>
             <div class="flex flex-wrap gap-2 mb-3">
               <span v-for="(condition, index) in medicalInfo.conditions" :key="index" class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 flex items-center gap-2">
                 {{ condition }}
                  <button @click="removeCondition(index)" class="hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
               </span>
             </div>
             <div class="flex gap-2">
               <input v-model="newCondition" type="text" placeholder="Add new condition" class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none">
               <button @click="addCondition" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Add</button>
             </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Emergency Contact -->
    <div class="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
      <div class="p-6 bg-yellow-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-yellow-600">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Emergency Contact</h2>
            <p class="text-sm text-slate-500">Person to contact in case of emergency</p>
          </div>
        </div>
        <div v-if="!isEditingContact" class="self-start sm:self-auto">
          <button @click="startEditingContact" class="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>
        <div v-else class="flex gap-3 self-start sm:self-auto">
          <button @click="cancelEditingContact" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="saveContact" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
        </div>
      </div>
      <div class="p-6">
        <!-- Display Mode -->
        <div v-if="!isEditingContact" class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div><p class="text-sm text-slate-500 mb-1">Full Name</p><p class="font-medium text-slate-900">{{ emergencyContact.name }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Relationship</p><p class="font-medium text-slate-900">{{ emergencyContact.relationship }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Phone</p><p class="font-medium text-slate-900">{{ emergencyContact.phone }}</p></div>
          <div><p class="text-sm text-slate-500 mb-1">Email</p><p class="font-medium text-slate-900">{{ emergencyContact.email }}</p></div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
           <div><label class="block text-sm text-slate-500 mb-1">Full Name</label><input v-model="emergencyContact.name" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           <div><label class="block text-sm text-slate-500 mb-1">Relationship</label><input v-model="emergencyContact.relationship" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           <div><label class="block text-sm text-slate-500 mb-1">Phone</label><input v-model="emergencyContact.phone" type="tel" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           <div><label class="block text-sm text-slate-500 mb-1">Email</label><input v-model="emergencyContact.email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div :class="isEditingSecurity ? 'bg-indigo-50/20 border border-indigo-100' : 'bg-indigo-50 border border-indigo-100'" class="rounded-xl overflow-hidden shadow-card transition-colors"> 
      
      <div v-if="!isEditingSecurity" class="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Security Settings</h2>
            <p class="text-sm text-slate-500">Change your password</p>
          </div>
        </div>
        <div class="self-start sm:self-auto">
          <button @click="startEditingSecurity" class="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Change Password
          </button>
        </div>
      </div>

      <div v-else>
         <div class="p-6 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Security Settings</h2>
              <p class="text-sm text-slate-500">Change your password</p>
            </div>
          </div>
          <div class="flex gap-3 self-start sm:self-auto">
             <button @click="cancelEditingSecurity" class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button @click="saveSecurity" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Update Password
            </button>
          </div>
        </div>
        <div class="p-6">
           <div class="mb-6"><label class="block text-sm text-slate-500 mb-1">Current Password</label><input v-model="securityForm.currentPassword" type="password" placeholder="Enter current password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           <div class="mb-6"><label class="block text-sm text-slate-500 mb-1">New Password</label><input v-model="securityForm.newPassword" type="password" placeholder="Enter new password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           <div class="mb-6"><label class="block text-sm text-slate-500 mb-1">Confirm New Password</label><input v-model="securityForm.confirmPassword" type="password" placeholder="Confirm new password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"></div>
           
           <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
             <p class="text-xs font-semibold text-blue-800 mb-2">Password Requirements:</p>
             <ul class="text-xs text-blue-700 space-y-1 list-disc list-inside">
               <li>At least 8 characters long</li>
               <li>Include uppercase and lowercase letters</li>
               <li>Include at least one number</li>
               <li>Include at least one special character</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
