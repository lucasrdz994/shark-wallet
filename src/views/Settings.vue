<script setup>
import { ref } from 'vue'
import { Toast } from 'vant'
import 'vant/es/toast/style'

// Router
import { useRouter } from 'vue-router'

// Pinia
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'

const router = useRouter()
const sessionStore = useSessionStore()

// References
const { user } = storeToRefs(sessionStore)
const processing = ref(false)

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
</script>

<template>
  <section>
    <template v-if="user">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="user.displayName" name="name" label="Nombre" placeholder="Nombre" />
          <van-field :model-value="user.email" name="email" label="Email" placeholder="Email" readonly />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit" :loading="processing">Guardar</van-button>
        </div>
      </van-form>
      <div class="mx-4">
        <van-button type="danger" block round @click="onLogout">Cerrar sesión</van-button>
      </div>
    </template>
  </section>
</template>
