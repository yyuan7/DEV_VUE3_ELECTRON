import { createRouter, type RouteRecordRaw } from 'vue-router'
import { history, flatMultiLevelRoutes } from './modules/help.flat'

const Layouts = () => import('@/renderer/layouts/index.vue')

/** Helper function for `manufacturer`, `distributor`, `initiator`, and `pickup agent` which share similar route patterns */
const createAdminFunctionRoutes = (path: string, title: string, roles: string[]) => {
  return {
    path: `/${path}`,
    component: Layouts,
    redirect: `/${path}/index`,
    meta: {
      roles,
      requiresAdmin: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/renderer/views/admin/lowAdmin/home/index.vue'),
        name: `${title} Home`,
        meta: {
          title: `${title} Home`
        }
      },
      {
        path: 'add',
        name: `${title} Add`,
        component: () =>
          path === 'manufacturer'
            ? import('@/renderer/views/admin/lowAdmin/add/manufacturer/VAddManuHelper.vue')
            : import('@/renderer/views/admin/lowAdmin/add/VAddBusiness.vue'),
        meta: {
          title: `${title} Add`
        }
      },
      {
        path: ':id(\\d+)',
        name: `${title} Dashboard`,
        component: () => import('@/renderer/views/admin/lowAdmin/dashboard/VAdminDashboard.vue'),
        meta: {
          title: `${title} Dashboard`
        }
      },
      {
        path: ':id(\\d+)/edit',
        name: `${title} Edit`,
        component: () => import('@/renderer/views/admin/lowAdmin/edit/VAdminEditHelper.vue'),
        meta: {
          title: `${title} Edit`
        }
      }
    ]
  }
}

/** Constant routes: visible for all users, such as `login` and `error` */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/renderer/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/renderer/views/error/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/renderer/views/error/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  {
    path: '/login',
    component: () => import('@/renderer/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/',
    component: Layouts,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/renderer/views/home/index.vue'),
        name: 'Home',
        meta: {
          title: 'Home',
          icon: 'mdi-home',
          affix: true
        }
      }
    ]
  },
  {
    path: '/upc',
    component: Layouts,
    redirect: '/upc/index',
    children: [
      {
        path: 'index',
        component: () => import('@/renderer/views/upc/index.vue'),
        name: 'UPC',
        meta: {
          title: 'UPC',
          icon: 'mdi-barcode'
        }
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            component: () => import('@/renderer/views/upc/search/VUpcPresearch.vue'),
            name: 'UPC-Search',
            meta: { title: 'UPC-Search' }
          },
          {
            path: 'results',
            component: () => import('@/renderer/views/upc/search/VUpcSearchResult.vue'),
            name: 'UPC-Result',
            meta: { title: 'UPC Search Results' }
          }
        ]
      },
      {
        path: 'edit',
        children: [
          {
            path: 'index',
            component: () => import('@/renderer/views/upc/edit/VPreUPCEdit.vue'),
            name: 'UPC-Edit-I',
            meta: { title: 'UPC-Edit-I' }
          },
          {
            path: ':upcCode',
            component: () => import('@/renderer/views/upc/edit/VStepIndicator.vue'),
            name: 'UPC-Edit-II',
            meta: { title: 'UPC-Edit-II' }
          }
        ]
      },
      {
        path: 'add',
        children: [
          {
            path: 'index',
            component: () => import('@/renderer/views/upc/add/VPreUPCAdd.vue'),
            name: 'UPC-Add-I',
            meta: { title: 'UPC-Add-I' }
          },
          {
            path: ':upcCode',
            component: () => import('@/renderer/views/upc/add/VStepIndicator.vue'),
            name: 'UPC-Add-II',
            meta: { title: 'UPC-Add-II' }
          }
        ]
      },
      {
        path: ':upcCode',
        component: () => import('@/renderer/views/upc/dashboard/VUpcDashboard.vue'),
        name: 'UPC Dashboard',
        meta: { title: 'UPC Dashboard' },
        children: [
          {
            path: ':state',
            component: () =>
              import('@/renderer/views/upc/dashboard/billing/VUPCDashRulesHelper.vue'),
            name: 'UPC-Dash-Rules',
            meta: { title: 'UPC Dash Rules' }
          }
        ]
      }
    ]
  },
  {
    path: '/billing',
    component: Layouts,
    redirect: '/billing/search',
    children: [
      // {
      //   path: 'index',
      //   component: () => import('@/renderer/views/billing/index.vue'),
      //   name: 'Billing',
      //   meta: {
      //     title: 'Billing Rules',
      //     icon: 'mdi-currency-usd'
      //   }
      // },
      {
        path: 'search',
        children: [
          {
            path: '',
            component: () => import('@/renderer/views/billing/search/VBillingPresearch.vue'),
            name: 'BR-Search',
            meta: { title: 'BR-Search' }
          },
          {
            path: 'adv',
            component: () => import('@/renderer/views/billing/search/VAdvSearch.vue'),
            name: 'BR-Adv-Search',
            meta: { title: 'BR-Adv-Search' }
          },
          {
            path: 'results',
            component: () => import('@/renderer/views/billing/search/VBillingResults.vue'),
            name: 'BR-Result',
            meta: { title: 'BR Search Results' }
          }
        ]
      },
      {
        path: 'edit',
        children: [
          {
            path: '',
            component: () => import('@/renderer/views/billing/edit/VEditBillRules.vue'),
            name: 'BR-Edit',
            meta: { title: 'BR-Edit' }
          }
        ]
      },
      {
        path: 'add',
        children: [
          {
            path: '',
            component: () => import('@/renderer/views/billing/add/VAddBillRulesHelper.vue'),
            name: 'BR-Add',
            meta: { title: 'BR-Add' }
          }
        ]
      }
    ]
  },
  {
    path: '/unknown',
    component: Layouts,
    redirect: '/unknown/index',
    children: [
      {
        path: 'index',
        component: () => import('@/renderer/views/unknown/index.vue'),
        name: 'Unknown',
        meta: {
          title: 'Unknown UPCs'
        }
      }
    ]
  },
  {
    path: '/unpaid',
    component: Layouts,
    redirect: '/unpaid/index',
    children: [
      {
        path: 'index',
        component: () => import('@/renderer/views/unpaid/index.vue'),
        name: 'Unpaid',
        meta: {
          title: 'Unpaid UPCs'
        }
      }
    ]
  },
  {
    path: '/todo',
    component: Layouts,
    redirect: '/todo/index',
    children: [
      {
        path: 'index',
        component: () => import('@/renderer/views/todo/index.vue'),
        name: 'ToDo',
        meta: {
          title: 'ToDo List'
        }
      }
    ]
  }
]

/** Dynamic routes: visible based on authority, such as `admin action` */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: Layouts,
    redirect: '/admin/index',
    name: 'Admin',
    meta: {
      title: 'Admin Action',
      roles: ['admin', 'high-admin'],
      icon: 'mdi-lock',
      alwaysShow: true,
      requiresAdmin: true
    },
    children: [
      {
        path: 'auth',
        component: () => import('@/renderer/views/admin/auth/index.vue'),
        name: 'Admin Credential',
        meta: {
          title: 'Admin Credential',
          roles: ['admin', 'high-admin'],
          hidden: true
        }
      },
      {
        path: 'index',
        component: () => import('@/renderer/views/admin/index.vue'),
        name: 'Admin Home',
        meta: {
          title: 'Admin Home',
          roles: ['admin', 'high-admin']
        }
      }
    ]
  },
  createAdminFunctionRoutes('manufacturer', 'Manufacturer', ['admin', 'high-admin']),
  createAdminFunctionRoutes('distributor', 'Distributor', ['admin', 'high-admin']),
  createAdminFunctionRoutes('initiator', 'Initiator', ['admin', 'high-admin']),
  createAdminFunctionRoutes('pickup', 'Pickup Agent', ['admin', 'high-admin']),
  // High Admin Only ////////////////////////////////////////////
  {
    path: '/fee',
    component: Layouts,
    redirect: '/fee/index',
    meta: {
      roles: ['high-admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/renderer/views/admin/highAdmin/index.vue'),
        name: 'Fee Home',
        meta: {
          title: 'Fee Home'
        }
      },
      {
        path: 'dashboard',
        component: () => import('@/renderer/views/admin/highAdmin/VFeeDashboardHelper.vue'),
        name: 'Fee Dashboard',
        meta: {
          title: 'Fee Dashboard'
        }
      },
      {
        path: 'negotiate',
        component: () => import('@/renderer/views/admin/highAdmin/VPickupRatesHelper.vue'),
        name: 'Pickup Processing',
        meta: {
          title: 'Pickup Fee Dashboard'
        }
      }
    ]
  }
]

/** Resets all dynamic routes */
export function resetRouter() {
  // All registered dynamic routes must have the `name` props for effective reset
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    window.location.reload()
  }
}

const router = createRouter({
  history,
  routes: flatMultiLevelRoutes(constantRoutes),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

export default router
