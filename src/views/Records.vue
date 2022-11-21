<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useRecordsStore } from '../stores/records'
import { useJobsStore } from '../stores/jobs'
import { useLabelsStore } from '../stores/labels'

// Props
const props = defineProps({
  updateMode: {
    type: Boolean,
    default: false
  }
})

const recordsStore = useRecordsStore()
const jobsStore = useJobsStore()
const labelsStore = useLabelsStore()
const route = useRoute()

// Configs
const minDate = dayjs('20220801').startOf('month').toDate()
const maxDate = dayjs('20220801').endOf('month').toDate()
const defaultDate = dayjs('20220801').set('day', dayjs().date()).toDate()
const pickerConfig = {
  text: 'name',
  value: 'id'
}

// References
const loading = ref(false)
const processing = ref(false)
const showScheduledPicker = ref(false)
const showTypesPicker = ref(false)
const showLabelsPicker = ref(false)
const emptyRecord = ref('')

const record = reactive({
  id: null,
  type: 'expense',
  amount: 0,
  note: '',
  label: {},
  scheduled: false,
  scheduledOn: null,
  reminder: false,
  reminderOn: null
})

// Computed
const typesOptions = computed(() => {
  return [
    { name: 'Gasto', value: 'expense' },
    { name: 'Ingreso', value: 'income' },
    { name: 'Deuda', value: 'debt' }
  ]
})
const labelsOptions = computed(() => labelsStore.items.filter((el) => el.visibility.includes(record.type)))
const scheduledFormatDate = computed(() => (record.scheduled ? `${record.scheduledOn} de cada mes` : null))
const isJobRecord = computed(() => record.scheduled || record.reminder)
const recordTypeName = computed(() => typesOptions.value.find((el) => el.value === record.type)?.name || null)

// Functions
async function onSubmit() {
  try {
    processing.value = true

    if (isJobRecord.value) {
      return await jobsStore.create(record)
    }
    if (props.updateMode) {
      return await recordsStore.update(record)
    }
    await recordsStore.create(record)
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
}

function onConfirmLabel(event) {
  const label = labelsOptions.value.find((el) => el.id === event.id)
  record.label = {
    id: label.id,
    name: label.name
  }
  showLabelsPicker.value = false
}

function onConfirmType(event) {
  record.type = event.value
  showTypesPicker.value = false
}

function onConfirmScheduled(event) {
  record.scheduledOn = event.getDate()
  showScheduledPicker.value = false
}

function restoreEmptyRecord() {
  const defaults = JSON.parse(emptyRecord.value)
  for (const key in defaults) {
    if (record.hasOwnProperty(key)) {
      record[key] = defaults[key]
    }
  }
}

// Watchers
watch(
  () => route.path,
  () => {
    restoreEmptyRecord()
  }
)
watch(
  () => [record.scheduled, record.reminder],
  (val) => {
    const [scheduled, reminder] = val
    record.scheduledOn = scheduled ? dayjs().date() : null
    record.reminderOn = reminder ? dayjs().todate() : null
  }
)

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    emptyRecord.value = JSON.stringify(record)
    await labelsStore.list()
    if (props.updateMode) {
      const recordData = await recordsStore.get(route.params.id)
      for (const key in recordData) {
        if (record.hasOwnProperty(key)) {
          record[key] = recordData[key]
        }
      }
    } else {
      record.label = labelsStore.default
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
    <div v-if="loading" class="loading">
      <van-loading color="#1989fa" />
    </div>
    <div v-else class="record-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="recordTypeName"
            is-link
            readonly
            name="type"
            label="Tipo"
            placeholder="Seleccione una"
            @click="showTypesPicker = true"
          />
          <van-field
            v-model.number="record.amount"
            name="amount"
            type="number"
            label="Monto"
            placeholder="Monto"
            autocomplete="off"
          />
          <van-field
            v-model="record.note"
            name="note"
            label="Nota"
            type="textarea"
            placeholder="Nota"
            rows="2"
            autosize
          />
          <van-field
            v-model="record.label.name"
            is-link
            readonly
            name="label"
            label="Etiqueta"
            placeholder="Seleccione una"
            @click="showLabelsPicker = true"
          />

          <template v-if="!props.updateMode && record.type !== 'debt'">
            <van-cell center title="Programado">
              <template #right-icon>
                <van-switch v-model="record.scheduled" name="scheduled" size="24" />
              </template>
            </van-cell>
            <van-cell
              v-if="record.scheduled"
              title="Se agrega el"
              name="scheduledOn"
              is-link
              :value="scheduledFormatDate"
              @click="showScheduledPicker = true"
            />
          </template>
          <template v-else-if="props.updateMode && record.scheduled">
            <van-cell title="Gasto programado" icon="info-o" />
          </template>

          <!-- Popups and Pickers -->
          <van-calendar
            v-model:show="showScheduledPicker"
            class="scheduled-every-calendar"
            title="Seleccione un día"
            color="#1989fa"
            :show-mark="false"
            :min-date="minDate"
            :max-date="maxDate"
            :default-date="defaultDate"
            @confirm="onConfirmScheduled"
          />

          <van-action-sheet
            v-model:show="showTypesPicker"
            :actions="typesOptions"
            cancel-text="Cancelar"
            description="Seleccione un tipo de registro"
            @select="onConfirmType"
          />

          <van-popup v-model:show="showLabelsPicker" round position="bottom">
            <van-picker
              title="Etiquetas"
              :columns-field-names="pickerConfig"
              :columns="labelsOptions"
              @cancel="showLabelsPicker = false"
              @confirm="onConfirmLabel"
            />
          </van-popup>
        </van-cell-group>

        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit" :loading="processing">Guardar</van-button>
        </div>
      </van-form>
    </div>
  </section>
</template>

<style scoped>
.record-form {
  padding: var(--van-padding-md) 0;
}
</style>
