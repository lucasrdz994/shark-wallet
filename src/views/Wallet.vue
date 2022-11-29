<script setup>
import { ref, watch } from 'vue'
import { useRecordsStore } from '../stores/records'

// Components
import Balance from '../components/Balance.vue'
import BalanceSearch from '../components/BalanceSearch.vue'
import RecordList from '../components/RecordList.vue'

const recordsStore = useRecordsStore()

// References
const processing = ref(false)
const items = ref([])
const balanceSearch = ref(null)

// Functions
const onSearchChange = (event) => (balanceSearch.value = event)

// Watchers
watch(balanceSearch, async (val) => {
  try {
    processing.value = true
    items.value = await recordsStore.getBalance(val)
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
})
</script>

<template>
  <section class="page">
    <Balance :items="items" />
    <BalanceSearch @change="onSearchChange" />

    <RecordList :items="items" :processing="processing" title="Mi Billetera" />
  </section>
</template>
