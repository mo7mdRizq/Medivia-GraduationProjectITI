<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String,
  icon: [Object, Function]
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="mb-5">
    <label v-if="label" class="block text-sm font-semibold text-gray-800 mb-2">{{ label }}</label>
    <div class="relative">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <component :is="icon" class="h-5 w-5" />
      </div>
      <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        class="block w-full rounded-lg border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 sm:text-sm py-3"
        :class="[
          icon ? 'pl-11' : 'pl-4',
          error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-200 text-gray-900 placeholder-gray-400'
        ]"
      />
      <!-- Append slot -->
      <div v-if="$slots.append" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <slot name="append"></slot>
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
      <!-- Error icon could go here -->
      {{ error }}
    </p>
  </div>
</template>
