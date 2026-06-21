<template>
    <span :class="classes">
      <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotColor" />
      <slot />
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'default',
      // default | primary | success | warning | danger | live | silver | ghost
    },
    size: {
      type: String,
      default: 'md', // sm | md | lg
    },
    dot: { type: Boolean, default: false },
    rounded: { type: Boolean, default: false },
  })
  
  const variants = {
    default:  'bg-[#2A2A2A] text-[#A0A0A0]',
    primary:  'bg-[#A32D2D]/20 text-[#C94040] border border-[#A32D2D]/30',
    success:  'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25',
    warning:  'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25',
    danger:   'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/25',
    live:     'bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B]/30 animate-pulse',
    silver:   'bg-[#C0C0C0]/15 text-[#C0C0C0] border border-[#C0C0C0]/25',
    ghost:    'bg-transparent text-[#A0A0A0] border border-[#2A2A2A]',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }
  
  const dotColors = {
    default: 'bg-[#A0A0A0]',
    primary: 'bg-[#A32D2D]',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    danger:  'bg-[#EF4444]',
    live:    'bg-[#FF3B3B]',
    silver:  'bg-[#C0C0C0]',
    ghost:   'bg-[#606060]',
  }
  
  const classes = computed(() => [
    'inline-flex items-center font-medium',
    props.rounded ? 'rounded-full' : 'rounded-[6px]',
    variants[props.variant] || variants.default,
    sizes[props.size] || sizes.md,
  ])
  
  const dotColor = computed(() => dotColors[props.variant] || dotColors.default)
  </script>