<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRecordsStore } from '../stores/records'
// import { useJobsStore } from '../stores/jobs'

// Components
import Loading from './Loading.vue'

const recordsStore = useRecordsStore()
// const jobsStore = useJobsStore()

// Config
const badgeProps = {
  max: 9
}

const themeVars = {
  badgeSize: '18px',
  badgePadding: '1px 5px',
  badgeBorderWidth: '0'
}

// References
const loading = ref(false)
const reminders = ref([])

// Computed
const havePendings = computed(() => Boolean(recordsStore.pendings.length))
const pendingsCount = computed(() => recordsStore.pendings.length)
const haveReminders = computed(() => Boolean(reminders.value.length))

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await recordsStore.getPendings()
    // reminders.value = await jobsStore.reminders()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <van-row gutter="16">
    <van-col span="8">
      <van-config-provider :theme-vars="themeVars">
        <div class="box center">
          <Loading v-if="loading" />
          <template v-else>
            <van-icon
              size="42"
              :name="havePendings ? 'warn-o' : 'thumb-circle-o'"
              :badge="pendingsCount || null"
              :badge-props="badgeProps"
            />
            <small>{{ havePendings ? 'Deudas pendientes' : 'Sin deudas' }}</small>
          </template>
        </div>
      </van-config-provider>
    </van-col>
    <van-col span="16">
      <div class="box" :class="{ center: !haveReminders }">
        <template v-if="haveReminders">
          <div class="title"><van-icon name="clock-o" size="22" /> Recordatorios</div>
          <small v-for="item of reminders" :key="item.id">
            $ {{ item.amount }}
            <van-tag type="success">{{ item.label.name }}</van-tag>
          </small>
        </template>
        <template v-else>
          <small>No tienes recordatorios de pago</small>
        </template>
      </div>
    </van-col>
  </van-row>
</template>

<style scoped>
.van-row {
  margin: var(--van-padding-md);
  margin-bottom: 0;
}
.box {
  height: auto;
  border-radius: 1rem;
  padding: var(--van-padding-md);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.box.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.6rem;
  text-align: center;
}
.title {
  margin-bottom: 0.5rem;
}
</style>
