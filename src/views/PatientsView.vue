<template>
  <div>
    <!-- Header -->
        <header class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Patient List</h2>
                <p class="text-gray-500 mt-1">Manage and view all your patients</p>
            </div>
            <button @click="openPatientModal"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Patient
            </button>
        </header>

        <!-- Search and Filter -->
        <div class="mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <svg class="w-5 h-5 text-gray-400 ml-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by name, email, or condition..."
                class="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none h-10">
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Total Patients</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ patients.length }}</h3>
                </div>
            </div>
            <div class="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <p class="text-sm font-medium text-green-600 mb-2">Active Patients</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ activePatientsCount }}</h3>
                </div>
            </div>
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <p class="text-sm font-medium text-gray-500 mb-2">Inactive Patients</p>
                <div class="flex items-center justify-between">
                    <h3 class="text-3xl font-bold text-gray-900">{{ inactivePatientsCount }}</h3>
                </div>
            </div>
        </div>

        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">patients</h3>

        <!-- Patient Grid -->
        <div v-if="filteredPatients.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div v-for="patient in filteredPatients" :key="patient.id" class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <!-- ... existing card content ... -->
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-sm">{{ patient.name }}</h4>
                            <p class="text-xs text-gray-500">{{ patient.age }} years • {{ patient.gender }}</p>
                        </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold"
                        :class="patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
                        {{ patient.status }}
                    </span>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Last Visit: <span class="text-gray-900 font-medium ml-1">{{ patient.lastVisit }}</span>
                    </div>
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        {{ patient.phone }}
                    </div>
                    <div class="flex items-center text-xs text-gray-600">
                        <svg class="w-3.5 h-3.5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ patient.email }}
                    </div>
                </div>

                <div class="mb-4">
                    <p class="text-[10px] text-gray-400 mb-1.5 uppercase font-medium">Conditions:</p>
                    <div class="flex flex-wrap gap-2 min-h-[1.5rem]">
                        <span v-for="condition in patient.conditions" :key="condition"
                            class="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium border border-red-100">
                            {{ condition }}
                        </span>
                    </div>
                </div>

                <div class="bg-blue-50 text-blue-700 text-xs font-medium py-1.5 px-3 rounded-lg text-center mb-4 border border-blue-100">
                    Next: {{ patient.nextAppointment }}
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <button @click="$router.push({ name: 'patient-details', params: { id: patient.id } })"
                        class="bg-blue-600 text-white text-xs font-medium py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">
                        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Profile
                    </button>
                    <button @click="openScheduleModal(patient)"
                        class="bg-white text-gray-700 text-xs font-medium py-2 rounded-lg hover:bg-gray-50 transition border border-gray-200 flex justify-center items-center">
                        <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Schedule
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm border-dashed">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No patients found</h3>
            <p class="text-gray-500 mt-1 max-w-sm mx-auto">We couldn't find any patients matching your search query.</p>
            <button class="mt-4 text-blue-600 font-medium text-sm hover:underline" @click="searchQuery = ''">Clear Search</button>
        </div>


    <!-- New Patient Modal -->
    <div v-if="showPatientModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closePatientModal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-xl font-bold text-gray-900">Add New Patient</h3>
                <button @click="closePatientModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar">
                <form @submit.prevent="submitPatient" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input v-model="newPatient.name" type="text" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                placeholder="e.g. John Doe">
                        </div>

                        <!-- Age -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input v-model="newPatient.age" type="number" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                placeholder="e.g. 30">
                        </div>

                        <!-- Gender -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select v-model="newPatient.gender" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                                <option value="" disabled>Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                         <!-- Phone -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input v-model="newPatient.phone" type="tel" required
                                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                                placeholder="(555) 000-0000">
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input v-model="newPatient.email" type="email" required
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="john@example.com">
                    </div>

                    <!-- Conditions -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Medical Conditions (comma separated)</label>
                        <input v-model="newPatient.conditionsInput" type="text"
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="e.g. Asthma, Diabetes">
                    </div>

                    <!-- Status -->
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Initial Status</label>
                        <select v-model="newPatient.status" required
                            class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>

                    <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" @click="closePatientModal"
                            class="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center">
                            Register Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Schedule Appointment Modal -->
    <div v-if="showScheduleModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closeScheduleModal">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
            <div class="bg-blue-600 p-4 flex justify-between items-center">
                <h3 class="text-white font-bold text-lg">Schedule Appointment</h3>
                <button @click="closeScheduleModal" class="text-white hover:text-gray-200 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="p-6">
                <form @submit.prevent="submitAppointment">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                        <input :value="selectedPatientForSchedule?.name" type="text" disabled class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600">
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input v-model="newAppointment.date" type="date" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input v-model="newAppointment.time" type="time" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select v-model="newAppointment.type" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Check-up</option>
                            <option>Follow-up</option>
                            <option>Consultation</option>
                            <option>Emergency</option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea v-model="newAppointment.description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Reason for visit..."></textarea>
                    </div>

                    <div class="flex gap-3">
                        <button type="button" @click="closeScheduleModal" class="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 rounded-lg font-medium text-sm transition">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition shadow-sm">
                            Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { addAppointment, appointments } from '../stores/appointmentsStore';

const searchQuery = ref('');
const showPatientModal = ref(false);
const showScheduleModal = ref(false);
const selectedPatientForSchedule = ref(null);

const newAppointment = reactive({
    date: '',
    time: '',
    type: 'Check-up',
    description: ''
});

const openScheduleModal = (patient) => {
    selectedPatientForSchedule.value = patient;
    newAppointment.date = '';
    newAppointment.time = '';
    newAppointment.type = 'Check-up';
    newAppointment.description = '';
    showScheduleModal.value = true;
};

const closeScheduleModal = () => {
    showScheduleModal.value = false;
    selectedPatientForSchedule.value = null;
};

const submitAppointment = () => {
    if (!selectedPatientForSchedule.value) return;

    const dateObj = new Date(newAppointment.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Simple time formatting (e.g., 14:00 -> 2:00 PM)
    const [hours, minutes] = newAppointment.time.split(':');
    const timeObj = new Date();
    timeObj.setHours(hours, minutes);
    const formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });


    const appointment = {
        id: appointments.value.length + 1, // Simple ID generation
        patientName: selectedPatientForSchedule.value.name,
        patientAge: selectedPatientForSchedule.value.age,
        status: 'Pending',
        date: formattedDate,
        time: formattedTime,
        duration: '30 min', // Default
        type: newAppointment.type,
        shortDescription: newAppointment.description,
        description: newAppointment.description,
        isUrgent: false,
        expanded: false,
        tags: [newAppointment.type], // Simple tag
        phone: selectedPatientForSchedule.value.phone,
        email: selectedPatientForSchedule.value.email,
        medicalHistory: selectedPatientForSchedule.value.conditions || []
    };

    addAppointment(appointment);
    closeScheduleModal();
    // Optional: Notify success
};

const newPatient = reactive({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    conditionsInput: '',
    status: 'Active'
});

const openPatientModal = () => {
    Object.assign(newPatient, {
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        conditionsInput: '',
        status: 'Active'
    });
    showPatientModal.value = true;
};

const closePatientModal = () => {
    showPatientModal.value = false;
};

const submitPatient = () => {
    const conditionsArray = newPatient.conditionsInput.split(',').map(c => c.trim()).filter(c => c);
    
    // Calculate a random future date for "Next Appointment" for demo
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
    const nextAppt = futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const patient = {
        id: patients.value.length + 1,
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        status: newPatient.status,
        lastVisit: 'Never', // New patient
        phone: newPatient.phone,
        email: newPatient.email,
        conditions: conditionsArray,
        nextAppointment: nextAppt
    };

    patients.value.unshift(patient);
    closePatientModal();
};

const patients = ref([
    {
        id: 1,
        name: 'John Martinez',
        age: 45,
        gender: 'Male',
        status: 'Active',
        lastVisit: 'Dec 5, 2025',
        phone: '(555) 123-4567',
        email: 'john.martinez@email.com',
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        nextAppointment: 'Dec 15, 2025'
    },
    {
        id: 2,
        name: 'Emily Johnson',
        age: 32,
        gender: 'Female',
        status: 'Active',
        lastVisit: 'Dec 4, 2025',
        phone: '(555) 234-5678',
        email: 'emily.johnson@email.com',
        conditions: ['Seasonal Allergies'],
        nextAppointment: 'Dec 10, 2025'
    },
    {
        id: 3,
        name: 'Michael Brown',
        age: 58,
        gender: 'Male',
        status: 'Active',
        lastVisit: 'Dec 3, 2025',
        phone: '(555) 345-6789',
        email: 'michael.brown@email.com',
        conditions: ['Hypertension', 'High Cholesterol'],
        nextAppointment: 'Dec 18, 2025'
    },
    {
        id: 4,
        name: 'Sarah Davis',
        age: 41,
        gender: 'Female',
        status: 'Active',
        lastVisit: 'Nov 28, 2025',
        phone: '(555) 456-7890',
        email: 'sarah.davis@email.com',
        conditions: ['Asthma'],
        nextAppointment: 'Dec 20, 2025'
    },
    {
        id: 5,
        name: 'Robert Wilson',
        age: 67,
        gender: 'Male',
        status: 'Active',
        lastVisit: 'Dec 1, 2025',
        phone: '(555) 567-8901',
        email: 'robert.wilson@email.com',
        conditions: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol'],
        nextAppointment: 'Jan 5, 2026'
    },
    {
        id: 6,
        name: 'Jessica Lee',
        age: 29,
        gender: 'Female',
        status: 'Active',
        lastVisit: 'Dec 7, 2025',
        phone: '(555) 678-9012',
        email: 'jessica.lee@email.com',
        conditions: [],
        nextAppointment: 'Dec 28, 2025'
    }
]);

const activePatientsCount = computed(() => patients.value.filter(p => p.status === 'Active').length);
const inactivePatientsCount = computed(() => patients.value.length - activePatientsCount.value);

const filteredPatients = computed(() => {
    if (!searchQuery.value) return patients.value;
    const query = searchQuery.value.toLowerCase();
    return patients.value.filter(patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.conditions.some(c => c.toLowerCase().includes(query))
    );
});
</script>
