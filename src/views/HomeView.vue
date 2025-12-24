<script setup>
import LandingNavbar from '../components/landing/LandingNavbar.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { 
  ClipboardDocumentCheckIcon, 
  ShareIcon, 
  ChartBarIcon, 
  ArrowUpTrayIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const features = [
  {
    title: 'Unified Medical Record',
    description: 'Keep all your doctor visits, diagnoses, and notes securely stored and easy to access.',
    icon: ClipboardDocumentCheckIcon,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100'
  },
  {
    title: 'Instant Doctor Sharing',
    description: 'Generate a secure, temporary QR code or link to share your history with a new specialist.',
    icon: ShareIcon,
    iconColor: 'text-indigo-500', // Adjusted specifically
    iconBg: 'bg-indigo-100'
  },
  {
    title: 'Chronic Disease Tracking',
    description: 'Monitor vitals like blood pressure and glucose over time with easy-to-read charts.',
    icon: ChartBarIcon,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-100'
  },
  {
    title: 'Upload Visits & Labs',
    description: 'After a doctor visit, snap a picture of the prescription or upload the lab PDF. We organize it for you.',
    icon: ArrowUpTrayIcon,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100'
  },
  {
    title: 'Prescription Management',
    description: 'View all your prescriptions in one place and receive reminders for your medication schedule.',
    icon: DocumentTextIcon,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-100'
  }
]

const steps = [
  {
    title: 'Create your profile',
    description: 'Sign up in seconds. Add your basic details, allergies, and chronic conditions to set up your digital vault.',
    icon: '≡ƒæñ' // Using emoji for simplicity or can switch to icons
  },
  {
    title: 'Upload visits & Labs',
    description: 'After a doctor visit, snap a picture of the prescription or upload the lab PDF. We organize it for you.',
    icon: '≡ƒôä'
  },
  {
    title: 'Share & collaborate',
    description: 'Visiting a new doctor? Show them your generated QR code. They get instant, read-only access to your history.',
    icon: '≡ƒöù'
  }
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <LandingNavbar />

    <main>
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div class="lg:w-1/2 space-y-8">
          <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Your Complete <span class="text-brand-600">Medical Record</span>. One Secure Platform.
          </h1>
          <p class="text-lg text-gray-600 max-w-lg leading-relaxed">
            Manage your medical history, doctor visits, medications, and lab results ΓÇö all in one place, fully secure and always accessible.
          </p>
          <div class="pt-2">
            <BaseButton variant="primary" class="px-8 py-3.5 text-base" @click="$router.push('/register')">Get Started</BaseButton>
          </div>
        </div>
        
        <div class="lg:w-1/2 relative flex justify-center">
           <!-- Using the uploaded composition image directly for exact match -->
           <img 
             src="/hero-composition.png" 
             alt="Doctor with medical shield" 
             class="relative z-10 w-full max-w-lg h-auto object-contain drop-shadow-xl"
           />
           
           <!-- Background Glow effect -->
           <div class="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full transform scale-90 translate-y-4 -z-10"></div>
        </div>
      </section>

      <!-- Key Features Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-16">
          <span class="text-brand-600 font-semibold border-b-2 border-brand-200 pb-1">Key Features</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to manage your health</h2>
          <p class="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">Medivia solves the fragmentation of healthcare data by putting the patient in control.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
             <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-6', feature.iconBg]">
                <component :is="feature.icon" :class="['w-6 h-6', feature.iconColor]" />
             </div>
             <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
             <p class="text-gray-500 leading-relaxed">{{ feature.description }}</p>
          </div>

          <!-- "Ready to start?" Card -->
          <div class="bg-gray-900 rounded-2xl p-8 shadow-lg flex flex-col justify-center text-white relative overflow-hidden group">
             <div class="relative z-10">
               <h3 class="text-xl font-bold mb-4">Ready to start?</h3>
               <p class="text-gray-300 mb-8 text-sm">Join thousands of patients taking control today.</p>
               <BaseButton class="w-full bg-brand-600 hover:bg-brand-500 border-none text-white" @click="$router.push('/register')">Get Started</BaseButton>
             </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="bg-brand-500 py-20 text-white relative overflow-hidden">
         <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16">
               <h2 class="text-3xl font-bold sm:text-4xl">How Medivia Works</h2>
               <p class="mt-4 text-brand-100 text-lg">Three simple steps to take full control of your medical data.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div v-for="(step, index) in steps" :key="step.title" class="relative">
                 <!-- Connector Line (Desktop) -->
                 <div v-if="index !== steps.length - 1" class="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-brand-400/50"></div>
                 
                 <div class="relative z-10 flex flex-col items-center">
                    <div class="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl mb-8 transform hover:scale-110 transition-transform duration-300">
                       {{ step.icon }}
                    </div>
                    <h3 class="text-xl font-bold mb-3">{{ step.title }}</h3>
                    <p class="text-brand-100/90 leading-relaxed text-sm max-w-xs mx-auto">{{ step.description }}</p>
                 </div>
              </div>
            </div>
         </div>
      </section>

      <!-- Testimonials Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div class="text-center mb-16">
           <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">Trusted by Patients and Doctors</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <!-- Testimonial 1 -->
           <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <p class="text-gray-600 mb-6 italic">"Medivia has saved my team countless hours. I can instantly see a patient's history without waiting for faxed records."</p>
              <div class="flex items-center gap-4">
                 <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-12 h-12 rounded-full object-cover" alt="Dr. Ahmed">
                 <div>
                    <h4 class="font-bold text-gray-900 text-sm">Dr. Ahmed Mohamed</h4>
                    <span class="text-xs text-brand-600 uppercase tracking-wide font-semibold">Cardiologist</span>
                 </div>
              </div>
           </div>

            <!-- Testimonial 2 -->
           <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <p class="text-gray-600 mb-6 italic">"Managing my father's medications used to be a nightmare. With Medivia's reminders, I feel much more in control."</p>
              <div class="flex items-center gap-4">
                 <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-12 h-12 rounded-full object-cover" alt="User">
                 <div>
                    <h4 class="font-bold text-gray-900 text-sm">Ahmed Mohamed</h4>
                    <span class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Patient</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Center Testimonial -->
        <div class="mt-8 flex justify-center">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl w-full">
              <p class="text-gray-600 mb-6 italic">"The interface is incredibly intuitive. I wish all my patients used this system. It reduces drug interaction errors significantly."</p>
              <div class="flex items-center gap-4">
                 <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" class="w-12 h-12 rounded-full object-cover" alt="Dr. Ali">
                 <div>
                    <h4 class="font-bold text-gray-900 text-sm">Dr. Ali Kamal</h4>
                    <span class="text-xs text-brand-600 uppercase tracking-wide font-semibold">Pediatrician</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

    </main>

    <LandingFooter />
  </div>
</template>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-1000 {
  animation-delay: 1s;
}
</style>
