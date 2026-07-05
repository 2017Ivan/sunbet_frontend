<template>
  <div class="max-w-7xl mx-auto  ">
    
    <HeroSection />
    <GamesTabs :games="games" />

    <!-- Games Grid -->
    <div class="grid grid-cols-1  ">
      <GameCard 
        v-for="game in games" 
        :key="game.id"
        :game="game"
      />
    </div>

    <!-- View All Button -->
    <div class="text-center mt-2  bg-gray-100">
      <button class="text-rose-500 hover:text-rose-600 font-semibold text-sm transition-colors">
        View All sports →
      </button>
    </div>
     <RecentWinners :winners="recentWinners" :scroll-speed="1.5" />


  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameCard from '../../components/betting/match Card/MatchCard.vue'
import HeroSection from '../../components/ui/HeroSection/HeroCarousel.vue'
import RecentWinners from '../../components/main components/RecentWinners/RecentWinners.vue'
import GamesTabs from '../../components/ui/games/ GamesTabs.vue'

// Sample data - in real app, hii itakuja kutoka API
const games = ref([
  // ============================================
  // BRAZIL - U20 PIAUIENSE (5 games)
  // ============================================
  {
    id: 1,
    league: 'Brazil - U20 Piauiense',
    time: '23:22',
    status: 'H1',
    homeTeam: 'River-PI U20',
    awayTeam: 'AE Altos U20',
    odds: { home: 2.85, draw: 3.40, away: 2.20 },
    totalBets: 40
  },
  {
    id: 2,
    league: 'Brazil - U20 Piauiense',
    time: '22:15',
    status: 'H1',
    homeTeam: 'Piauí U20',
    awayTeam: 'River-PI U20',
    odds: { home: 3.10, draw: 3.20, away: 2.40 },
    totalBets: 35
  },
  {
    id: 3,
    league: 'Brazil - U20 Piauiense',
    time: '21:45',
    status: 'H1',
    homeTeam: 'AE Altos U20',
    awayTeam: 'Piauí U20',
    odds: { home: 2.20, draw: 3.10, away: 3.40 },
    totalBets: 28
  },
  {
    id: 4,
    league: 'Brazil - U20 Piauiense',
    time: '20:30',
    status: 'H1',
    homeTeam: 'River-PI U20',
    awayTeam: 'Boca Juniors U20',
    odds: { home: 2.60, draw: 3.30, away: 2.80 },
    totalBets: 50
  },
  {
    id: 5,
    league: 'Brazil - U20 Piauiense',
    time: '19:00',
    status: 'H1',
    homeTeam: 'AE Altos U20',
    awayTeam: 'Flamengo U20',
    odds: { home: 3.50, draw: 3.60, away: 2.00 },
    totalBets: 32
  },

  // ============================================
  // ICELAND - U19 LEAGUE (5 games)
  // ============================================
  {
    id: 6,
    league: 'Iceland - U19 League',
    time: '75:24',
    status: 'H2',
    homeTeam: 'Fylkir/Ellidi U19',
    awayTeam: 'HK/Ymir U19',
    odds: { home: 40.00, draw: 10.00, away: 1.03 },
    totalBets: 25
  },
  {
    id: 7,
    league: 'Iceland - U19 League',
    time: '63:33',
    status: 'H2',
    homeTeam: 'Stjarnan/KFG U19',
    awayTeam: 'Leiknir U19',
    odds: { home: 1.41, draw: 4.10, away: 6.70 },
    totalBets: 22
  },
  {
    id: 8,
    league: 'Iceland - U19 League',
    time: '58:10',
    status: 'H2',
    homeTeam: 'Valur U19',
    awayTeam: 'Fylkir/Ellidi U19',
    odds: { home: 2.20, draw: 3.50, away: 3.00 },
    totalBets: 18
  },
  {
    id: 9,
    league: 'Iceland - U19 League',
    time: '42:00',
    status: 'HT',
    homeTeam: 'HK/Ymir U19',
    awayTeam: 'Stjarnan/KFG U19',
    odds: { home: 3.80, draw: 3.40, away: 2.10 },
    totalBets: 30
  },
  {
    id: 10,
    league: 'Iceland - U19 League',
    time: '15:30',
    status: 'H1',
    homeTeam: 'Leiknir U19',
    awayTeam: 'Valur U19',
    odds: { home: 2.90, draw: 3.20, away: 2.60 },
    totalBets: 15
  },

  // ============================================
  // ENGLAND - PREMIER LEAGUE (5 games)
  // ============================================
  {
    id: 11,
    league: 'England - Premier League',
    time: '88:12',
    status: 'H2',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    odds: { home: 2.10, draw: 3.50, away: 3.80 },
    totalBets: 156
  },
  {
    id: 12,
    league: 'England - Premier League',
    time: '78:45',
    status: 'H2',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    odds: { home: 1.85, draw: 3.60, away: 4.50 },
    totalBets: 134
  },
  {
    id: 13,
    league: 'England - Premier League',
    time: '55:00',
    status: 'H2',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    odds: { home: 1.60, draw: 4.00, away: 6.00 },
    totalBets: 89
  },
  {
    id: 14,
    league: 'England - Premier League',
    time: '30:00',
    status: 'H1',
    homeTeam: 'Newcastle United',
    awayTeam: 'Aston Villa',
    odds: { home: 2.40, draw: 3.30, away: 3.10 },
    totalBets: 67
  },
  {
    id: 15,
    league: 'England - Premier League',
    time: '15:00',
    status: 'H1',
    homeTeam: 'West Ham United',
    awayTeam: 'Crystal Palace',
    odds: { home: 2.60, draw: 3.20, away: 2.90 },
    totalBets: 45
  },

  // ============================================
  // SPAIN - LA LIGA (5 games)
  // ============================================
  {
    id: 16,
    league: 'Spain - La Liga',
    time: '45:00',
    status: 'HT',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    odds: { home: 2.30, draw: 3.20, away: 3.10 },
    totalBets: 98
  },
  {
    id: 17,
    league: 'Spain - La Liga',
    time: '68:30',
    status: 'H2',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Sevilla',
    odds: { home: 2.10, draw: 3.30, away: 3.60 },
    totalBets: 75
  },
  {
    id: 18,
    league: 'Spain - La Liga',
    time: '35:00',
    status: 'H1',
    homeTeam: 'Villarreal',
    awayTeam: 'Real Sociedad',
    odds: { home: 2.70, draw: 3.20, away: 2.80 },
    totalBets: 52
  },
  {
    id: 19,
    league: 'Spain - La Liga',
    time: '20:00',
    status: 'H1',
    homeTeam: 'Athletic Bilbao',
    awayTeam: 'Valencia',
    odds: { home: 2.40, draw: 3.10, away: 3.20 },
    totalBets: 41
  },
  {
    id: 20,
    league: 'Spain - La Liga',
    time: '18:30',
    status: 'H1',
    homeTeam: 'Real Betis',
    awayTeam: 'Getafe',
    odds: { home: 1.95, draw: 3.40, away: 4.20 },
    totalBets: 38
  },

  // ============================================
  // ITALY - SERIE A (5 games)
  // ============================================
  {
    id: 21,
    league: 'Italy - Serie A',
    time: '12:45',
    status: 'H1',
    homeTeam: 'AC Milan',
    awayTeam: 'Inter Milan',
    odds: { home: 2.60, draw: 3.30, away: 2.80 },
    totalBets: 45
  },
  {
    id: 22,
    league: 'Italy - Serie A',
    time: '82:15',
    status: 'H2',
    homeTeam: 'Juventus',
    awayTeam: 'Napoli',
    odds: { home: 2.20, draw: 3.20, away: 3.50 },
    totalBets: 62
  },
  {
    id: 23,
    league: 'Italy - Serie A',
    time: '50:00',
    status: 'H2',
    homeTeam: 'AS Roma',
    awayTeam: 'Lazio',
    odds: { home: 2.40, draw: 3.10, away: 3.20 },
    totalBets: 55
  },
  {
    id: 24,
    league: 'Italy - Serie A',
    time: '28:00',
    status: 'H1',
    homeTeam: 'Atalanta',
    awayTeam: 'Fiorentina',
    odds: { home: 1.90, draw: 3.60, away: 4.10 },
    totalBets: 33
  },
  {
    id: 25,
    league: 'Italy - Serie A',
    time: '14:00',
    status: 'H1',
    homeTeam: 'Bologna',
    awayTeam: 'Torino',
    odds: { home: 2.80, draw: 3.00, away: 2.90 },
    totalBets: 29
  }
])

// ---- Recent winners ----
const recentWinners = [
  { 
    initials: 'JM', 
    phone: '+255677453123',
    name: 'James M.', 
    bet: 'Accumulator x8', 
    sport: 'Football', 
    amount: 'TZS 4,200,000', 
    time: '5 min ago', 
    avatarColor: '#A32D2D' 
  },
  { 
    initials: 'AK', 
    phone: '+255712345678',
    name: 'Amina K.', 
    bet: 'Single bet', 
    sport: 'Tennis', 
    amount: 'TZS 850,000', 
    time: '12 min ago', 
    avatarColor: '#7A1F1F' 
  },
  { 
    initials: 'SM', 
    phone: '+255756789012',
    name: 'Said M.', 
    bet: 'Double bet', 
    sport: 'Basketball', 
    amount: 'TZS 1,350,000', 
    time: '28 min ago', 
    avatarColor: '#C94040' 
  },
  { 
    initials: 'FH', 
    phone: '+255698765432',
    name: 'Fatuma H.', 
    bet: 'Accumulator x5', 
    sport: 'Football', 
    amount: 'TZS 2,780,000', 
    time: '1 hr ago', 
    avatarColor: '#6B1A1A' 
  },
  { 
    initials: 'DM', 
    phone: '+255623456789',
    name: 'David M.', 
    bet: 'Single bet', 
    sport: 'Cricket', 
    amount: 'TZS 420,000', 
    time: '2 hrs ago', 
    avatarColor: '#8B2020' 
  },
]
</script>