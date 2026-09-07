<!-- Setting.vue - Admin Settings: switch active payment gateway (PalmPesa <-> Snipe) -->
<template>
  <div class="space-y-6">
    <!-- Payment Gateway -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6">
      <h3 class="text-lg font-bold text-white mb-1">💳 Payment Gateway (Deposit)</h3>
      <p class="text-xs text-gray-500 mb-6">
        Chagua ni provider gani itatumika kwa DEPOSIT za wateja. Wakati PalmPesa inasumbua
        kufanya malipo, badilisha tu kwa Snipe - wateja wataendelea kuweka pesa bila kukatizwa.
        (Withdraw haigusiwi.)
      </p>

      <div v-if="loading" class="py-10 text-center text-gray-500 text-sm">Loading gateway...</div>

      <template v-else>
        <!-- Active status -->
        <div class="mb-6 px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-3">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span class="text-sm text-gray-300">
              Sasa inatumika:
              <span class="font-bold text-white uppercase">{{ activeName }}</span>
            </span>
          </div>
          <button
            @click="loadGateway"
            class="text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            🔄 Refresh
          </button>
        </div>

        <!-- Provider options -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="p in providers"
            :key="p.key"
            @click="switchGateway(p.key)"
            :class="p.key === active
              ? 'border-emerald-500/60 bg-emerald-950/30'
              : 'border-[#2A2A2A] hover:border-rose-500/40 cursor-pointer'"
            class="relative rounded-2xl border p-5 transition-all duration-200"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                     :class="p.key === active ? 'bg-emerald-500/20' : 'bg-[#0D0D0D] border border-[#2A2A2A]'">
                  <span>{{ p.key === 'palmpesa' ? '🌴' : '⚡' }}</span>
                </div>
                <div>
                  <p class="text-white font-bold">{{ p.name }}</p>
                  <p class="text-[11px] text-gray-500">{{ p.key === 'palmpesa' ? 'M-Pesa wall-initiated' : 'Mobile money USSD push' }}</p>
                </div>
              </div>
              <span
                v-if="p.key === active"
                class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold"
              >
                ACTIVE
              </span>
              <span v-else class="text-[10px] px-2 py-0.5 rounded-full bg-[#2A2A2A] text-gray-400 font-semibold">
                Inactive
              </span>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed">
              {{ p.key === 'palmpesa'
                ? 'Kigezo cha sasa. Bofya kubadilisha kwenda Snipe.'
                : 'Bofya kuamsha - deposits mpya zitaenda kwa Snipe.' }}
            </p>
            <button
              :disabled="switching || p.key === active"
              class="mt-4 w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              :class="p.key === active
                ? 'bg-emerald-600/30 text-emerald-300'
                : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700'"
            >
              {{ p.key === active ? '✓ Inatumika' : (switching ? 'Switching...' : 'Wezesha ' + p.name) }}
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Note -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6">
      <h4 class="text-sm font-bold text-white mb-2">ℹ️ Jinsi inavyofanya kazi</h4>
      <ul class="text-xs text-gray-500 space-y-1.5 list-disc list-inside">
        <li>Mabadiliko yanaanza kutumika mara moja - hakuna restart ya server inayohitajika.</li>
        <li>Deposits zilizoanza na provider ya zamani zinaendelea kufuatiliwa hadi kukamilika.</li>
        <li>Chaguo linahifadhiwa la kudumu (server inakumbuka hata ikianzishwa upya).</li>
        <li>Ukipata shida na moja, geuza tu na nyingine - sawa vitu vingine havibadiliki.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import PaymentGatewayService from '../../../services/paymentGateway/paymentGateway.service'

const toast = useToast()

const loading = ref(false)
const switching = ref(false)
const active = ref('')
const providers = ref([])

const activeName = computed(() => {
  const p = providers.value.find((x) => x.key === active.value)
  return p ? p.name : active.value || '—'
})

const loadGateway = async (silent = true) => {
  if (!silent) loading.value = true
  const result = await PaymentGatewayService.getGateway()
  if (result.success && result.data) {
    active.value = result.data.active || ''
    providers.value = result.data.providers || []
  } else if (!silent) {
    toast.error(result.message || 'Imeshindikana kuleta gateway', { position: 'bottom-right', timeout: 4000 })
  }
  loading.value = false
}

const switchGateway = async (key) => {
  if (switching.value || key === active.value) return

  const currentName = providers.value.find((x) => x.key === active.value)?.name || active.value
  const nextName = providers.value.find((x) => x.key === key)?.name || key
  const okConfirm = window.confirm(`Badilisha deposit gateway kutoka ${currentName} kwenda ${nextName}?`)
  if (!okConfirm) return

  switching.value = true
  const result = await PaymentGatewayService.setGateway(key)
  switching.value = false

  if (result.success) {
    active.value = result.data?.active || key
    toast.success(`✅ Deposit gateway imebadilika kuwa ${nextName.toUpperCase()}`, { position: 'bottom-right', timeout: 5000 })
  } else {
    toast.error(result.message || 'Imeshindikana kubadilisha gateway', { position: 'bottom-right', timeout: 4000 })
  }
}

onMounted(() => loadGateway(false))
</script>

<style scoped></style>