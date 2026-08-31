<!-- components/betting/bookingcode/BookingCodeModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/10 backdrop-blur-sm" @click="handleClose"></div>
      
      <!-- Modal -->
      <div class="relative bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M8 12h8"/>
            </svg>
            <h3 class="text-lg font-bold text-gray-900">Booking Code</h3>
          </div>
          <button 
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all"
            @click="handleClose"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Show selections count -->
        <!-- <div class="bg-gray-50 rounded-xl p-3 mb-4 flex items-center justify-between">
          <span class="text-gray-500 text-sm">Selections in slip</span>
          <span class="text-gray-900 font-bold">{{ selectionsCount }}</span>
        </div> -->

        <!-- ============ CREATE CODE ============ -->
        <div class="space-y-4">
          <p class="text-sm text-gray-500">
            Create a booking code from your current bet slip selections
          </p>

          <!-- Created Code Display - Show when code exists -->
          <div v-if="createdCode" class="bg-gray-50 rounded-xl p-4 space-y-3 border border-rose-500/20">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 text-xs">Your Code</span>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-rose-500 text-2xl tracking-wider">{{ createdCode }}</span>
                <button 
                  class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  @click="handleCopyCode"
                  title="Copy code"
                >
                  <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

            <!-- Share with internal share UI -->
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

          <!-- Social share buttons - Show only when code exists -->
          <div v-if="createdCode" class="pt-1">
            <div class="flex items-center justify-center gap-3">
              <!-- WhatsApp -->
              <button
                class="w-11 h-11 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-105 transition-transform"
                :title="`Share ${createdCode} on WhatsApp`"
                @click="shareWhatsApp"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>

              <!-- Facebook -->
              <button
                class="w-11 h-11 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-105 transition-transform"
                :title="`Share ${createdCode} on Facebook`"
                @click="shareFacebook"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.91h-2.32V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg>
              </button>

              <!-- Instagram (copies link - no web share intent) -->
              <button
                class="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:scale-105 transition-transform"
                :title="`Copy ${createdCode} link for Instagram`"
                @click="shareInstagram"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" stroke="none"/></svg>
              </button>

              <!-- Copy link -->
              <button
                class="w-11 h-11 rounded-full flex items-center justify-center bg-gray-500 text-white hover:scale-105 transition-transform"
                :title="`Copy ${createdCode} link`"
                @click="handleCopyLink"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
            </div>
            <p class="text-center text-[10px] text-gray-500 mt-2">
              Share link: <span class="text-rose-400">{{ shareLink }}</span>
            </p>
          </div>

          <!-- Error message -->
          <div v-if="createError" class="bg-red-500/10 border border-red-500/20 rounded-xl p-2">
            <p class="text-xs text-red-400 text-center">{{ createError }}</p>
          </div>

          <!-- Success message with info -->
          <div v-if="createdCode" class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <p class="text-xs text-emerald-600 text-center">
              ✅ Share this code with friends so they can load your selections!
            </p>
          </div>
        </div>

        <!-- Footer info -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-[10px] text-gray-500 text-center">
            ⏱️ This Booking codes must be used before it Expires
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useBookingCodeStore } from '../../../stores/bookingCode/useBookingCodeStore.js'
import { useBetStore } from '../../../stores/bet/betStore.js'
import * as shareUtil from '../../../utils/share.js'

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

const shareLink = computed(() => {
  if (!createdCode.value) return ''
  return `${shareUtil.getShareOrigin()}/booking/${createdCode.value}`
})

const buildShareText = () => {
  return `🎟️ Bet with my booking code ${createdCode.value} on SunBet!`
}

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
  
  const url = shareLink.value
  
  if (navigator.share) {
    navigator.share({
      title: 'Booking Code',
      text: buildShareText(),
      url: url
    }).catch(() => {})
  } else {
    copyText(url, '✅ Link copied to clipboard!')
  }
}

// ---- Social Share Methods ----
const shareWhatsApp = () => {
  const url = shareLink.value
  if (!url) return
  shareUtil.shareWhatsApp(`${buildShareText()}\n\n${url}`)
}

const shareFacebook = () => {
  const url = shareLink.value
  if (!url) return
  shareUtil.shareFacebook(url)
}

const shareInstagram = () => {
  // Instagram haina web share-intent; tunakili link na hivyo mtumiaji abande kwenye IG
  copyText(shareLink.value, '📋 Link copied! Paste it in your Instagram')
}

const handleCopyLink = () => {
  copyText(shareLink.value, '✅ Link copied to clipboard!')
}

const copyText = async (text, message) => {
  await shareUtil.copyToClipboard(text)
  toast.success(message, { position: 'bottom-right', timeout: 3000 })
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
  background: #d1d5db;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #A32D2D;
}
</style>