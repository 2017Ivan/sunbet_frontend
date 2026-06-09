<template>
    <div class="min-h-screen bg-[#0D0D0D]">
  
      <!-- ===== PAGE HEADER ===== -->
      <div class="sticky top-16 z-30 bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-[#1E1E1E]">
        <div class="max-w-screen-xl mx-auto px-4">
          <div class="flex items-center justify-between py-4">
            <div>
              <h1 class="text-xl font-bold text-white">Wallet</h1>
              <p class="text-xs text-[#606060] mt-0.5">Manage your funds securely</p>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              <span class="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span class="text-xs font-semibold text-[#22C55E]">Secure & Encrypted</span>
            </div>
          </div>
  
          <!-- Tabs -->
          <div class="flex gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all"
              :class="activeTab === tab.id
                ? 'border-[#A32D2D] text-[#A32D2D]'
                : 'border-transparent text-[#606060] hover:text-[#A0A0A0]'"
              @click="activeTab = tab.id"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
  
      <div class="max-w-screen-xl mx-auto px-4 py-6">
        <div class="flex gap-6">
  
          <!-- ===== MAIN CONTENT ===== -->
          <div class="flex-1 min-w-0 space-y-5">
  
            <!-- ===== BALANCE CARDS ===== -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
  
              <!-- Main balance -->
              <div class="sm:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#1a0505] via-[#1a0808] to-[#161616] border border-[#A32D2D]/25 rounded-[20px] p-6">
                <div class="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#A32D2D]/10 blur-[60px] pointer-events-none" />
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <div class="w-9 h-9 rounded-[9px] bg-[#A32D2D]/20 border border-[#A32D2D]/30 flex items-center justify-center">
                        <svg class="w-5 h-5 text-[#A32D2D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1"/>
                          <path d="M17 12h4v4h-4a2 2 0 010-4z"/>
                        </svg>
                      </div>
                      <span class="text-sm font-semibold text-[#A0A0A0]">Main Balance</span>
                    </div>
                    <button
                      class="flex items-center gap-1.5 text-xs text-[#606060] hover:text-white transition-colors"
                      @click="balanceVisible = !balanceVisible"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path v-if="balanceVisible" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
                        <path v-else d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle v-if="!balanceVisible" cx="12" cy="12" r="3"/>
                      </svg>
                      {{ balanceVisible ? 'Hide' : 'Show' }}
                    </button>
                  </div>
  
                  <div class="mb-4">
                    <p class="text-4xl font-black text-white tracking-tight">
                      {{ balanceVisible ? 'TZS 125,000' : 'TZS ••••••' }}
                    </p>
                    <p class="text-sm text-[#606060] mt-1">≈ USD {{ balanceVisible ? '48.50' : '••••' }}</p>
                  </div>
  
                  <div class="flex gap-2">
                    <AppButton variant="primary" size="md" @click="activeTab = 'deposit'">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                      </svg>
                      Deposit
                    </AppButton>
                    <AppButton variant="secondary" size="md" @click="activeTab = 'withdraw'">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                      </svg>
                      Withdraw
                    </AppButton>
                  </div>
                </div>
              </div>
  
              <!-- Bonus balance -->
              <div class="bg-[#161616] border border-[#2A2A2A] rounded-[20px] p-5 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 rounded-[8px] bg-[#F59E0B]/15 flex items-center justify-center">
                      <span class="text-base">🎁</span>
                    </div>
                    <span class="text-sm font-semibold text-[#A0A0A0]">Bonus Balance</span>
                  </div>
                  <p class="text-2xl font-black text-[#F59E0B]">TZS 10,000</p>
                  <p class="text-xs text-[#606060] mt-1">Expires in 7 days</p>
                </div>
                <div class="mt-4 pt-4 border-t border-[#2A2A2A]">
                  <div class="flex justify-between text-xs mb-1.5">
                    <span class="text-[#606060]">Wagering progress</span>
                    <span class="text-[#A0A0A0]">3x / 5x</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-[#1E1E1E]">
                    <div class="h-full rounded-full bg-[#F59E0B]" style="width: 60%" />
                  </div>
                </div>
              </div>
            </div>
  
            <!-- ===== DEPOSIT TAB ===== -->
            <Transition name="tab" mode="out-in">
              <div v-if="activeTab === 'deposit'" key="deposit">
  
                <!-- Payment methods -->
                <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5 mb-5">
                  <h3 class="text-sm font-bold text-white mb-4">Select Payment Method</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      v-for="method in paymentMethods"
                      :key="method.id"
                      class="flex flex-col items-center gap-2 p-4 rounded-[14px] border transition-all duration-200"
                      :class="selectedMethod === method.id
                        ? 'bg-[#A32D2D]/10 border-[#A32D2D]/50 shadow-[0_0_16px_rgba(163,45,45,0.2)]'
                        : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#333]'"
                      @click="selectedMethod = method.id"
                    >
                      <div
                        class="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl"
                        :style="{ background: method.bg }"
                      >
                        {{ method.icon }}
                      </div>
                      <span class="text-xs font-semibold text-center leading-tight" :class="selectedMethod === method.id ? 'text-white' : 'text-[#A0A0A0]'">
                        {{ method.name }}
                      </span>
                      <span v-if="method.popular" class="text-[9px] px-1.5 py-0.5 rounded-full bg-[#A32D2D]/20 text-[#C94040] font-bold">
                        Popular
                      </span>
                    </button>
                  </div>
                </div>
  
                <!-- Deposit form -->
                <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
                  <h3 class="text-sm font-bold text-white mb-5">
                    Deposit via {{ paymentMethods.find(m => m.id === selectedMethod)?.name }}
                  </h3>
  
                  <div class="space-y-4">
  
                    <!-- Phone (M-Pesa) -->
                    <div v-if="['mpesa', 'tigopesa', 'airtelmoney', 'halopesa'].includes(selectedMethod)">
                      <AppInput
                        v-model="depositForm.phone"
                        label="Mobile Number"
                        placeholder="+255 7XX XXX XXX"
                        type="tel"
                        :hint="'Enter the ' + paymentMethods.find(m => m.id === selectedMethod)?.name + ' registered number'"
                        :error="depositErrors.phone"
                      >
                        <template #icon-left>
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 006.29 6.29l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                          </svg>
                        </template>
                      </AppInput>
                    </div>
  
                    <!-- Amount -->
                    <div>
                      <label class="text-xs font-medium text-[#A0A0A0] mb-1.5 block">
                        Amount (TZS) <span class="text-[#A32D2D]">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#606060]">TZS</span>
                        <input
                          v-model="depositForm.amount"
                          type="number"
                          placeholder="0"
                          class="w-full h-11 pl-14 pr-4 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30 transition-all"
                          :class="depositErrors.amount ? 'border-[#EF4444]' : ''"
                        />
                      </div>
                      <p v-if="depositErrors.amount" class="text-xs text-[#EF4444] mt-1">{{ depositErrors.amount }}</p>
  
                      <!-- Quick amounts -->
                      <div class="flex gap-2 mt-2 flex-wrap">
                        <button
                          v-for="amt in quickAmounts"
                          :key="amt"
                          class="px-3 py-1.5 rounded-[8px] bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#A32D2D]/40 text-xs font-semibold text-[#A0A0A0] hover:text-white transition-all"
                          @click="depositForm.amount = amt"
                        >
                          {{ amt >= 1000 ? (amt/1000) + 'K' : amt }}
                        </button>
                      </div>
                    </div>
  
                    <!-- Promo code -->
                    <div>
                      <label class="text-xs font-medium text-[#A0A0A0] mb-1.5 block">Promo Code (Optional)</label>
                      <div class="flex gap-2">
                        <input
                          v-model="depositForm.promoCode"
                          type="text"
                          placeholder="Enter promo code"
                          class="flex-1 h-11 px-4 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-sm text-white placeholder:text-[#606060] focus:outline-none transition-all"
                          :class="promoStatus === 'valid' ? 'border-[#22C55E]' : promoStatus === 'invalid' ? 'border-[#EF4444]' : ''"
                        />
                        <AppButton
                          variant="secondary"
                          size="md"
                          :loading="checkingPromo"
                          @click="checkPromoCode"
                        >
                          Apply
                        </AppButton>
                      </div>
                      <p v-if="promoStatus === 'valid'" class="text-xs text-[#22C55E] mt-1">✅ +TZS 10,000 bonus applied!</p>
                      <p v-if="promoStatus === 'invalid'" class="text-xs text-[#EF4444] mt-1">❌ Invalid promo code</p>
                    </div>
  
                    <!-- Summary box -->
                    <div v-if="depositForm.amount" class="bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] p-4 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-[#606060]">Deposit amount</span>
                        <span class="text-white font-semibold">TZS {{ Number(depositForm.amount).toLocaleString() }}</span>
                      </div>
                      <div v-if="promoStatus === 'valid'" class="flex justify-between text-sm">
                        <span class="text-[#606060]">Bonus</span>
                        <span class="text-[#22C55E] font-semibold">+TZS 10,000</span>
                      </div>
                      <div class="flex justify-between text-sm border-t border-[#2A2A2A] pt-2">
                        <span class="text-[#606060]">You'll receive</span>
                        <span class="text-white font-black text-base">
                          TZS {{ (Number(depositForm.amount) + (promoStatus === 'valid' ? 10000 : 0)).toLocaleString() }}
                        </span>
                      </div>
                      <div class="flex justify-between text-xs">
                        <span class="text-[#606060]">Processing time</span>
                        <span class="text-[#22C55E]">Instant</span>
                      </div>
                    </div>
  
                    <!-- Submit -->
                    <AppButton
                      variant="primary"
                      fullWidth
                      size="lg"
                      :loading="processingDeposit"
                      loading-text="Processing..."
                      @click="handleDeposit"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                      </svg>
                      Deposit TZS {{ depositForm.amount ? Number(depositForm.amount).toLocaleString() : '0' }}
                    </AppButton>
  
                    <p class="text-xs text-[#606060] text-center">
                      🔒 Your transaction is protected by 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
  
              <!-- ===== WITHDRAW TAB ===== -->
              <div v-else-if="activeTab === 'withdraw'" key="withdraw">
  
                <!-- Withdraw form -->
                <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5 mb-5">
                  <h3 class="text-sm font-bold text-white mb-1">Withdraw Funds</h3>
                  <p class="text-xs text-[#606060] mb-5">Funds sent directly to your mobile money</p>
  
                  <div class="space-y-4">
  
                    <!-- Method -->
                    <div>
                      <label class="text-xs font-medium text-[#A0A0A0] mb-2 block">Withdraw to</label>
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          v-for="method in paymentMethods"
                          :key="method.id"
                          class="flex items-center gap-2 px-3 py-2.5 rounded-[10px] border transition-all"
                          :class="withdrawForm.method === method.id
                            ? 'bg-[#A32D2D]/10 border-[#A32D2D]/50 text-white'
                            : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#606060] hover:border-[#333]'"
                          @click="withdrawForm.method = method.id"
                        >
                          <span class="text-base">{{ method.icon }}</span>
                          <span class="text-xs font-semibold">{{ method.name }}</span>
                        </button>
                      </div>
                    </div>
  
                    <!-- Phone -->
                    <AppInput
                      v-model="withdrawForm.phone"
                      label="Mobile Number"
                      placeholder="+255 7XX XXX XXX"
                      type="tel"
                      hint="Funds will be sent to this number"
                      :error="withdrawErrors.phone"
                    >
                      <template #icon-left>
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.82a16 16 0 006.29 6.29l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                      </template>
                    </AppInput>
  
                    <!-- Amount -->
                    <div>
                      <label class="text-xs font-medium text-[#A0A0A0] mb-1.5 block">
                        Amount (TZS) <span class="text-[#A32D2D]">*</span>
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#606060]">TZS</span>
                        <input
                          v-model="withdrawForm.amount"
                          type="number"
                          placeholder="0"
                          class="w-full h-11 pl-14 pr-24 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30 transition-all"
                          :class="withdrawErrors.amount ? 'border-[#EF4444]' : ''"
                        />
                        <button
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#A32D2D] hover:text-[#C94040] transition-colors"
                          @click="withdrawForm.amount = 125000"
                        >
                          MAX
                        </button>
                      </div>
                      <div class="flex justify-between text-[10px] mt-1">
                        <span class="text-[#606060]">Min: TZS 1,000</span>
                        <span class="text-[#606060]">Available: <span class="text-white font-semibold">TZS 125,000</span></span>
                      </div>
                      <p v-if="withdrawErrors.amount" class="text-xs text-[#EF4444] mt-1">{{ withdrawErrors.amount }}</p>
  
                      <!-- Quick amounts -->
                      <div class="flex gap-2 mt-2 flex-wrap">
                        <button
                          v-for="amt in quickAmounts"
                          :key="amt"
                          class="px-3 py-1.5 rounded-[8px] bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#A32D2D]/40 text-xs font-semibold text-[#A0A0A0] hover:text-white transition-all"
                          @click="withdrawForm.amount = amt"
                        >
                          {{ amt >= 1000 ? (amt/1000) + 'K' : amt }}
                        </button>
                      </div>
                    </div>
  
                    <!-- PIN -->
                    <div>
                      <label class="text-xs font-medium text-[#A0A0A0] mb-1.5 block">
                        Transaction PIN <span class="text-[#A32D2D]">*</span>
                      </label>
                      <div class="flex gap-3">
                        <input
                          v-for="i in 4"
                          :key="i"
                          :ref="el => pinInputs[i-1] = el"
                          v-model="pin[i-1]"
                          type="password"
                          maxlength="1"
                          class="w-12 h-12 rounded-[10px] bg-[#1E1E1E] border border-[#2A2A2A] focus:border-[#A32D2D] text-white text-center text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#A32D2D]/30 transition-all"
                          :class="withdrawErrors.pin ? 'border-[#EF4444]' : ''"
                          @input="onPinInput(i-1, $event)"
                          @keydown.backspace="onPinBackspace(i-1)"
                        />
                      </div>
                      <p v-if="withdrawErrors.pin" class="text-xs text-[#EF4444] mt-1">{{ withdrawErrors.pin }}</p>
                      <p class="text-[10px] text-[#606060] mt-1">Enter your 4-digit SunBet PIN</p>
                    </div>
  
                    <!-- Summary -->
                    <div v-if="withdrawForm.amount" class="bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] p-4 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-[#606060]">Withdraw amount</span>
                        <span class="text-white font-semibold">TZS {{ Number(withdrawForm.amount).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-[#606060]">Processing fee</span>
                        <span class="text-[#22C55E] font-semibold">FREE</span>
                      </div>
                      <div class="flex justify-between text-sm border-t border-[#2A2A2A] pt-2">
                        <span class="text-[#606060]">You'll receive</span>
                        <span class="text-white font-black text-base">TZS {{ Number(withdrawForm.amount).toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between text-xs">
                        <span class="text-[#606060]">Processing time</span>
                        <span class="text-[#22C55E]">~3 minutes</span>
                      </div>
                    </div>
  
                    <AppButton
                      variant="primary"
                      fullWidth
                      size="lg"
                      :loading="processingWithdraw"
                      loading-text="Processing..."
                      @click="handleWithdraw"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                      </svg>
                      Withdraw TZS {{ withdrawForm.amount ? Number(withdrawForm.amount).toLocaleString() : '0' }}
                    </AppButton>
                  </div>
                </div>
              </div>
  
              <!-- ===== TRANSACTIONS TAB ===== -->
              <div v-else-if="activeTab === 'transactions'" key="transactions">
  
                <!-- Filters -->
                <div class="flex flex-wrap gap-3 mb-5">
                  <div class="flex gap-1 p-1 bg-[#161616] rounded-[10px] border border-[#2A2A2A]">
                    <button
                      v-for="f in txFilters"
                      :key="f.id"
                      class="px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all"
                      :class="txFilter === f.id
                        ? 'bg-[#A32D2D] text-white'
                        : 'text-[#606060] hover:text-white'"
                      @click="txFilter = f.id"
                    >
                      {{ f.label }}
                    </button>
                  </div>
  
                  <select
                    v-model="txDateFilter"
                    class="h-9 px-3 rounded-[10px] bg-[#161616] border border-[#2A2A2A] text-xs text-[#A0A0A0] focus:border-[#A32D2D] focus:outline-none"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
  
                <!-- Transactions list -->
                <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden">
                  <div class="divide-y divide-[#1E1E1E]">
                    <div
                      v-for="tx in filteredTransactions"
                      :key="tx.id"
                      class="flex items-center gap-4 px-5 py-4 hover:bg-[#1E1E1E] transition-colors"
                    >
                      <!-- Icon -->
                      <div
                        class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                        :class="txIconBg(tx.type)"
                      >
                        {{ txIcon(tx.type) }}
                      </div>
  
                      <!-- Info -->
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-white truncate">{{ tx.description }}</p>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span class="text-[10px] text-[#606060]">{{ tx.date }}</span>
                          <span class="w-1 h-1 rounded-full bg-[#333]" />
                          <span class="text-[10px] text-[#606060]">{{ tx.method }}</span>
                          <span class="w-1 h-1 rounded-full bg-[#333]" />
                          <span
                            class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            :class="txStatusClass(tx.status)"
                          >
                            {{ tx.status }}
                          </span>
                        </div>
                      </div>
  
                      <!-- Amount + ref -->
                      <div class="text-right flex-shrink-0">
                        <p
                          class="text-sm font-black"
                          :class="tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus'
                            ? 'text-[#22C55E]'
                            : 'text-[#EF4444]'"
                        >
                          {{ tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus' ? '+' : '-' }}TZS {{ tx.amount.toLocaleString() }}
                        </p>
                        <p class="text-[10px] text-[#606060] mt-0.5">#{{ tx.ref }}</p>
                      </div>
                    </div>
  
                    <!-- Empty -->
                    <div v-if="!filteredTransactions.length" class="py-16 flex flex-col items-center gap-3">
                      <span class="text-4xl">📭</span>
                      <p class="text-sm text-[#606060]">No transactions found</p>
                    </div>
                  </div>
                </div>
  
                <!-- Load more -->
                <button
                  class="w-full mt-4 py-3 rounded-[12px] border border-[#2A2A2A] text-sm text-[#606060] hover:text-white hover:border-[#333] transition-all"
                >
                  Load more transactions
                </button>
              </div>
            </Transition>
  
          </div>
  
          <!-- ===== RIGHT SIDEBAR (desktop) ===== -->
          <aside class="hidden lg:block w-72 flex-shrink-0 space-y-4">
  
            <!-- Quick stats -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <h3 class="text-sm font-bold text-white mb-4">This Month</h3>
              <div class="space-y-3">
                <div
                  v-for="stat in walletStats"
                  :key="stat.label"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-[7px] flex items-center justify-center" :class="stat.iconBg">
                      <span class="text-sm">{{ stat.icon }}</span>
                    </div>
                    <span class="text-xs text-[#606060]">{{ stat.label }}</span>
                  </div>
                  <span class="text-sm font-bold" :class="stat.color">{{ stat.value }}</span>
                </div>
              </div>
            </div>
  
            <!-- Payment info -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <h3 class="text-sm font-bold text-white mb-4">Payment Methods</h3>
              <div class="space-y-2">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="flex items-center gap-3 p-3 rounded-[10px] bg-[#1E1E1E]"
                >
                  <span class="text-lg">{{ method.icon }}</span>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-white">{{ method.name }}</p>
                    <p class="text-[10px] text-[#606060]">Instant • Free</p>
                  </div>
                  <div class="w-2 h-2 rounded-full bg-[#22C55E]" />
                </div>
              </div>
            </div>
  
            <!-- Security -->
            <div class="bg-[#161616] border border-[#2A2A2A] rounded-[18px] p-5">
              <h3 class="text-sm font-bold text-white mb-3">Security</h3>
              <div class="space-y-2.5">
                <div
                  v-for="item in securityItems"
                  :key="item.label"
                  class="flex items-center gap-3"
                >
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="item.done ? 'bg-[#22C55E]/20' : 'bg-[#EF4444]/20'"
                  >
                    <svg v-if="item.done" class="w-2.5 h-2.5 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <svg v-else class="w-2.5 h-2.5 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </div>
                  <span class="text-xs text-[#A0A0A0]">{{ item.label }}</span>
                </div>
              </div>
            </div>
  
          </aside>
        </div>
      </div>
  
      <!-- ===== SUCCESS MODAL ===== -->
      <AppModal v-model="showSuccessModal" size="sm">
        <div class="flex flex-col items-center gap-4 py-4">
          <div class="w-16 h-16 rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E]/30 flex items-center justify-center">
            <svg class="w-8 h-8 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-bold text-white">{{ successMessage.title }}</h3>
            <p class="text-sm text-[#606060] mt-1">{{ successMessage.subtitle }}</p>
          </div>
          <div class="w-full bg-[#0D0D0D] rounded-[12px] p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#606060]">Amount</span>
              <span class="text-white font-bold">{{ successMessage.amount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[#606060]">Reference</span>
              <span class="text-white font-mono text-xs">{{ successMessage.ref }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[#606060]">Status</span>
              <span class="text-[#22C55E] font-semibold">✅ {{ successMessage.status }}</span>
            </div>
          </div>
          <AppButton variant="primary" fullWidth @click="showSuccessModal = false">
            Done
          </AppButton>
        </div>
      </AppModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import AppButton from '../components/ui/AppButton.vue'
  import AppInput  from '../components/ui/AppInput.vue'
  import AppModal  from '../components/ui/AppModal.vue'
  
  // ---- Tabs ----
  const activeTab = ref('deposit')
  const tabs = [
    { id: 'deposit',      icon: '⬇️', label: 'Deposit'      },
    { id: 'withdraw',     icon: '⬆️', label: 'Withdraw'     },
    { id: 'transactions', icon: '📋', label: 'Transactions'  },
  ]
  
  // ---- Balance ----
  const balanceVisible = ref(true)
  
  // ---- Payment methods ----
  const selectedMethod = ref('mpesa')
  const paymentMethods = [
    { id: 'mpesa',      name: 'M-Pesa',       icon: '📱', bg: '#00a651',  popular: true  },
    { id: 'tigopesa',   name: 'Tigo Pesa',    icon: '📲', bg: '#0099d6',  popular: false },
    { id: 'airtelmoney',name: 'Airtel Money', icon: '💳', bg: '#e40000',  popular: false },
    { id: 'halopesa',   name: 'HaloPesa',     icon: '🏦', bg: '#7b2d8b',  popular: false },
  ]
  
  // ---- Quick amounts ----
  const quickAmounts = [1000, 5000, 10000, 20000, 50000, 100000]
  
  // ---- Deposit form ----
  const depositForm = ref({ phone: '', amount: '', promoCode: '' })
  const depositErrors = ref({ phone: '', amount: '' })
  const processingDeposit = ref(false)
  const checkingPromo     = ref(false)
  const promoStatus       = ref(null) // null | 'valid' | 'invalid'
  
  const handleDeposit = async () => {
    depositErrors.value = { phone: '', amount: '' }
    let valid = true
  
    if (!depositForm.value.phone && ['mpesa','tigopesa','airtelmoney','halopesa'].includes(selectedMethod.value)) {
      depositErrors.value.phone = 'Phone number is required'; valid = false
    }
    if (!depositForm.value.amount || depositForm.value.amount < 1000) {
      depositErrors.value.amount = 'Minimum deposit is TZS 1,000'; valid = false
    }
    if (!valid) return
  
    processingDeposit.value = true
    await new Promise(r => setTimeout(r, 2000))
    processingDeposit.value = false
  
    successMessage.value = {
      title:    'Deposit Successful!',
      subtitle: 'Your account has been credited',
      amount:   `TZS ${Number(depositForm.value.amount).toLocaleString()}`,
      ref:      'TXN' + Math.random().toString(36).substring(2,10).toUpperCase(),
      status:   'Completed',
    }
    showSuccessModal.value = true
    depositForm.value = { phone: '', amount: '', promoCode: '' }
    promoStatus.value = null
  }
  
  const checkPromoCode = async () => {
    if (!depositForm.value.promoCode) return
    checkingPromo.value = true
    await new Promise(r => setTimeout(r, 800))
    promoStatus.value   = depositForm.value.promoCode.toUpperCase() === 'SUNBET100' ? 'valid' : 'invalid'
    checkingPromo.value = false
  }
  
  // ---- Withdraw form ----
  const withdrawForm   = ref({ phone: '', amount: '', method: 'mpesa' })
  const withdrawErrors = ref({ phone: '', amount: '', pin: '' })
  const processingWithdraw = ref(false)
  const pin       = ref(['', '', '', ''])
  const pinInputs = ref([])
  
  const onPinInput = (index, event) => {
    const val = event.target.value.replace(/\D/g, '')
    pin.value[index] = val
    if (val && index < 3) pinInputs.value[index + 1]?.focus()
  }
  
  const onPinBackspace = (index) => {
    if (!pin.value[index] && index > 0) {
      pin.value[index - 1] = ''
      pinInputs.value[index - 1]?.focus()
    }
  }
  
  const handleWithdraw = async () => {
    withdrawErrors.value = { phone: '', amount: '', pin: '' }
    let valid = true
  
    if (!withdrawForm.value.phone) {
      withdrawErrors.value.phone = 'Phone number is required'; valid = false
    }
    if (!withdrawForm.value.amount || withdrawForm.value.amount < 1000) {
      withdrawErrors.value.amount = 'Minimum withdrawal is TZS 1,000'; valid = false
    }
    if (withdrawForm.value.amount > 125000) {
      withdrawErrors.value.amount = 'Insufficient balance'; valid = false
    }
    if (pin.value.join('').length < 4) {
      withdrawErrors.value.pin = 'Enter your 4-digit PIN'; valid = false
    }
    if (!valid) return
  
    processingWithdraw.value = true
    await new Promise(r => setTimeout(r, 2500))
    processingWithdraw.value = false
  
    successMessage.value = {
      title:    'Withdrawal Initiated!',
      subtitle: 'Funds sent to your mobile number',
      amount:   `TZS ${Number(withdrawForm.value.amount).toLocaleString()}`,
      ref:      'WTH' + Math.random().toString(36).substring(2,10).toUpperCase(),
      status:   'Processing (~3 min)',
    }
    showSuccessModal.value = true
    withdrawForm.value = { phone: '', amount: '', method: 'mpesa' }
    pin.value = ['', '', '', '']
  }
  
  // ---- Transactions ----
  const txFilter     = ref('all')
  const txDateFilter = ref('all')
  
  const txFilters = [
    { id: 'all',      label: 'All'      },
    { id: 'deposit',  label: '⬇ Deposits'  },
    { id: 'withdraw', label: '⬆ Withdrawals' },
    { id: 'bet',      label: '🎯 Bets'   },
    { id: 'win',      label: '🏆 Wins'   },
  ]
  
  const transactions = ref([
    { id: 1,  type: 'win',      description: 'Bet Win — Accumulator x4',     amount: 306000, method: 'Wallet',   date: 'Today 18:42',       status: 'Completed', ref: 'WIN001A2B' },
    { id: 2,  type: 'bet',      description: 'Bet Placed — SB001 Acca x5',   amount: 10000,  method: 'Wallet',   date: 'Today 14:32',       status: 'Active',    ref: 'BET9X2K3L' },
    { id: 3,  type: 'deposit',  description: 'Deposit via M-Pesa',            amount: 50000,  method: 'M-Pesa',   date: 'Today 12:00',       status: 'Completed', ref: 'DEP4M5N6P' },
    { id: 4,  type: 'bet',      description: 'Bet Placed — SB002 Single',     amount: 25000,  method: 'Wallet',   date: 'Today 16:10',       status: 'Active',    ref: 'BET7Q8R9S' },
    { id: 5,  type: 'bonus',    description: 'Welcome Bonus Credited',         amount: 10000,  method: 'Bonus',    date: 'Yesterday 10:00',   status: 'Completed', ref: 'BON2T3U4V' },
    { id: 6,  type: 'withdraw', description: 'Withdrawal to M-Pesa',          amount: 80000,  method: 'M-Pesa',   date: 'Yesterday 15:30',   status: 'Completed', ref: 'WTH5W6X7Y' },
    { id: 7,  type: 'deposit',  description: 'Deposit via Tigo Pesa',         amount: 30000,  method: 'Tigo Pesa',date: '2 days ago 09:15',  status: 'Completed', ref: 'DEP8Z9A1B' },
    { id: 8,  type: 'win',      description: 'Bet Win — Double x2',           amount: 43500,  method: 'Wallet',   date: '3 days ago 22:00',  status: 'Completed', ref: 'WIN2C3D4E' },
    { id: 9,  type: 'bet',      description: 'Bet Placed — Single',           amount: 50000,  method: 'Wallet',   date: '4 days ago 17:00',  status: 'Lost',      ref: 'BET5F6G7H' },
    { id: 10, type: 'deposit',  description: 'Deposit via Airtel Money',      amount: 100000, method: 'Airtel',   date: '5 days ago 11:00',  status: 'Completed', ref: 'DEP8I9J1K' },
  ])
  
  const filteredTransactions = computed(() => {
    let list = transactions.value
    if (txFilter.value !== 'all') list = list.filter(t => t.type === txFilter.value)
    return list
  })
  
  // ---- TX helpers ----
  const txIcon = (type) => ({
    deposit:  '⬇️',
    withdraw: '⬆️',
    bet:      '🎯',
    win:      '🏆',
    bonus:    '🎁',
  }[type] || '💳')
  
  const txIconBg = (type) => ({
    deposit:  'bg-[#22C55E]/15',
    withdraw: 'bg-[#EF4444]/15',
    bet:      'bg-[#A32D2D]/15',
    win:      'bg-[#F59E0B]/15',
    bonus:    'bg-[#F59E0B]/15',
  }[type] || 'bg-[#1E1E1E]')
  
  const txStatusClass = (status) => ({
    'Completed': 'bg-[#22C55E]/15 text-[#22C55E]',
    'Active':    'bg-[#F59E0B]/15 text-[#F59E0B]',
    'Processing':'bg-[#F59E0B]/15 text-[#F59E0B]',
    'Lost':      'bg-[#EF4444]/15 text-[#EF4444]',
    'Failed':    'bg-[#EF4444]/15 text-[#EF4444]',
  }[status] || 'bg-[#1E1E1E] text-[#606060]')
  
  // ---- Wallet stats sidebar ----
  const walletStats = [
    { label: 'Total Deposited',  icon: '⬇️', iconBg: 'bg-[#22C55E]/15', value: 'TZS 480K',  color: 'text-[#22C55E]' },
    { label: 'Total Withdrawn',  icon: '⬆️', iconBg: 'bg-[#EF4444]/15', value: 'TZS 80K',   color: 'text-[#EF4444]' },
    { label: 'Total Staked',     icon: '🎯', iconBg: 'bg-[#A32D2D]/15', value: 'TZS 230K',  color: 'text-white'     },
    { label: 'Total Winnings',   icon: '🏆', iconBg: 'bg-[#F59E0B]/15', value: 'TZS 438K',  color: 'text-[#F59E0B]' },
    { label: 'Net Profit',       icon: '📈', iconBg: 'bg-[#22C55E]/15', value: '+TZS 132K', color: 'text-[#22C55E]' },
  ]
  
  // ---- Security ----
  const securityItems = [
    { label: 'Phone verified',         done: true  },
    { label: 'Email verified',         done: false },
    { label: '2FA enabled',            done: false },
    { label: 'KYC completed',          done: true  },
    { label: 'Transaction PIN set',    done: true  },
  ]
  
  // ---- Success modal ----
  const showSuccessModal = ref(false)
  const successMessage   = ref({
    title: '', subtitle: '', amount: '', ref: '', status: ''
  })
  </script>
  
  <style scoped>
  .tab-enter-active, .tab-leave-active { transition: all 0.2s ease; }
  .tab-enter-from { opacity: 0; transform: translateY(8px);  }
  .tab-leave-to   { opacity: 0; transform: translateY(-8px); }
  </style>