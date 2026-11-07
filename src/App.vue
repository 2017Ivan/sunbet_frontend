<!-- App.vue -->
<template>
  <router-view />
  <PwaInstallPrompt />
</template>

<script setup>
import PwaInstallPrompt from './components/ui/PwaInstallPrompt.vue'
</script>