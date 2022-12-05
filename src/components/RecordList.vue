<script setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

const router = useRouter()

const emit = defineEmits(['on-remove'])

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    required: true
  },
  processing: {
    type: Boolean,
    default: false
  }
})


// Functions
function onShowRecordDetails(item) {
  router.push('/app/records/' + item.id)
}

function formatDate(date) {
  date = !(date instanceof Date) ? date.toDate() : date
  return dayjs(date).format('DD MMMM - hh:mm')
}
</script>

<template>
  <van-cell-group inset class="record-list scrollable">
    <van-cell :title="props.title" />
    <template v-if="!props.processing">
      <template v-if="items.length">
        <van-swipe-cell v-for="item of items" :key="item.id">
          <van-cell clickable @click="onShowRecordDetails(item)">
            <template #title>
              <span class="record-title">
                <span
                  v-if="item.type === 'expense'"
                  :class="item.type"
                >
                  - $ {{ item.amount }}
                  <van-icon v-if="item.scheduled" name="clock-o" color="#403d58" />
                </span>
                <span
                  v-else
                  :class="item.type"
                >
                  + $ {{ item.amount }}
                  <van-icon v-if="item.scheduled" name="clock-o" color="#403d58" />
                </span>
              </span>
            </template>
            <template #value>
              <van-tag type="success" size="large">{{ item.label.name }}</van-tag>
            </template>
            <template #label>
              {{ formatDate(item.createdAt) }}
            </template>
          </van-cell>
          <template #right>
            <van-button
              square
              type="danger"
              text="Eliminar"
              @click="emit('on-remove', item.id)"
            />
          </template>
        </van-swipe-cell>
      </template>
      <van-empty v-else description="No encontramos resultados" />
    </template>

    <van-loading v-else color="#1989fa" class="processing" />
  </van-cell-group>
</template>

<style scoped>
.record-list {
  max-height: 100%;
  margin-top: var(--van-padding-md);
  margin-bottom: var(--van-padding-md);
}
.record-title {
  font-size: var(--van-font-size-lg);
  font-weight: 700;
}
.record-title .income {
  color: var(--app-success);
}
.record-title .expense {
  color: var(--app-danger);
}
.record-title .pending {
  color: var(--van-gray-6);
}
</style>
