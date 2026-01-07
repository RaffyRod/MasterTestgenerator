<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <!-- Header Section -->
        <div class="nav-header">
          <div class="logo-wrapper">
            <span class="logo-icon">🧪</span>
            <h1 class="logo">{{ $t('app.title') }}</h1>
          </div>
          <div class="nav-header-right">
            <div class="config-menu-wrapper">
              <button
                @click="toggleConfigMenu"
                class="config-toggle"
                :title="$t('nav.config')"
                :class="{ active: configMenuOpen }"
              >
                <span>⚙️</span>
              </button>
              <div v-if="configMenuOpen" class="config-menu" @click.stop>
                <router-link
                  to="/ai-config"
                  class="config-menu-item"
                  @click="closeConfigMenu"
                >
                  <span class="config-menu-icon">🤖</span>
                  <span class="config-menu-text">{{ $t('nav.aiConfig') }}</span>
                </router-link>
                <button
                  @click="toggleThemeAndClose"
                  class="config-menu-item"
                >
                  <span class="config-menu-icon">
                    <span v-if="currentTheme === 'light'">🌙</span>
                    <span v-else>☀️</span>
                  </span>
                  <span class="config-menu-text">
                    {{ currentTheme === 'light' ? $t('nav.darkMode') : $t('nav.lightMode') }}
                  </span>
                </button>
              </div>
            </div>
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
        
        <!-- Menu Section -->
        <div class="nav-menu">
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
            <router-link to="/bug-report" class="nav-link" @click="closeMobileMenu">
              <span class="nav-icon">🐛</span>
              <span>{{ $t('nav.bugReport') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <NotificationToast />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useTheme } from '@shared/composables/useTheme.js'
import { onMounted, onUnmounted, ref } from 'vue'
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
    const configMenuOpen = ref(false)

    const handleClickOutside = (event) => {
      const configMenu = document.querySelector('.config-menu-wrapper')
      if (configMenu && !configMenu.contains(event.target)) {
        configMenuOpen.value = false
      }
    }

    onMounted(() => {
      try {
        initTheme()
        const savedLocale = localStorage.getItem('locale')
        if (savedLocale) {
          locale.value = savedLocale
        }
        // Close config menu when clicking outside
        document.addEventListener('click', handleClickOutside)
      } catch (error) {
        console.error('Error initializing app:', error)
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    const toggleConfigMenu = () => {
      configMenuOpen.value = !configMenuOpen.value
    }

    const closeConfigMenu = () => {
      configMenuOpen.value = false
    }

    const toggleThemeAndClose = () => {
      toggleTheme()
      closeConfigMenu()
    }

    return {
      currentLocale: locale,
      currentTheme,
      mobileMenuOpen,
      configMenuOpen,
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
      closeMobileMenu,
      toggleConfigMenu,
      closeConfigMenu,
      toggleThemeAndClose
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
  --card-bg: #1a1a1a;
  --input-bg: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-tertiary: #b0b0b0;
  --border-color: #3a3a3a;
  --shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.5);
  --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #fafafa;
  --bg-header: linear-gradient(135deg, #5b8def 0%, #6ba3e8 100%);
  --card-bg: #ffffff;
  --input-bg: #f5f5f5;
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
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme='light'] .nav-header {
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.nav-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-menu {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
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

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
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


.config-menu-wrapper {
  position: relative;
}

.config-toggle {
  background: var(--bg-primary) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--primary-color) !important;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.25rem;
  width: auto;
  height: 44px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  visibility: visible !important;
  opacity: 1 !important;
  text-decoration: none;
  min-width: 44px;
  min-height: 44px;
  border: none;
}

.config-toggle:hover {
  background: var(--bg-tertiary) !important;
  transform: scale(1.1);
}

.config-toggle.active {
  background: var(--primary-gradient) !important;
  color: white !important;
}

[data-theme='light'] .config-toggle {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

[data-theme='light'] .config-toggle:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

[data-theme='light'] .config-toggle.active {
  background: var(--primary-gradient) !important;
  color: white !important;
}

.config-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  min-width: 200px;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-theme='light'] .config-menu {
  background: #ffffff;
  border-color: #e0e0e0;
}

[data-theme='dark'] .config-menu {
  background: #1a1a1a;
  border-color: #3a3a3a;
}

.config-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  color: var(--text-primary);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 500;
}

.config-menu-item:hover {
  background: var(--bg-secondary);
}

[data-theme='light'] .config-menu-item {
  color: #000000;
}

[data-theme='light'] .config-menu-item:hover {
  background: #f5f5f5;
}

[data-theme='dark'] .config-menu-item {
  color: #ffffff;
}

[data-theme='dark'] .config-menu-item:hover {
  background: #2a2a2a;
}

.config-menu-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

.config-menu-text {
  flex: 1;
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
  height: 44px;
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
  height: 100%;
  display: flex !important;
  align-items: center;
  justify-content: center;
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
  background: var(--bg-primary);
  color: var(--text-primary);
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
    padding: 1.25rem 1.5rem;
    gap: 1.25rem;
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

  .nav-header {
    padding-bottom: 0.75rem;
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
    flex-direction: column;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 0.5rem;
  }

  .nav-links.mobile-open {
    max-height: 400px;
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

  .nav-header-right {
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
  }

  .config-toggle,
  .theme-toggle,
  .language-selector {
    min-width: 44px;
    min-height: 44px;
  }

  .config-menu {
    right: 0;
    left: auto;
    min-width: 180px;
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
