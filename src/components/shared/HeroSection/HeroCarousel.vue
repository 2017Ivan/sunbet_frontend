<template>
  <div class="carousel-wrapper">
    <!-- Slides -->
    <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="carousel-slide"
        :style="{ background: slide.bg }"
      >
        <!-- Glow blob -->
        <div class="blob" :style="{ background: slide.blob }" />

        <!-- Big emoji -->
        <div class="slide-emoji">{{ slide.emoji }}</div>

        <!-- Content -->
        <div class="slide-content">
          <span class="slide-badge" :style="{ background: slide.badgeBg, borderColor: slide.badgeBorder, color: slide.badgeColor }">
            <span v-if="slide.liveIndicator" class="live-dot" />
            {{ slide.badge }}
          </span>

          <h6 class="slide-title" :style="{ color: slide.titleColor || '#fff' }" v-html="slide.title" />
          <p class="slide-sub">{{ slide.sub }}</p>

          <button class="slide-cta" :style="{ background: slide.ctaBg, color: slide.ctaColor }" @click="$router.push(slide.route)">
            {{ slide.cta }} →
          </button>
        </div>
      </div>
    </div>

    <!-- Prev / Next -->
    <button class="carousel-btn prev" @click="prev">&#8249;</button>
    <button class="carousel-btn next" @click="next">&#8250;</button>

    <!-- Dots -->
    <div class="carousel-dots">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === current }"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const current = ref(0)
let timer = null

const slides = [
  {
    emoji: '🎁',
    badge: '🔥 New User Offer',
    badgeBg: 'rgba(255,255,255,0.15)',
    badgeBorder: 'rgba(255,255,255,0.25)',
    badgeColor: '#fff',
    title: '100% Welcome<br>Bonus Up To TZS 20K',
    titleColor: '#fff',
    sub: 'Deposit TZS 10,000 — play with TZS 20,000 instantly',
    cta: 'Claim Bonus',
    ctaBg: '#fff',
    ctaColor: '#1a0505',
    bg: 'linear-gradient(135deg,#3a0808 0%,#1a0505 50%,#0D0D0D 100%)',
    blob: 'rgba(163,45,45,0.12)',
    route: '/auth/register',
    liveIndicator: false,
  },
  {
    emoji: '🏆',
    badge: '🏆 Mega Jackpot',
    badgeBg: 'rgba(245,158,11,0.2)',
    badgeBorder: 'rgba(245,158,11,0.4)',
    badgeColor: '#F59E0B',
    title: '<span style="color:#F59E0B">TZS 50,000,000</span><br>Jackpot This Weekend',
    titleColor: '#fff',
    sub: 'Pick 13 correct results to win the biggest prize in Tanzania',
    cta: 'Play Jackpot',
    ctaBg: '#F59E0B',
    ctaColor: '#1a0a00',
    bg: 'linear-gradient(135deg,#2a1a00 0%,#3d2500 50%,#0D0D0D 100%)',
    blob: 'rgba(245,158,11,0.10)',
    route: '/sports',
    liveIndicator: false,
  },
  {
    emoji: '⚡',
    badge: 'Live Now',
    badgeBg: 'rgba(255,59,59,0.2)',
    badgeBorder: 'rgba(255,59,59,0.4)',
    badgeColor: '#FF3B3B',
    title: '24 Matches<br>Live Right Now',
    titleColor: '#fff',
    sub: 'Real-time odds • Cash out anytime • In-play betting',
    cta: 'Watch Live',
    ctaBg: '#FF3B3B',
    ctaColor: '#fff',
    bg: 'linear-gradient(135deg,#001a3a 0%,#001228 50%,#0D0D0D 100%)',
    blob: 'rgba(56,125,255,0.10)',
    route: '/live',
    liveIndicator: true,
  },
  {
    emoji: '📱',
    badge: '⚡ Instant Withdrawal',
    badgeBg: 'rgba(34,197,94,0.2)',
    badgeBorder: 'rgba(34,197,94,0.4)',
    badgeColor: '#22C55E',
    title: 'Withdraw Via<br>M-Pesa In 3 Minutes',
    titleColor: '#fff',
    sub: 'No delays. No hidden fees. Your winnings, instantly.',
    cta: 'Withdraw Now',
    ctaBg: '#22C55E',
    ctaColor: '#001a0c',
    bg: 'linear-gradient(135deg,#002a14 0%,#001a0c 50%,#0D0D0D 100%)',
    blob: 'rgba(34,197,94,0.10)',
    route: '/wallet',
    liveIndicator: false,
  },
]

const goTo = (i) => { current.value = i }
const next = () => { current.value = (current.value + 1) % slides.length }
const prev = () => { current.value = (current.value - 1 + slides.length) % slides.length }

const resetTimer = () => {
  clearInterval(timer)
  timer = setInterval(next, 4500)
}

onMounted(() => resetTimer())
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  /* border-radius: 20px; */
  overflow: hidden;
  height: 150px;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.blob {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  pointer-events: none;
}

.slide-emoji {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 100px;
  opacity: 0.3;
  pointer-events: none;
  user-select: none;
}

.slide-content {
  position: relative;
  z-index: 2;
  padding: 28px 28px 36px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slide-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 999px;
  border: 1px solid;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF3B3B;
  animation: pulse 1.5s infinite;
  display: inline-block;
}

.slide-title {
  font-size: 15px;
  font-weight: 900;
  line-height: 1.15;
}

.slide-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  max-width: 380px;
}

.slide-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 24px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  width: fit-content;
  transition: opacity 0.2s;
}
.slide-cta:hover { opacity: 0.88; }

/* Prev / Next buttons */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.carousel-btn:hover { background: rgba(0, 0, 0, 0.7); }
.carousel-btn.prev { left: 14px; }
.carousel-btn.next { right: 14px; }

/* Dots */
.carousel-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 5;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.35s;
  padding: 0;
}
.dot.active {
  width: 22px;
  background: #fff;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
</style>