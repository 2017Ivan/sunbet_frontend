<template>
    <div class="flex-1 bg-[#161616] border border-[#2A2A2A] rounded-[18px] overflow-hidden flex flex-col">
  
      <!-- ===== MATCH HEADER ===== -->
      <div class="relative bg-gradient-to-br from-[#1a0505] to-[#161616] p-5 border-b border-[#2A2A2A]">
        <div class="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23A32D2D%22 fill-opacity=%221%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22/%3E%3C/g%3E%3C/svg%3E')]" />
  
        <div class="relative z-10">
          <!-- League + Live badge -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ match.leagueFlag }}</span>
              <span class="text-sm font-semibold text-[#A0A0A0]">{{ match.league }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B] text-xs font-bold border border-[#FF3B3B]/25">
                <span class="w-2 h-2 rounded-full bg-[#FF3B3B] animate-pulse" />
                LIVE {{ match.minute }}'
              </span>
              <button
                v-if="$emit"
                class="lg:hidden w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#606060] hover:text-white"
                @click="$emit('close')"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
  
          <!-- Teams + Score -->
          <div class="grid grid-cols-3 gap-4 items-center">
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-[#1E1E1E] border-2 border-[#2A2A2A] mx-auto flex items-center justify-center text-3xl mb-2">
                {{ match.homeFlag }}
              </div>
              <p class="text-sm font-bold text-white">{{ match.home }}</p>
              <p class="text-xs text-[#606060]">Home</p>
            </div>
  
            <div class="text-center">
              <div class="text-4xl font-black text-white tabular-nums mb-1">
                {{ match.score.home }}<span class="text-[#A32D2D]">:</span>{{ match.score.away }}
              </div>
              <p class="text-xs text-[#606060]">HT {{ match.ht.home }}-{{ match.ht.away }}</p>
              <p class="text-[10px] text-[#A32D2D] font-semibold mt-1">{{ match.period }}</p>
            </div>
  
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-[#1E1E1E] border-2 border-[#2A2A2A] mx-auto flex items-center justify-center text-3xl mb-2">
                {{ match.awayFlag }}
              </div>
              <p class="text-sm font-bold text-white">{{ match.away }}</p>
              <p class="text-xs text-[#606060]">Away</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ===== TABS ===== -->
      <div class="flex border-b border-[#2A2A2A] overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-shrink-0 px-5 py-3 text-xs font-semibold border-b-2 transition-all"
          :class="activeTab === tab.id
            ? 'border-[#A32D2D] text-[#A32D2D]'
            : 'border-transparent text-[#606060] hover:text-[#A0A0A0]'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
  
      <!-- ===== TAB CONTENT ===== -->
      <div class="flex-1 overflow-y-auto">
  
        <!-- Markets tab -->
        <div v-if="activeTab === 'markets'" class="p-4 space-y-3">
          <div
            v-for="market in match.markets"
            :key="market.name"
            class="bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] overflow-hidden"
          >
            <!-- Market header -->
            <button
              class="w-full flex items-center justify-between px-4 py-3 hover:bg-[#161616] transition-colors"
              @click="toggleMarket(market.name)"
            >
              <span class="text-sm font-semibold text-[#A0A0A0]">{{ market.name }}</span>
              <svg
                class="w-4 h-4 text-[#606060] transition-transform duration-200"
                :class="collapsedMarkets.includes(market.name) ? 'rotate-180' : ''"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <polyline points="18 15 12 9 6 15"/>
              </svg>
            </button>
  
            <!-- Market odds -->
            <div
              v-if="!collapsedMarkets.includes(market.name)"
              class="px-3 pb-3"
            >
              <div
                class="grid gap-2"
                :class="market.odds.length === 2 ? 'grid-cols-2' : market.odds.length === 3 ? 'grid-cols-3' : 'grid-cols-3'"
              >
                <button
                  v-for="odd in market.odds"
                  :key="odd.label"
                  class="flex flex-col items-center gap-1 py-3 px-2 rounded-[10px] border transition-all duration-150 group"
                  :class="isBetSelected(odd.label)
                    ? 'bg-[#A32D2D] border-[#A32D2D]'
                    : 'bg-[#161616] border-[#2A2A2A] hover:border-[#A32D2D]/50 hover:bg-[#A32D2D]/8'"
                  @click="$emit('bet', match, odd)"
                >
                  <span
                    class="text-[10px] font-medium text-center leading-tight"
                    :class="isBetSelected(odd.label) ? 'text-white/70' : 'text-[#606060]'"
                  >
                    {{ odd.label }}
                  </span>
                  <span
                    class="text-sm font-bold flex items-center gap-1"
                    :class="[
                      isBetSelected(odd.label) ? 'text-white' : 'text-[#A32D2D]',
                      odd.changed === 'up'   ? '!text-[#22C55E]' : '',
                      odd.changed === 'down' ? '!text-[#EF4444]' : '',
                    ]"
                  >
                    {{ odd.value }}
                    <svg v-if="odd.changed === 'up'" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4l8 16H4z"/>
                    </svg>
                    <svg v-if="odd.changed === 'down'" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 20l8-16H4z"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Stats tab -->
        <div v-else-if="activeTab === 'stats'" class="p-4 space-y-3">
  
          <div class="bg-[#0D0D0D] border border-[#2A2A2A] rounded-[12px] p-4 space-y-4">
  
            <!-- Stat row component -->
            <div
              v-for="stat in statRows"
              :key="stat.label"
              class="space-y-1.5"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-white w-8 text-left">{{ stat.home }}</span>
                <span class="text-[#606060] flex-1 text-center">{{ stat.label }}</span>
                <span class="font-bold text-white w-8 text-right">{{ stat.away }}</span>
              </div>
              <div class="flex gap-1 h-1.5 rounded-full overflow-hidden">
                <div
                  class="rounded-l-full bg-[#A32D2D] transition-all duration-700"
                  :style="{ width: (stat.home / (stat.home + stat.away) * 100) + '%' }"
                />
                <div
                  class="rounded-r-full bg-[#C0C0C0] transition-all duration-700"
                  :style="{ width: (stat.away / (stat.home + stat.away) * 100) + '%' }"
                />
              </div>
              <div class="flex justify-between text-[10px] text-[#606060]">
                <span>{{ match.home }}</span>
                <span>{{ match.away }}</span>
              </div>
            </div>
  
          </div>
        </div>
  
        <!-- Timeline tab -->
        <div v-else-if="activeTab === 'timeline'" class="p-4">
          <div class="relative">
            <!-- Centre line -->
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-[#2A2A2A] -translate-x-1/2" />
  
            <div class="space-y-3">
              <div
                v-for="event in [...match.events].reverse()"
                :key="event.minute + event.player"
                class="flex items-center gap-3 relative"
                :class="event.team === 'home' ? 'flex-row-reverse' : ''"
              >
                <!-- Event card -->
                <div
                  class="flex-1 max-w-[42%]"
                  :class="event.team === 'home' ? 'text-right' : 'text-left'"
                >
                  <div
                    class="inline-block bg-[#1E1E1E] border border-[#2A2A2A] rounded-[10px] px-3 py-2"
                  >
                    <p class="text-xs font-semibold text-white">{{ event.player }}</p>
                    <p class="text-[10px] text-[#606060] mt-0.5 capitalize">{{ event.type.replace('_', ' ') }}</p>
                  </div>
                </div>
  
                <!-- Centre: Minute + Icon -->
                <div class="flex flex-col items-center flex-shrink-0 z-10">
                  <div class="w-9 h-9 rounded-full bg-[#161616] border-2 border-[#2A2A2A] flex items-center justify-center text-base">
                    {{ event.icon }}
                  </div>
                  <span class="text-[9px] text-[#606060] mt-1">{{ event.minute }}'</span>
                </div>
  
                <!-- Spacer -->
                <div class="flex-1 max-w-[42%]" />
              </div>
  
              <!-- Kickoff -->
              <div class="flex items-center gap-3">
                <div class="flex-1" />
                <div class="flex flex-col items-center z-10">
                  <div class="w-9 h-9 rounded-full bg-[#A32D2D]/15 border-2 border-[#A32D2D]/30 flex items-center justify-center text-[10px] font-bold text-[#A32D2D]">
                    KO
                  </div>
                  <span class="text-[9px] text-[#606060] mt-1">0'</span>
                </div>
                <div class="flex-1" />
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
    import { useBetSlipStore } from '../../stores/useBetSlipStore'
  
  const props = defineProps({
    match: { type: Object, required: true },
  })
  
  const emit = defineEmits(['bet', 'close'])
  
  const activeTab        = ref('markets')
  const collapsedMarkets = ref([])
  
  const tabs = [
    { id: 'markets',  label: '📊 Markets'  },
    { id: 'stats',    label: '📈 Stats'    },
    { id: 'timeline', label: '⏱ Timeline'  },
  ]
  
  const toggleMarket = (name) => {
    const i = collapsedMarkets.value.indexOf(name)
    i >= 0
      ? collapsedMarkets.value.splice(i, 1)
      : collapsedMarkets.value.push(name)
  }
  


const betSlipStore = useBetSlipStore()

const isBetSelected = (label) => betSlipStore.items.some(b => b.id === `live-${props.match.id}-${label}`)
  
  const statRows = computed(() => [
    { label: 'Possession %',     home: props.match.stats.possession.home,   away: 100 - props.match.stats.possession.home },
    { label: 'Shots',            home: props.match.stats.shots.home,         away: props.match.stats.shots.away            },
    { label: 'Shots on Target',  home: props.match.stats.shotsOnTarget.home, away: props.match.stats.shotsOnTarget.away    },
    { label: 'Corners',          home: props.match.stats.corners.home,       away: props.match.stats.corners.away          },
    { label: 'Yellow Cards',     home: props.match.stats.yellowCards.home,   away: props.match.stats.yellowCards.away      },
  ])
  </script>
  
  <style scoped>
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  </style>