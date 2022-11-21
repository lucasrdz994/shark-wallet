<script setup>
import { onMounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'

// Components
import Greeting from '../components/Greeting.vue'
import Navigation from '../components/Navigation.vue'

const notificationsStore = useNotificationsStore()

// Lifecycle
onMounted(async () => {
  await notificationsStore.init()
})
</script>

<template>
  <div class="layout">
    <div class="waves">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 34"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(86, 136, 199, 0.20)" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(86, 136, 199, 0.40)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(86, 136, 199, 0.50)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(86, 136, 199, 0.60)" />
        </g>
      </svg>
    </div>

    <Greeting />
    <section class="view-section">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <Component :is="Component" />
        </transition>
      </router-view>
    </section>
    <Navigation />
  </div>
</template>

<style scoped>
.layout {
  height: 100%;
  /* display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 77px 1fr 60px; */
  /* position: relative;
  /* z-index: 1; */
}
.waves {
  transform: rotate(180deg);
  position: fixed;
  width: 100%;
  height: 150px;
}

.waves > svg {
  position: relative;
  width: 100%;
  height: 100%;
  margin-bottom: -7px; /*Fix for safari gap*/
  top: 0;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
