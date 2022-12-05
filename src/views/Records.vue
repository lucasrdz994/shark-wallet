<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useRecordsStore } from '../stores/records'
import { useJobsStore } from '../stores/jobs'
import { useLabelsStore } from '../stores/labels'
import { Toast } from 'vant'
import 'vant/es/toast/style'

// Components
import Loading from '../components/Loading.vue'

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

const scheduled = ref(false)
const scheduledOn = ref(null)

const reminder = ref(false)
const reminderOn = ref(null)

const record = reactive({
  id: null,
  type: 'expense',
  amount: 0,
  note: '',
  label: {},
  pending: false,
  createdAt: null,
  updatedAt: null,
  deletedAt: null
})

// Computed
const typesOptions = computed(() => {
  return [
    { name: 'Gasto', value: 'expense' },
    { name: 'Ingreso', value: 'income' }
  ]
})
const labels = computed(() => labelsStore.items.filter((el) => el.visibility.includes(record.type)))
const scheduledText = computed(() => (scheduled.value ? `${scheduledOn.value} de cada mes` : null))
const isJob = computed(() => scheduled.value || reminder.value)
const typeName = computed(() => typesOptions.value.find((el) => el.value === record.type)?.name || null)

// Functions
async function onSubmit() {
  try {
    processing.value = true

    if (isJob.value) {
      const rules = {
        scheduled: scheduled.value,
        scheduledOn: scheduledOn.value,
        reminder: reminder.value,
        reminderOn: reminderOn.value
      }
      await jobsStore.create(record, rules)
    } else {
      if (props.updateMode) {
        await recordsStore.update(record)
      } else {
        await recordsStore.create(record)
      }
    }
    Toast.success('Guardado')
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
}

function onConfirmLabel(event) {
  const label = labels.value.find((el) => el.id === event.id)
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
  scheduledOn.value = event.getDate()
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
  () => [scheduled.value, reminder.value],
  (val) => {
    const [scheduled, reminder] = val
    scheduledOn.value = scheduled ? dayjs().date() : null
    reminderOn.value = reminder ? dayjs().todate() : null
  }
)

watchEffect(() => record.label = labelsStore.default)

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    emptyRecord.value = JSON.stringify(record)
    await labelsStore.getAll()

    if (props.updateMode) {
      const data = await recordsStore.get(route.params.id)
      for (const key in data) {
        if (record.hasOwnProperty(key)) {
          record[key] = data[key]
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
      <van-form class="record-form" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="typeName"
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
            :rules="[{ pattern: /\d+/, message: 'Campo requerido' }]"
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

          <van-cell center title="Pendiente">
            <template #right-icon>
              <van-switch v-model="record.pending" name="pending" size="24" />
            </template>
          </van-cell>

          <template v-if="!props.updateMode">
            <van-cell center title="Programado">
              <template #right-icon>
                <van-switch v-model="scheduled" name="scheduled" size="24" />
              </template>
            </van-cell>
            <van-cell
              v-if="scheduled"
              title="Se agrega el"
              name="scheduledOn"
              is-link
              :value="scheduledText"
              @click="showScheduledPicker = true"
            />
          </template>
          <template v-else-if="props.updateMode && scheduled">
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
              :columns="labels"
              @cancel="showLabelsPicker = false"
              @confirm="onConfirmLabel"
            />
          </van-popup>
        </van-cell-group>

        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit" :loading="processing">Guardar</van-button>
        </div>
      </van-form>
    </template>
  </section>
</template>

<style scoped>
.record-form {
  margin: var(--van-padding-md) 0;
}
</style>
