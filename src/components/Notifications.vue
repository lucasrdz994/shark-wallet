<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'

const notificationsStore = useNotificationsStore()

const gridVars = {
  gridItemContentPadding: 'var(--van-padding-md)'
}

// References
const showNotifications = ref(false)

// Computed
const emptyNotifications = computed(() => Boolean(!notificationsStore.count))

// Lifecycle
onMounted(async () => {
  try {
    await notificationsStore.list()
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <van-popover v-model:show="showNotifications" placement="bottom-end" :offset="[0, 2]">
    <van-config-provider :theme-vars="gridVars">
      <van-grid :clickable="!emptyNotifications" :center="false" column-num="1" style="width: 300px">
        <template v-if="emptyNotifications">
          <van-grid-item>
            <van-empty image-size="100" description="No hay notificaciones" />
          </van-grid-item>
        </template>
        <template v-else>
          <van-grid-item
            v-for="item of notificationsStore.items"
            :key="item.id"
            :text="item.title"
            @click="showNotifications = false"
          />
        </template>
      </van-grid>
    </van-config-provider>
    <template #reference>
      <section class="notification-icon">
        <svg
          width="68px"
          height="68px"
          fill="#323233"
          version="1.1"
          viewBox="0 0 752 752"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m512.55 450.98-11.246-11.445c-0.90234-0.96094-1.3945-2.2344-1.3828-3.5508v-59.988c0.039063-25.453-7.7617-50.305-22.344-71.168-14.582-20.867-35.234-36.734-59.152-45.449 1.3633-4.1445 2.0977-8.4648 2.1719-12.828 0-15.859-8.4648-30.52-22.199-38.449-13.738-7.9297-30.66-7.9297-44.398 0-13.738 7.9297-22.199 22.59-22.199 38.449 0.074219 4.3633 0.80859 8.6836 2.1719 12.828-23.957 8.6797-44.652 24.535-59.27 45.406-14.617 20.867-22.449 45.734-22.426 71.211v59.199c-0.035156 1.25-0.52734 2.4414-1.3789 3.3555l-11.445 11.641c-4.7773 4.8789-8 11.059-9.2656 17.77-1.2656 6.707-0.51172 13.641 2.1602 19.922 2.6055 6.3125 7.043 11.699 12.742 15.461 5.6992 3.7656 12.395 5.7344 19.227 5.6523h58.012c1.875 17.809 12.477 33.52 28.285 41.926 15.812 8.4062 34.766 8.4062 50.578 0 15.809-8.4062 26.41-24.117 28.285-41.926h59.199c6.8281 0.082031 13.523-1.8867 19.223-5.6523 5.6992-3.7617 10.137-9.1484 12.742-15.461 2.3828-6.2734 2.8867-13.102 1.4492-19.656-1.4375-6.5547-4.7539-12.547-9.5391-17.246zm-136.55-219.23c3.9258 0 7.6914 1.5586 10.465 4.332 2.7773 2.7773 4.3359 6.543 4.3359 10.465 0 2.1172-0.47266 4.207-1.3828 6.1172-8.9805-1.0469-18.051-1.0469-27.031 0-0.91016-1.9102-1.3828-4-1.3828-6.1172 0-3.957 1.5859-7.7539 4.4062-10.535 2.8164-2.7812 6.6328-4.3164 10.59-4.2617zm0 295.99c-5.4219 0.015625-10.699-1.75-15.012-5.0312-4.3164-3.2812-7.4336-7.8945-8.8633-13.125h47.555c-1.3867 5.2344-4.4531 9.8672-8.7344 13.184-4.2773 3.3164-9.5312 5.1328-14.945 5.168zm116.42-50.91c-0.67578 1.918-2.5039 3.1875-4.5352 3.1562h-223.57c-2.0352 0.054687-3.8945-1.1484-4.6836-3.0273-0.78516-1.8789-0.33594-4.0469 1.1289-5.457l11.445-11.641v-0.003907c6.3945-6.5977 9.875-15.48 9.6719-24.664v-59.199c-0.046875-22.07 7.6484-43.457 21.746-60.438 14.098-16.984 33.703-28.484 55.406-32.5 11.273-2.1992 22.863-2.1992 34.137 0 21.668 4.0586 41.227 15.574 55.285 32.555 14.059 16.977 21.727 38.34 21.672 60.383v59.199c0.023438 9.0039 3.5664 17.641 9.8672 24.074l11.246 11.641c1.8711 1.457 2.375 4.0703 1.1836 6.1172z"
          />
        </svg>
      </section>
    </template>
  </van-popover>
</template>

<style scoped>
.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
}
</style>
