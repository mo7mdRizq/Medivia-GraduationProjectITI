<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  title: String,
  subtitle: String,
  badgeText: String,
  badgeColor: {
    type: String, // Text/Icon color class
    default: 'text-green-400'
  },
  badgeBg: {
    type: String, // Dot background color class (if using dot)
    default: 'bg-green-400'
  },
  badgeIcon: Object, // Component for the badge icon
  tipTitle: String,
  tipText: String,
  hideLogo: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="min-h-screen w-full flex font-sans">
    <!-- Left Side -->
    <div class="hidden lg:flex lg:w-1/2 bg-brand-600 relative flex-col justify-between p-12 lg:p-16 text-white overflow-hidden">
      
      <!-- Background Pattern/Gradient could go here -->
      
      <div>
        <!-- Badge -->
        <div v-if="badgeText" class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 w-fit mb-12 shadow-sm">
           <!-- Dynamic Icon or Dot -->
           <component v-if="badgeIcon" :is="badgeIcon" :class="['w-4 h-4', badgeColor]" />
           <div v-else :class="['w-2.5 h-2.5 rounded-full', badgeBg]"></div>
           
           <span class="text-sm font-medium tracking-wide text-white/90">{{ badgeText }}</span>
        </div>

        <!-- Heading -->
        <div class="relative z-10">
          <h1 class="text-5xl font-bold leading-tight tracking-tight text-white">
            {{ title }}
          </h1>
          <h1 class="text-5xl font-bold leading-tight tracking-tight text-cyan-400">
            {{ subtitle }}
          </h1>
          
          <p class="mt-8 text-blue-100 text-lg leading-relaxed max-w-lg opacity-90">
            <slot name="description"></slot>
          </p>
        </div>
      </div>

      <!-- Tip Card -->
      <div v-if="tipTitle" class="mt-auto mb-16 relative z-10">
        <div class="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 max-w-md shadow-xl">
          <div class="flex items-start gap-4">
            <div class="p-2.5 bg-white/20 rounded-xl shrink-0 flex items-center justify-center">
               <!-- Lightning Icon -->
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg text-white tracking-wide">{{ tipTitle }}</h3>
              <p class="text-blue-50/90 text-[15px] leading-relaxed mt-1 font-light tracking-wide">"{{ tipText }}"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="absolute bottom-8 left-12 right-12 flex justify-between items-end text-sm text-blue-200/70 font-medium">
        <span>@2025 Medivia</span>
        <div class="flex gap-8">
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </div>

    <!-- Right Side -->
    <div class="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 sm:p-12 relative">
      <div class="w-full max-w-[420px]">
        <!-- Logo -->
        <div v-if="!hideLogo" class="mb-10 flex items-center gap-3">
          <RouterLink to="/" class="cursor-pointer">
            <img src="/logo.png" alt="Medivia Logo" class="h-10 w-auto hover:opacity-80 transition-opacity" />
          </RouterLink>
        </div>

        <slot></slot>
      </div>
    </div>
  </div>
</template>
