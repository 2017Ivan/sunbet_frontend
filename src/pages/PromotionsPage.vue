<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== HERO ===== -->
      <div class="relative overflow-hidden bg-gradient-to-br from-[#1a0505] to-[#0D0D0D] border-b border-[#1E1E1E]">
        <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#A32D2D]/15 blur-[100px] pointer-events-none" />
        <div class="max-w-screen-xl mx-auto px-4 py-10 relative z-10">
          <div class="text-center max-w-2xl mx-auto">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A32D2D]/15 border border-[#A32D2D]/25 text-[#C94040] text-xs font-semibold mb-4">
              🔥 Hot Deals
            </span>
            <h1 class="text-3xl sm:text-4xl font-black text-white mb-3">
              Promotions & <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#A32D2D] to-[#E05555]">Bonuses</span>
            </h1>
            <p class="text-[#606060] text-sm leading-relaxed">
              Exclusive offers for SunBet members. Claim your bonus and boost your winnings today.
            </p>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-xl mx-auto px-4 py-8">
  
        <!-- Filter tabs -->
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all"
            :class="activeCategory === cat.id
              ? 'bg-[#A32D2D] border-[#A32D2D] text-white'
              : 'bg-[#161616] border-[#2A2A2A] text-[#606060] hover:border-[#333] hover:text-[#A0A0A0]'"
            @click="activeCategory = cat.id"
          >
            {{ cat.emoji }} {{ cat.label }}
            <span
              class="text-[10px] px-1.5 rounded-full font-bold"
              :class="activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#1E1E1E] text-[#606060]'"
            >
              {{ cat.count }}
            </span>
          </button>
        </div>
  
        <!-- Featured promo (big) -->
        <div
          class="relative overflow-hidden rounded-[22px] p-8 mb-8 cursor-pointer group"
          style="background: linear-gradient(135deg, #7A1F1F, #A32D2D, #C94040)"
          @click="openPromo(featuredPromo)"
        >
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z%22/%3E%3C/g%3E%3C/svg%3E')]" />
          <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-[60px] pointer-events-none" />
  
          <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div class="flex-1">
              <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                ⭐ FEATURED OFFER
              </span>
              <h2 class="text-3xl sm:text-4xl font-black text-white mb-2">{{ featuredPromo.title }}</h2>
              <p class="text-white/75 text-sm leading-relaxed mb-5 max-w-lg">{{ featuredPromo.description }}</p>
              <div class="flex flex-wrap gap-3">
                <AppButton
                  variant="silver"
                  size="lg"
                  @click.stop="claimPromo(featuredPromo)"
                >
                  🎁 Claim Bonus
                </AppButton>
                <div class="flex items-center gap-2 text-white/60 text-xs">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Expires in {{ featuredPromo.expiresIn }}
                </div>
              </div>
            </div>
            <div class="text-center flex-shrink-0">
              <p class="text-7xl font-black text-white leading-none">{{ featuredPromo.highlight }}</p>
              <p class="text-white/70 text-sm mt-1">{{ featuredPromo.highlightLabel }}</p>
            </div>
          </div>
        </div>
  
        <!-- Promos grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="promo in filteredPromos"
            :key="promo.id"
            class="bg-[#161616] border border-[#2A2A2A] rounded-[20px] overflow-hidden hover:border-[#A32D2D]/30 hover:shadow-[0_4px_24px_rgba(163,45,45,0.12)] transition-all duration-300 cursor-pointer group"
            @click="openPromo(promo)"
          >
            <!-- Gradient header -->
            <div
              class="relative h-28 flex items-center justify-center overflow-hidden"
              :style="{ background: promo.gradient }"
            >
              <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M0 40L40 0H20L0 20M40 40V20L20 40%22/%3E%3C/g%3E%3C/svg%3E')]" />
              <span class="text-5xl relative z-10">{{ promo.emoji }}</span>
              <div class="absolute top-3 left-3">
                <span
                  class="text-[10px] font-bold px-2 py-1 rounded-full"
                  :class="promo.badge.class"
                >
                  {{ promo.badge.label }}
                </span>
              </div>
              <div v-if="promo.expiresIn" class="absolute top-3 right-3 flex items-center gap-1 text-white/70 text-[10px]">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ promo.expiresIn }}
              </div>
            </div>
  
            <!-- Content -->
            <div class="p-5">
              <h3 class="text-base font-bold text-white mb-2 group-hover:text-[#C94040] transition-colors">
                {{ promo.title }}
              </h3>
              <p class="text-sm text-[#606060] leading-relaxed mb-4">{{ promo.description }}</p>
  
              <!-- Terms highlights -->
              <div class="space-y-1.5 mb-4">
                <div
                  v-for="term in promo.terms"
                  :key="term"
                  class="flex items-center gap-2 text-xs text-[#A0A0A0]"
                >
                  <svg class="w-3 h-3 text-[#A32D2D] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ term }}
                </div>
              </div>
  
              <AppButton
                variant="primary"
                fullWidth
                size="md"
                @click.stop="claimPromo(promo)"
              >
                {{ promo.claimed ? '✅ Claimed' : promo.cta }}
              </AppButton>
            </div>
          </div>
        </div>
  
        <!-- Promo code section -->
        <div class="mt-8 bg-[#161616] border border-[#2A2A2A] rounded-[20px] p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex-1">
              <h3 class="text-base font-bold text-white mb-1">Have a promo code?</h3>
              <p class="text-sm text-[#606060]">Enter your code below to unlock exclusive bonuses</p>
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
              <input
                v-model="promoCode"
                type="text"
                placeholder="e.g. SUNBET100"
                class="flex-1 sm:w-48 h-11 px-4 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-sm text-white placeholder:text-[#606060] focus:outline-none uppercase transition-all"
              />
              <AppButton
                variant="primary"
                size="md"
                :loading="applyingCode"
                @click="applyPromoCode"
              >
                Apply
              </AppButton>
            </div>
          </div>
          <p v-if="codeResult" class="mt-3 text-sm" :class="codeResult.valid ? 'text-[#22C55E]' : 'text-[#EF4444]'">
            {{ codeResult.valid ? '✅' : '❌' }} {{ codeResult.message }}
          </p>
        </div>
  
      </div>
  
      <!-- ===== PROMO DETAIL MODAL ===== -->
      <AppModal
        v-model="showPromoModal"
        :title="selectedPromo?.title"
        size="lg"
      >
        <div v-if="selectedPromo" class="space-y-4">
          <!-- Promo header -->
          <div
            class="relative rounded-[14px] overflow-hidden h-32 flex items-center justify-center"
            :style="{ background: selectedPromo.gradient }"
          >
            <span class="text-6xl">{{ selectedPromo.emoji }}</span>
          </div>
  
          <p class="text-sm text-[#A0A0A0] leading-relaxed">{{ selectedPromo.description }}</p>
  
          <!-- Full terms -->
          <div class="bg-[#0D0D0D] rounded-[12px] p-4">
            <p class="text-xs font-bold text-[#606060] uppercase tracking-wider mb-3">Terms & Conditions</p>
            <div class="space-y-2">
              <div
                v-for="term in selectedPromo.terms"
                :key="term"
                class="flex items-start gap-2 text-xs text-[#A0A0A0]"
              >
                <svg class="w-3 h-3 text-[#A32D2D] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ term }}
              </div>
            </div>
          </div>
        </div>
  
        <template #footer>
          <AppButton variant="secondary" fullWidth @click="showPromoModal = false">
            Close
          </AppButton>
          <AppButton
            variant="primary"
            fullWidth
            :loading="claiming === selectedPromo?.id"
            @click="claimPromo(selectedPromo)"
          >
            🎁 Claim Now
          </AppButton>
        </template>
      </AppModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import AppButton from '../components/ui/AppButton.vue'
  import AppModal  from '../components/ui/AppModal.vue'
  
  // ---- Categories ----
  const activeCategory = ref('all')
  const categories = [
    { id: 'all',      emoji: '🔥', label: 'All Offers',   count: 8 },
    { id: 'welcome',  emoji: '🎁', label: 'Welcome',      count: 1 },
    { id: 'cashback', emoji: '💰', label: 'Cashback',     count: 2 },
    { id: 'jackpot',  emoji: '🏆', label: 'Jackpot',      count: 1 },
    { id: 'reload',   emoji: '🔄', label: 'Reload',       count: 2 },
    { id: 'vip',      emoji: '⭐', label: 'VIP Only',     count: 2 },
  ]
  
  // ---- Featured promo ----
  const featuredPromo = {
    id: 0,
    title: '100% Welcome Bonus up to TZS 200,000',
    description: 'New to SunBet? Make your first deposit and we\'ll match it 100%! Minimum deposit TZS 10,000. Use bonus on any sport of your choice.',
    highlight: '100%',
    highlightLabel: 'Match Bonus',
    expiresIn: '7 days',
    gradient: 'linear-gradient(135deg, #7A1F1F, #A32D2D)',
    emoji: '🎁',
  }
  
  // ---- All promos ----
  const allPromos = ref([
    {
      id: 1, category: 'welcome',
      emoji: '🎁',
      gradient: 'linear-gradient(135deg, #7A1F1F, #A32D2D)',
      badge: { label: 'NEW USER', class: 'bg-white/20 text-white' },
      title: '100% First Deposit Bonus',
      description: 'Get 100% bonus on your first deposit up to TZS 200,000. Min deposit TZS 10,000.',
      terms: ['Min deposit TZS 10,000', '5x wagering requirement', 'Valid for 30 days', 'All sports eligible'],
      cta: '🎁 Claim Bonus',
      expiresIn: '7 days',
      claimed: false,
    },
    {
      id: 2, category: 'cashback',
      emoji: '💰',
      gradient: 'linear-gradient(135deg, #1a3a5c, #1e5f8c)',
      badge: { label: 'EVERY FRIDAY', class: 'bg-white/20 text-white' },
      title: 'Cashback Friday — 10%',
      description: 'Lose your bets on Friday? We got you. Get 10% cashback on all losing bets every Friday.',
      terms: ['Every Friday only', 'Max cashback TZS 50,000', 'Credited by Saturday midnight', 'Min bet TZS 1,000'],
      cta: '💰 Opt In',
      expiresIn: 'Weekly',
      claimed: false,
    },
    {
      id: 3, category: 'jackpot',
      emoji: '🏆',
      gradient: 'linear-gradient(135deg, #78350f, #d97706)',
      badge: { label: 'JACKPOT', class: 'bg-black/30 text-[#F59E0B]' },
      title: 'TZS 50M Mega Jackpot',
      description: 'Pick 13 correct results from selected matches and win Tanzania\'s biggest jackpot!',
      terms: ['Pick 13 correct results', 'Entry fee from TZS 500', 'Multiple entries allowed', 'Jackpot rolls over if no winner'],
      cta: '🎯 Play Now',
      expiresIn: '2 days',
      claimed: false,
    },
    {
      id: 4, category: 'reload',
      emoji: '🔄',
      gradient: 'linear-gradient(135deg, #1a4731, #15803d)',
      badge: { label: 'WEEKEND', class: 'bg-white/20 text-white' },
      title: '50% Weekend Reload Bonus',
      description: 'Top up your account this weekend and get 50% extra bonus. Perfect for weekend football!',
      terms: ['Weekends only (Sat-Sun)', 'Min deposit TZS 20,000', 'Max bonus TZS 100,000', '3x wagering on football'],
      cta: '🔄 Claim Reload',
      expiresIn: '3 days',
      claimed: false,
    },
    {
      id: 5, category: 'cashback',
      emoji: '⚡',
      gradient: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
      badge: { label: 'ACCA BOOST', class: 'bg-white/20 text-white' },
      title: 'Accumulator Boost — Up to 50%',
      description: 'Build an accumulator of 5+ selections and get a bonus on your winnings. More legs = bigger boost!',
      terms: ['5+ selections required', 'Min odds 1.20 per selection', '5 legs = 10% boost', '10+ legs = 50% boost'],
      cta: '⚡ Boost My Acca',
      expiresIn: 'Ongoing',
      claimed: true,
    },
    {
      id: 6, category: 'vip',
      emoji: '👑',
      gradient: 'linear-gradient(135deg, #713f12, #ca8a04)',
      badge: { label: 'VIP GOLD+', class: 'bg-black/30 text-[#F59E0B]' },
      title: 'VIP Gold Exclusive Cashback',
      description: 'As a VIP Gold member, enjoy 15% weekly cashback on all sports betting losses.',
      terms: ['VIP Gold & above only', '15% weekly cashback', 'Max TZS 200,000/week', 'Auto-credited every Monday'],
      cta: '👑 Claim VIP Bonus',
      expiresIn: 'Weekly',
      claimed: false,
    },
    {
      id: 7, category: 'vip',
      emoji: '🎰',
      gradient: 'linear-gradient(135deg, #1e1b4b, #3730a3)',
      badge: { label: 'VIP ONLY', class: 'bg-white/20 text-white' },
      title: 'Free Bet Fridays',
      description: 'VIP members get TZS 5,000 free bet every Friday. No deposit required. Bet on anything!',
      terms: ['VIP Silver & above', 'TZS 5,000 free bet weekly', 'Single bets only', 'Min odds 2.00'],
      cta: '🎰 Get Free Bet',
      expiresIn: 'Every Friday',
      claimed: false,
    },
    {
      id: 8, category: 'reload',
      emoji: '🇹🇿',
      gradient: 'linear-gradient(135deg, #14532d, #166534)',
      badge: { label: 'LOCAL SPECIAL', class: 'bg-white/20 text-white' },
      title: 'Tanzania Premier League Boost',
      description: 'Bet on Tanzania Premier League matches and get enhanced odds every matchday.',
      terms: ['Tanzania PL matches only', 'Enhanced odds on selected matches', 'Max stake TZS 50,000', 'Single bets only'],
      cta: '🇹🇿 Bet Local',
      expiresIn: 'Every matchday',
      claimed: false,
    },
  ])
  
  const filteredPromos = computed(() =>
    activeCategory.value === 'all'
      ? allPromos.value
      : allPromos.value.filter(p => p.category === activeCategory.value)
  )
  
  // ---- Promo modal ----
  const showPromoModal = ref(false)
  const selectedPromo  = ref(null)
  const claiming       = ref(null)
  
  const openPromo = (promo) => {
    selectedPromo.value  = promo
    showPromoModal.value = true
  }
  
  const claimPromo = async (promo) => {
    if (!promo || promo.claimed) return
    claiming.value = promo.id
    await new Promise(r => setTimeout(r, 1200))
    const found = allPromos.value.find(p => p.id === promo.id)
    if (found) found.claimed = true
    claiming.value = null
    showPromoModal.value = false
  }
  
  // ---- Promo code ----
  const promoCode   = ref('')
  const applyingCode = ref(false)
  const codeResult   = ref(null)
  
  const applyPromoCode = async () => {
    if (!promoCode.value) return
    applyingCode.value = true
    await new Promise(r => setTimeout(r, 1000))
    codeResult.value = promoCode.value.toUpperCase() === 'SUNBET100'
      ? { valid: true,  message: 'Code applied! TZS 10,000 bonus credited to your account.' }
      : { valid: false, message: 'Invalid or expired promo code. Please try again.' }
    applyingCode.value = false
  }
  </script>
  
  <style scoped>
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  </style>