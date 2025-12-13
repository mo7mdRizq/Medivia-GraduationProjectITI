<script setup></script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-3xl font-bold text-blue-600 mb-4">Hello Tailwind!</h1>
      <p class="text-gray-700 mb-6">
        This is a test component to verify that Tailwind CSS v4 is working correctly in your Vue + Vite project.
      </p>
      <div class="space-y-4">
        <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Primary Button
        </button>
        <button class="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded transition duration-200">
          Secondary Button
        </button>
      </div>
      <div class="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        Built with Vue 3 + Tailwind CSS v4
      </div>
    </div>
  </div>
</template>

<style scoped></style>
