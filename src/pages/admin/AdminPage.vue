<template>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-black text-white">Admin Dashboard</h1>
        <span class="text-xs text-gray-500">Last updated: just now</span>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in adminStats" :key="stat.label"
             class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 hover:border-rose-500/30 transition-all duration-300">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xl">{{ stat.icon }}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="stat.trend > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-gray-500/10 text-gray-400'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <p class="text-2xl font-black font-mono text-white">{{ stat.value }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Recent bets table -->
      <div class="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-[#2A2A2A]">
          <h3 class="font-bold text-white">Recent Bets</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#2A2A2A]">
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stake</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Odds</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#2A2A2A]">
              <tr v-for="bet in recentBets" :key="bet.id" class="hover:bg-[#2A2A2A]/30 transition-colors">
                <td class="px-4 py-3 font-mono text-xs text-rose-400">#{{ bet.id }}</td>
                <td class="px-4 py-3 text-gray-300">{{ bet.user }}</td>
                <td class="px-4 py-3 font-mono text-rose-400 font-bold">TZS {{ bet.stake }}</td>
                <td class="px-4 py-3 font-mono text-gray-400">{{ bet.odds }}x</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                        :class="bet.status === 'won' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                               : bet.status === 'lost' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                               : 'bg-rose-500/10 text-rose-400 border-rose-500/20'">
                    {{ bet.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-500">{{ bet.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const adminStats = [
    { icon: '👥', label: 'Total Users',    value: '52,341',     color: 'text-white',    trend: 12 },
    { icon: '📋', label: 'Bets Today',     value: '8,920',      color: 'text-rose-400',  trend: 5  },
    { icon: '💰', label: 'Revenue Today',  value: 'TZS 1.2M',   color: 'text-rose-400', trend: 8  },
    { icon: '🏆', label: 'Payouts Today',  value: 'TZS 980K',   color: 'text-gray-400',     trend: -3 },
  ]
  
  const recentBets = [
    { id: 'BB001', user: 'John Doe',    stake: '500',  odds: '4.50', status: 'won',     date: 'Today 14:32' },
    { id: 'BB002', user: 'Jane Smith',  stake: '200',  odds: '1.85', status: 'pending', date: 'Today 14:15' },
    { id: 'BB003', user: 'Mike Otieno', stake: '1,000',odds: '2.10', status: 'lost',    date: 'Today 13:50' },
    { id: 'BB004', user: 'Aisha K.',    stake: '350',  odds: '3.20', status: 'won',     date: 'Today 13:22' },
    { id: 'BB005', user: 'Peter N.',    stake: '750',  odds: '1.65', status: 'pending', date: 'Today 12:45' },
  ]
  </script>