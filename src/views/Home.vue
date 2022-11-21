<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Toast } from 'vant'
import 'vant/es/toast/style'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/session'

const router = useRouter()
const sessionStore = useSessionStore()

// References
const installButton = ref(null)
const showSignInPopup = ref(false)
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

onMounted(() => {
  const button = installButton.value.$el
  let deferredPrompt

  window.addEventListener('beforeinstallprompt', (e) => {
    button.style.display = 'block'
    deferredPrompt = e
  })

  button.addEventListener('click', async () => {
    if (deferredPrompt !== null) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        deferredPrompt = null
      }
    }
  })
})
</script>

<template>
  <div class="background-decoration">
    <svg
      id="wave"
      style="transform: rotate(180deg); transition: 0.3s"
      viewBox="0 0 1440 490"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
          <stop stop-color="rgba(0, 109, 170, 1)" offset="0%"></stop>
          <stop stop-color="rgba(57, 147, 221, 1)" offset="100%"></stop>
        </linearGradient>
      </defs>
      <path
        style="transform: translate(0, 0px); opacity: 1"
        fill="url(#sw-gradient-0)"
        d="M0,294L120,269.5C240,245,480,196,720,155.2C960,114,1200,82,1440,130.7C1680,180,1920,310,2160,302.2C2400,294,2640,147,2880,147C3120,147,3360,294,3600,318.5C3840,343,4080,245,4320,212.3C4560,180,4800,212,5040,196C5280,180,5520,114,5760,81.7C6000,49,6240,49,6480,73.5C6720,98,6960,147,7200,171.5C7440,196,7680,196,7920,228.7C8160,261,8400,327,8640,359.3C8880,392,9120,392,9360,367.5C9600,343,9840,294,10080,269.5C10320,245,10560,245,10800,261.3C11040,278,11280,310,11520,277.7C11760,245,12000,147,12240,122.5C12480,98,12720,147,12960,179.7C13200,212,13440,229,13680,204.2C13920,180,14160,114,14400,147C14640,180,14880,310,15120,375.7C15360,441,15600,441,15840,408.3C16080,376,16320,310,16560,302.2C16800,294,17040,343,17160,367.5L17280,392L17280,490L17160,490C17040,490,16800,490,16560,490C16320,490,16080,490,15840,490C15600,490,15360,490,15120,490C14880,490,14640,490,14400,490C14160,490,13920,490,13680,490C13440,490,13200,490,12960,490C12720,490,12480,490,12240,490C12000,490,11760,490,11520,490C11280,490,11040,490,10800,490C10560,490,10320,490,10080,490C9840,490,9600,490,9360,490C9120,490,8880,490,8640,490C8400,490,8160,490,7920,490C7680,490,7440,490,7200,490C6960,490,6720,490,6480,490C6240,490,6000,490,5760,490C5520,490,5280,490,5040,490C4800,490,4560,490,4320,490C4080,490,3840,490,3600,490C3360,490,3120,490,2880,490C2640,490,2400,490,2160,490C1920,490,1680,490,1440,490C1200,490,960,490,720,490C480,490,240,490,120,490L0,490Z"
      ></path>
    </svg>
  </div>
  <section class="landing-page">
    <header>
      <div class="logo">
        <van-image width="160" alt="logo" src="/logo.svg" />
      </div>
      <nav>
        <van-button plain round color="#6B66A3" @click="showSignInPopup = true">Ingresar</van-button>
        <van-button round color="#6B66A3">Crear Cuenta</van-button>
      </nav>
      <van-popup
        v-model:show="showSignInPopup"
        round
        closeable
        :style="{
          height: '30%',
          width: '500px',
          'max-width': '80%',
          padding: '1.5rem',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        }"
      >
        <van-form :style="{ width: '100%' }" @submit="onSubmit">
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
      </van-popup>
    </header>
    <section class="heading">
      <h1>Gestiona tu Billetera</h1>
    </section>
    <section class="features">
      <article>
        <h3>Gastos e Ingresos</h3>
        <van-icon name="exchange" size="48" />
        <p>Registra tus movimientos fácilmente</p>
      </article>
      <article>
        <h3>Balance mensual</h3>
        <van-icon name="bar-chart-o" size="48" />
        <p>Consulta el balance mensual para un mayor control</p>
      </article>
      <article>
        <h3>Recordatorios</h3>
        <van-icon name="clock-o" size="48" />
        <p>No olvides ningún gasto o cobro</p>
      </article>
    </section>
    <section class="install">
      <van-button ref="installButton" round size="large" color="#6B66A3" icon="down">Instalar App</van-button>
    </section>
    <footer>Hecho con ❤️ por Lucas Rodríguez</footer>
  </section>
</template>

<style scoped>
.background-decoration {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  opacity: 0.75;
}
.landing-page {
  padding: 2rem 2.5rem;
  position: relative;
  max-width: 1140px;
  margin: 0 auto;
}
header {
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 3fr;
  gap: 1.5rem;
}
header .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--app-dark);
  white-space: nowrap;
  justify-self: start;
}
header nav {
  display: flex;
  column-gap: 1rem;
  justify-self: end;
}
.heading {
  font-size: 3rem;
  text-align: center;
  color: var(--van-gray-8);
  margin: 4rem 0;
}
.features {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  color: var(--van-gray-7);
  margin-bottom: 4rem;
  flex-wrap: wrap;
}
.features article {
  border: 1px solid var(--van-gray-4);
  padding: var(--van-padding-md) var(--van-padding-lg);
  border-radius: 1rem;
  background-color: var(--app-white);
  text-align: center;
  filter: drop-shadow(0px 2px 12px rgba(47, 47, 47, 0.15));
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
.install {
  max-width: 400px;
  margin: 0 auto 80px auto;
}
footer {
  color: var(--app-white);
  background-color: var(--app-dark);
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media all and (max-width: 768px) {
  header {
    grid-template-columns: auto;
  }
  header .logo,
  header nav {
    justify-self: center;
  }
}
</style>
