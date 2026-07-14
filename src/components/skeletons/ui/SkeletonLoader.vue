<!-- components/ui/skeleton/SkeletonLoader.vue -->
<template>
  <div class="skeleton-wrapper">
    <slot />
  </div>
</template>

<script setup>
// Skeleton loader base component with fade pulse animation
</script>

<style scoped>
.skeleton-wrapper {
  animation: fadePulse 1.8s ease-in-out infinite;
}

@keyframes fadePulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* Apply to all child elements with bg-gray-700 */
.skeleton-wrapper :deep(.bg-gray-700) {
  animation: fadePulse 1.8s ease-in-out infinite;
  border-radius: 0.5rem;
}

/* Different delay for each element to create wave effect */
.skeleton-wrapper :deep(.bg-gray-700:nth-child(1)) {
  animation-delay: 0s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(2)) {
  animation-delay: 0.2s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(3)) {
  animation-delay: 0.4s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(4)) {
  animation-delay: 0.6s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(5)) {
  animation-delay: 0.8s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(6)) {
  animation-delay: 1.0s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(7)) {
  animation-delay: 1.2s;
}
.skeleton-wrapper :deep(.bg-gray-700:nth-child(8)) {
  animation-delay: 1.4s;
}

/* Override specific rounded elements */
.skeleton-wrapper :deep(.rounded-full) {
  border-radius: 9999px;
}

.skeleton-wrapper :deep(.rounded-lg) {
  border-radius: 0.5rem;
}

.skeleton-wrapper :deep(.rounded-xl) {
  border-radius: 0.75rem;
}
</style>