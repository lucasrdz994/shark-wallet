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
const curentYear = String(dayjs().year())
const currentMonth = String(dayjs().month() + 1)

// References
const showDatePopup = ref(false)
const date = ref([curentYear, currentMonth])

// Functions
function onSearch(event = null) {
  if (event) {
    date.value = event.selectedValues
  }
  emit('change', date.value)
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
  onSearch()
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
      <van-date-picker
        v-model="date"
        title="Seleccione un mes"
        :columns-type="['year', 'month']"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onSearch"
        @cancel="showDatePopup = false"
      />
    </van-popup>
  </section>
</template>
