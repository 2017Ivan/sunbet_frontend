<template>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          @click.self="closeOnBackdrop && close()"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />
  
          <!-- Modal -->
          <div :class="modalClasses">
            <!-- Handle bar (mobile) -->
            <div class="flex justify-center pt-3 pb-1 sm:hidden">
              <div class="w-10 h-1 rounded-full bg-[#333]" />
            </div>
  
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-center justify-between px-5 pt-4 pb-0">
              <div>
                <h2 class="text-base font-semibold text-[#F0F0F0]">{{ title }}</h2>
                <p v-if="subtitle" class="text-xs text-[#A0A0A0] mt-0.5">{{ subtitle }}</p>
              </div>
              <slot name="header" />
              <button
                v-if="showClose"
                class="w-8 h-8 rounded-full bg-[#2A2A2A] hover:bg-[#333] flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors ml-4"
                @click="close"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
  
            <!-- Body -->
            <div class="px-5 py-4">
              <slot />
            </div>
  
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-5 pb-5 pt-0 flex gap-3">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    modelValue:      { type: Boolean, default: false },
    title:           { type: String, default: '' },
    subtitle:        { type: String, default: '' },
    size: {
      type: String,
      default: 'md', // sm | md | lg | xl | full
    },
    showClose:       { type: Boolean, default: true },
    closeOnBackdrop: { type: Boolean, default: true },
  })
  
  const emit = defineEmits(['update:modelValue', 'close'])
  
  const close = () => {
    emit('update:modelValue', false)
    emit('close')
  }
  
  const sizes = {
    sm:   'sm:max-w-sm',
    md:   'sm:max-w-md',
    lg:   'sm:max-w-lg',
    xl:   'sm:max-w-2xl',
    full: 'sm:max-w-4xl',
  }
  
  const modalClasses = computed(() => [
    'relative w-full z-10',
    'bg-[#161616] border-t border-[#2A2A2A] sm:border rounded-t-[20px] sm:rounded-[20px]',
    'shadow-[0_-8px_40px_rgba(0,0,0,0.6)] sm:shadow-[0_8px_40px_rgba(0,0,0,0.6)]',
    sizes[props.size] || sizes.md,
  ])
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.25s ease;
  }
  .modal-enter-active .relative,
  .modal-leave-active .relative {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .modal-enter-from { opacity: 0; }
  .modal-leave-to   { opacity: 0; }
  .modal-enter-from .relative { transform: translateY(40px); }
  .modal-leave-to   .relative { transform: translateY(40px); }
  </style>