<script setup>
</script>

<template>
  <footer class="bg-white border-t border-gray-100 mt-auto">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Logo Column -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="Medivia" class="h-10 w-auto" />
         </div>
         <p class="text-slate-500 text-sm leading-relaxed mb-6">
           Graduation Project 2025.<br>
           Empowering patients with data.
         </p>
        </div>

        <!-- Spacer Column (optional, to match spacing) -->
        <div class="hidden lg:block"></div>

        <!-- Use grid-cols-2 for links to be side-by-side on desktop -->
        <div class="lg:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h3 class="text-xs font-bold text-gray-900 tracking-widest uppercase mb-6">Product</h3>
              <ul class="space-y-4">
                  <li><a href="#" class="text-sm text-slate-500 hover:text-brand-600 transition-colors">Features</a></li>
                  <li><a href="#" class="text-sm text-slate-500 hover:text-brand-600 transition-colors">Security</a></li>
                  <li><a href="#" class="text-sm text-slate-500 hover:text-brand-600 transition-colors">For Doctors</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-xs font-bold text-gray-900 tracking-widest uppercase mb-6">Company</h3>
              <ul class="space-y-4">
                  <li><a href="#" class="text-sm text-slate-500 hover:text-brand-600 transition-colors">About Us</a></li>
                  <li><a href="#" class="text-sm text-slate-500 hover:text-brand-600 transition-colors">Contact</a></li>
                  <li><a href="#" class="text-sm text-slate-500 hover:text-brand-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center">
        <p class="text-sm text-slate-400">
            &copy; 2025 Medivia. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
