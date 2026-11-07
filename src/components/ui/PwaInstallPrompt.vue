<template>
  <Transition name="install-prompt">
    <aside
      v-if="isPromptVisible"
      class="fixed bottom-24 left-3 right-3 z-[100] rounded-xl border border-slate-200 bg-white p-4 sm:bottom-5 sm:left-auto sm:right-5 sm:w-96"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <img
          src="/sunbet_logo.svg"
          alt=""
          class="h-11 w-11 shrink-0 rounded-lg"
        />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-900">Install SunBet</p>
          <p v-if="isIos" class="mt-1 text-xs leading-relaxed text-slate-600">
            Tap Share in your browser, then choose “Add to Home Screen”.
          </p>
          <p v-else-if="installError" class="mt-1 text-xs leading-relaxed text-rose-700">
            {{ installError }}
          </p>
          <p v-else class="mt-1 text-xs leading-relaxed text-slate-600">
            Add SunBet to your home screen for quick access.
          </p>
        </div>
        <button
          type="button"
          class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Dismiss install message"
          @click="dismissPrompt"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="m5.2 5.2 9.6 9.6m0-9.6-9.6 9.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <button
        v-if="installPrompt && !installError"
        type="button"
        class="mt-3 w-full rounded-lg bg-rose-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-800"
        @click="installApp"
      >
        Install app
      </button>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'

const installPrompt = shallowRef(null)
const isInstalled = ref(false)
const isDismissed = ref(false)
const isIos = ref(false)
const installError = ref('')

const isPromptVisible = computed(() => (
  !isInstalled.value
  && !isDismissed.value
  && (Boolean(installPrompt.value) || isIos.value || Boolean(installError.value))
))

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
  if (!isDismissed.value && !isInstalled.value) {
    installPrompt.value = event
  }
}

const handleAppInstalled = () => {
  isInstalled.value = true
  installPrompt.value = null
}

const dismissPrompt = () => {
  isDismissed.value = true
}

const installApp = async () => {
  const promptEvent = installPrompt.value
  if (!promptEvent) return

  installPrompt.value = null
  try {
    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    if (choice.outcome === 'accepted') {
      isInstalled.value = true
    } else {
      isDismissed.value = true
    }
  } catch (error) {
    console.error('[PWA INSTALL] Unable to open the browser install prompt:', error)
    installError.value = 'Could not open the install prompt. Try installing from your browser menu.'
  }
}

onMounted(() => {
  const userAgent = navigator.userAgent || ''
  isIos.value = /iphone|ipad|ipod/i.test(userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  isInstalled.value = window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
.install-prompt-enter-active,
.install-prompt-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.install-prompt-enter-from,
.install-prompt-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
