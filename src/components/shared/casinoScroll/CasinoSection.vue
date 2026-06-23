<template>
  <section class="casino-section">
    <!-- Header -->
    <div class="section-header">
      <h2 class="section-title">🎰 Casino Games</h2>
      <RouterLink to="/casino" class="see-all">View all →</RouterLink>
    </div>

    <!-- Scroll track — duplicated for infinite loop -->
    <div class="scroll-wrap">
      <div
        class="scroll-track"
        :class="{ paused: hovered }"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <CasinoCard
          v-for="(game, i) in [...games, ...games]"
          :key="`${game.id}-${i}`"
          :game="game"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import CasinoCard from './CasinoCard.vue'

const hovered = ref(false)

const games = [
  { id: 1,  name: 'Lucky Spin',    tag: 'Slots',       emoji: '🎰', bg: 'linear-gradient(135deg,#1a0505,#3a0a0a)', badge: 'HOT' },
  { id: 2,  name: 'Baccarat Live', tag: 'Table Game',  emoji: '🃏', bg: 'linear-gradient(135deg,#001a3a,#003366)', badge: null },
  { id: 3,  name: 'Roulette VIP',  tag: 'Roulette',    emoji: '🎲', bg: 'linear-gradient(135deg,#002a14,#004d26)', badge: 'NEW' },
  { id: 4,  name: 'Poker Pro',     tag: 'Poker',       emoji: '🎴', bg: 'linear-gradient(135deg,#2a1a00,#4d3300)', badge: null },
  { id: 5,  name: 'Crash Game',    tag: 'Instant Win', emoji: '🎮', bg: 'linear-gradient(135deg,#1a0033,#330066)', badge: null },
  { id: 6,  name: 'Blackjack 21',  tag: 'Table Game',  emoji: '🃏', bg: 'linear-gradient(135deg,#1a0505,#500a0a)', badge: 'HOT' },
  { id: 7,  name: 'Dragon Tiger',  tag: 'Asian Games', emoji: '🐉', bg: 'linear-gradient(135deg,#001a3a,#003366)', badge: null },
  { id: 8,  name: 'Book of Ra',    tag: 'Slots',       emoji: '📜', bg: 'linear-gradient(135deg,#002a14,#005229)', badge: 'NEW' },
  { id: 9,  name: 'Wheel Fortune', tag: 'Game Show',   emoji: '🎡', bg: 'linear-gradient(135deg,#2a1a00,#4a3000)', badge: null },
  { id: 10, name: 'Diamond Slots', tag: 'Slots',       emoji: '💎', bg: 'linear-gradient(135deg,#1a0033,#330055)', badge: null },
]
</script>

<style scoped>
.casino-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
}

.see-all {
  font-size: 12px;
  color: #E05555;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.see-all:hover { color: #C94040; }

/* Scroll container */
.scroll-wrap {
  overflow: hidden;
  /* fade edges */
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
}

.scroll-track {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: scrollCasino 32s linear infinite;
}

.scroll-track.paused {
  animation-play-state: paused;
}

@keyframes scrollCasino {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>