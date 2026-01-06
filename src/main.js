import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { messages } from './i18n'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

const savedTheme = localStorage.getItem('app-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = savedTheme || 'dark'
document.documentElement.setAttribute('data-theme', theme)

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app')

