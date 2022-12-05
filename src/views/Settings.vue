<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Toast } from 'vant'
import 'vant/es/toast/style'

// Router
import { useRouter } from 'vue-router'

// Pinia
import { useSessionStore } from '../stores/session'

const router = useRouter()
const sessionStore = useSessionStore()

// References
const processing = ref(false)
const user = reactive({
  displayName: '',
  email: ''
})

// Functions
async function onSubmit(event) {
  try {
    processing.value = true
    await sessionStore.update({
      displayName: event.name
    })
    Toast.success('Guardado')
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
}

async function onLogout() {
  try {
    await sessionStore.logout()
  } catch (error) {
    console.log(error)
  } finally {
    router.push('/')
  }
}

// Lifecycle
onMounted(() => {
  for (const key in user) {
    if (sessionStore.user.hasOwnProperty(key)) {
      user[key] = sessionStore.user[key]
    }
  }
})
</script>

<template>
  <section class="page">
    <van-form class="settings-form" @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="user.displayName" name="name" label="Nombre" placeholder="Nombre" />
        <van-field :model-value="user.email" name="email" label="Email" placeholder="Email" readonly />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" :loading="processing">Guardar</van-button>
      </div>
      <div style="margin: 0 16px 0 16px">
        <van-button type="danger" block round @click="onLogout">Cerrar sesión</van-button>
      </div>
    </van-form>
  </section>
</template>

<style scoped>
.settings-form {
  margin: var(--van-padding-md) 0;
}
</style>
