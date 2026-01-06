import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { messages } from './i18n'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  legacy: false
})

const savedTheme = localStorage.getItem('app-theme')
const theme = savedTheme || 'dark'
document.documentElement.setAttribute('data-theme', theme)

const app = createApp(App)

app.use(router)
app.use(i18n)

// Error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
}

// Mount app
app.mount('#app')

console.log('✅ App mounted successfully')
