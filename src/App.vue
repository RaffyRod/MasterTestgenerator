<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-left">
          <div class="logo-wrapper">
            <span class="logo-icon">🧪</span>
            <h1 class="logo">{{ $t('app.title') }}</h1>
          </div>
          <div class="nav-links">
            <router-link to="/test-plans" class="nav-link">
              <span class="nav-icon">📋</span>
              <span>{{ $t('nav.testPlans') }}</span>
            </router-link>
            <router-link to="/test-cases" class="nav-link">
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
      <router-view />
    </main>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useTheme } from './composables/useTheme'
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const { locale } = useI18n()
    const { currentTheme, toggleTheme, initTheme } = useTheme()
    
    onMounted(() => {
      initTheme()
      const savedLocale = localStorage.getItem('locale')
      if (savedLocale) {
        locale.value = savedLocale
      }
    })
    
    return {
      currentLocale: locale,
      currentTheme,
      setLocale: (lang) => {
        locale.value = lang
        localStorage.setItem('locale', lang)
      },
      toggleTheme
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
  
  --bg-primary: #1a1f3a;
  --bg-secondary: #0f1322;
  --bg-tertiary: #151a2e;
  --bg-header: linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%);
  --text-primary: #e0e0e0;
  --text-secondary: #8a8fa3;
  --text-tertiary: #5a5f73;
  --border-color: #2a2f4a;
  --shadow-sm: 0 4px 15px rgba(0,0,0,0.3);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 48px rgba(0,0,0,0.5);
  
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #fafafa;
  --bg-header: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #e0e0e0;
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #0a0e27;
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

[data-theme="light"] body {
  background: var(--bg-secondary);
}

#app {
  min-height: 100vh;
}

.navbar {
  background: var(--bg-header);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-radius: 0;
  margin-bottom: 2rem;
}

[data-theme="light"] .navbar {
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
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
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

[data-theme="light"] .logo {
  color: white;
  -webkit-text-fill-color: white;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

[data-theme="light"] .nav-links {
  background: transparent;
  border: none;
  padding: 0;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  background: transparent;
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

[data-theme="light"] .nav-link {
  color: white;
}

[data-theme="light"] .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

[data-theme="light"] .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--primary-color);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.25rem;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  transform: scale(1.1);
}

[data-theme="light"] .theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

[data-theme="light"] .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.language-selector {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

[data-theme="light"] .language-selector {
  background: rgba(255, 255, 255, 0.1);
  border: none;
}

.lang-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
  min-width: 3rem;
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

[data-theme="light"] .lang-btn {
  color: white;
}

[data-theme="light"] .lang-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

[data-theme="light"] .lang-btn.active {
  background: white;
  color: var(--primary-color);
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  animation: fadeIn 0.4s ease-in;
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
    padding: 1rem;
  }
  
  .nav-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .nav-left {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .logo-wrapper {
    justify-content: center;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-right {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
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

