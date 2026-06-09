import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBetSlipStore = defineStore('betSlip', () => {
  const items = ref([])

  const count = computed(() => items.value.length)

  const addBet = (bet) => {
    const exists = items.value.find(b => b.id === bet.id)
    if (!exists) items.value.push(bet)
  }

  const removeBet = (index) => {
    items.value.splice(index, 1)
  }

  const clearAll = () => {
    items.value = []
  }

  const toggleBet = (bet) => {
    const index = items.value.findIndex(b => b.id === bet.id)
    if (index >= 0) removeBet(index)
    else addBet(bet)
  }

  return { items, count, addBet, removeBet, clearAll, toggleBet }
})