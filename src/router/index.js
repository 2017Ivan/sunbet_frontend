// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'

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
const ForgotPasswordPage = () => import('../pages/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../pages/ResetPasswordPage.vue')

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
        meta: { 
          title: 'SunBet — Bet Smart, Win Big',
          requiresAuth: false,
          guest: false
        }
      },
      {
        path: 'sports',
        name: 'sports',
        component: SportsLobbyPage,
        meta: { 
          title: 'Sports — SunBet',
          requiresAuth: true,
          guest: false
        }
      },
      {
        path: 'live',
        name: 'live',
        component: LiveBettingPage,
        meta: { 
          title: 'Live Betting — SunBet',
          requiresAuth: true,
          guest: false
        }
      },
      {
        path: 'my-bets',
        name: 'my-bets',
        component: MyBetsPage,
        meta: { 
          title: 'My Bets — SunBet',
          requiresAuth: true,
          guest: false
        }
      },
      {
        path: 'wallet',
        name: 'wallet',
        component: WalletPage,
        meta: { 
          title: 'Wallet — SunBet',
          requiresAuth: true,
          guest: false
        }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: { 
          title: 'Dashboard — SunBet',
          requiresAuth: true,
          guest: false,
          requiresRole: 'AGENT'
        }
      },
      {
        path: 'promotions',
        name: 'promotions',
        component: PromotionsPage,
        meta: { 
          title: 'Promotions — SunBet',
          requiresAuth: false,
          guest: false
        }
      },
      {
        path: 'leaderboard',
        name: 'leaderboard',
        component: LeaderboardPage,
        meta: { 
          title: 'Leaderboard — SunBet',
          requiresAuth: false,
          guest: false
        }
      },
    ]
  },

  // ===== AUTH ROUTES (Guest only) =====
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { 
          title: 'Login — SunBet',
          requiresAuth: false,
          guest: true
        }
      },
      {
        path: 'register',
        name: 'register',
        component: LoginPage, 
        meta: { 
          title: 'Register — SunBet',
          requiresAuth: false,
          guest: true
        }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordPage,
        meta: { 
          title: 'Forgot Password — SunBet',
          requiresAuth: false,
          guest: true
        }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPasswordPage,
        meta: { 
          title: 'Reset Password — SunBet',
          requiresAuth: false,
          guest: true
        }
      }
    ]
  },

  // ===== ADMIN ROUTES =====
  {
    path: '/admin',
    component: AdminLayout,
    meta: { 
      requiresAuth: true,
      guest: false,
      requiresRole: 'ADMIN'
    },
    children: [
      {
        path: '',
        name: 'admin',
        component: AdminPanel,
        meta: { 
          title: 'Admin Panel — SunBet',
          requiresRole: 'ADMIN'
        }
      }
    ]
  },

  // ===== 404 =====
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
]

// ── Router instance ───────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
});

// ── Navigation guards with RBAC ──────────────────────────────────────────────
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title}` : "SunBet";

  // Get auth store instance
  const authStore = useAuthStore();
  
  // ── CHECK KAMA TOKEN IPO NA STORE HAJAISHA INITIALIZE ──────────────────
  const token = localStorage.getItem('access_token');
  
  // Initialize if:
  // 1. Tuna token lakini store haijalogin
  // 2. Au store haijawahi initialize (isLoading === undefined)
  if (token && !authStore.isLoggedIn) {
    console.log('⏳ Token found but store not logged in, initializing...');
    await authStore.initialize();
  } else if (authStore.isLoading === undefined && !authStore.isLoggedIn) {
    console.log('⏳ Store not initialized, initializing...');
    await authStore.initialize();
  }

  const isLoggedIn = authStore.isLoggedIn;
  const userRole = authStore.user?.role;

  console.log(`🔐 Navigation to: ${to.path} | isLoggedIn: ${isLoggedIn} | Role: ${userRole} | Token: ${!!token}`);

  // ── 1. Guest routes (login/register) ──────────────────────────────────────
  if (to.meta.guest && isLoggedIn) {
    console.log("⛔ Guest route but user logged in, redirecting to home");
    return next({ name: "home" });
  }

  // ── 2. Protected routes - check authentication ────────────────────────────
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log("🔒 Protected route requires auth, redirecting to login");
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  // ── 3. Role-based access control (RBAC) ──────────────────────────────────
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole;
    
    // Kama hana role, jaribu kuinitialize tena
    if (!userRole && token) {
      console.log('⚠️ No role found, re-initializing...');
      await authStore.initialize();
      // Tena angalia role baada ya re-initialize
      const newRole = authStore.user?.role;
      if (!newRole) {
        console.log('❌ Still no role, logging out...');
        authStore.logout();
        return next({ name: "login", query: { redirect: to.fullPath } });
      }
      // Endelea na role mpya
      if (newRole !== requiredRole) {
        console.log(`⛔ Access denied: Required '${requiredRole}', user has '${newRole}'`);
        return next({ name: "home" });
      }
      console.log(`✅ Role check passed after re-init: ${newRole}`);
      return next();
    }
    
    // Check if user has the required role
    if (userRole !== requiredRole) {
      console.log(`⛔ Access denied: Required role '${requiredRole}', but user has '${userRole}'`);
      
      // Redirect based on role or go home
      if (userRole === 'AGENT') {
        return next({ name: 'dashboard' });
      } else if (userRole === 'USER') {
        return next({ name: 'home' });
      } else {
        return next({ name: 'home' });
      }
    }
    
    console.log(`✅ Role check passed: ${userRole} has access to ${to.path}`);
  }

  // ── 4. Additional: Agent-specific routes (if needed) ──────────────────────
  if (to.meta.requiresAgent) {
    if (userRole !== 'AGENT' && userRole !== 'ADMIN') {
      console.log(`⛔ Agent route requires AGENT or ADMIN role`);
      return next({ name: 'home' });
    }
  }

  next();
});

export default router