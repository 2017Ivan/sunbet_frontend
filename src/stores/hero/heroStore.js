import { defineStore } from 'pinia'
import { DEFAULT_HERO_SLIDES } from '../../components/ui/HeroSection/heroSlides'
import heroService from '../../services/heroService'

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES))
}

export const useHeroStore = defineStore('hero', {
  state: () => ({
    slides: cloneDefaults(),
    loaded: false,
    loading: false,
    error: null
  }),

  actions: {
    async load() {
      if (this.loaded) return
      this.loading = true
      this.error = null
      try {
        const result = await heroService.getSlides()
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const defaults = cloneDefaults()
          this.slides = result.data.map((apiSlide, i) => {
            const base = defaults[i] || defaults[0]
            return {
              ...base,
              ...apiSlide,
              thumb: {
                ...(base.thumb || {}),
                ...(apiSlide.thumb || {}),
                image: apiSlide.thumb?.image || null
              }
            }
          })
        } else {
          this.slides = cloneDefaults()
        }
      } catch (e) {
        console.warn('[HERO STORE] API load failed, using defaults:', e)
        this.slides = cloneDefaults()
        this.error = e.message
      } finally {
        this.loaded = true
        this.loading = false
      }
    },

    async setSlideImage(index, dataUrl) {
      if (!this.slides[index] || !this.slides[index].thumb) return false
      this.slides[index].thumb.image = dataUrl
      try {
        const result = await heroService.saveSlide(index, { thumb: this.slides[index].thumb })
        if (!result.success) {
          console.warn('[HERO STORE] API save slide failed:', result.message)
        }
      } catch (e) {
        console.warn('[HERO STORE] API save slide error:', e)
      }
      return true
    },

    async clearSlideImage(index) {
      if (!this.slides[index] || !this.slides[index].thumb) return false
      delete this.slides[index].thumb.image
      try {
        await heroService.clearSlide(index)
      } catch (e) {
        console.warn('[HERO STORE] API clear slide error:', e)
      }
      return true
    },

    async persist() {
      try {
        const result = await heroService.saveAllSlides(this.slides)
        if (!result.success) {
          console.warn('[HERO STORE] API persist failed:', result.message)
        }
        return result.success
      } catch (e) {
        console.warn('[HERO STORE] API persist error:', e)
        return false
      }
    },

    async resetAll() {
      try {
        await heroService.resetAll()
      } catch (e) {
        console.warn('[HERO STORE] API reset error:', e)
      }
      this.slides = cloneDefaults()
    }
  }
})
