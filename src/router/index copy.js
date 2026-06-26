import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

// Pages — lazy loaded
const HomePage = () => import('../pages/HomePage.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const SportsLobbyPage = () => import('../pages/SportsLobbyPage.vue')
const LiveBettingPage = () => import('../pages/LiveBettingPage.vue')
const MyBetsPage = () => import('../pages/MyBetsPage.vue')
const WalletPage = () => import('../pages/WalletPage.vue')
const DashboardPage = () => import('../pages/DashboardPage.vue')
const PromotionsPage = () => import('../pages/PromotionsPage.vue')
const LeaderboardPage = () => import('../pages/LeaderboardPage.vue')
const AdminPanel = () => import('../pages/admin/AdminPanel.vue')

const routes = [
  // ===== PUBLIC ROUTES (DefaultLayout) =====
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: { title: 'SunBet — Bet Smart, Win Big' }
      },
      {
        path: 'sports',
        name: 'sports',
        component: SportsLobbyPage,
        meta: { title: 'Sports — SunBet', requiresAuth: true }
      },
      {
        path: 'live',
        name: 'live',
        component: LiveBettingPage,
        meta: { title: 'Live Betting — SunBet', requiresAuth: true }
      },
      {
        path: 'my-bets',
        name: 'my-bets',
        component: MyBetsPage,
        meta: { title: 'My Bets — SunBet', requiresAuth: true }
      },
      {
        path: 'wallet',
        name: 'wallet',
        component: WalletPage,
        meta: { title: 'Wallet — SunBet', requiresAuth: true }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: { title: 'Dashboard — SunBet', requiresAuth: true }
      },
      {
        path: 'promotions',
        name: 'promotions',
        component: PromotionsPage,
        meta: { title: 'Promotions — SunBet' }
      },
      {
        path: 'leaderboard',
        name: 'leaderboard',
        component: LeaderboardPage,
        meta: { title: 'Leaderboard — SunBet' }
      },
    ]
  },

  // ===== AUTH ROUTES =====
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { title: 'Login — SunBet', guestOnly: true }
      },
      {
        path: 'register',
        name: 'register',
        component: LoginPage, 
        meta: { title: 'Register — SunBet', guestOnly: true }
      },
    ]
  },

  // ===== ADMIN ROUTES =====
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin',
        component: AdminPanel,
        meta: { title: 'Admin Panel — SunBet' }
      }
    ]
  },

  // ===== 404 =====
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// ===== NAVIGATION GUARDS =====
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'SunBet'

  // Fake auth check — baadaye utaunganisha na store yako
  const isLoggedIn = !!localStorage.getItem('sunbet_token')
  const isAdmin = !!localStorage.getItem('sunbet_admin')

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' })
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'home' })
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return next({ name: 'home' })
  }

  next()
})

export default router