// BetSlip.vue 
<template>
  <!-- Desktop: Sidebar mode -->
  <div v-if="mode === 'desktop'" class="h-full flex flex-col bg-gray-700">
    <BetSlipContent 
      @close="$emit('close')" 
      @place-bet="$emit('place-bet', $event)"
      :show-close-button="false"
    />
  </div>

  <!-- Mobile: Drawer mode -->
  <template v-else>
    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-right">
      <div
        v-if="open"
        class="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#0D0D0D] border-l border-[#2A2A2A] flex flex-col shadow-[−8px_0_40px_rgba(0,0,0,0.6)]"
      >
        <BetSlipContent 
          @close="$emit('close')" 
          @place-bet="$emit('place-bet', $event)"
          :show-close-button="true"
        />
      </div>
    </Transition>
  </template>
</template>

<script setup>
import BetSlipContent from './BetSlipContent.vue'

defineProps({
  mode: {
    type: String,
    default: 'desktop' // 'desktop' au 'drawer'
  },
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'place-bet'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>