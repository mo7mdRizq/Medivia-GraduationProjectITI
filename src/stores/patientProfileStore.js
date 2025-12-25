import { ref, watch } from 'vue'

const STORAGE_KEY_PREFIX = 'medivia_patient_profile_'

export const usePatientProfileStore = (email) => {
    const STORAGE_KEY = STORAGE_KEY_PREFIX + (email || 'guest')

    const personalInfo = ref({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        email: email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    })

    const medicalInfo = ref({
        bloodType: '',
        allergies: [],
        conditions: []
    })

    const emergencyContact = ref({
        name: '',
        relationship: '',
        phone: '',
        email: ''
    })

    const loadProfile = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const data = JSON.parse(stored)
            personalInfo.value = { ...personalInfo.value, ...data.personalInfo }
            medicalInfo.value = { ...medicalInfo.value, ...data.medicalInfo }
            emergencyContact.value = { ...emergencyContact.value, ...data.emergencyContact }
        } else {
            // Fallback to registration data if available
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
            const user = users.find(u => u.email === email)
            if (user) {
                const names = user.fullName.split(' ')
                personalInfo.value.firstName = names[0] || ''
                personalInfo.value.lastName = names.slice(1).join(' ') || ''
                personalInfo.value.email = user.email
                personalInfo.value.phone = user.phone || ''
                personalInfo.value.dob = user.dob || ''
                personalInfo.value.gender = user.gender || ''
            }
        }
    }

    const saveProfile = () => {
        const data = {
            personalInfo: personalInfo.value,
            medicalInfo: medicalInfo.value,
            emergencyContact: emergencyContact.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

        // Update registered users for consistency if needed
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        const userIndex = users.findIndex(u => u.email === email)
        if (userIndex !== -1) {
            users[userIndex].fullName = `${personalInfo.value.firstName} ${personalInfo.value.lastName}`.trim()
            users[userIndex].phone = personalInfo.value.phone
            users[userIndex].dob = personalInfo.value.dob
            users[userIndex].gender = personalInfo.value.gender
            localStorage.setItem('registeredUsers', JSON.stringify(users))
        }
    }

    return {
        personalInfo,
        medicalInfo,
        emergencyContact,
        loadProfile,
        saveProfile
    }
}
