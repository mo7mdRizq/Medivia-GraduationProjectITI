<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const isLoading = ref({
  google: false,
  apple: false
})

const mockProfiles = {
  google: {
    name: 'Google User',
    email: 'user@gmail.com',
    providerName: 'Google'
  },
  apple: {
    name: 'Apple User',
    email: 'user@icloud.com',
    providerName: 'Apple'
  }
}

const simulatePopup = (provider) => {
  const width = 500
  const height = 600
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  
  const popup = window.open(
    '', 
    'Social Login', 
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
  )
  
  if (popup) {
    const brandColor = provider === 'google' ? '#dc2626' : '#000000'
    const logoUrl = provider === 'google' 
        ? 'https://www.svgrepo.com/show/475656/google-color.svg' 
        : 'https://www.svgrepo.com/show/511330/apple-173.svg'

    popup.document.write(`
      <html>
        <head>
           <title>Sign in with ${provider}</title>
           <style>
             body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb; }
             .loader { border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid ${brandColor}; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
             @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
             .logo { width: 60px; height: 60px; margin-bottom: 20px; }
             h2 { color: #1f2937; margin: 0 0 10px 0; font-size: 20px; }
             p { color: #6b7280; margin: 0; font-size: 14px; }
           </style>
        </head>
        <body>
           <img src="${logoUrl}" class="logo" />
           <div class="loader"></div>
           <h2>Connecting to ${provider === 'google' ? 'Google' : 'Apple'}</h2>
           <p>Please wait while we verify your credentials...</p>
        </body>
      </html>
    `)
  }
  
  return popup
}

const handleSocialLogin = async (provider) => {
  if (isLoading.value.google || isLoading.value.apple) return

  isLoading.value[provider] = true
  const profile = mockProfiles[provider]
  
  // 1. Open Popup
  const popup = simulatePopup(provider)
  
  // 2. Wait for "Handshake" (Simulated delay)
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  // 3. Close Popup
  if (popup && !popup.closed) {
    popup.close()
  }
  
  // 4. Complete Login
  isLoading.value[provider] = false
  
  toast.success(`Welcome, ${profile.name}`, {
     transition: toast.TRANSITIONS.SLIDE,
     theme: 'colored',
     icon: provider === 'google' ? '🇬' : '' // Using simple chars as icons or could use SVG
  })
  
  // Set Auth State
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userName', profile.name)
  localStorage.setItem('userEmail', profile.email)
  
  setTimeout(() => {
    router.push('/')
  }, 800)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Google Button: White, Shadow, Standard -->
    <button 
       type="button"
       class="flex justify-center items-center w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transform active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
       @click="handleSocialLogin('google')"
       :disabled="isLoading.google || isLoading.apple"
       :class="{ 'opacity-70 cursor-not-allowed': isLoading.google || isLoading.apple }"
    >
      <div v-if="isLoading.google" class="mr-2">
         <svg class="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
      </div>
      <img v-else src="https://www.svgrepo.com/show/475656/google-color.svg" class="h-5 w-5 mr-2" alt="Google">
      <span class="text-gray-700 font-medium text-sm">Google</span>
    </button>

    <!-- Apple Button: Outline Style (Restored) -->
    <button 
       type="button"
       class="flex justify-center items-center w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transform active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
       @click="handleSocialLogin('apple')"
       :disabled="isLoading.google || isLoading.apple"
       :class="{ 'opacity-70 cursor-not-allowed': isLoading.google || isLoading.apple }"
    >
      <div v-if="isLoading.apple" class="mr-2">
        <svg class="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <img v-else src="https://www.svgrepo.com/show/511330/apple-173.svg" class="h-5 w-5 mr-2" alt="Apple">
      <span class="text-gray-700 font-medium text-sm">Apple</span>
    </button>
  </div>
</template>
