<template>
  <div class="min-h-screen bg-white lg:px-45">
    <!-- Header -->
      <Header />
  

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto   ">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Main Content - Left Side -->
        <div class="flex-1 min-w-0">
          <slot name="main">
            <router-view></router-view>
          </slot>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pb-[50px] lg:pb-0">
      <Footer />
    </div>

    <!-- Bottom Navigation - Mobile only -->
    <BottomNav />
  </div>
</template>

<script setup>
import Header from '../../components/main components/header/Header.vue'
import Footer from '../../components/main components/footer/Footer.vue'
import BottomNav from '../../components/main components/BottomNav/BottomNav.vue'
</script>

<style scoped>
/* Custom styles if needed */
</style>