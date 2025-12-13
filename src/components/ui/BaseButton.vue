<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'outline'].includes(value)
  },
  block: Boolean
})
</script>

<template>
  <button 
    :class="[
      'inline-flex justify-center items-center px-4 py-3 border text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200',
      block ? 'w-full' : '',
      variant === 'primary' 
        ? 'border-transparent text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:ring-brand-500' 
        : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-200',
    ]"
  >
    <slot></slot>
  </button>
</template>
