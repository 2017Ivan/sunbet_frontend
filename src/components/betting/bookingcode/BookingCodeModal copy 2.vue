<!-- components/betting/bookingcode/BookingCodeModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="handleClose"></div>
      
      <!-- Modal -->
      <div class="relative bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[#A32D2D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M8 12h8"/>
            </svg>
            <h3 class="text-lg font-bold text-white">Booking Code</h3>
          </div>
          <button 
            class="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#606060] hover:text-white hover:bg-[#3A3A3A] transition-all"
            @click="handleClose"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Show selections count -->
        <div class="bg-[#2A2A2A] rounded-xl p-3 mb-4 flex items-center justify-between">
          <span class="text-[#606060] text-sm">Selections in slip</span>
          <span class="text-white font-bold">{{ selectionsCount }}</span>
        </div>

        <!-- ============ CREATE CODE ============ -->
        <div class="space-y-4">
          <p class="text-sm text-[#A0A0A0]">
            Create a booking code from your current bet slip selections
          </p>

          <!-- Created Code Display -->
          <div v-if="createdCode" class="bg-[#2A2A2A] rounded-xl p-4 space-y-3 border border-[#A32D2D]/20">
            <div class="flex items-center justify-between">
              <span class="text-[#606060] text-xs">Your Code</span>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-[#A32D2D] text-2xl tracking-wider">{{ createdCode }}</span>
                <button 
                  class="p-1.5 rounded-lg bg-[#3A3A3A] hover:bg-[#4A4A4A] transition-colors"
                  @click="handleCopyCode"
                  title="Copy code"
                >
                  <svg class="w-4 h-4 text-[#A0A0A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke-linejoin="round"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#606060] text-xs">Expires in</span>
              <span class="text-white text-sm font-semibold">{{ expiryTime || '5 hours' }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button 
              v-if="!createdCode"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#A32D2D] text-white hover:bg-[#8B2424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isCreating || selectionsCount === 0"
              @click="handleCreateCode"
            >
              <span v-if="isCreating" class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Creating...
              </span>
              <span v-else>Create Code</span>
            </button>
            <button 
              v-else
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#22C55E] text-white hover:bg-[#16A34A] transition-colors"
              @click="handleShareCode"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share Code
              </span>
            </button>
          </div>
<!-- 
          <button 
            v-if="createdCode"
            class="w-full py-2 rounded-xl text-sm font-medium border border-[#2A2A2A] text-[#606060] hover:text-white hover:border-[#3A3A3A] transition-colors"
            @click="handleClearCreatedCode"
          >
            Clear Code
          </button> -->

          <!-- Error message -->
          <div v-if="createError" class="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-2">
            <p class="text-xs text-[#EF4444] text-center">{{ createError }}</p>
          </div>
        </div>

        <!-- Footer info -->
        <div class="mt-4 pt-4 border-t border-[#2A2A2A]">
          <p class="text-[10px] text-[#606060] text-center">
            ⏱️ Booking codes expire after 5 hours
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useBookingCodeStore } from '../../../stores/bookingcode/bookingCodeStore.js'
import { useBetStore } from '../../../stores/bets/betStore.js'

// ---- Props ----
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// ---- Emits ----
const emit = defineEmits(['close', 'code-created', 'code-loaded'])

// ---- Stores ----
const toast = useToast()
const bookingCodeStore = useBookingCodeStore()
const betStore = useBetStore()

// ---- State ----
const isCreating = ref(false)
const createdCode = ref(null)
const codeExpiry = ref(null)
const createError = ref('')

// ---- Computed ----
const selectionsCount = computed(() => betStore.slip.length)

const expiryTime = computed(() => {
  if (!codeExpiry.value) return null
  const now = new Date()
  const expiry = new Date(codeExpiry.value)
  const diff = expiry - now
  if (diff <= 0) return 'Expired'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
})

// ---- Methods ----
const handleClose = () => {
  emit('close')
  resetState()
}

const resetState = () => {
  createdCode.value = null
  codeExpiry.value = null
  createError.value = ''
  isCreating.value = false
}

const handleCreateCode = async () => {
  if (selectionsCount.value === 0) {
    createError.value = 'No selections in bet slip'
    toast.warning('No selections to create a booking code', {
      position: 'bottom-right',
      timeout: 3000
    })
    return
  }

  isCreating.value = true
  createError.value = ''

  try {
    const result = await bookingCodeStore.createBookingCodeFromSlip()
    if (result.success) {
      createdCode.value = result.data.bookingCode
      codeExpiry.value = result.data.expiresAt
      toast.success(`✅ Booking code created: ${result.data.bookingCode}`, {
        position: 'bottom-right',
        timeout: 5000
      })
      emit('code-created', result.data)
    } else {
      createError.value = result.error || 'Failed to create code'
      toast.error(createError.value, {
        position: 'bottom-right',
        timeout: 3000
      })
    }
  } catch (error) {
    createError.value = 'An error occurred while creating code'
    toast.error(createError.value, {
      position: 'bottom-right',
      timeout: 3000
    })
    console.error('Create code error:', error)
  } finally {
    isCreating.value = false
  }
}

const handleCopyCode = async () => {
  if (!createdCode.value) return
  const result = await bookingCodeStore.copyBookingCode(createdCode.value)
  if (result.success) {
    toast.success('📋 Code copied to clipboard!', {
      position: 'bottom-right',
      timeout: 2000
    })
  } else {
    toast.error('❌ Failed to copy code', {
      position: 'bottom-right',
      timeout: 2000
    })
  }
}

const handleShareCode = () => {
  if (!createdCode.value) return
  const url = `${window.location.origin}/booking/${createdCode.value}`
  
  if (navigator.share) {
    navigator.share({
      title: 'Booking Code',
      text: `Use this booking code: ${createdCode.value}`,
      url: url
    }).catch(() => {})
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      toast.success('✅ Link copied to clipboard!', {
        position: 'bottom-right',
        timeout: 3000
      })
    }).catch(() => {
      // Manual copy
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('✅ Link copied to clipboard!', {
        position: 'bottom-right',
        timeout: 3000
      })
    })
  }
}

const handleClearCreatedCode = () => {
  createdCode.value = null
  codeExpiry.value = null
  bookingCodeStore.clearBookingCode()
  toast.info('Code cleared', {
    position: 'bottom-right',
    timeout: 2000
  })
}

// ---- Watchers ----
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetState()
    bookingCodeStore.clearBookingCode()
  }
})

// ---- Expose ----
defineExpose({
  resetState
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #2A2A2A;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #A32D2D;
}
</style>