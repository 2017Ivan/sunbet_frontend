<template>
  <footer class="bg-gray-900 text-gray-300 border-t border-gray-800 ">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 gap-5">
      
      <!-- TOP ROW: Brand + Official Partner + LALIGA -->
      <div class="flex flex-row sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 text-center sm:text-left">
        
        <!-- Brand -->
        <div class="flex items-center space-x-2">
    
          <span class="text-white font-bold text-lg sm:text-2xl"><span class="text-xl text-rose-900">Sun</span><span class="text-rose-400 font-bold">Bet</span></span>
        </div>
        
        <!-- Official Sports Betting Partner -->
       <div class="w-[110px] border-x-1 border-gray-500 px-1">
        <span class="text-gray-400 text-sm sm:text-base">
          Official Sun Betting Partner
        </span>
        </div>
        
        <!-- LALIGA -->
        <div class="flex flex-col items-center sm:items-end">
          <span class="text-xs text-gray-500 uppercase tracking-wider font-semibold underline decoration-dotted decoration-rose-500 underline-offset-2">LALIGA</span>
          <!-- <div class="w-8 h-0.5 bg-rose-500 rounded mt-0.5 underline decoration-dotted underline-offset-2"></div> -->
        </div>
        
      </div>
      
    
      <!-- Description -->
     <div class="flex my-1.5 items-center justify-center">
      <p class="text-gray-400 text-xs text-center">
        The world's most visited betting platform
      </p>
      </div>
      
   
      <!-- Payment Methods -->
      <div class="text-center mt-5">
        <p class="text-gray-500 text-xs uppercase tracking-wider mb-3 font-extrabold italic">Payment methods</p>
        <div class="flex items-center justify-center space-x-8">
          <span class="text-white/30 font-bold text-sm">Airtel</span>
          <span class="text-white/30 font-bold text-sm">Vodacom</span>
           <span class="text-white/30 font-bold text-sm">Yas</span>
          <span class="text-white/30 font-bold text-sm">Halotel</span>
        </div>
      </div>
 
      
      <!-- Region Links -->
      <div class="flex items-center justify-center space-x-2 text-center my-6">
        <a href="#" class="text-xs text-gray-500 hover:text-rose-400 transition-colors underline decoration-dotted underline-offset-2">SunBet TZ</a>
        <span class="text-gray-600 text-xs">|</span>
        <a href="#" class="text-xs text-gray-500 hover:text-rose-400 transition-colors underline decoration-dotted underline-offset-2">SunBet UG</a>
      </div>
      
  
      <!-- Responsible Gambling -->
      <div class="text-center space-y-2 max-w-2xl mx-auto">
        <div class="flex items-center justify-center space-x-2">
          <span class="text-rose-500 font-bold text-sm">18+</span>
          <p class="text-gray-400 text-xs">
            Age 18 and above only. Play Responsibly.
          </p>
        </div>
        <p class="text-gray-500 text-xs">
          Betting is addictive and can be psychologically harmful.
        </p>
        <p class="text-gray-500 text-xs">
          SunBet Tanzania is licensed by the Gaming Board of Tanzania.
        </p>
      </div>
      
      <!-- Divider -->
      <div class="my-4 sm:my-6 border-t-2 border-gray-500"></div>
      
      <!-- Bottom Links -->
      <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <a href="#" class="text-gray-400 hover:text-rose-400 transition-colors text-xs underline decoration-dotted decoration-rose-900 underline-offset-2">Terms & Conditions</a>
        <span class="text-gray-600 text-xs hidden xs:inline">|</span>
        <a href="#" class="text-gray-400 hover:text-rose-400 transition-colors text-xs underline decoration-dotted decoration-rose-900 underline-offset-2">About Us</a>
        <span class="text-gray-600 text-xs hidden xs:inline">|</span>
        <a href="#" class="text-gray-400 hover:text-rose-400 transition-colors text-xs underline decoration-dotted decoration-rose-900 underline-offset-2" >System Status</a>
      </div>
      
      <!-- Back to Top & Copyright -->
      <div class="mt-6 flex flex-col items-center">
        <!-- Back to Top Button -->
        <button 
          @click="scrollToTop" 
          class="flex flex-col my-2 py-2 justify-center text-gray-300 hover:text-rose-400 transition-colors text-xs flex items-center space-x-1  space-y-3 bg-gray-600 w-full "
        >
          <span>Back to Top</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        <!-- Copyright -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 text-xs">18+</span>
          <span class="text-gray-600 text-xs">|</span>
          <span class="text-gray-500 text-xs">© 2026 SunBet. All rights reserved.</span>
        </div>
      </div>
      
    </div>
  </footer>
</template>

<script setup>
// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
/* Custom styles if needed */
</style>