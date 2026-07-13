<template>
  <div class="min-h-screen bg-[#0D0D0D]">
    <!-- Mobile Menu Toggle -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#2A2A2A] lg:hidden">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3" @click="router.push('/')">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
            <span class="text-lg">🌞</span>
          </div>
          <span class="text-lg font-bold text-white">SunBet Admin</span>
        </div>
        <button 
          @click="toggleMobileSidebar"
          class="p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors"
        >
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMobileSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div 
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
      @click="closeMobileSidebar"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed left-0 top-0 h-full bg-[#0D0D0D] border-r border-[#2A2A2A] transition-all duration-300 z-50"
      :class="[
        isSidebarCollapsed ? 'w-20' : 'w-64',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo - Desktop -->
      <div class="hidden lg:flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div 
          class="flex items-center gap-3 cursor-pointer"
          @click="router.push('/')"
        >
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
            <span class="text-xl">🌞</span>
          </div>
          <span v-if="!isSidebarCollapsed" class="text-lg font-bold text-white">
            SunBet Admin
          </span>
        </div>
        <button 
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors hidden lg:block"
        >
          <svg class="w-5 h-5 text-gray-400" :class="{ 'rotate-180': isSidebarCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Logo - Mobile -->
      <div class="lg:hidden flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div 
          class="flex items-center gap-3 cursor-pointer"
          @click="router.push('/')"
        >
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
            <span class="text-xl">🌞</span>
          </div>
          <span class="text-lg font-bold text-white">SunBet Admin</span>
        </div>
        <button 
          @click="closeMobileSidebar"
          class="p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 140px);">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-[#2A2A2A] transition-all duration-200 group"
          :class="{ 'bg-[#2A2A2A] text-rose-400': isActive(item.path) }"
          @click="closeMobileSidebar"
        >
          <span class="text-xl min-w-[32px] text-center">{{ item.icon }}</span>
          <span v-if="!isSidebarCollapsed" class="text-sm font-medium">{{ item.label }}</span>
          <div v-if="isSidebarCollapsed" class="absolute left-20 hidden group-hover:block bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 border border-[#2A2A2A]">
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2A2A] bg-[#0D0D0D]">
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-400 hover:bg-[#2A2A2A] hover:text-rose-400 transition-all duration-200"
        >
          <span class="text-xl min-w-[32px] text-center">🚪</span>
          <span v-if="!isSidebarCollapsed" class="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="transition-all duration-300" :class="[
      isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
      'ml-0 pt-16 lg:pt-0'
    ]">
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 bg-[#0D0D0D]/80 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6 lg:py-4">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl lg:text-2xl font-bold text-white truncate">{{ pageTitle }}</h1>
            <p class="text-xs lg:text-sm text-gray-500 mt-0.5 truncate">{{ pageSubtitle }}</p>
          </div>
          
          <div class="flex items-center gap-2 lg:gap-4">
            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors">
              <svg class="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            <!-- Admin Profile -->
            <div class="flex items-center gap-2 lg:gap-3">
              <div class="text-right hidden sm:block">
                <p class="text-xs lg:text-sm font-semibold text-white truncate max-w-[120px] lg:max-w-[200px]">{{ adminName }}</p>
                <p class="text-[10px] lg:text-xs text-gray-500">Administrator</p>
              </div>
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                <span class="text-base lg:text-lg">👑</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="p-3 lg:p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' 
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth < 1024)

// Handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isMobileSidebarOpen.value = false
  }
}

// Close mobile sidebar on route change
watch(() => route.path, () => {
  if (isMobile.value) {
    closeMobileSidebar()
  }
})

onMounted(async () => {
  console.log('🔐 AdminLayout mounted')
  
  window.addEventListener('resize', handleResize)
  
  if (!authStore.isLoggedIn) {
    await authStore.initialize()
  }
  
  if (!authStore.isLoggedIn) {
    console.log('Not logged in, redirecting to login')
    router.push('/login')
  } else {
    console.log('✅ Admin authenticated:', authStore.user?.phone_number)
  }
})

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const navItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/bets', icon: '🎲', label: 'Bets Management' },
  { path: '/admin/users', icon: '👥', label: 'Users Management' },
  { path: '/admin/notifications', icon: '🔔', label: 'Send Notification' },
  { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  { path: '/admin/fixtures', icon: '📅', label: 'Fixtures' },
]

const pageTitles = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview of platform performance' },
  '/admin/bets': { title: 'Bets Management', subtitle: 'Manage and settle bets' },
  '/admin/users': { title: 'Users Management', subtitle: 'View and manage users' },
  '/admin/notifications': { title: 'Send Notification', subtitle: 'Send push notifications to users' },
  '/admin/settings': { title: 'Settings', subtitle: 'Configure admin settings' },
  '/admin/fixtures': { title: 'Fixtures', subtitle: 'Manage and add fixtures' },
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Dashboard')
const pageSubtitle = computed(() => pageTitles[route.path]?.subtitle || '')

const adminName = computed(() => authStore.user?.phone_number || 'Admin User')

function isActive(path) {
  return route.path.startsWith(path)
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function toggleMobileSidebar() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

function closeMobileSidebar() {
  isMobileSidebarOpen.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

// Import onBeforeUnmount
import { onBeforeUnmount } from 'vue'
</script>

<style scoped>
/* Smooth scrolling */
* {
  scroll-behavior: smooth;
}

/* Custom scrollbar for sidebar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #2A2A2A;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3A3A3A;
}

/* Mobile menu animations */
.translate-x-0 {
  transform: translateX(0);
}

.-translate-x-full {
  transform: translateX(-100%);
}

/* Ensure sidebar doesn't overflow on small screens */
@media (max-width: 1023px) {
  aside {
    width: 280px !important;
    max-width: 85vw;
  }
}

/* Touch-friendly buttons */
button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Improve text readability on mobile */
@media (max-width: 640px) {
  .truncate {
    max-width: 120px;
  }
}
</style>