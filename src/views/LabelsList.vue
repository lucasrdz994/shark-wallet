<script setup>
import { reactive, ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { Toast } from 'vant'
import 'vant/es/toast/style'

// Pinia
import { useLabelsStore } from '../stores/labels'

dayjs.locale('es')

const labelsStore = useLabelsStore()

// References
const loading = ref(false)
const processing = ref(false)
const showCreateLabelPopup = ref(false)
const showLabelsDetails = ref([])
const emptyLabel = ref('')

const label = reactive({
  id: null,
  name: '',
  note: '',
  budget: null
})

// Functions
async function onSubmit() {
  try {
    processing.value = true
    await labelsStore.create(label)
    showCreateLabelPopup.value = false
    Toast.success('Guardado')
    restoreEmptyLabel()
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
}

function format(date) {
  return dayjs(date).format('DD MM YY - hh:mm')
}

function restoreEmptyLabel() {
  const defaults = JSON.parse(emptyLabel.value)
  for (const key in defaults) {
    if (label.hasOwnProperty(key)) {
      label[key] = defaults[key]
    }
  }
}

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    emptyLabel.value = JSON.stringify(label)
    await labelsStore.list()
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
    <div v-else class="labels-list">
      <van-cell-group inset>
        <van-collapse v-model="showLabelsDetails">
          <van-collapse-item v-for="item of labelsStore.items" :key="item.id" :name="item.id">
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <div>
              <p>{{ item.note }}</p>
              <small>{{ format(item.date) }}</small>
            </div>
          </van-collapse-item>
        </van-collapse>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button type="primary" block round to="labels">Nueva etiqueta</van-button>
      </div>
      <van-popup v-model:show="showCreateLabelPopup" round closeable position="bottom">
        <span class="popup-title">Nueva Etiqueta</span>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field v-model="label.name" name="name" label="Nombre" placeholder="Nombre" autocomplete="off" />
            <van-field
              v-model="label.note"
              name="note"
              label="Nota"
              type="textarea"
              placeholder="Nota"
              rows="2"
              autosize
            />
            <van-field
              v-model.number="label.budget"
              name="budget"
              type="number"
              label="Presupuesto"
              placeholder="Sin presupuesto definido"
              autocomplete="off"
            />
          </van-cell-group>

          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit" :loading="processing">Guardar</van-button>
          </div>
        </van-form>
      </van-popup>
    </div>
  </section>
</template>

<style scoped>
.labels-list {
  padding: var(--van-padding-md) 0;
}
.popup-title {
  display: block;
  font-size: 22px;
  text-align: center;
  margin: 1rem 0;
}
</style>
