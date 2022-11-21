<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabbarVars = {
  tabbarItemIconMarginBottom: '0px',
  tabbarItemIconSize: '24px'
}

const showMenuOptions = ref(false)
const menuOptions = [
  { text: 'Recordatorios', icon: 'clock-o', to: 'reminders' },
  { text: 'Programados', icon: 'replay', to: 'scheduled' },
  { text: 'Ajustes', icon: 'setting-o', to: 'settings' }
]
const onSelectMenuOption = (option) => router.push(option.to)
</script>

<template>
  <footer class="navigation">
    <van-config-provider :theme-vars="tabbarVars">
      <van-tabbar route>
        <van-tabbar-item icon="home-o" to="/app/summary"></van-tabbar-item>
        <van-tabbar-item icon="bar-chart-o" to="/app/wallet"></van-tabbar-item>
        <van-tabbar-item icon="add-o" class="create-button" to="/app/records"> </van-tabbar-item>
        <van-tabbar-item icon="label-o" to="/app/labels-list"></van-tabbar-item>
        <van-popover
          v-model:show="showMenuOptions"
          :actions="menuOptions"
          placement="top-end"
          :offset="[-10, 15]"
          @select="onSelectMenuOption"
        >
          <template #reference>
            <van-tabbar-item style="height: 100%" icon="ellipsis"></van-tabbar-item>
          </template>
        </van-popover>
      </van-tabbar>
    </van-config-provider>
  </footer>
</template>

<style scoped>
.navigation {
  height: var(--app-navigation-footer-height);
}
</style>
