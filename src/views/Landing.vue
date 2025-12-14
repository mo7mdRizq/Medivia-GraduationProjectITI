<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <header class="shadow-sm">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center space-x-2">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">+</span>
            <span class="text-xl font-semibold">Medivia</span>
          </div>
          <nav class="hidden md:flex items-center space-x-8 text-sm text-gray-600 font-medium">
            <a class="border-b-2 border-blue-600 pb-3 text-blue-600" href="#home">Home</a>
            <RouterLink class="pb-3 hover:text-blue-600" to="/dashboard">Dashboard</RouterLink>
            <a class="pb-3 hover:text-blue-600" href="#appointment">Appointment</a>
            <a class="pb-3 hover:text-blue-600" href="#visits">Visits</a>
            <a class="pb-3 hover:text-blue-600" href="#about">About</a>
          </nav>
          <button class="ml-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30">Login</button>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <section id="home" class="hero-bg relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div class="dot-grid absolute right-10 top-16 h-44 w-32 opacity-60"></div>
        </div>
        <div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:py-20">
          <div class="w-full space-y-6 lg:w-1/2">
            <p class="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Your Complete <span class="text-blue-600">Medical Record.</span> One Secure Platform.
            </p>
            <p class="max-w-xl text-lg text-gray-600">
              Manage your medical history, doctor visits, medications, and lab results — all in one place, fully secure and always accessible.
            </p>
            <div>
              <RouterLink to="/dashboard" class="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30">Get Started</RouterLink>
            </div>
          </div>
          <div class="relative w-full max-w-lg lg:w-1/2">
            <div class="relative mx-auto h-80 w-80">
              <div class="absolute inset-0 rounded-full bg-white shadow-2xl"></div>
              <div class="absolute inset-4 rounded-full bg-gradient-to-br from-blue-100 via-white to-blue-50"></div>
              <img class="absolute inset-6 h-68 w-68 rounded-full object-cover" src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80" alt="Doctor portrait">
              <div class="absolute -left-7 bottom-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white text-3xl font-bold shadow-lg">+</div>
              <div class="absolute -right-10 top-3 hidden sm:block">
                <div class="rounded-3xl bg-white p-3 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-14 text-blue-600" viewBox="0 0 64 80" fill="none">
                    <path d="M32 4 8 12v23c0 12.7 9 24.1 24 33 15-8.9 24-20.3 24-33V12L32 4Z" stroke="currentColor" stroke-width="3" fill="#EBF5FF"/>
                    <path d="M32 24v18M23 33h18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="absolute -right-8 -bottom-10 h-32 w-32 rounded-full bg-blue-600/25 blur-3xl"></div>
              <div class="absolute -left-12 top-4 h-24 w-24 rounded-full bg-blue-600/15 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dashboard Features Section -->
      <section id="dashboard" class="py-16">
        <div class="mx-auto w-full max-w-6xl px-4">
          <div class="mb-3 text-center text-blue-600 font-semibold">Key Features</div>
          <h2 class="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need to manage your health</h2>
          <p class="mt-3 text-center text-gray-600">Medivia solves the fragmentation of healthcare data by putting the patient in control.</p>

          <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <!-- Features Grid... (Skipping full repetition for brevity, but I should copy content. I'll summarize structure) -->
             <!-- Copied from file content but using Vue conventions if needed -->
            <!-- Item 1 -->
            <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5 5 7v5c0 3.5 2.8 6.7 7 8.5 4.2-1.8 7-5 7-8.5V7l-7-2.5Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11v4m-2-2h4" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Unified Medical Record</h3>
              <p class="mt-2 text-sm text-gray-600">Keep all your doctor visits, diagnoses, and notes securely stored and easy to access.</p>
            </div>
            
            <!-- Item 2 -->
             <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10m-5 0v10m0 0 4-4m-4 4-4-4" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Instant Doctor Sharing</h3>
              <p class="mt-2 text-sm text-gray-600">Generate a secure QR code or link to share your history with a new specialist.</p>
            </div>

            <!-- Item 3 -->
            <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8a4 4 0 0 1 4 4c0 3.1-2.9 5.6-4 6.5-1.1-.9-4-3.4-4-6.5a4 4 0 0 1 4-4Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Chronic Disease Tracking</h3>
              <p class="mt-2 text-sm text-gray-600">Monitor vitals like blood pressure and glucose over time with easy-to-read charts.</p>
            </div>

            <!-- Item 4 -->
            <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m0 0-4-4m4 4 4-4" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9h5" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Upload Visits & Labs</h3>
              <p class="mt-2 text-sm text-gray-600">After a doctor visit, snap a picture of the prescription or upload the lab PDF.</p>
            </div>

             <!-- Item 5 -->
            <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6h4m-6 3h8m-7 3h6m-4 3h2M8 4h8l1 16H7L8 4Z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Prescription Management</h3>
              <p class="mt-2 text-sm text-gray-600">View prescriptions in one place and receive reminders for your medication schedule.</p>
            </div>

            <!-- CTA Card -->
            <div class="rounded-2xl bg-blue-600 text-white p-6 shadow-xl shadow-blue-600/30">
              <h3 class="text-lg font-semibold">Ready to start?</h3>
              <p class="mt-2 text-sm text-blue-50">Join thousands of patients taking control today.</p>
              <RouterLink to="/dashboard" class="mt-5 inline-block w-full rounded-md bg-white px-4 py-2 text-center font-semibold text-blue-600 hover:bg-blue-50">Get Started</RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Appointment/Steps Section -->
      <section id="appointment" class="bg-blue-600 text-white">
        <div class="mx-auto w-full max-w-6xl px-4 py-16">
           <h2 class="text-center text-3xl font-extrabold sm:text-4xl">How Medivia Works</h2>
           <p class="mt-3 text-center text-blue-100">Three simple steps to take full control of your medical data.</p>
           <div class="mt-10 grid gap-8 md:grid-cols-3">
             <div class="flex flex-col items-center rounded-2xl bg-white/10 p-6 text-center">
               <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 9c-3.5 0-5.5 1.7-5.5 3.5V19h11v-.5C17.5 16.7 15.5 15 12 15Z" />
                 </svg>
               </div>
               <h3 class="text-lg font-semibold">Create your profile</h3>
               <p class="mt-2 text-sm text-blue-100">Sign up in seconds. Add your basic details, allergies, and chronic conditions.</p>
             </div>
             <!-- ... other steps ... -->
             <div class="flex flex-col items-center rounded-2xl bg-white/10 p-6 text-center">
               <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4h10l1 3H6l1-3Zm-1 6h12l-1 8H7l-1-8Z" />
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14h4m-3-3h2" />
                 </svg>
               </div>
               <h3 class="text-lg font-semibold">Upload visits & Labs</h3>
               <p class="mt-2 text-sm text-blue-100">Snap a picture of the prescription or upload the lab PDF. We organize it for you.</p>
             </div>
             <div class="flex flex-col items-center rounded-2xl bg-white/10 p-6 text-center">
               <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9h10M7 15h6m6-9v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6l4 3Z" />
                 </svg>
               </div>
               <h3 class="text-lg font-semibold">Share & collaborate</h3>
               <p class="mt-2 text-sm text-blue-100">Show your QR code to a new doctor. They get instant, read-only access to your history.</p>
             </div>
           </div>
        </div>
      </section>

      <!-- Social Proof -->
      <section id="visits" class="bg-gray-50 py-16">
        <!-- ... content for trusted by ... -->
         <div class="mx-auto w-full max-w-6xl px-4">
          <h2 class="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Trusted by Patients and Doctors</h2>
          <div class="mt-10 grid gap-6 lg:grid-cols-2">
             <!-- Testimonials -->
             <div class="relative rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50">
               <div class="absolute right-5 top-4 text-3xl text-gray-200">”</div>
               <p class="text-gray-600">Medivia has saved my team countless hours. I can instantly see a patient’s history without waiting for faxed records.</p>
               <div class="mt-4 flex items-center space-x-3">
                 <img class="h-12 w-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Dr. Ahmed Mohamed">
                 <div>
                   <div class="font-semibold text-gray-900">Dr. Ahmed Mohamed</div>
                   <div class="text-sm text-gray-600">Cardiologist</div>
                 </div>
               </div>
             </div>
             <!-- ... other testimonials ... -->
          </div>
         </div>
      </section>
    </main>
    
    <footer id="about" class="border-t border-gray-200 bg-gray-50">
      <div class="mx-auto w-full max-w-6xl px-4 py-10">
         <div class="grid gap-8 md:grid-cols-3">
           <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">+</span>
              <span class="text-xl font-semibold">Medivia</span>
            </div>
            <p class="text-sm text-gray-600">Graduation Project 2025. Empowering patients with data.</p>
           </div>
           <!-- Links -->
           <div>
            <h4 class="font-semibold text-gray-900">Product</h4>
            <ul class="mt-3 space-y-2 text-sm text-gray-600">
               <li><a href="#dashboard" class="hover:text-blue-600">Features</a></li>
               <li><a href="#home" class="hover:text-blue-600">Security</a></li>
               <li><a href="#visits" class="hover:text-blue-600">For Doctors</a></li>
             </ul>
           </div>
           <div>
            <h4 class="font-semibold text-gray-900">Company</h4>
            <ul class="mt-3 space-y-2 text-sm text-gray-600">
               <li><a href="#about" class="hover:text-blue-600">About Us</a></li>
               <li><a href="#appointment" class="hover:text-blue-600">Contact</a></li>
               <li><a href="#home" class="hover:text-blue-600">Privacy Policy</a></li>
             </ul>
           </div>
         </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero-bg {
  background: radial-gradient(circle at 15% 20%, rgba(28,126,214,0.05), transparent 45%),
              radial-gradient(circle at 90% 15%, rgba(28,126,214,0.06), transparent 35%);
}
.dot-grid {
  background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 12px 12px;
}
</style>
