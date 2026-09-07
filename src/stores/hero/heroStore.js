import { defineStore } from 'pinia'
import { DEFAULT_HERO_SLIDES } from '../../components/ui/HeroSection/heroSlides'

const STORAGE_KEY = 'sunbet_hero_slides_v1'

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES))
}

export const useHeroStore = defineStore('hero', {
  state: () => ({
    slides: cloneDefaults(),
    loaded: false
  }),

  actions: {
    load() {
      if (this.loaded) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          const images = Array.isArray(saved.images) ? saved.images : []
          this.slides = cloneDefaults()
          images.forEach((img, i) => {
            if (img && this.slides[i] && this.slides[i].thumb) {
              this.slides[i].thumb.image = img
            }
          })
        }
      } catch (e) {
        console.warn('[HERO STORE] load failed:', e)
      }
      this.loaded = true
    },

    persist() {
      try {
        const images = this.slides.map((s) => (s.thumb && s.thumb.image) || null)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ images, updatedAt: Date.now() }))
        return true
      } catch (e) {
        console.warn('[HERO STORE] persist failed:', e)
        return false
      }
    },

    setSlideImage(index, dataUrl) {
      if (!this.slides[index] || !this.slides[index].thumb) return false
      this.slides[index].thumb.image = dataUrl
      return this.persist()
    },

    clearSlideImage(index) {
      if (!this.slides[index] || !this.slides[index].thumb) return false
      delete this.slides[index].thumb.image
      return this.persist()
    },

    resetAll() {
      this.slides = cloneDefaults()
      this.persist()
    }
  }
})