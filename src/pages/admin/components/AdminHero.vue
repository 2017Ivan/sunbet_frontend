<!-- AdminHero.vue - Upload thumbnail images for homepage hero slider -->
<template>
  <div class="space-y-6">
    <!-- Intro -->
    <div class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-6">
      <h3 class="text-lg font-bold text-white mb-1">🖼️ Hero Banner Thumbnails</h3>
      <p class="text-xs text-gray-500">
        Pakia picha ya thumbnail kwa kila slide inayoonekana juu ya homepage. Picha inabadilishwa papo hapo (stored kwenye browser) - ukiachisha tupu, bet-card ya kawaida itaendelea kuonyeshwa.
      </p>

      <div class="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div class="text-xs text-emerald-400 font-semibold">
          ✓ Mabadiliko yanaonekana mara moja kwenye homepage
        </div>

        <div class="flex gap-2">
          <button
            @click="saveAll"
            class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 text-sm font-bold"
          >
            💾 Save All
          </button>
          <button
            @click="resetAll"
            class="px-5 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] text-gray-400 rounded-lg hover:text-red-400 hover:border-red-500/40 transition-all duration-300 text-sm font-semibold"
          >
            ↺ Reset All
          </button>
        </div>
      </div>
    </div>

    <!-- Slide cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-5"
      >
        <!-- Slide # + current image badge -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-rose-400 uppercase tracking-wider">Slide {{ i + 1 }}</span>
            <span
              v-if="hasImage(slide)"
              class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold"
            >
              ✓ Image set
            </span>
            <span
              v-else
              class="text-[10px] px-2 py-0.5 rounded-full bg-[#2A2A2A] text-gray-400 font-semibold"
            >
              Default bet-card
            </span>
          </div>
          <button
            v-if="hasImage(slide)"
            @click="removeImage(i)"
            class="text-[11px] text-red-400 hover:text-red-300 font-semibold"
          >
            ✕ Remove
          </button>
        </div>

        <!-- Mini preview -->
        <div class="relative overflow-hidden rounded-xl h-32 border border-[#2A2A2A]"
             :style="{ background: slide.bg }">
          <img
            v-if="hasImage(slide)"
            :src="slide.thumb.image"
            alt="thumbnail"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <template v-else>
            <div
              class="absolute -top-[30px] -right-[30px] w-[150px] h-[90px] rounded-full pointer-events-none blur-2xl opacity-60"
              :style="{ background: slide.blob }"
            />
            <div class="absolute inset-0 z-10 flex items-center p-3">
              <div class="flex flex-col gap-1 max-w-[55%]">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase w-fit"
                  :style="{ background: slide.badgeBg, borderColor: slide.badgeBorder, color: slide.badgeColor }"
                >
                  {{ slide.badge }}
                </span>
                <h6 class="text-[11px] font-black leading-tight text-white line-clamp-2" v-html="slide.title" />
                <span class="text-[9px] text-white/60 hidden sm:block">{{ slide.cta }} →</span>
              </div>
              <div class="ml-auto">
                <div
                  class="w-28 h-20 rounded-lg bg-[#151515]/80 border border-white/10 flex items-center justify-center"
                >
                  <span class="text-[9px] text-white/40 font-semibold px-2 text-center">No image<br>shows bet-card</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Upload controls -->
        <div class="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            :id="'heroFile' + i"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange($event, i)"
          />
          <label
            :for="'heroFile' + i"
            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] text-white text-sm hover:border-rose-500/50 hover:bg-[#151515] transition-colors cursor-pointer"
          >
            <span class="text-base">📤</span>
            {{ hasImage(slide) ? 'Change Image' : 'Upload Image' }}
          </label>
        </div>

        <p class="mt-3 text-[11px] text-gray-500">
          Picha inachukua upana mzima wa hero (~21:4/16:5). Tumia landscape pana • files auto-compressed kwenye browser
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import { useHeroStore } from '../../../stores/hero/heroStore'

const toast = useToast()
const heroStore = useHeroStore()
const { slides } = storeToRefs(heroStore)

const hasImage = (slide) => !!(slide.thumb && slide.thumb.image)

onMounted(() => {
  heroStore.load()
})

const readAndCompressImage = (file, maxWidth = 900) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Imeshindikana kusoma file'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('File si picha halali'))
      img.onload = () => {
        const ratio = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * ratio))
        canvas.height = Math.max(1, Math.round(img.height * ratio))
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const onFileChange = async (e, index) => {
  const file = e.target.files && e.target.files[0]
  e.target.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Tafadhali chagua file la picha', { position: 'bottom-right', timeout: 4000 })
    return
  }

  try {
    const dataUrl = await readAndCompressImage(file)
    const ok = heroStore.setSlideImage(index, dataUrl)
    if (ok) {
      toast.success(`✅ Slide ${index + 1}: thumbnail imehifadhiwa!`, { position: 'bottom-right', timeout: 4000 })
    } else {
      toast.error('Picha ni kubwa mno - jaribu picha ndogo', { position: 'bottom-right', timeout: 4000 })
    }
  } catch (err) {
    toast.error(err.message || 'Imeshindikana kupakia picha', { position: 'bottom-right', timeout: 4000 })
  }
}

const removeImage = (index) => {
  heroStore.clearSlideImage(index)
  toast.info(`Slide ${index + 1}: imerejeshwa kwenye default bet-card`, { position: 'bottom-right', timeout: 4000 })
}

const saveAll = () => {
  heroStore.persist()
  toast.success('✅ Thumbnails zote zimehifadhiwa!', { position: 'bottom-right', timeout: 4000 })
}

const resetAll = () => {
  const confirmReset = window.confirm('Unataka kufuta thumbnails zote na kurudi kwenye default?')
  if (!confirmReset) return
  heroStore.resetAll()
  toast.success('↺ Imerejeshwa kwenye default', { position: 'bottom-right', timeout: 4000 })
}
</script>