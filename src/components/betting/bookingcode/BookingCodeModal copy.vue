<!-- components/betting/BookingCodeModal.vue -->
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

        <!-- Tabs -->
        <div class="flex gap-1 p-1 bg-[#2A2A2A] rounded-xl mb-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
            :class="activeTab === tab.id 
              ? 'bg-[#A32D2D] text-white' 
              : 'text-[#606060] hover:text-[#A0A0A0]'"
            @click="activeTab = tab.id"
          >
            <span class="mr-1.5">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- ============ CREATE TAB ============ -->
        <div v-if="activeTab === 'create'" class="space-y-4">
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
            <div class="flex items-center justify-between">
              <span class="text-[#606060] text-xs">Selections</span>
              <span class="text-white text-sm">{{ selectionsCount }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button 
              v-if="!createdCode"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#A32D2D] text-white hover:bg-[#8B2424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading || selectionsCount === 0"
              @click="handleCreateCode"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
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

          <button 
            v-if="createdCode"
            class="w-full py-2 rounded-xl text-sm font-medium border border-[#2A2A2A] text-[#606060] hover:text-white hover:border-[#3A3A3A] transition-colors"
            @click="handleClearCreatedCode"
          >
            Clear Code
          </button>
        </div>

        <!-- ============ LOAD TAB ============ -->
        <div v-else class="space-y-4">
          <p class="text-sm text-[#A0A0A0]">Enter a booking code to load selections</p>

          <!-- Input -->
          <div class="flex gap-2">
            <input
              v-model="loadCodeInput"
              type="text"
              placeholder="e.g. ABC123"
              maxlength="6"
              class="flex-1 h-10 px-3 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] focus:border-[#A32D2D] text-white text-sm uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30 transition-all"
              @input="handleCodeInput"
              @keyup.enter="handleLoadCode"
            />
            <button
              class="px-4 py-2 rounded-xl text-sm font-bold bg-[#A32D2D] text-white hover:bg-[#8B2424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              :disabled="!isValidCode || isLoading"
              @click="handleLoadCode"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Loading...
              </span>
              <span v-else>Load</span>
            </button>
          </div>

          <!-- Quick paste button -->
          <button
            class="text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors"
            @click="handlePasteFromClipboard"
          >
            📋 Paste from clipboard
          </button>

          <!-- Error message -->
          <div v-if="loadError" class="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-3">
            <p class="text-xs text-[#EF4444]">{{ loadError }}</p>
          </div>

          <!-- Loaded selections preview -->
          <div v-if="loadedSelections.length > 0" class="space-y-2">
            <div class="bg-[#2A2A2A] rounded-xl p-3 space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-xs text-[#A0A0A0] font-semibold">Selections ({{ loadedSelections.length }})</p>
                <span class="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">Loaded</span>
              </div>
              <div 
                v-for="(sel, idx) in loadedSelections.slice(0, 3)" 
                :key="idx" 
                class="text-xs text-white border-b border-[#3A3A3A] pb-2 last:border-0 last:pb-0"
              >
                <div class="font-medium truncate">{{ sel.matchName || sel.match || 'Match' }}</div>
                <div class="flex items-center justify-between mt-0.5">
                  <span class="text-[#A0A0A0]">{{ sel.selection }}</span>
                  <span class="text-[#A32D2D] font-bold">{{ parseFloat(sel.odds).toFixed(2) }}</span>
                </div>
              </div>
              <p v-if="loadedSelections.length > 3" class="text-xs text-[#606060]">+{{ loadedSelections.length - 3 }} more</p>
            </div>

            <!-- Apply button -->
            <button
              class="w-full py-2.5 rounded-xl text-sm font-bold bg-[#22C55E] text-white hover:bg-[#16A34A] transition-colors"
              @click="handleApplyCode"
            >
              ✅ Add to Bet Slip ({{ loadedSelections.length }} selections)
            </button>
          </div>

          <!-- Code info when loaded -->
          <div v-if="codeStatus" class="bg-[#2A2A2A] rounded-xl p-3 space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-[#606060]">Status</span>
              <span :class="codeStatus.isActive ? 'text-[#22C55E]' : 'text-[#EF4444]'">
                {{ codeStatus.isActive ? '✅ Active' : '❌ Expired' }}
              </span>
            </div>
            <div v-if="codeStatus.expiresAt" class="flex justify-between text-xs">
              <span class="text-[#606060]">Expires</span>
              <span class="text-[#A0A0A0]">{{ formatDate(codeStatus.expiresAt) }}</span>
            </div>
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
const bookingCodeStore = useBookingCodeStore()
const betStore = useBetStore()

// ---- State ----
const activeTab = ref('create')
const loadCodeInput = ref('')
const loadError = ref('')
const isLoading = ref(false)
const isCreating = ref(false)
const createdCode = ref(null)
const codeExpiry = ref(null)

// ---- Tabs ----
const tabs = [
  { id: 'create', label: 'Create', icon: '📝' },
  { id: 'load', label: 'Load', icon: '📥' }
]

// ---- Computed ----
const selectionsCount = computed(() => betStore.slip.length)

const isValidCode = computed(() => {
  const code = loadCodeInput.value.trim().toUpperCase()
  return code.length === 6 && /^[A-Z0-9]{6}$/.test(code)
})

const loadedSelections = computed(() => bookingCodeStore.loadedSelections)

const codeStatus = computed(() => bookingCodeStore.codeStatus)

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
  loadCodeInput.value = ''
  loadError.value = ''
  createdCode.value = null
  codeExpiry.value = null
  activeTab.value = 'create'
}

const handleCreateCode = async () => {
  if (selectionsCount.value === 0) {
    loadError.value = 'No selections in bet slip'
    return
  }

  isCreating.value = true
  loadError.value = ''

  try {
    const result = await bookingCodeStore.createBookingCodeFromSlip()
    if (result.success) {
      createdCode.value = result.data.bookingCode
      codeExpiry.value = result.data.expiresAt
      emit('code-created', result.data)
    } else {
      loadError.value = result.error || 'Failed to create code'
    }
  } catch (error) {
    loadError.value = 'An error occurred while creating code'
    console.error('Create code error:', error)
  } finally {
    isCreating.value = false
  }
}

const handleCopyCode = async () => {
  if (!createdCode.value) return
  const result = await bookingCodeStore.copyBookingCode(createdCode.value)
  if (result.success) {
    // Show success feedback
    const btn = document.activeElement
    const originalText = btn.innerHTML
    btn.innerHTML = '✅ Copied!'
    setTimeout(() => {
      btn.innerHTML = originalText
    }, 2000)
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
      alert('✅ Link copied to clipboard!')
    }).catch(() => {
      // Manual copy
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('✅ Link copied to clipboard!')
    })
  }
}

const handleClearCreatedCode = () => {
  createdCode.value = null
  codeExpiry.value = null
  bookingCodeStore.clearBookingCode()
}

const handleCodeInput = (e) => {
  const value = e.target.value.toUpperCase()
  loadCodeInput.value = value.replace(/[^A-Z0-9]/g, '')
  loadError.value = ''
}

const handlePasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    const cleanCode = text.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (cleanCode.length === 6) {
      loadCodeInput.value = cleanCode
    } else {
      loadError.value = 'Invalid code format in clipboard'
    }
  } catch (error) {
    loadError.value = 'Unable to read clipboard'
  }
}

const handleLoadCode = async () => {
  if (!isValidCode.value) {
    loadError.value = 'Enter a valid 6-character code (letters and numbers only)'
    return
  }

  isLoading.value = true
  loadError.value = ''

  const code = loadCodeInput.value.trim().toUpperCase()

  try {
    const result = await bookingCodeStore.loadBookingCode(code)
    if (result.success) {
      loadError.value = ''
      // Check if code has selections
      if (loadedSelections.value.length === 0) {
        loadError.value = 'No selections found in this code'
      }
    } else {
      loadError.value = result.error || 'Failed to load booking code'
    }
  } catch (error) {
    loadError.value = 'An error occurred while loading code'
    console.error('Load code error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleApplyCode = () => {
  if (loadedSelections.value.length === 0) {
    loadError.value = 'No selections to apply'
    return
  }

  const success = bookingCodeStore.applyLoadedSelectionsToSlip()
  if (success) {
    emit('code-loaded', loadedSelections.value)
    emit('close')
    resetState()
  } else {
    loadError.value = 'Failed to apply selections'
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ---- Watchers ----
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetState()
    // Reset store state
    bookingCodeStore.clearBookingCode()
  }
})

// Reset when tab changes
watch(activeTab, () => {
  loadError.value = ''
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

/* Input styles */
input::placeholder {
  color: #606060;
}

/* Focus styles */
input:focus {
  outline: none;
}
</style>