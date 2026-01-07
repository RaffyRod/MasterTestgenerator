<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-left">
          <div class="logo-wrapper">
            <span class="logo-icon">🧪</span>
            <h1 class="logo">{{ $t('app.title') }}</h1>
          </div>
          <button @click="toggleMobileMenu" class="mobile-menu-toggle" aria-label="Toggle menu">
            <span v-if="!mobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
          <div class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
            <router-link to="/test-plans" class="nav-link" @click="closeMobileMenu">
              <span class="nav-icon">📋</span>
              <span>{{ $t('nav.testPlans') }}</span>
            </router-link>
            <router-link to="/test-cases" class="nav-link" @click="closeMobileMenu">
              <span class="nav-icon">✅</span>
              <span>{{ $t('nav.testCases') }}</span>
            </router-link>
          </div>
        </div>
        <div class="nav-right">
          <button
            @click="toggleTheme"
            class="theme-toggle"
            :title="currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
          >
            <span v-if="currentTheme === 'light'">🌙</span>
            <span v-else>☀️</span>
          </button>
          <div class="language-selector">
            <button
              @click="setLocale('en')"
              :class="['lang-btn', { active: currentLocale === 'en' }]"
              title="English"
            >
              EN
            </button>
            <button
              @click="setLocale('es')"
              :class="['lang-btn', { active: currentLocale === 'es' }]"
              title="Español"
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view v-if="true" />
      <div v-if="false" style="padding: 2rem; color: red; background: yellow">
        DEBUG: Router view should be visible
      </div>
    </main>
    <NotificationToast />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useTheme } from '@shared/composables/useTheme.js'
import { onMounted, ref } from 'vue'
import NotificationToast from '@shared/components/NotificationToast.vue'

export default {
  name: 'App',
  components: {
    NotificationToast
  },
  setup() {
    const { locale } = useI18n()
    const { currentTheme, toggleTheme, initTheme } = useTheme()
    const mobileMenuOpen = ref(false)

    onMounted(() => {
      try {
        initTheme()
        const savedLocale = localStorage.getItem('locale')
        if (savedLocale) {
          locale.value = savedLocale
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      }
    })

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    return {
      currentLocale: locale,
      currentTheme,
      mobileMenuOpen,
      setLocale: lang => {
        try {
          locale.value = lang
          localStorage.setItem('locale', lang)
        } catch (error) {
          console.error('Error setting locale:', error)
        }
      },
      toggleTheme,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>

<style>
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #4caf50;
  --info-color: #2196f3;
  --warning-color: #ff9800;
  --danger-color: #f44336;

  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;
  --bg-header: linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%);
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-tertiary: #b0b0b0;
  --border-color: #3a3a3a;
  --shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.5);

  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #fafafa;
  --bg-header: linear-gradient(135deg, #5b8def 0%, #6ba3e8 100%);
  --primary-color: #5b8def;
  --secondary-color: #6ba3e8;
  --primary-gradient: linear-gradient(135deg, #5b8def 0%, #6ba3e8 100%);
  --text-primary: #000000;
  --text-secondary: #333333;
  --text-tertiary: #666666;
  --border-color: #e0e0e0;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

[data-theme='light'] body {
  background: #ffffff !important;
  color: #000000 !important;
}

[data-theme='dark'] body {
  background: #000000 !important;
  color: #ffffff !important;
}

[data-theme='light'] body {
  background: var(--bg-secondary);
}

#app {
  min-height: 100vh;
  width: 100%;
  display: block;
}

.navbar {
  background: var(--bg-header) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
  padding: 1rem 0 !important;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-radius: 0;
  margin-bottom: 2rem;
  width: 100%;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

[data-theme='light'] .navbar {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.75rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme='light'] .logo {
  color: white;
  -webkit-text-fill-color: white;
}

.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: var(--transition);
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}

.mobile-menu-toggle:hover {
  background: var(--bg-secondary);
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

[data-theme='light'] .nav-links {
  background: transparent;
  border: none;
  padding: 0;
}

.nav-link {
  color: var(--text-secondary) !important;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: var(--transition);
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  background: transparent;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 44px;
  min-width: 44px;
}

.nav-link:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.nav-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

[data-theme='light'] .nav-link {
  color: white;
}

[data-theme='light'] .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

[data-theme='light'] .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: var(--bg-primary) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--primary-color) !important;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.25rem;
  width: auto;
  height: auto;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  visibility: visible !important;
  opacity: 1 !important;
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  transform: scale(1.1);
}

[data-theme='light'] .theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

[data-theme='light'] .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.language-selector {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  align-items: center;
}

[data-theme='light'] .language-selector {
  background: rgba(255, 255, 255, 0.1);
  border: none;
}

.lang-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary) !important;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
  min-width: 3rem;
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.lang-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--text-primary);
}

.lang-btn.active {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

[data-theme='light'] .lang-btn {
  color: white;
}

[data-theme='light'] .lang-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

[data-theme='light'] .lang-btn.active {
  background: white;
  color: var(--primary-color);
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  animation: fadeIn 0.4s ease-in;
  min-height: calc(100vh - 200px);
  display: block;
  visibility: visible;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0 0.75rem 0.75rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .nav-container {
    padding: 1.5rem;
  }

  .logo {
    font-size: 1.75rem;
  }

  .nav-links {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  body {
    padding: 0;
  }

  .nav-container {
    padding: 1rem;
    gap: 1rem;
  }

  .nav-left {
    width: 100%;
    justify-content: space-between;
    position: relative;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .logo-wrapper {
    gap: 0.5rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .nav-links {
    position: absolute;
    top: calc(100% + 1rem);
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 0.5rem;
  }

  .nav-links.mobile-open {
    max-height: 300px;
    opacity: 1;
    transform: translateY(0);
  }

  [data-theme='light'] .nav-links {
    background: #ffffff;
    border-color: #e0e0e0;
  }

  [data-theme='dark'] .nav-links {
    background: #1a1a1a;
    border-color: #3a3a3a;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 1rem 1.25rem;
    min-height: 48px;
  }

  .nav-right {
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
  }

  .theme-toggle,
  .language-selector {
    min-width: 44px;
    min-height: 44px;
  }

  .main-content {
    padding: 0 1rem 1rem;
  }
}

@media (max-width: 480px) {
  body {
    padding: 0.5rem;
  }

  .nav-container {
    padding: 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .nav-icon {
    display: none;
  }
}
</style>
