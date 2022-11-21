<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Toast } from 'vant'
import 'vant/es/toast/style'

// Router
import { useRouter } from 'vue-router'

import { useSessionStore } from '../stores/session'

const router = useRouter()
const sessionStore = useSessionStore()

// References
const processing = ref(false)

const credentials = reactive({
  email: null,
  password: null
})

// Functions
async function onSubmit() {
  try {
    processing.value = true
    await sessionStore.login(credentials)
    Toast.success('Logged in')
    router.push('app')
  } catch (error) {
    console.log(error)
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (sessionStore.isLoggedIn) {
    router.push('app')
  }
})
</script>

<template>
  <section class="page">
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="credentials.email" name="email" label="Email" type="email" placeholder="Email" />
          <van-field
            v-model="credentials.password"
            name="password"
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit" :loading="processing">Login</van-button>
        </div>
      </van-form>
    </div>
  </section>
</template>

<style scoped>
.login-form {
  padding: var(--van-padding-md) 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
