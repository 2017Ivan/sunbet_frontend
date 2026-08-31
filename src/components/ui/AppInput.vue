<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="inputId" class="text-xs font-medium text-gray-500 tracking-wide">
      {{ label }}
      <span v-if="required" class="text-[#A32D2D] ml-0.5">*</span>
    </label>

    <div class="relative flex items-center">
      <!-- Phone country code prefix -->
      <div v-if="phone" class="absolute left-3 flex items-center gap-1.5 pointer-events-none select-none">
        <svg class="w-[22px] h-[15px] rounded-[2px]" viewBox="0 0 30 20">
          <polygon points="0,0 30,0 0,20" fill="#1EB53A"/>
          <polygon points="30,0 30,20 0,20" fill="#00A3DD"/>
          <g transform="rotate(-33.69 15 10)">
            <rect x="-8" y="6.8" width="46" height="1.2" fill="#FCD116"/>
            <rect x="-8" y="8" width="46" height="4" fill="#000000"/>
            <rect x="-8" y="12" width="46" height="1.2" fill="#FCD116"/>
          </g>
        </svg>
        <span class="text-sm font-semibold text-gray-500">+255</span>
      </div>

      <!-- Left icon -->
      <div v-else-if="$slots['icon-left']" class="absolute left-3 text-gray-500 flex items-center pointer-events-none">
        <slot name="icon-left" />
      </div>

      <input
        :id="inputId"
        v-bind="$attrs"
        :type="currentType"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="handleInput"
        @focus="focused = true"
        @blur="focused = false"
      />

      <!-- Right slot -->
      <div class="absolute right-3 flex items-center gap-2">
        <button
          v-if="type === 'password'"
          type="button"
          class="text-gray-500 hover:text-gray-500 transition-colors"
          @click="showPassword = !showPassword"
        >
          <svg v-if="showPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <slot name="icon-right" />
      </div>
    </div>

    <p v-if="error" class="text-xs text-[#EF4444] flex items-center gap-1">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label:      { type: String, default: '' },
  placeholder:{ type: String, default: '' },
  type:       { type: String, default: 'text' },
  hint:       { type: String, default: '' },
  error:      { type: String, default: '' },
  disabled:   { type: Boolean, default: false },
  readonly:   { type: Boolean, default: false },
  required:   { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
  },
  // New prop: phone input mode
  phone: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const inputId = useId()
const focused = ref(false)
const showPassword = ref(false)

const currentType = computed(() =>
  props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type
)

const sizes = {
  sm: 'h-8 text-xs px-3',
  md: 'h-11 text-sm px-4',
  lg: 'h-13 text-base px-4',
}

// ─── INPUT CLASSES ────────────────────────────────────────────────────────
const inputClasses = computed(() => {
  let classes = [
    'w-full rounded-[10px]  bg-gray-100 border transition-all duration-200',
    'text-gray-900 placeholder:text-gray-400',
    'focus:outline-none',
    sizes[props.size] || sizes.md,
    props.error
      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/30'
      : 'border-gray-200 focus:border-[#A32D2D] focus:ring-1 focus:ring-[#A32D2D]/30',
    props.disabled ? 'opacity-50 cursor-not-allowed' : '',
  ]

  // Add padding for left icon
  if (props.phone) {
    classes.push('pl-[96px]')
  } else if (props.$slots?.['icon-left']) {
    classes.push('pl-10')
  } else {
    classes.push('pl-4')
  }

  // Add padding for right icon or password toggle
  if (props.type === 'password' || props.$slots?.['icon-right']) {
    classes.push('pr-10')
  } else {
    classes.push('pr-4')
  }

  return classes.join(' ')
})

// ─── PHONE NUMBER HANDLING ──────────────────────────────────────────────
const displayValue = computed(() => {
  if (!props.phone) return props.modelValue
  
  // If modelValue is number, convert to string
  let value = String(props.modelValue || '')
  
  // Remove all non-digit characters
  value = value.replace(/\D/g, '')
  
  // If it starts with 255, remove it
  if (value.startsWith('255')) {
    value = value.substring(3)
  }
  
  // If it starts with 0, remove it
  if (value.startsWith('0')) {
    value = value.substring(1)
  }
  
  // Limit to 9 digits
  if (value.length > 9) {
    value = value.substring(0, 9)
  }
  
  return value
})

const handleInput = (event) => {
  let value = event.target.value
  
  if (props.phone) {
    // Remove all non-digit characters
    value = value.replace(/\D/g, '')
    
    // If it starts with 255, remove it
    if (value.startsWith('255')) {
      value = value.substring(3)
    }
    
    // If it starts with 0, remove it
    if (value.startsWith('0')) {
      value = value.substring(1)
    }
    
    // Limit to 9 digits
    if (value.length > 9) {
      value = value.substring(0, 9)
    }
  }
  
  emit('update:modelValue', value)
}
</script>