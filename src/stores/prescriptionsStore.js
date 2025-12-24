import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_prescriptions'

const defaultPrescriptions = [
    {
        id: 1,
        medication: 'Metformin',
        dosage: '500mg',
        status: 'Active',
        condition: 'Endocrinology',
        frequency: 'Twice daily',
        duration: '3 months',
        instructions: 'Take with meals to reduce stomach upset. Monitor blood sugar levels regularly. Avoid excessive alcohol consumption.',
        doctor: 'Dr. Sarah Johnson',
        lastRefill: 'Dec 10, 2025',
        nextRefill: 'Jan 9, 2026',
        refillsRemaining: 3
    },
    {
        id: 2,
        medication: 'Lisinopril',
        dosage: '10mg',
        status: 'Active',
        condition: 'Hypertension Management',
        frequency: 'Once daily',
        duration: 'Ongoing',
        instructions: 'Take in the morning with or without food. Monitor blood pressure regularly. Avoid potassium supplements without consulting your doctor.',
        doctor: 'Dr. Sarah Johnson',
        lastRefill: 'Dec 1, 2025',
        nextRefill: 'Dec 31, 2025',
        refillsRemaining: 2
    },
    {
        id: 3,
        medication: 'Atorvastatin',
        dosage: '20mg',
        status: 'Active',
        condition: 'Cholesterol Management',
        frequency: 'Once daily at bedtime',
        duration: 'Ongoing',
        instructions: 'Take at bedtime with or without food. Avoid grapefruit and grapefruit juice. Report any unexplained muscle pain.',
        doctor: 'Dr. Sarah Johnson',
        lastRefill: 'Nov 20, 2025',
        nextRefill: 'Dec 20, 2025',
        refillsRemaining: 1
    },
    {
        id: 4,
        medication: 'Vitamin D3',
        dosage: '2000 IU',
        status: 'Active',
        condition: 'Vitamin D Deficiency',
        frequency: 'Once daily',
        duration: '6 months',
        instructions: 'Take with fatty meal for better absorption. Can be taken at any time of the day.',
        doctor: 'Dr. Michael Chen',
        lastRefill: 'Nov 28, 2025',
        nextRefill: 'Jan 28, 2026',
        refillsRemaining: 2
    },
    {
        id: 5,
        medication: 'Omeprazole',
        dosage: '20mg',
        status: 'Active',
        condition: 'Acid Reflux',
        frequency: 'Once daily before breakfast',
        duration: '3 months',
        instructions: 'Take 30 minutes before breakfast. Swallow whole, do not crush or chew. May take 1-4 days for full effect.',
        doctor: 'Dr. Emily Davis',
        lastRefill: 'Oct 10, 2025',
        nextRefill: 'Nov 10, 2025',
        refillsRemaining: 0
    },
    {
        id: 6,
        medication: 'Amoxicillin',
        dosage: '500mg',
        status: 'Completed',
        condition: 'Acute Respiratory Infection',
        frequency: 'Every three times daily',
        duration: '10 days',
        instructions: 'Take every 8 hours for 10 days. Complete the entire course even if symptoms improve. Take with food if stomach upset occurs.',
        doctor: 'Dr. Emily Davis',
        completionDate: 'Aug 5, 2025'
    },
    {
        id: 7,
        medication: 'Ibuprofen',
        dosage: '400mg',
        status: 'Completed',
        condition: 'Acute Pain Reliever',
        frequency: 'Every six hours as needed',
        duration: 'As needed',
        instructions: 'Take with food or milk to avoid stomach irritation. Do not exceed 1200mg in 24 hours. Stop if pain persists for more than 10 days.',
        doctor: 'Dr. Michael Chen',
        completionDate: 'May 24, 2025'
    },
    {
        id: 8,
        medication: 'Aspirin',
        dosage: '81mg',
        status: 'Active',
        condition: 'Cardiovascular Protection',
        frequency: 'Once daily',
        duration: 'Ongoing',
        instructions: 'Take with food to reduce risk of stomach upset. Low-dose aspirin for heart health. Do not stop suddenly without consulting your doctor.',
        doctor: 'Dr. Sarah Johnson',
        lastRefill: 'Oct 10, 2025',
        nextRefill: 'Feb 15, 2026',
        refillsRemaining: 4
    },
    {
        id: 9,
        medication: 'Cetirizine',
        dosage: '10mg',
        status: 'Active',
        condition: 'Seasonal Allergies',
        frequency: 'Once daily',
        duration: 'As needed',
        instructions: 'Take once daily in the morning or evening. Can be taken with or without food. Avoid alcohol while taking this medication.',
        doctor: 'Dr. Emily Davis',
        lastRefill: 'Oct 1, 2025',
        nextRefill: 'Not applicable',
        refillsRemaining: 6
    }
]

const getStoredPrescriptions = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultPrescriptions
}

export const prescriptions = ref(getStoredPrescriptions())

watch(prescriptions, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const activeCount = computed(() => prescriptions.value.filter(p => p.status === 'Active').length)
export const refillSoonCount = computed(() => prescriptions.value.filter(p => p.status === 'Active' && p.refillsRemaining <= 2).length)
export const completedCount = computed(() => prescriptions.value.filter(p => p.status === 'Completed').length)

export const addPrescription = (newPrescription) => {
    prescriptions.value.unshift(newPrescription)
}
