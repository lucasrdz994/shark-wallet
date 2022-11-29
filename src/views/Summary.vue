<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRecordsStore } from '../stores/records'

// Components
import Loading from '../components/Loading.vue'
import RecordList from '../components/RecordList.vue'
import Payments from '../components/Payments.vue'

const recordsStore = useRecordsStore()

// References
const loading = ref(false)

// Computed
const items = computed(() => recordsStore.latests)

// Functions
async function onRemoveRecord(event) {
  await recordsStore.remove(event)
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await recordsStore.getLatests()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <Loading v-if="loading" />
    <template v-else>
      <Payments />
      <RecordList
        title="Últimos Registros"
        :items="items"
        @on-remove="onRemoveRecord"
      />
    </template>
  </section>
</template>
