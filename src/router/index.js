import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth/authStore.js";

// ── Layouts ──────────────────────────────────────────────────────────────────
import DefaultLayout from "../layouts/default/DefaultLayout.vue";
import AuthLayout from "../layouts/auth/AuthLayout.vue";
import AdminLayout from "../layouts/admin/AdminLayout.vue";

// ── Pages (lazy loaded) ───────────────────────────────────────────────────────
const HomePage = () => import("../pages/home/HomePage.vue");
const AuthPage = () => import("../pages/Auth/AuthLoginAndRegister.vue");
const DashboardPage = () => import("../pages/Dashboard/DashboardPage.vue");
const SportsPage = () => import("../pages/sport/SportsPage.vue");
const LivePage = () => import("../pages/live/LivePage.vue");
const CasinoPage = () => import("../pages/casino/CasinoPage.vue");
const AviatorPage = () => import("../pages/aviator/AviatorPage.vue");
const VirtualsPage = () => import("../pages/virtual/VirtualsPage.vue");
const BetsPage = () => import("../pages/bets/BetsPage.vue");
const BetDetailPage = () => import("../pages/bets/BetDetailPage.vue");
const JackpotPage = () => import("../pages/jackpot/JackpotPage.vue");
const PromotionsPage = () => import("../pages/promotions/PromotionsPage.vue");
const AdminPage = () => import("../pages/admin/AdminPage.vue");
const NotFoundPage = () => import("../pages/notfound/NotFoundPage.vue");
const ProfilePage = () => import("../pages/profile/ProfilePage.vue");
const DepositePage = () => import("../pages/money/deposite/Deposit.vue");
const WithdrawPage = () => import("../pages/money/withdraw/Withdraw.vue");
// ❌ ONDOA HII - hatuitumii tena kama page
// const BetSlipPage = () => import("../components/betting/betslip/BetSlip.vue/index.js");

// ── Routes ────────────────────────────────────────────────────────────────────
const routes = [
  // ════════════════════════════════════════════════════════════════════
  // 1. AUTH ROUTES (no main layout)
  // ════════════════════════════════════════════════════════════════════
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "auth",
        component: AuthPage,
        meta: { title: "Authentication", guest: true },
        props: route => ({ tab: route.query.tab || 'login' })
      },
      {
        path: "login",
        redirect: { name: "auth", query: { tab: "login" } }
      },
      {
        path: "register",
        redirect: { name: "auth", query: { tab: "register" } }
      },
    ],
  },

  // Shortcuts za auth
  { path: "/login", redirect: "/auth/login" },
  { path: "/register", redirect: "/auth/register" },

  // ════════════════════════════════════════════════════════════════════
  // 2. MAIN LAYOUT ROUTES (DefaultLayout)
  // ════════════════════════════════════════════════════════════════════
  {
    path: "/",
    component: DefaultLayout,
    children: [
      // ── PUBLIC ROUTES (No authentication required) ──
      {
        path: "",
        name: "home",
        component: HomePage,
        meta: { title: "BoomBet" },
      },
      {
        path: "sports",
        name: "sports",
        component: SportsPage,
        meta: { title: "Sports" },
      },
      {
        path: "sports/live",
        name: "live",
        component: LivePage,
        meta: { title: "Live Betting" },
      },
      {
        path: "casino",
        name: "casino",
        component: CasinoPage,
        meta: { title: "Casino" },
      },
      {
        path: "casino/aviator",
        name: "aviator",
        component: AviatorPage,
        meta: { title: "Aviator" },
      },
      {
        path: "virtuals",
        name: "virtuals",
        component: VirtualsPage,
        meta: { title: "Virtual Sports" },
      },
      {
        path: "jackpot",
        name: "jackpot",
        component: JackpotPage,
        meta: { title: "Jackpot" },
      },
      {
        path: "promotions",
        name: "promotions",
        component: PromotionsPage,
        meta: { title: "Promotions" },
      },
      {
        path: "deposite",
        name: "deposite",
        component: DepositePage,
        meta: { title: "Deposite" },
      },
      {
        path: "withdraw",
        name: "withdraw",
        component: WithdrawPage,
        meta: { title: "Withdraw" },
      },
      // ❌ ONDOA HII ROUTE - BetSlip sio page tena
      // {
      //   path: "bet-slip",
      //   name: "bet-slip",
      //   component: BetSlipPage,
      //   meta: { title: "Bet Slip" },
      // },

      // ── PROTECTED ROUTES (requiresAuth: true) ──
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardPage,
        meta: { title: "Dashboard", requiresAuth: true },
      },
      {
        path: "profile",
        name: "profile",
        component: ProfilePage,
        meta: { title: "Profile", requiresAuth: false },
      },
      {
        path: "bets",
        name: "bets",
        component: BetsPage,
        meta: { title: "My Bets", requiresAuth: false },
      },
      {
        path: "bets/:id",
        name: "bet-detail",
        component: BetDetailPage,
        meta: { title: "Bet Detail", requiresAuth: false },
      },
      {
        path: '/deposit/status',
        name: 'DepositStatus',
        component: () => import('../pages/money/deposite/views/DepositStatus.vue'),
        meta: { title: "Deposit Status", requiresAuth: true }
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 3. ADMIN ROUTES (AdminLayout)
  // ════════════════════════════════════════════════════════════════════
  {
    path: "/admin",
    component: AdminLayout,
    meta: { 
      requiresAuth: true, 
      requiresRole: 'ADMIN'
    },
    children: [
      {
        path: "",
        name: "admin",
        component: AdminPage,
        meta: { 
          title: "Admin Dashboard", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import('../pages/admin/components/AdminUsers.vue'),
        meta: { 
          title: "Manage Users", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "bets",
        name: "admin-bets",
        component: () => import('../pages/admin/components/AdminBets.vue'),
        meta: { 
          title: "Manage Bets", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "notifications",
        name: "admin-notifications",
        component: () => import('../pages/admin/components/AdminNotifications.vue'),
        meta: { 
          title: "Notifications", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "settings",
        name: "admin-settings",
        component: () => import('../pages/admin/components/Setting.vue'),
        meta: { 
          title: "Settings", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
      {
        path: "fixtures",
        name: "admin-fixtures",
        component: () => import('../pages/admin/components/AdminFixtures.vue'),
        meta: { 
          title: "Fixtures", 
          requiresAuth: true, 
          requiresRole: 'ADMIN' 
        },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 4. 404 NOT FOUND (Always last)
  // ════════════════════════════════════════════════════════════════════
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: { title: "404 - Page Not Found" },
  },
];

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
  document.title = to.meta.title ? `${to.meta.title} — BoomBet` : "BoomBet";

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
    return next({ 
      name: "auth", 
      query: { 
        tab: "login", 
        redirect: to.fullPath 
      } 
    });
  }

  // ── 3. Role-based access control (RBAC) ──────────────────────────────────
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole;
    
    if (!userRole && token) {
      console.log('⚠️ No role found, re-initializing...');
      await authStore.initialize();
      const newRole = authStore.user?.role;
      if (!newRole) {
        console.log('❌ Still no role, logging out...');
        authStore.logout();
        return next({ 
          name: "auth", 
          query: { 
            tab: "login", 
            redirect: to.fullPath 
          } 
        });
      }
      if (newRole !== requiredRole) {
        console.log(`⛔ Access denied: Required '${requiredRole}', user has '${newRole}'`);
        return next({ name: "home" });
      }
      console.log(`✅ Role check passed after re-init: ${newRole}`);
      return next();
    }
    
    if (userRole !== requiredRole) {
      console.log(`⛔ Access denied: Required role '${requiredRole}', but user has '${userRole}'`);
      
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

export default router;