import { onMounted, onUnmounted, ref } from 'vue'

const currentTime = ref(Date.now())
let intervalId = null
let subscriberCount = 0

export const useMinuteClock = () => {
  onMounted(() => {
    subscriberCount += 1
    currentTime.value = Date.now()
    if (intervalId === null) {
      intervalId = setInterval(() => {
        currentTime.value = Date.now()
      }, 10_000)
    }
  })

  onUnmounted(() => {
    subscriberCount -= 1
    if (subscriberCount === 0 && intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  })

  return currentTime
}
