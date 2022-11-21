<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useSessionStore } from './stores/session'

const router = useRouter()

const sessionStore = useSessionStore()

// Firebase Auth Listener

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      sessionStore.user = user
    } else {
      router.replace('/')
    }
  })
})
</script>

<template>
  <main>
    <router-view></router-view>
  </main>
</template>
