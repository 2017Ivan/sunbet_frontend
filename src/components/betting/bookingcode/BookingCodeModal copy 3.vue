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
            <svg class="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

          <!-- Created Code Display - Show when code exists -->
          <div v-if="createdCode" class="bg-[#2A2A2A] rounded-xl p-4 space-y-3 border border-rose-500/20">
            <div class="flex items-center justify-between">
              <span class="text-[#606060] text-xs">Your Code</span>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-rose-500 text-2xl tracking-wider">{{ createdCode }}</span>
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
           
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <!-- Show CREATE button ONLY when no code exists yet -->
            <button 
              v-if="!createdCode"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isCreating || selectionsCount === 0"
              @click="handleCreateCode"
            >
              <span v-if="isCreating" class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Creating...
              </span>
              <span v-else>Create Booking Code</span>
            </button>

            <!-- Share button - Show ONLY when code exists -->
            <button 
              v-if="createdCode"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
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

          <!-- Error message -->
          <div v-if="createError" class="bg-red-500/10 border border-red-500/20 rounded-xl p-2">
            <p class="text-xs text-red-400 text-center">{{ createError }}</p>
          </div>

          <!-- Success message with info -->
          <div v-if="createdCode" class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <p class="text-xs text-emerald-400 text-center">
              ✅ Share this code with friends so they can load your selections!
            </p>
          </div>
        </div>

        <!-- Footer info -->
        <div class="mt-4 pt-4 border-t border-[#2A2A2A]">
          <p class="text-[10px] text-[#606060] text-center">
            ⏱️ This booking code must be used before it expires
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
const hasAttemptedCreate = ref(false)

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
  // Reset state when closing
  resetState()
}

const resetState = () => {
  createdCode.value = null
  codeExpiry.value = null
  createError.value = ''
  isCreating.value = false
  hasAttemptedCreate.value = false
  bookingCodeStore.clearBookingCode()
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
  hasAttemptedCreate.value = true

  try {
    const result = await bookingCodeStore.createBookingCodeFromSlip()
    
    if (result.success) {
      // Extract code from response - handle both formats
      const code = result.data?.bookingCode?.code || result.data?.bookingCode
      const expiry = result.data?.bookingCode?.expiresAt || result.data?.expiresAt
      
      createdCode.value = code
      codeExpiry.value = expiry
      
      toast.success(`✅ Booking code created: ${code}`, {
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
  
  try {
    await navigator.clipboard.writeText(createdCode.value)
    toast.success('📋 Code copied to clipboard!', {
      position: 'bottom-right',
      timeout: 2000
    })
  } catch {
    // Fallback
    const textArea = document.createElement('textarea')
    textArea.value = createdCode.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    toast.success('📋 Code copied to clipboard!', {
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
    navigator.clipboard.writeText(url).then(() => {
      toast.success('✅ Link copied to clipboard!', {
        position: 'bottom-right',
        timeout: 3000
      })
    }).catch(() => {
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

// ---- Watchers ----
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetState()
    // Auto-create code when modal opens if there are selections
    if (selectionsCount.value > 0) {
      handleCreateCode()
    }
  }
})

// ---- Expose ----
defineExpose({
  resetState,
  handleCreateCode
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