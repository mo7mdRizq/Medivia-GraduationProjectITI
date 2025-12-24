import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_visits'

const defaultVisits = [
    {
        id: 1,
        type: 'Annual Physical Exam',
        date: 'Nov 28, 2025',
        time: '9:00 AM',
        doctor: 'Dr. Michael Chen',
        specialty: 'Primary Care',
        chiefComplaint: 'Routine annual health examination',
        diagnosis: 'Patient in excellent health. All vital signs within normal limits. No acute concerns identified.',
        expanded: true
    },
    {
        id: 2,
        type: 'Follow-up Consultation',
        date: 'Oct 15, 2025',
        time: '10:30 AM',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        chiefComplaint: 'Hypertension management follow-up',
        diagnosis: 'Stage 1 Hypertension - Well controlled on current medication regimen. Blood pressure readings consistently within target range.',
        vitalSigns: [
            { label: 'Blood Pressure', value: '118/70 mmHg', color: 'blue' },
            { label: 'Heart Rate', value: '68 bpm', color: 'green' },
            { label: 'Temperature', value: '98.4°F', color: 'teal' },
            { label: 'Weight', value: '174 lbs', color: 'indigo' },
            { label: 'Height', value: "5'10\"", color: 'purple' }
        ],
        clinicalNotes: 'Patient reports excellent medication compliance. Home blood pressure monitoring shows consistent readings in normal range. No adverse medication effects reported. EKG shows normal sinus rhythm with no abnormalities. Continue current medication regimen. Patient educated on importance of sodium restriction and regular cardiovascular exercise.',
        prescriptions: [
            'Lisinopril 10mg daily (continued)',
            'Aspirin 81mg daily (continued)'
        ],
        labTests: [
            'Comprehensive Metabolic Panel',
            'Lipid Panel'
        ],
        followUpPlan: 'Cardiology follow-up in 3 months',
        attachedFiles: [
            { name: 'Cardiology_Visit_Notes.pdf', size: '312 KB' },
            { name: 'BP_Monitoring_Chart.pdf', size: '203 KB' },
            { name: 'EKG_Results.pdf', size: '180 KB' }
        ],
        expanded: true
    },
    {
        id: 3,
        type: 'Consultation',
        date: 'Sep 8, 2025',
        time: '11:00 AM',
        doctor: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        chiefComplaint: 'Skin lesion evaluation on left shoulder',
        diagnosis: 'Benign nevus - No concerning features on visual examination and dermoscopy. No evidence of dysplasia or malignancy.',
        expanded: false
    },
    {
        id: 4,
        type: 'Sick Visit',
        date: 'Jul 22, 2025',
        time: '2:15 PM',
        doctor: 'Dr. Michael Chen',
        specialty: 'Primary Care',
        chiefComplaint: 'Cough, congestion, and mild fatigue for 3 days',
        diagnosis: 'Acute Upper Respiratory Infection (Common Cold) - Viral etiology suspected. No indication for antibiotic therapy.',
        expanded: false
    },
    {
        id: 5,
        type: 'Initial Consultation',
        date: 'May 10, 2025',
        time: '9:30 AM',
        doctor: 'Dr. James Park',
        specialty: 'Orthopedics',
        chiefComplaint: 'Right knee pain for 2 weeks, worse with activity',
        diagnosis: "Patellar tendinopathy (Jumper's Knee) - Mild to moderate severity. Likely related to recent increase in running mileage.",
        expanded: false
    },
    {
        id: 6,
        type: 'Initial Consultation',
        date: 'Mar 3, 2025',
        time: '1:45 PM',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        chiefComplaint: 'Elevated blood pressure readings at home',
        diagnosis: 'Stage 1 Hypertension - Newly diagnosed. No evidence of end-organ damage. Recommended lifestyle modifications and pharmacological therapy.',
        expanded: false
    }
]

const getStoredVisits = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultVisits
}

export const visits = ref(getStoredVisits())

watch(visits, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const totalVisits = computed(() => visits.value.length)

export const recentVisitsCount = computed(() => {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return visits.value.filter(v => new Date(v.date) >= threeMonthsAgo).length
})

export const uniqueProvidersCount = computed(() => {
    const providers = new Set(visits.value.map(v => v.doctor))
    return providers.size
})

export const addVisit = (newVisit) => {
    visits.value.unshift(newVisit)
}
