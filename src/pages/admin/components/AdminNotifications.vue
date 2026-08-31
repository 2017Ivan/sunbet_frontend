<!-- views/admin/AdminNotifications.vue - Tuma notifications kwa mteja mmoja au wote -->
<template>
  <div class="space-y-6">
    <!-- Deposit Alert Receivers -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6">
      <h3 class="text-lg font-bold text-white mb-1">📲 Deposit Alert Receivers</h3>
      <p class="text-xs text-gray-500 mb-4">Admin phone numbers that get an alert whenever a customer requests a deposit (amount + number).</p>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          v-model="newRecipientPhone"
          type="tel"
          placeholder="Phone number (e.g. 2557...)"
          class="flex-1 px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          @keyup.enter="addRecipient"
        />
        <input
          v-model="newRecipientLabel"
          type="text"
          placeholder="Label (optional)"
          class="sm:w-48 px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          @keyup.enter="addRecipient"
        />
        <button
          @click="addRecipient"
          :disabled="recipientBusy"
          class="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition-all duration-300 text-sm font-bold"
        >
          + Add
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <div v-if="recipients.length === 0" class="text-gray-500 text-sm">
          No receivers yet. Add an admin phone number to receive deposit alerts.
        </div>
        <div
          v-for="r in recipients"
          :key="r.id"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A]"
        >
          <span class="text-emerald-400">📞</span>
          <span class="font-mono text-white text-sm">{{ r.phone_number }}</span>
          <span v-if="r.label" class="text-[11px] text-gray-500">{{ r.label }}</span>
          <button @click="removeRecipient(r)" class="text-red-400 hover:text-red-300 text-sm ml-1">✕</button>
        </div>
      </div>
    </div>

    <!-- Pending Deposit Requests -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-lg font-bold text-white">💰 Deposit Requests</h3>
        <button @click="loadDepositRequests" class="text-xs text-rose-400 hover:text-rose-300 font-semibold">🔄 Refresh</button>
      </div>
      <p class="text-xs text-gray-500 mb-4">For each request: make the payment to the customer's number, the user pays with PIN, then click <strong class="text-emerald-400">Accept</strong> to release the funds to their SunBet balance.</p>

      <div v-if="depositRequests.length > 0" class="mb-4 px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-sm font-semibold animate-pulse">
        🔔 {{ depositRequests.length }} deposit request(s) waiting — make the payment, then click <strong>Accept</strong>.
      </div>

      <div v-if="depositRequests.length === 0" class="text-gray-500 text-sm py-4 text-center">
        No deposit requests waiting.
      </div>

      <div class="divide-y divide-[#2A2A2A]">
        <div v-for="d in depositRequests" :key="d.id" class="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-white font-semibold text-sm">TSh {{ formatMoney(d.amount) }}</p>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">PENDING</span>
            </div>
            <p class="text-gray-400 text-sm mt-0.5 font-mono">📞 {{ d.payer_phone || d.user?.phone_number || '—' }}</p>
            <p class="text-[11px] text-gray-500 mt-0.5">⏰ {{ formatDate(d.createdAt || d.created_at) }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="confirmDeposit(d)"
              :disabled="d.busy"
              class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {{ d.busy ? '...' : '✓ Accept' }}
            </button>
            <button
              @click="cancelDeposit(d)"
              :disabled="d.busy"
              class="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors font-semibold"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Send Notification Form -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6">
      <h3 class="text-lg font-bold text-white mb-1">Tuma Notification</h3>
      <p class="text-xs text-gray-500 mb-6">Notifikesheni itaonekana kwenye eneo la arifa la mteja - haijulikani kuwa imetumwa na admin</p>

      <div class="space-y-5">
        <!-- Target Audience -->
        <div>
          <label class="block text-rose-400 text-sm mb-2">Wakusudiwa</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="notification.target = 'all'"
              :class="notification.target === 'all' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-[#0D0D0D] border-[#2A2A2A] text-gray-300 hover:border-rose-500/50'"
              class="px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200"
            >
              📢 Wateja Wote
            </button>
            <button
              @click="notification.target = 'specific'"
              :class="notification.target === 'specific' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-[#0D0D0D] border-[#2A2A2A] text-gray-300 hover:border-rose-500/50'"
              class="px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200"
            >
              👤 Mteja Mahususi
            </button>
          </div>
        </div>

        <!-- Specific User Search -->
        <div v-if="notification.target === 'specific'" class="relative">
          <label class="block text-rose-400 text-sm mb-2">Tafuta Mteja (namba ya simu)</label>
          <input
            v-model="userSearch"
            type="text"
            placeholder="Andika namba ya simu (mf. 255700...)"
            class="w-full px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
            @input="debounceSearchUser"
            @keyup.enter="searchSpecificUser"
          />

          <!-- Loading -->
          <div v-if="searchLoading" class="absolute z-20 w-full mt-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg overflow-hidden shadow-xl p-3">
            <p class="text-rose-400 text-center text-sm animate-pulse">Inatafuta...</p>
          </div>

          <!-- Results dropdown -->
          <div v-else-if="userSearchResults.length" class="absolute z-20 w-full mt-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg overflow-hidden shadow-xl">
            <div
              v-for="user in userSearchResults"
              :key="user.id"
              @click="selectUser(user)"
              class="px-4 py-3 hover:bg-[#2A2A2A] cursor-pointer text-white text-sm transition-colors border-b border-[#2A2A2A]/60 last:border-0"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono">{{ user.phone_number }}</span>
                <span class="text-xs text-gray-500">TZS {{ formatMoney(user.balance) }}</span>
              </div>
              <div class="text-[11px] text-gray-500 mt-0.5">Role: {{ user.role || 'USER' }}</div>
            </div>
          </div>
          <div v-else-if="userSearch.length >= 3 && !searchLoading && searched" class="absolute z-20 w-full mt-1 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg overflow-hidden shadow-xl p-3">
            <p class="text-gray-500 text-sm text-center">Hakuna mteja aliyepatikana</p>
          </div>

          <!-- Selected chip -->
          <div v-if="selectedUser" class="mt-2 p-3 bg-rose-950/40 rounded-lg border border-rose-800/40 flex items-center justify-between">
            <span class="text-white text-sm">✅ Imechaguliwa: <strong class="font-mono text-rose-300">{{ selectedUser.phone_number }}</strong></span>
            <button @click="clearSelectedUser" class="text-red-400 hover:text-red-300 text-sm">✕ Ondoa</button>
          </div>
        </div>

        <!-- Type -->
        <div>
          <label class="block text-rose-400 text-sm mb-2">Aina ya Notification</label>
          <div class="flex flex-wrap gap-3">
            <label class="flex items-center gap-2 cursor-pointer text-gray-300 text-sm">
              <input type="radio" value="info" v-model="notification.type" class="accent-rose-500"> ℹ️ Info
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-gray-300 text-sm">
              <input type="radio" value="promotion" v-model="notification.type" class="accent-rose-500"> 🎉 Promotion
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-gray-300 text-sm">
              <input type="radio" value="alert" v-model="notification.type" class="accent-rose-500"> ⚠️ Alert
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-gray-300 text-sm">
              <input type="radio" value="success" v-model="notification.type" class="accent-rose-500"> ✅ Success
            </label>
          </div>
        </div>

        <!-- Title + Message -->
        <div>
          <label class="block text-rose-400 text-sm mb-2">Kichwa (hiari)</label>
          <input
            v-model="notification.title"
            type="text"
            placeholder="Mf. Mboleo Mpya, Onyo la Mfumo..."
            class="w-full px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors"
          />
          <p class="text-right text-[11px] text-gray-600 mt-1">{{ notification.title.length }}/100</p>
        </div>

        <div>
          <label class="block text-rose-400 text-sm mb-2">Ujumbe <span class="text-red-500">*</span></label>
          <textarea
            v-model="notification.message"
            rows="4"
            placeholder="Andika ujumbe wa notification hapa..."
            class="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-colors resize-none"
          ></textarea>
          <p class="text-right text-[11px] text-gray-600 mt-1">{{ notification.message.length }}/500</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 pt-1">
          <button
            @click="handlePreview"
            :disabled="sending"
            class="px-6 py-2.5 bg-[#2A2A2A] text-gray-200 rounded-lg hover:bg-[#333] disabled:opacity-50 transition-colors text-sm font-semibold"
          >
            👁️ Preview
          </button>
          <button
            @click="sendNotification"
            :disabled="sending"
            class="px-8 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-rose-500/20 text-sm font-bold"
          >
            {{ sending ? 'Inatuma...' : (notification.target === 'all' ? '📢 Tuma kwa Wote' : '➤ Tuma kwa Mteja') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-5">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Jumla</p>
        <p class="text-2xl font-bold text-white mt-1">{{ stats.total }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-5">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Leo</p>
        <p class="text-2xl font-bold text-rose-400 mt-1">{{ stats.today }}</p>
      </div>
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-5">
        <p class="text-xs text-gray-500 uppercase tracking-wider">Hazijasomwa</p>
        <p class="text-2xl font-bold text-yellow-400 mt-1">{{ stats.unread }}</p>
      </div>
    </div>

    <!-- History -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A]">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-[#2A2A2A]">
        <h3 class="font-bold text-white text-sm flex-1 whitespace-nowrap">Historia ya Notifications</h3>

        <input
          v-model="filters.search"
          type="text"
          placeholder="Tafuta kwa namba ya mteja"
          class="text-sm px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none"
          @keyup.enter="loadHistory"
          @input="debounceHistory"
        />

        <select
          v-model="filters.type"
          class="text-sm px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white focus:outline-none cursor-pointer"
        >
          <option value="">Aina: Zote</option>
          <option value="info">ℹ️ Info</option>
          <option value="promotion">🎉 Promotion</option>
          <option value="alert">⚠️ Alert</option>
          <option value="success">✅ Success</option>
        </select>

        <select
          v-model="filters.is_read"
          class="text-sm px-3 py-2 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white focus:outline-none cursor-pointer"
        >
          <option value="">Hali: Zote</option>
          <option value="false">○ Hazijasomwa</option>
          <option value="true">✓ Zimesomwa</option>
        </select>

        <button
          @click="loadHistory"
          class="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
        >
          🔍 Futa
        </button>
      </div>

      <div class="divide-y divide-[#2A2A2A]">
        <div v-if="isLoading" class="p-8 text-center text-gray-400 text-sm">Inapakia historia...</div>
        <div v-else-if="recentNotifications.length === 0" class="p-8 text-center text-gray-500 text-sm">
          Hakuna notifications zilizotumwa bado
        </div>

        <div v-for="notif in recentNotifications" :key="notif.id" class="p-4 hover:bg-[#2A2A2A]/30 transition-colors">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <div :class="getTypeBg(notif.type)" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="text-lg">{{ getTypeIcon(notif.type) }}</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-white font-semibold text-sm truncate">{{ notif.title }}</p>
                  <span v-if="notif.is_read" class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">✓ Imesomwa</span>
                  <span v-else class="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">○ Hazijasomwa</span>
                </div>
                <p class="text-gray-400 text-sm mt-0.5 break-words">{{ notif.message }}</p>
                <div class="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                  <span class="font-mono">➤ {{ notif.phone_number || 'Wateja wote' }}</span>
                  <span>{{ getTypeIcon(notif.type) }} {{ notif.type }}</span>
                  <span>{{ formatDate(notif.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" @click.self="closePreview">
      <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6 w-full max-w-sm mx-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white mb-4">📱 Preview Notification</h3>

        <!-- Simulated customer view -->
        <div class="bg-[#0D0D0D] rounded-xl p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
              <span class="text-2xl">{{ getTypeIcon(notification.type) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm truncate">SunBet</p>
              <p class="text-gray-500 text-xs">Sasa hivi</p>
            </div>
          </div>
          <p class="text-white font-medium mb-2 break-words">{{ notification.title || 'Notification' }}</p>
          <p class="text-gray-400 text-sm break-words">{{ notification.message || 'Ujumbe wako utaonekana hapa...' }}</p>
          <div v-if="notification.target === 'specific' && selectedUser" class="mt-3 pt-3 border-t border-[#2A2A2A]">
            <p class="text-xs text-gray-500">Inatumwa kwa: <span class="text-rose-400 font-mono">{{ selectedUser.phone_number }}</span></p>
          </div>
          <div v-else-if="notification.target === 'all'" class="mt-3 pt-3 border-t border-[#2A2A2A]">
            <p class="text-xs text-gray-500">Inatumwa kwa: <span class="text-rose-400">Wateja wote</span></p>
          </div>
        </div>

        <div class="flex gap-3 mt-4">
          <button @click="closePreview" class="flex-1 py-2.5 bg-[#2A2A2A] text-gray-300 rounded-lg hover:bg-[#333] transition-colors text-sm font-semibold">
            Funga
          </button>
          <button @click="sendFromPreview" :disabled="sending" class="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-bold hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition-colors text-sm">
            {{ sending ? 'Inatuma...' : 'Tuma Sasa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-2xl max-w-sm animate-slide-up"
         :class="toast.type === 'success' ? 'bg-emerald-950/95 border border-emerald-700' : 'bg-red-950/95 border border-red-700'">
      <div class="flex items-start gap-3">
        <span class="text-xl">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <div class="flex-1">
          <p class="text-white font-medium text-sm">{{ toast.message }}</p>
          <p v-if="toast.details" class="text-xs text-white/60 mt-1">{{ toast.details }}</p>
        </div>
        <button @click="toast.show = false" class="text-white/60 hover:text-white">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useNotificationStore } from '../../../stores/notifications.store'
import manageUsersService from '../../../services/manageUsersService'
import DepositService from '../../../services/deposit/deposit.service'
import socketService from '../../../services/socket/socket.service'

const notificationStore = useNotificationStore()

// State
const sending = ref(false)
const isLoading = ref(false)
const showPreview = ref(false)
const userSearch = ref('')
const userSearchResults = ref([])
const searchLoading = ref(false)
const searched = ref(false)
const selectedUser = ref(null)
let searchTimeout = null
let historyTimeout = null

// Form
const notification = ref({
  target: 'all',
  type: 'info',
  title: '',
  message: '',
  metadata: null
})

const filters = reactive({
  type: '',
  is_read: '',
  search: ''
})

const recentNotifications = ref([])
const stats = reactive({ total: 0, today: 0, unread: 0 })

const toast = ref({ show: false, message: '', type: 'success', details: '' })

// ============ DEPOSIT RECEIVERS ============
const recipients = ref([])
const newRecipientPhone = ref('')
const newRecipientLabel = ref('')
const recipientBusy = ref(false)

async function loadRecipients() {
  const result = await DepositService.getRecipients()
  if (result.success) {
    recipients.value = result.data?.recipients || []
  }
}

async function addRecipient() {
  const phone = newRecipientPhone.value.trim()
  if (!phone) {
    showToast('Enter a phone number first', 'error')
    return
  }
  recipientBusy.value = true
  try {
    const result = await DepositService.addRecipient({
      phone_number: phone,
      label: newRecipientLabel.value.trim() || null
    })
    if (result.success) {
      showToast('Receiver added ✅', 'success', phone)
      newRecipientPhone.value = ''
      newRecipientLabel.value = ''
      await loadRecipients()
    } else {
      showToast('Failed: ' + (result.message || 'Unknown error'), 'error')
    }
  } finally {
    recipientBusy.value = false
  }
}

async function removeRecipient(r) {
  const result = await DepositService.removeRecipient(r.id)
  if (result.success) {
    showToast('Receiver removed', 'success', r.phone_number)
    await loadRecipients()
  } else {
    showToast('Failed: ' + (result.message || 'Unknown error'), 'error')
  }
}

// ============ DEPOSIT REQUESTS ============
const depositRequests = ref([])
let depositRefreshTimer = null

function handleDepositSignal() {
  loadDepositRequests()
  loadRecipients()
}

async function loadDepositRequests() {
  const result = await DepositService.getRequests({ status: 'PENDING', limit: 30 })
  if (result.success) {
    depositRequests.value = (result.data?.deposit_requests || []).map(r => ({ ...r, busy: false }))
  }
}

async function confirmDeposit(d) {
  d.busy = true
  try {
    const result = await DepositService.confirmRequest(d.id)
    if (result.success) {
      showToast('Deposit accepted ✅ — balance updated & customer notified', 'success', `TSh ${formatMoney(d.amount)}`)
      await loadDepositRequests()
    } else {
      showToast('Failed: ' + (result.message || 'Unknown error'), 'error')
    }
  } finally {
    d.busy = false
  }
}

async function cancelDeposit(d) {
  d.busy = true
  try {
    const result = await DepositService.cancelRequest(d.id)
    if (result.success) {
      showToast('Deposit request cancelled', 'success', `TSh ${formatMoney(d.amount)}`)
      await loadDepositRequests()
    } else {
      showToast('Failed: ' + (result.message || 'Unknown error'), 'error')
    }
  } finally {
    d.busy = false
  }
}

// ============ HELPERS ============
function formatMoney(n) {
  if (n === null || n === undefined) return '0'
  return new Intl.NumberFormat('en-TZ').format(n)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-TZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTypeBg(type) {
  const types = {
    info: 'bg-cyan-500/15',
    promotion: 'bg-purple-500/15',
    alert: 'bg-yellow-500/15',
    system: 'bg-blue-500/15',
    success: 'bg-emerald-500/15',
    warning: 'bg-yellow-500/15'
  }
  return types[type] || 'bg-cyan-500/15'
}

function getTypeIcon(type) {
  const icons = {
    info: 'ℹ️',
    promotion: '🎉',
    alert: '⚠️',
    system: '⚙️',
    success: '✅',
    warning: '⚠️'
  }
  return icons[type] || '📢'
}

function showToast(message, type = 'success', details = '') {
  toast.value = { show: true, message, type, details }
  setTimeout(() => { toast.value.show = false }, 5000)
}

// ============ SEARCH USER ============
function debounceSearchUser() {
  searched.value = false
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(searchSpecificUser, 500)
}

async function searchSpecificUser() {
  if (userSearch.value.length < 3) {
    userSearchResults.value = []
    return
  }

  searchLoading.value = true
  try {
    const result = await manageUsersService.getUsers({ search: userSearch.value.trim(), limit: 8 })
    searched.value = true
    userSearchResults.value = result.success ? (result.data?.users || []) : []
  } catch (error) {
    userSearchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

function selectUser(user) {
  selectedUser.value = user
  userSearch.value = user.phone_number
  userSearchResults.value = []
}

function clearSelectedUser() {
  selectedUser.value = null
  userSearch.value = ''
  userSearchResults.value = []
}

// ============ SEND ============
function handlePreview() {
  if (!notification.value.message) {
    showToast('Andika ujumbe kwanza', 'error')
    return
  }
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
}

function sendFromPreview() {
  closePreview()
  sendNotification()
}

async function sendNotification() {
  if (!notification.value.message) {
    showToast('Andika ujumbe kwanza', 'error')
    return
  }
  if (notification.value.target === 'specific' && !selectedUser.value?.phone_number) {
    showToast('Chagua mteja kwanza', 'error')
    return
  }

  sending.value = true
  try {
    const payload = {
      title: notification.value.title || 'Notification',
      message: notification.value.message,
      type: notification.value.type,
      metadata: notification.value.metadata
    }

    let result
    if (notification.value.target === 'all') {
      result = await notificationStore.sendToAllUsers(payload)
    } else {
      result = await notificationStore.sendToUser({
        ...payload,
        phone_number: selectedUser.value.phone_number
      })
    }

    if (result.success) {
      showToast('Notification imetumwa kikamilifu! ✅', 'success',
        notification.value.target === 'all' ? 'Kwa wateja wote' : `Kwa ${selectedUser.value.phone_number}`)
      clearForm()
      await loadHistory()
    } else {
      showToast('Imeshindikana: ' + (result.message || 'Unknown error'), 'error')
    }
  } catch (error) {
    showToast('Error: ' + (error.message || 'Failed to send notification'), 'error')
  } finally {
    sending.value = false
    closePreview()
  }
}

function clearForm() {
  notification.value = {
    target: 'all',
    type: 'info',
    title: '',
    message: '',
    metadata: null
  }
  userSearch.value = ''
  userSearchResults.value = []
  selectedUser.value = null
  searched.value = false
}

// ============ HISTORY ============
function debounceHistory() {
  clearTimeout(historyTimeout)
  historyTimeout = setTimeout(loadHistory, 600)
}

async function loadHistory() {
  isLoading.value = true
  try {
    const params = { limit: 50, offset: 0 }
    if (filters.type) params.type = filters.type
    if (filters.is_read !== '') params.is_read = filters.is_read === 'true'
    if (filters.search.trim()) params.search = filters.search.trim()

    const result = await notificationStore.fetchAllNotifications(params)
    if (result.success) {
      const data = result.data || {}
      recentNotifications.value = data.notifications || []
      stats.total = data.total || recentNotifications.value.length

      const today = new Date().toDateString()
      stats.today = recentNotifications.value.filter(n => {
        const d = new Date(n.created_at || n.createdAt)
        return d.toDateString() === today
      }).length
      stats.unread = recentNotifications.value.filter(n => !n.is_read).length
    } else {
      showToast('Iliangamia kupakia historia', 'error')
    }
  } catch (error) {
    showToast('Iliangamia kupakia historia', 'error')
  } finally {
    isLoading.value = false
  }
}

// Limit title/message length
watch(() => notification.value.title, (v) => {
  if (v && v.length > 100) notification.value.title = v.slice(0, 100)
})
watch(() => notification.value.message, (v) => {
  if (v && v.length > 500) notification.value.message = v.slice(0, 500)
})

onMounted(() => {
  loadHistory()
  loadRecipients()
  loadDepositRequests()

  // Live: refresh deposit list the moment a notification (deposit request) arrives
  const token = localStorage.getItem('access_token')
  socketService.connect(token)
  socketService.onNewNotification(handleDepositSignal)

  // Fallback polling in case the socket is not connected
  depositRefreshTimer = setInterval(loadDepositRequests, 10000)
})

onBeforeUnmount(() => {
  if (depositRefreshTimer) {
    clearInterval(depositRefreshTimer)
    depositRefreshTimer = null
  }
})
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>