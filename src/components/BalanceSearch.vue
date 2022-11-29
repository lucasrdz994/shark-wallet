<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useSessionStore } from '../stores/session'

dayjs.locale('es')

const sessionStore = useSessionStore()

// Emits
const emit = defineEmits(['change'])

// Configs
const minDate = dayjs(sessionStore.createdAt).toDate()
const maxDate = dayjs().toDate()

// References
const showDatePopup = ref(false)
const date = ref(dayjs().toDate())

// Functions
function onSearch(event) {
  emit('change', event)
  showDatePopup.value = false
}

// Computed
const dateText = computed(() => {
  if (date.value) {
    return dayjs(date.value).format('MMMM, YYYY')
  }
  return ''
})

// Lifecycle
onMounted(() => {
  onSearch(date.value)
})
</script>

<template>
  <section>
    <van-cell-group inset>
      <van-field
        is-link
        readonly
        label="Balance de"
        placeholder="Seleccione un mes"
        :model-value="dateText"
        @click="showDatePopup = true"
      />
    </van-cell-group>
    <van-popup v-model:show="showDatePopup" round position="bottom">
      <van-datetime-picker
        v-model="date"
        type="year-month"
        title="Seleccione un mes"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onSearch"
        @cancel="showDatePopup = false"
      />
    </van-popup>
  </section>
</template>
