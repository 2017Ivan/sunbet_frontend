<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-1 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Main Content - Left Side -->
        <div class="flex-1 min-w-0">
          <slot name="main">
            <!-- Main content itawekwa hapa -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <p class="text-gray-600">Main Content Area</p>
            </div>
          </slot>
        </div>

        <!-- Betslip - Right Side (Desktop only) -->
        <div class="lg:w-80 xl:w-96 flex-shrink-0">
          <slot name="betslip">
            <!-- Betslip itawekwa hapa -->
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <p class="text-gray-600">Betslip Area</p>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <!-- <Footer /> -->

    <!-- Bottom Navigation - Mobile only -->
    <!-- <BottomNav /> -->
  </div>
</template>

<script setup>
import Header from '../components/main components/header/Header.vue'
// import Footer from './Footer.vue'
// import BottomNav from './BottomNav.vue'
</script>

<style scoped>
/* Custom styles if needed */
</style>