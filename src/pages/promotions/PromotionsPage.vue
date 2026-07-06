<!-- pages/promotions/PromotionsPage.vue -->
<template>
  <div class="min-h-screen bg-[#0D0D0D]">
    <div class="max-w-6xl mx-auto px-4 py-6">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">🎁 Promotions</h1>
        <p class="text-sm text-[#606060] mt-1">Exclusive offers and bonuses for you</p>
      </div>

      <!-- Active Promotions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="promo in activePromotions" 
          :key="promo.id"
          class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-rose-600/30 transition-all duration-300 group"
        >
          <!-- Banner -->
          <div class="relative h-32 bg-gradient-to-r" :class="promo.gradient">
            <div class="absolute inset-0 bg-black/30"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-5xl">{{ promo.icon }}</span>
            </div>
            <div class="absolute top-3 right-3 px-2.5 py-1 bg-rose-600/90 text-white text-[10px] font-bold rounded-full">
              {{ promo.tag }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-white font-bold text-base">{{ promo.title }}</h3>
            <p class="text-[#606060] text-sm mt-1 line-clamp-2">{{ promo.description }}</p>
            
            <div class="flex items-center justify-between mt-4 pt-3 border-t border-[#2A2A2A]">
              <div>
                <p class="text-[10px] text-[#606060] uppercase tracking-wider">Valid until</p>
                <p class="text-white text-xs font-semibold">{{ promo.validUntil }}</p>
              </div>
              <button 
                class="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-rose-600/25"
                @click="claimPromo(promo.id)"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Inactive / Expired Promotions -->
      <div v-if="expiredPromotions.length > 0" class="mt-10">
        <h2 class="text-sm font-bold text-[#606060] uppercase tracking-wider mb-4">Expired Promotions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
          <div 
            v-for="promo in expiredPromotions" 
            :key="promo.id"
            class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden"
          >
            <!-- Banner -->
            <div class="relative h-28 bg-gradient-to-r" :class="promo.gradient">
              <div class="absolute inset-0 bg-black/50"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-4xl">{{ promo.icon }}</span>
              </div>
              <div class="absolute top-3 right-3 px-2.5 py-1 bg-gray-600/90 text-white text-[10px] font-bold rounded-full">
                EXPIRED
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <h3 class="text-white font-bold text-sm">{{ promo.title }}</h3>
              <p class="text-[#606060] text-xs mt-1 line-clamp-2">{{ promo.description }}</p>
              <div class="mt-3 pt-2 border-t border-[#2A2A2A]">
                <p class="text-[10px] text-[#606060]">Expired on {{ promo.validUntil }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ---- Active Promotions ----
const activePromotions = ref([
  {
    id: 1,
    icon: '🎉',
    title: 'Welcome Bonus 100%',
    description: 'Get 100% bonus on your first deposit up to TZS 500,000. Minimum deposit TZS 10,000.',
    tag: 'NEW',
    gradient: 'from-rose-600 to-rose-800',
    validUntil: '2026-08-31'
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Acca Boost',
    description: 'Boost your accumulator bets by up to 50%. Add 5+ selections to qualify.',
    tag: 'HOT',
    gradient: 'from-amber-600 to-rose-700',
    validUntil: '2026-07-31'
  },
  {
    id: 3,
    icon: '🔄',
    title: 'Cashback 10%',
    description: 'Get 10% cashback on all losing bets placed this week. Max cashback TZS 100,000.',
    tag: 'POPULAR',
    gradient: 'from-emerald-600 to-rose-700',
    validUntil: '2026-07-15'
  },
  {
    id: 4,
    icon: '🏆',
    title: 'Grand Jackpot',
    description: 'Win up to TZS 10,000,000 in our weekly jackpot. Minimum bet TZS 1,000.',
    tag: 'JACKPOT',
    gradient: 'from-purple-600 to-rose-700',
    validUntil: '2026-07-20'
  },
  {
    id: 5,
    icon: '🎯',
    title: 'Free Bet Friday',
    description: 'Place a bet of TZS 5,000 or more and get a free bet worth TZS 1,000 every Friday.',
    tag: 'WEEKLY',
    gradient: 'from-blue-600 to-rose-700',
    validUntil: '2026-07-31'
  },
  {
    id: 6,
    icon: '💎',
    title: 'VIP Loyalty Program',
    description: 'Earn points for every bet placed. Redeem points for exclusive rewards and bonuses.',
    tag: 'VIP',
    gradient: 'from-rose-700 to-gray-800',
    validUntil: '2026-12-31'
  }
])

// ---- Expired Promotions ----
const expiredPromotions = ref([
  {
    id: 7,
    icon: '🎄',
    title: 'Christmas Special',
    description: 'Double your winnings on all bets placed during Christmas week.',
    gradient: 'from-red-600 to-green-700',
    validUntil: '2025-12-25'
  },
  {
    id: 8,
    icon: '🎆',
    title: 'New Year Bonus',
    description: 'Start the new year with a 50% bonus on your first deposit.',
    gradient: 'from-yellow-600 to-rose-700',
    validUntil: '2026-01-15'
  }
])

// ---- Claim Promo ----
const claimPromo = (promoId) => {
  console.log('Claiming promo:', promoId)
  alert('Promotion claimed successfully! Check your bonus balance.')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>