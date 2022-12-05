import { createRouter, createWebHistory } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Layout from './views/_Layout.vue'

import Summary from './views/Summary.vue'
import Records from './views/Records.vue'
import Wallet from './views/Wallet.vue'
import Scheduled from './views/Scheduled.vue'
import Reminders from './views/Scheduled.vue'
import Settings from './views/Settings.vue'
import LabelsList from './views/LabelsList.vue'
import Labels from './views/Labels.vue'

import Login from './views/Login.vue'
import Home from './views/Home.vue'

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home,
    meta: { title: 'Inicio' }
  },
  {
    path: '/app',
    component: Layout,
    redirect: '/app/summary',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'summary',
        component: Summary,
        meta: { title: 'Resumen' }
      },
      {
        path: 'wallet',
        component: Wallet,
        meta: { title: 'Mi Billetera' }
      },
      {
        path: 'records',
        component: Records,
        meta: { title: 'Registros' }
      },
      {
        path: 'records/:id',
        component: Records,
        meta: { title: 'Registros' },
        props: { updateMode: true }
      },
      {
        path: 'scheduled',
        component: Scheduled,
        meta: { title: 'Programados' }
      },
      {
        path: 'settings',
        component: Settings,
        meta: { title: 'Ajustes' }
      },
      {
        path: 'labels-list',
        component: LabelsList,
        meta: { title: 'Etiquetas' }
      },
      {
        path: 'labels',
        component: Labels,
        meta: { title: 'Etiquetas' }
      },
      {
        path: 'scheduled',
        component: Records,
        meta: { title: 'Programados' }
      },
      {
        path: 'reminders',
        component: Reminders,
        meta: { title: 'Recordatorios' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Obtengo el usuario logueado
const fetchCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const listener = onAuthStateChanged(
      auth,
      (user) => {
        listener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to) => {
  if (to.meta.title) document.title = `${to.meta.title} - Shark Wallet`

  const user = Boolean(await fetchCurrentUser())

  if (to.meta.requiresAuth && !user) return '/login'

  if (user && !/\/app[.\-/\w]*/gi.test(to.path)) return '/app'
})

export default router
