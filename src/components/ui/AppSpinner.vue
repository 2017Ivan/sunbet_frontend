<template>
    <div :class="['flex items-center justify-center', fullScreen ? 'fixed inset-0 bg-[#0D0D0D]/80 z-50' : '']">
      <div class="flex flex-col items-center gap-3">
        <svg
          :class="['animate-spin text-[#A32D2D]', sizes[size]]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
          <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        <p v-if="text" class="text-xs text-[#606060]">{{ text }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    size: {
      type: String,
      default: 'md', // sm | md | lg | xl
    },
    text:       { type: String, default: '' },
    fullScreen: { type: Boolean, default: false },
  })
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }
  </script>