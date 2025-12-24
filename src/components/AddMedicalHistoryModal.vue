<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add-history'])

const formData = ref({
  type: 'General Checkup',
  doctor: 'Dr. Michael Chen',
  specialty: 'Primary Care',
  date: new Date().toISOString().split('T')[0],
  title: '',
  summary: ''
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const newRecord = {
    id: Date.now(),
    type: formData.value.type,
    date: new Date(formData.value.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    title: formData.value.title,
    summary: formData.value.summary,
    doctor: formData.value.doctor,
    specialty: formData.value.specialty,
    files: [], // Init empty
    expanded: false
  }
  emit('add-history', newRecord)
  closeModal()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
    
    <div class="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="bg-[#5A4FF3] p-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <h2 class="text-2xl font-black tracking-tight">Add Medical History</h2>
        <p class="text-indigo-100 text-xs font-bold mt-1 uppercase tracking-widest opacity-80">Manual Timeline Entry</p>
      </div>

      <div class="p-8 overflow-y-auto space-y-6">
        <div class="grid grid-cols-2 gap-5">
           <div>
             <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Date of Event</label>
             <input v-model="formData.date" type="date" class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100 font-bold transition-all">
           </div>
           <div>
             <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Category</label>
             <input v-model="formData.type" type="text" placeholder="e.g. Surgery" class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100 font-bold transition-all">
           </div>
        </div>

        <div>
           <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Record Title</label>
           <input v-model="formData.title" type="text" placeholder="e.g. Appendectomy - Successful Recovery" class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100 font-bold transition-all">
        </div>

        <div class="grid grid-cols-2 gap-5">
           <div>
             <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Practitioner</label>
             <input v-model="formData.doctor" type="text" class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100 font-bold transition-all">
           </div>
           <div>
             <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Specialty</label>
             <input v-model="formData.specialty" type="text" class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100 font-bold transition-all">
           </div>
        </div>

        <div>
           <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Clinical Summary</label>
           <textarea v-model="formData.summary" rows="4" placeholder="Describe the outcome and follow-up details..." class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#5A4FF3] focus:ring-4 focus:ring-indigo-100 font-bold transition-all resize-none"></textarea>
        </div>
      </div>

      <div class="p-8 pt-0 flex gap-4">
        <button @click="closeModal" class="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
          Discard
        </button>
        <button @click="handleSubmit" class="flex-1 py-4 rounded-2xl bg-[#5A4FF3] text-white font-black text-xs uppercase tracking-widest hover:bg-[#4F46E5] transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]">
          Save Record
        </button>
      </div>
    </div>
  </div>
</template>
