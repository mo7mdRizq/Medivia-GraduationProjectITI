import { ref, watch } from 'vue'

const STORAGE_KEY_PREFIX = 'medivia_patient_profile_'

const profiles = ref(new Map())

export const usePatientProfileStore = (email = 'guest') => {
    const STORAGE_KEY = STORAGE_KEY_PREFIX + email

    if (!profiles.value.has(email)) {
        profiles.value.set(email, {
            personalInfo: ref({
                firstName: '',
                lastName: '',
                dob: '',
                gender: '',
                email: email,
                phone: '',
                address: '',
                city: '',
                state: '',
                zip: ''
            }),
            medicalInfo: ref({
                bloodType: '',
                allergies: [],
                conditions: []
            }),
            emergencyContact: ref({
                name: '',
                relationship: '',
                phone: '',
                email: ''
            })
        })
    }

    const profile = profiles.value.get(email)

    const loadProfile = () => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const data = JSON.parse(stored)
            profile.personalInfo.value = { ...profile.personalInfo.value, ...data.personalInfo }
            profile.medicalInfo.value = { ...profile.medicalInfo.value, ...data.medicalInfo }
            profile.emergencyContact.value = { ...profile.emergencyContact.value, ...data.emergencyContact }
        } else {
            // Fallback to registration data if available
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
            const user = users.find(u => u.email === email)
            if (user) {
                const names = user.fullName.split(' ')
                profile.personalInfo.value.firstName = names[0] || ''
                profile.personalInfo.value.lastName = names.slice(1).join(' ') || ''
                profile.personalInfo.value.email = user.email
                profile.personalInfo.value.phone = user.phone || ''
                profile.personalInfo.value.dob = user.dob || ''
                profile.personalInfo.value.gender = user.gender || ''
            }
        }
    }

    const saveProfile = () => {
        const data = {
            personalInfo: profile.personalInfo.value,
            medicalInfo: profile.medicalInfo.value,
            emergencyContact: profile.emergencyContact.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

        // Update registered users for consistency if needed
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        const userIndex = users.findIndex(u => u.email === email)
        if (userIndex !== -1) {
            users[userIndex].fullName = `${profile.personalInfo.value.firstName} ${profile.personalInfo.value.lastName}`.trim()
            users[userIndex].phone = profile.personalInfo.value.phone
            users[userIndex].dob = profile.personalInfo.value.dob
            users[userIndex].gender = profile.personalInfo.value.gender
            localStorage.setItem('registeredUsers', JSON.stringify(users))
        }
    }

    return {
        personalInfo: profile.personalInfo,
        medicalInfo: profile.medicalInfo,
        emergencyContact: profile.emergencyContact,
        loadProfile,
        saveProfile
    }
}
