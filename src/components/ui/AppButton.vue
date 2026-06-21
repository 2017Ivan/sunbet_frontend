<template>
    <component
      :is="tag"
      :to="to"
      :href="href"
      :disabled="disabled || loading"
      :class="classes"
      v-bind="$attrs"
      @click="$emit('click', $event)"
    >
      <span v-if="loading" class="flex items-center gap-2">
        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span>{{ loadingText || 'Loading...' }}</span>
      </span>
  
      <span v-else class="flex items-center gap-2 justify-center">
        <slot name="icon-left" />
        <slot />
        <slot name="icon-right" />
      </span>
    </component>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      // primary | secondary | outline | ghost | danger | silver
    },
    size: {
      type: String,
      default: 'md',
      // sm | md | lg | xl
    },
    tag: { type: String, default: 'button' },
    to: { type: [String, Object], default: null },
    href: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: '' },
    fullWidth: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
  })
  
  defineEmits(['click'])
  
  const classes = computed(() => {
    const base = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D0D0D]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      props.fullWidth ? 'w-full' : '',
      props.rounded ? 'rounded-full' : 'rounded-[10px]',
    ]
  
    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-2',
    }
  
    const variants = {
      primary: [
        'bg-[#A32D2D] hover:bg-[#7A1F1F] active:bg-[#6A1A1A]',
        'text-white shadow-[0_4px_20px_rgba(163,45,45,0.35)]',
        'focus:ring-[#A32D2D]',
      ],
      secondary: [
        'bg-[#1E1E1E] hover:bg-[#2A2A2A] active:bg-[#333]',
        'text-[#F0F0F0] border border-[#2A2A2A]',
        'focus:ring-[#333]',
      ],
      outline: [
        'bg-transparent hover:bg-[#A32D2D]/10 active:bg-[#A32D2D]/20',
        'text-[#A32D2D] border border-[#A32D2D]',
        'focus:ring-[#A32D2D]',
      ],
      ghost: [
        'bg-transparent hover:bg-[#2A2A2A] active:bg-[#333]',
        'text-[#A0A0A0] hover:text-[#F0F0F0]',
        'focus:ring-[#333]',
      ],
      danger: [
        'bg-[#EF4444] hover:bg-[#DC2626] active:bg-[#B91C1C]',
        'text-white focus:ring-[#EF4444]',
      ],
      silver: [
        'bg-[#C0C0C0] hover:bg-[#E8E8E8] active:bg-[#A0A0A0]',
        'text-[#0D0D0D] font-semibold focus:ring-[#C0C0C0]',
      ],
    }
  
    return [
      ...base,
      sizes[props.size] || sizes.md,
      ...(variants[props.variant] || variants.primary),
    ]
  })
  </script>