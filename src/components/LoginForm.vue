<script setup>
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'login'
  }
})

const router = useRouter()
const sessionStore = useSessionStore()

const name = ref('')
const email = ref('')
const password = ref('')

const submitButtonText = computed(() => (props.type === 'login' ? 'Ingresar' : 'Crear Cuenta'))
const createAccountMode = computed(() => props.type === 'createAccount')

async function onSubmit(event) {
  try {
    if (props.type === 'login') {
      await sessionStore.login(event)
    }
    if (props.type === 'createAccount') {
      await sessionStore.createAccount(event)
    }
    router.push('/app')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-if="createAccountMode"
        v-model="name"
        name="name"
        label="Nombre"
        placeholder="Nombre"
        :rules="[{ required: true, message: 'Nombre is required' }]"
      />
      <van-field
        v-model="email"
        name="email"
        label="Email"
        placeholder="Email"
        :rules="[{ required: true, message: 'Email is required' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="Contraseña"
        placeholder="Contraseña"
        :rules="[{ required: true, message: 'Password is required' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        {{ submitButtonText }}
      </van-button>
    </div>
  </van-form>
</template>
