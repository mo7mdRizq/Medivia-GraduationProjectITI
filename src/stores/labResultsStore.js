import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'medivia_lab_results'

export const historicalData = {
    'Complete Blood Count (CBC)': {
        labels: ['Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'],
        datasets: [
            {
                label: 'WBC (K/µL)',
                data: [6.8, 7.0, 6.5, 7.1, 6.9, 7.0, 7.2],
                borderColor: '#5A4FF3',
                backgroundColor: 'rgba(90, 79, 243, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'RBC (M/µL)',
                data: [4.6, 4.7, 4.5, 4.8, 4.7, 4.6, 4.8],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Hemoglobin (g/dL)',
                data: [14.0, 14.2, 13.8, 14.3, 14.1, 14.4, 14.5],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Platelets (K/µL ÷10)',
                data: [22.0, 23.5, 21.8, 24.0, 23.2, 24.5, 24.5],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    'Lipid Panel': {
        labels: ['Jun 2025', 'Aug 2025', 'Oct 2025', 'Nov 2025'],
        datasets: [
            {
                label: 'Total Cholesterol (mg/dL)',
                data: [195, 200, 202, 206],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'LDL (mg/dL)',
                data: [120, 125, 130, 135],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'HDL (mg/dL)',
                data: [55, 54, 53, 52],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Triglycerides (mg/dL)',
                data: [130, 135, 140, 145],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    }
}

const defaultLabResults = [
    {
        id: 1,
        testName: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        date: 'Dec 5, 2025',
        orderedBy: 'Dr. Michael Chen',
        status: 'Normal',
        expanded: true,
        results: [
            { name: 'White Blood Cells', value: '7.2 K/µL', range: '4.8 - 11 K/µL', status: 'normal' },
            { name: 'Red Blood Cells', value: '4.8 M/uL', range: '4.5 - 6.5 M/uL', status: 'normal' },
            { name: 'Hemoglobin', value: '14.5 g/dL', range: '13.5 - 17.5 g/dL', status: 'normal' },
            { name: 'Hematocrit', value: '43.2 %', range: '38.0 - 50 %', status: 'normal' },
            { name: 'Platelets', value: '245 K/µL', range: '150 - 450 K/µL', status: 'normal' }
        ]
    },
    {
        id: 2,
        testName: 'Lipid Panel',
        category: 'Chemistry',
        date: 'Nov 20, 2025',
        orderedBy: 'Dr. Sarah Johnson',
        status: 'Attention',
        expanded: true,
        results: [
            { name: 'Total Cholesterol', value: '206 mg/dL', range: '0 - 200 mg/dL', status: 'high' },
            { name: 'LDL Cholesterol', value: '135 mg/dL', range: '0 - 100 mg/dL', status: 'high' },
            { name: 'HDL Cholesterol', value: '52 mg/dL', range: '40 - 599 mg/dL', status: 'normal' },
            { name: 'Triglycerides', value: '145 mg/dL', range: '0 - 150 mg/dL', status: 'normal' },
            { name: 'VLDL Cholesterol', value: '29 mg/dL', range: '5 - 40 mg/dL', status: 'normal' }
        ]
    },
    {
        id: 3,
        testName: 'Comprehensive Metabolic Panel',
        category: 'Chemistry',
        date: 'Nov 28, 2025',
        orderedBy: 'Dr. Michael Chen',
        status: 'Normal',
        expanded: false,
        results: []
    },
    {
        id: 4,
        testName: 'Thyroid Function Panel',
        category: 'Endocrinology',
        date: 'Oct 10, 2025',
        orderedBy: 'Dr. Michael Chen',
        status: 'Normal',
        expanded: false,
        results: []
    },
    {
        id: 5,
        testName: 'Hemoglobin A1C',
        category: 'Chemistry',
        date: 'Nov 28, 2025',
        orderedBy: 'Dr. Michael Chen',
        status: 'Normal',
        expanded: false,
        results: []
    },
    {
        id: 6,
        testName: 'Vitamin D',
        category: 'Vitamins',
        date: 'Nov 28, 2025',
        orderedBy: 'Dr. Michael Chen',
        status: 'Attention',
        expanded: false,
        results: []
    },
    {
        id: 7,
        testName: 'Liver Function Panel',
        category: 'Chemistry',
        date: 'Oct 15, 2025',
        orderedBy: 'Dr. Sarah Johnson',
        status: 'Normal',
        expanded: false,
        results: []
    }
]

const getStoredLabResults = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultLabResults
}

export const labResults = ref(getStoredLabResults())

watch(labResults, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export const totalTests = computed(() => labResults.value.length)
export const normalResultsCount = computed(() => labResults.value.filter(r => r.status === 'Normal').length)
export const attentionResultsCount = computed(() => labResults.value.filter(r => r.status === 'Attention').length)

export const addLabResult = (newResult) => {
    labResults.value.unshift(newResult)
}
