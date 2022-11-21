<script setup>
import { onMounted, ref } from 'vue'
import { useRecordsStore } from '../stores/records'

// Components
// import Balance from '../components/Balance.vue'
import RecordList from '../components/RecordList.vue'
import Payments from '../components/Payments.vue'

const recordsStore = useRecordsStore()

// References
const loading = ref(false)

// Functions
async function onRemoveRecord(event) {
  await recordsStore.remove(event)
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await recordsStore.list()
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
      <Payments />
      <RecordList title="Últimos Registros" :items="recordsStore.items" @on-remove="onRemoveRecord" />
    </template>
  </section>
</template>
