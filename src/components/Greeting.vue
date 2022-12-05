<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'
import { useSessionStore } from '../stores/session'

// Components
import Notifications from './Notifications.vue'

const notificationsStore = useNotificationsStore()
const sessionStore = useSessionStore()

// References
const loading = ref(false)

// Computed
const displayName = computed(() => sessionStore.user.displayName.split(' ')[0])

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await notificationsStore.list()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <header>
    <section class="logo-icon">
      <van-image width="52" height="52" src="/favicon.svg" />
    </section>
    <section class="greeting">Hola {{ displayName }}</section>
    <Notifications />
  </header>
</template>

<style scoped>
header {
  padding: 0 var(--van-padding-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: var(--app-greeting-header-height);
}
.greeting {
  font-size: 1.5rem;
}
.logo-icon {
  padding: 0.8rem;
  background-color: var(--app-white);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  align-self: flex-start;
}
</style>
