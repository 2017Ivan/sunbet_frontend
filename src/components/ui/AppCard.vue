<template>
    <div :class="classes" v-bind="$attrs">
      <!-- Header -->
      <div v-if="$slots.header || title" class="flex items-center justify-between mb-4">
        <div>
          <h3 v-if="title" class="text-sm font-semibold text-[#F0F0F0]">{{ title }}</h3>
          <p v-if="subtitle" class="text-xs text-[#A0A0A0] mt-0.5">{{ subtitle }}</p>
        </div>
        <slot name="header" />
      </div>
  
      <!-- Body -->
      <slot />
  
      <!-- Footer -->
      <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-[#2A2A2A]">
        <slot name="footer" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    variant: {
      type: String,
      default: 'default',
      // default | elevated | glass | bordered | flat
    },
    padding: {
      type: String,
      default: 'md', // none | sm | md | lg
    },
    hoverable: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
  })
  
  const paddings = {
    none: 'p-0',
    sm:   'p-3',
    md:   'p-4',
    lg:   'p-6',
  }
  
  const variants = {
    default:  'bg-[#242424] border border-[#2A2A2A]',
    elevated: 'bg-[#1E1E1E] shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
    glass:    'bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]',
    bordered: 'bg-[#161616] border border-[#333]',
    flat:     'bg-[#161616]',
  }
  
  const classes = computed(() => [
    'rounded-[14px] transition-all duration-200',
    variants[props.variant] || variants.default,
    paddings[props.padding] || paddings.md,
    props.hoverable ? 'hover:border-[#A32D2D]/50 hover:shadow-[0_4px_20px_rgba(163,45,45,0.15)]' : '',
    props.clickable ? 'cursor-pointer active:scale-[0.99]' : '',
  ])
  </script>