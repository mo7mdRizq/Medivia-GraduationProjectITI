<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <header>
      <h2 class="text-2xl font-bold text-gray-900">Profile Settings</h2>
      <p class="text-gray-500 mt-1">Manage your professional profile and account settings</p>
    </header>

    <!-- Profile Card (Avatar & Basic Info) -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 flex items-center space-x-6 shadow-sm">
        <div class="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold relative">
            {{ (currentUser.name && currentUser.name.split(' ').length > 1) ? (currentUser.name.split(' ')[0][0] + currentUser.name.split(' ')[1][0]) : 'DR' }}
            <div class="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50">
                 <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
        </div>
        <div>
            <h3 class="text-lg font-bold text-gray-900">{{ profile.firstName }} {{ profile.lastName }}, {{ profile.title }}</h3>
            <p class="text-gray-500 text-sm">Cardiologist</p>
            <button class="text-blue-600 text-xs font-semibold mt-2 hover:underline flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Change Profile Photo
            </button>
        </div>
    </div>

    <!-- Personal Information -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Personal Information</h3>
                    <p class="text-xs text-gray-500">Basic details and professional credentials</p>
                </div>
            </div>
            <button @click="toggleEdit('personal')" class="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                {{ isEditing.personal ? 'Save' : 'Edit' }}
            </button>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                <input v-model="profile.firstName" :disabled="!isEditing.personal" type="text" 
                    @input="validateRequired('firstName', profile.firstName)"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                    :class="{'border-red-500 focus:border-red-500': errors.firstName}">
                <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                <input v-model="profile.lastName" :disabled="!isEditing.personal" type="text" 
                    @input="validateRequired('lastName', profile.lastName)"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                    :class="{'border-red-500 focus:border-red-500': errors.lastName}">
                <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Professional Title</label>
                <input v-model="profile.title" :disabled="!isEditing.personal" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Medical Specialty</label>
                <input v-model="profile.specialty" :disabled="!isEditing.personal" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
            </div>
            <div class="md:col-span-2">
                 <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Medical License Number</label>
                <input v-model="profile.license" :disabled="!isEditing.personal" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed md:w-1/2">
            </div>
             <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Professional Bio</label>
                <textarea v-model="profile.bio" :disabled="!isEditing.personal" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"></textarea>
            </div>
        </div>
    </div>

    <!-- Contact Information -->
     <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div class="flex items-center space-x-3">
                 <div class="p-2 bg-green-100 text-green-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Contact Information</h3>
                    <p class="text-xs text-gray-500">Email, phone, and office location</p>
                </div>
            </div>
             <button @click="toggleEdit('contact')" class="text-green-600 text-sm font-medium hover:text-green-700 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                {{ isEditing.contact ? 'Save' : 'Edit' }}
            </button>
        </div>
         <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input v-model="profile.email" :disabled="!isEditing.contact" type="email" 
                    @input="validateEmail('email', profile.email)"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                    :class="{'border-red-500 focus:border-red-500': errors.email}">
                <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mobile Phone</label>
                <input v-model="profile.phone" :disabled="!isEditing.contact" type="text" 
                    @input="validatePhone('phone', profile.phone)"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                     :class="{'border-red-500 focus:border-red-500': errors.phone}">
                <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Office Phone</label>
                <input v-model="profile.officePhone" :disabled="!isEditing.contact" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed md:w-1/2">
            </div>
             <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Office Address</label>
                <input v-model="profile.address" :disabled="!isEditing.contact" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed mb-4">
                <div class="grid grid-cols-3 gap-4">
                     <div>
                        <input v-model="profile.city" :disabled="!isEditing.contact" placeholder="City" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
                    </div>
                     <div>
                        <input v-model="profile.state" :disabled="!isEditing.contact" placeholder="State" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
                    </div>
                     <div>
                        <input v-model="profile.zip" :disabled="!isEditing.contact" placeholder="Zip" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Professional Details -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <div class="flex items-center space-x-3">
                <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900">Professional Details</h3>
                    <p class="text-xs text-gray-500">Education, certifications, and experience</p>
                </div>
            </div>
             <button @click="toggleEdit('professional')" class="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center">
                 <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                {{ isEditing.professional ? 'Save' : 'Edit' }}
            </button>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                 <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Medical Education</label>
                <input v-model="profile.education" :disabled="!isEditing.professional" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
            </div>
            <div>
                 <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Years of Experience</label>
                <input v-model="profile.experience" :disabled="!isEditing.professional" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
            </div>
             <div class="md:col-span-2">
                 <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Board Certification</label>
                <input v-model="profile.certifications" :disabled="!isEditing.professional" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
            </div>
             <div class="md:col-span-2">
                 <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Languages Spoken</label>
                <input v-model="profile.languages" :disabled="!isEditing.professional" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors disabled:text-gray-500 disabled:cursor-not-allowed">
            </div>
        </div>
    </div>
    
     <!-- Password & Security -->
    <div class="bg-red-50 rounded-xl border border-red-100 p-6 flex items-center justify-between">
         <div class="flex items-center space-x-4">
            <div class="p-3 bg-white text-red-500 rounded-full shadow-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <div>
                <h3 class="font-bold text-gray-900">Password & Security</h3>
                <p class="text-sm text-gray-500">Update your password and security settings</p>
            </div>
        </div>
        <button class="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-700 transition shadow-sm">
            Change Password
        </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useValidation } from '../composables/useValidation';

const { currentUser, login } = useUserStore();
const { errors, validateRequired, validateEmail, validatePhone, clearErrors } = useValidation();

const isEditing = reactive({
    personal: false,
    contact: false,
    professional: false,
    schedule: false,
});

const profile = reactive({
    firstName: '',
    lastName: '',
    title: '',
    specialty: '',
    license: '',
    bio: '',
    email: '',
    phone: '',
    officePhone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    education: '',
    experience: '',
    certifications: '',
    languages: ''
});

// Initialize profile from userStore
const initProfile = () => {
    if (currentUser.value) {
        if (currentUser.value.name) {
            const names = currentUser.value.name.split(' ');
            profile.firstName = names[0] || '';
            profile.lastName = names.slice(1).join(' ') || '';
        }
        profile.email = currentUser.value.email || '';
        
        // Load other fields if they exist in store
        profile.title = currentUser.value.title || '';
        profile.specialty = currentUser.value.specialty || '';
        profile.license = currentUser.value.license || '';
        profile.bio = currentUser.value.bio || '';
        profile.phone = currentUser.value.phone || '';
        profile.officePhone = currentUser.value.officePhone || '';
        profile.address = currentUser.value.address || '';
        profile.city = currentUser.value.city || '';
        profile.state = currentUser.value.state || '';
        profile.zip = currentUser.value.zip || '';
        profile.education = currentUser.value.education || '';
        profile.experience = currentUser.value.experience || '';
        profile.certifications = currentUser.value.certifications || '';
        profile.languages = currentUser.value.languages || '';
    }
};

onMounted(() => {
    initProfile();
});

// Watch current user to update profile if store changes externally
watch(() => currentUser.value, () => {
   initProfile();
}, { deep: true });


const toggleEdit = (section) => {
    clearErrors();
    
    // If we are currently editing this section, we are trying to SAVE
    if (isEditing[section]) {
        let isValid = true;

        if (section === 'personal') {
             const isFirstValid = validateRequired('firstName', profile.firstName);
             const isLastValid = validateRequired('lastName', profile.lastName);
             isValid = isFirstValid && isLastValid;
        } else if (section === 'contact') {
            const isEmailValid = validateEmail('email', profile.email);
            // Phone is optional or required? Validating format if present
            const isPhoneValid = profile.phone ? validatePhone('phone', profile.phone) : true;
            isValid = isEmailValid && isPhoneValid;
        }
        
        if (!isValid) return;

        // Save to Store
        // We construct the full name for the 'name' field which is used by auth
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        
        const updatedUser = {
            ...currentUser.value,
            name: fullName,
            email: profile.email,
            // Save all other profile fields
            title: profile.title,
            specialty: profile.specialty,
            license: profile.license,
            bio: profile.bio,
            phone: profile.phone,
            officePhone: profile.officePhone,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            zip: profile.zip,
            education: profile.education,
            experience: profile.experience,
            certifications: profile.certifications,
            languages: profile.languages
        };

        login(updatedUser);
    }
    
    isEditing[section] = !isEditing[section];
};
</script>
