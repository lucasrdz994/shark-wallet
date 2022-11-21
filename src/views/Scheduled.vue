<script setup>
import { onMounted, ref } from 'vue'
import { useJobsStore } from '../stores/jobs'

// Components
// import RecordList from '../components/RecordList.vue'

const jobsStore = useJobsStore()

// References
const loading = ref(false)

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await jobsStore.list()
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
      <!-- <RecordList :items="jobsStore.items" title="Programados" /> -->
    </template>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}
</style>
