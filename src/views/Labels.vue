<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLabelsStore } from '../stores/labels'

// Components
import Loading from '../components/Loading.vue'

// Props
const props = defineProps({
  updateMode: {
    type: Boolean,
    default: false
  }
})

const labelsStore = useLabelsStore()
const route = useRoute()

// Config
const visibilityOptions = [
  { value: 'expense', text: 'Gasto' },
  { value: 'income', text: 'Ingreso' }
]

// References
const loading = ref(false)
const processing = ref(false)
const emptyLabel = ref('')
const visibilityCheckboxRefs = ref([])

const label = reactive({
  id: null,
  name: '',
  note: '',
  budget: null,
  visibility: visibilityOptions.map((el) => el.value),
  createdAt: null,
  updatedAt: null,
  deletedAt: null
})

// Functions
async function onSubmit() {
  try {
    processing.value = true

    if (props.updateMode) {
      return await labelsStore.update(label)
    }
    await labelsStore.create(label)
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
}

function restoreEmptyLabel() {
  const defaults = JSON.parse(emptyLabel.value)
  for (const key in defaults) {
    if (label.hasOwnProperty(key)) {
      label[key] = defaults[key]
    }
  }
}

const visibilityCheckboxToggle = (index) => {
  visibilityCheckboxRefs.value[index].toggle()
}

// Watchers
watch(
  () => route.path,
  () => {
    restoreEmptyLabel()
  }
)

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    emptyLabel.value = JSON.stringify(label)
    if (props.updateMode) {
      const data = await labelsStore.get(route.params.id)
      for (const key in data) {
        if (label.hasOwnProperty(key)) {
          label[key] = data[key]
        }
      }
    }
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
      <van-form class="label-form" @submit="onSubmit">
        <h6 class="cell-groups-subtitle">Crear etiqueta</h6>
        <van-cell-group inset>
          <van-field
            v-model="label.name"
            name="name"
            label="Nombre"
            placeholder="Nombre"
            :rules="[{ pattern: /\w+/, message: 'Campo requerido' }]"
          />
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
            placeholder="Presupuesto"
            autocomplete="off"
          />
        </van-cell-group>
        <h6 class="cell-groups-subtitle">Visibilidad</h6>
        <van-cell-group inset>
          <van-checkbox-group v-model="label.visibility">
            <van-cell
              v-for="(item, index) in visibilityOptions"
              :key="item"
              clickable
              :title="item.text"
              @click="visibilityCheckboxToggle(index)"
            >
              <template #right-icon>
                <van-checkbox :ref="(el) => (visibilityCheckboxRefs[index] = el)" :name="item.value" @click.stop />
              </template>
            </van-cell>
          </van-checkbox-group>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit" :loading="processing">Guardar</van-button>
        </div>
      </van-form>
    </template>
  </section>
</template>

<style scoped>
.label-form {
  margin: var(--van-padding-md) 0;
}
</style>
