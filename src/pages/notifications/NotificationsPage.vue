<!-- pages/notifications/NotificationsPage.vue - Eneo la arifa za mteja -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-10">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between pt-6 pb-4">
        <div>
          <h1 class="text-2xl font-extrabold text-white">Notifications</h1>
          <p class="text-sm text-gray-500 mt-1">{{ todayNotifications.length }} notifications for today · {{ todayUnreadCount }} unread</p>
        </div>
        <button
          v-if="todayUnreadCount > 0"
          @click="readAll"
          class="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-rose-400 hover:bg-gray-700 hover:border-rose-500/40 transition-colors"
        >
          ✓ Read All
        </button>
      </div>

      <!-- Loading -->
      <div v-if="notificationStore.isLoading" class="py-16 text-center text-gray-400 text-sm">
        <span class="inline-block w-6 h-6 border-2 border-gray-600 border-t-rose-500 rounded-full animate-spin"></span>
        <p class="mt-3">Inapakia arifa zako...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="todayNotifications.length === 0" class="py-16 text-center">
        <div class="text-5xl mb-3">📭</div>
        <p class="text-gray-400 font-medium">No notifications for today</p>
        <p class="text-gray-600 text-sm mt-1">New news, updates and promotions will appear here.</p>
      </div>

      <!-- List (za leo tu) -->
      <div v-else class="space-y-3">
        <div
          v-for="notif in todayNotifications"
          :key="notif.id"
          @click="openNotification(notif)"
          class="bg-gray-900/90 border rounded-xl p-4 transition-all cursor-pointer"
          :class="notif.is_read ? 'border-gray-800' : 'border-rose-500/30 bg-gray-900'"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" :class="getTypeBg(notif.type)">
              <span class="text-xl">{{ getTypeIcon(notif.type) }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-bold text-white text-sm truncate">{{ notif.title }}</p>
                <span
                  v-if="!notif.is_read"
                  class="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0"
                ></span>
              </div>
              <p class="text-gray-400 text-sm mt-1 leading-relaxed break-words">{{ notif.message }}</p>

              <div class="flex items-center justify-between mt-2">
                <span class="text-[11px] text-gray-600">{{ timeAgo(notif.created_at) }}</span>
                <button
                  v-if="!notif.is_read"
                  class="text-[11px] text-rose-400 hover:text-rose-700 font-semibold"
                  @click.stop="markRead(notif.id)"
                >
                  Soma
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div v-if="false && notificationStore.hasMore" class="text-center pt-4">
        <button
          @click="loadMore"
          class="text-sm font-semibold px-5 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useNotificationStore } from '../../stores/notifications.store'

const notificationStore = useNotificationStore()

// ---- Arifa za leo tu (recent) ----
const isToday = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return false
  const now = new Date()
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
}

const todayNotifications = computed(() =>
  notificationStore.notifications.filter(n => isToday(n.created_at))
)

const todayUnreadCount = computed(() =>
  todayNotifications.value.filter(n => !n.is_read).length
)

function getTypeBg(type) {
  const types = {
    info: 'bg-cyan-500/15',
    promotion: 'bg-purple-500/15',
    alert: 'bg-yellow-500/15',
    system: 'bg-blue-500/15',
    success: 'bg-emerald-500/15',
    warning: 'bg-yellow-500/15'
  }
  return types[type] || 'bg-cyan-500/15'
}

function getTypeIcon(type) {
  const icons = {
    info: 'ℹ️',
    promotion: '🎉',
    alert: '⚠️',
    system: '⚙️',
    success: '✅',
    warning: '⚠️'
  }
  return icons[type] || '📢'
}

function timeAgo(dateString) {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'Sasa hivi'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min iliyopita`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} saa iliyopita`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Jana'
  return `${days} siku zilizopita`
}

async function openNotification(notif) {
  if (!notif.is_read) {
    await notificationStore.markAsRead(notif.id)
  }
}

async function markRead(id) {
  await notificationStore.markAsRead(id)
}

async function readAll() {
  await notificationStore.markAllAsRead()
}

async function loadMore() {
  await notificationStore.loadMore()
}

onMounted(async () => {
  await notificationStore.fetchMyNotifications()
  await notificationStore.fetchUnreadCount()
})
</script>