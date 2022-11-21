<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'

// Components
import Notifications from './Notifications.vue'

const notificationsStore = useNotificationsStore()

// References
const loading = ref(false)

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
    <section class="greeting">Hola Lucas</section>
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
