<script setup>
import { onMounted, ref, computed } from 'vue'
import { useJobsStore } from '../stores/jobs'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

const jobsStore = useJobsStore()

// Config
const types = {
  expense: 'Gasto',
  income: 'Ingreso'
}

// References
const loading = ref(false)

// Computed
const items = computed(() => jobsStore.scheduled)

// Functions
function formatDate(date) {
  date = !(date instanceof Date) ? date.toDate() : date
  return dayjs(date).format('DD MMMM - hh:mm')
}

async function onRemove(id) {
  await jobsStore.remove(id)
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await jobsStore.getScheduled()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <div v-if="loading" class="loading">
      <van-loading color="#1989fa" />
    </div>
    <template v-else>
      <van-cell-group inset class="scheduled-list scrollable">
        <van-cell>Programados</van-cell>
        <template v-if="items.length">
          <van-swipe-cell v-for="item of items" :key="item.id">
            <van-cell>
              <template #title>
                $ {{ item.record.amount }}
                <van-icon v-if="item.rules.scheduled" class="u-ml-xs" name="clock-o" color="#403d58" />
                <van-icon v-if="item.rules.reminder" class="u-ml-xs" name="bullhorn-o" color="#403d58" />
              </template>
              <template #value>
                <van-tag type="success" size="large">{{ item.record.label.name }}</van-tag>
              </template>
              <template #label>
                <div>{{ types[item.record.type] }}</div>
                <div>{{ formatDate(item.createdAt) }}</div>
              </template>
            </van-cell>
            <template #right>
              <van-button
                square
                type="danger"
                text="Eliminar"
                @click="onRemove(item.id)"
              />
            </template>
          </van-swipe-cell>
        </template>
        <van-empty v-else description="No encontramos resultados" />
      </van-cell-group>
    </template>
  </section>
</template>

<style scoped>
.scheduled-list {
  max-height: 100%;
  margin-top: var(--van-padding-md);
  margin-bottom: var(--van-padding-md);
}
</style>
