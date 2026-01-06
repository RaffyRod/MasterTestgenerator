#!/usr/bin/env node

/**
 * Quick Setup Script
 * Installs all dependencies and configures the project including AI setup
 */

import { execSync } from 'child_process'
import { platform } from 'os'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const osPlatform = platform()

console.log('🚀 Master Test Generator - Quick Setup\n')
console.log('This script will install all dependencies and configure the project.\n')

// Step 1: Check Node.js
console.log('📦 Step 1: Checking Node.js...')
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim()
  console.log(`✅ Node.js ${nodeVersion} detected\n`)
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org')
  process.exit(1)
}

// Step 2: Check/Install pnpm
console.log('📦 Step 2: Checking pnpm...')
let pnpmInstalled = false
try {
  execSync('pnpm --version', { stdio: 'ignore' })
  pnpmInstalled = true
  console.log('✅ pnpm is installed\n')
} catch (error) {
  console.log('⚠️  pnpm not found. Installing pnpm globally...')
  try {
    execSync('npm install -g pnpm', { stdio: 'inherit' })
    pnpmInstalled = true
    console.log('✅ pnpm installed successfully\n')
  } catch (installError) {
    console.error('❌ Failed to install pnpm. Please install manually: npm install -g pnpm')
    process.exit(1)
  }
}

// Step 3: Install project dependencies
console.log('📦 Step 3: Installing project dependencies...')
try {
  execSync('pnpm install', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Dependencies installed successfully\n')
} catch (error) {
  console.error('❌ Failed to install dependencies')
  process.exit(1)
}

// Step 4: Setup Husky
console.log('📦 Step 4: Setting up Git hooks (Husky)...')
try {
  execSync('pnpm prepare', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Git hooks configured\n')
} catch (error) {
  console.log('⚠️  Git hooks setup skipped (not a git repository or husky failed)\n')
}

// Step 5: Check/Install Ollama
console.log('🤖 Step 5: Setting up Ollama (Local AI)...')
let ollamaInstalled = false

// Check if Ollama is already installed
try {
  execSync('ollama --version', { stdio: 'ignore' })
  ollamaInstalled = true
  console.log('✅ Ollama is already installed')

  // Check if a model is available
  try {
    const models = execSync('ollama list', { encoding: 'utf-8' })
    if (models.includes('llama')) {
      console.log('✅ AI model found\n')
    } else {
      console.log('⚠️  No AI models found. Pulling recommended model...')
      try {
        execSync('ollama pull llama3.2:1b', { stdio: 'inherit' })
        console.log('✅ AI model installed successfully\n')
      } catch (pullError) {
        console.log(
          '⚠️  Failed to pull model automatically. Run manually: ollama pull llama3.2:1b\n'
        )
      }
    }
  } catch (listError) {
    console.log('⚠️  Could not check models. Make sure Ollama is running.\n')
  }
} catch (error) {
  // Ollama is not installed - try to install it
  console.log('📥 Ollama is not installed. Attempting automatic installation...\n')

  if (osPlatform === 'win32') {
    console.log('📦 Installing Ollama for Windows...')
    try {
      // Try winget first (Windows Package Manager - available on Windows 10/11)
      let installedViaPackageManager = false
      try {
        execSync('winget --version', { stdio: 'ignore' })
        console.log('📦 Checking Ollama with winget...')
        try {
          // Check if already installed
          const wingetList = execSync('winget list Ollama.Ollama', {
            encoding: 'utf-8',
            stdio: 'pipe'
          })
          if (wingetList.includes('Ollama.Ollama')) {
            console.log('✅ Ollama is already installed via winget!')
            installedViaPackageManager = true
            ollamaInstalled = true
          }
        } catch (checkError) {
          // Not installed, try to install
          console.log('📦 Installing Ollama via winget...')
          execSync(
            'winget install Ollama.Ollama --silent --accept-package-agreements --accept-source-agreements',
            { stdio: 'inherit' }
          )
          installedViaPackageManager = true
          console.log('✅ Ollama installed via winget!')
        }
      } catch (wingetError) {
        // Try chocolatey as fallback (only if user has admin rights)
        try {
          execSync('choco --version', { stdio: 'ignore' })
          console.log('📦 Checking Ollama with Chocolatey...')
          try {
            const chocoList = execSync('choco list ollama --local-only', {
              encoding: 'utf-8',
              stdio: 'pipe'
            })
            if (chocoList.includes('ollama')) {
              console.log('✅ Ollama is already installed via Chocolatey!')
              installedViaPackageManager = true
              ollamaInstalled = true
            }
          } catch (checkError) {
            // Not installed, but skip Chocolatey install as it requires admin
            console.log('⚠️  Chocolatey requires admin rights. Using direct download instead...')
          }
        } catch (chocoError) {
          // Fallback to direct download
          console.log('📥 Downloading Ollama installer...')
        }
      }

      if (!installedViaWinget) {
        // Get latest release URL from GitHub
        console.log('📥 Fetching latest Ollama release...')
        const latestRelease = execSync(
          'powershell -Command "Invoke-RestMethod -Uri \'https://api.github.com/repos/ollama/ollama/releases/latest\' | Select-Object -ExpandProperty tag_name"',
          { encoding: 'utf-8' }
        ).trim()
        const version = latestRelease.replace('v', '')
        const downloadUrl = `https://github.com/ollama/ollama/releases/download/${latestRelease}/OllamaSetup.exe`

        console.log(`📥 Downloading Ollama ${version}...`)
        const installer = join(process.env.TEMP || process.env.TMP || '.', 'OllamaSetup.exe')

        // Download using PowerShell
        const downloadCmd = `powershell -ExecutionPolicy Bypass -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '${downloadUrl}' -OutFile '${installer}'"`
        execSync(downloadCmd, { stdio: 'inherit' })

        console.log('🔧 Installing Ollama...')
        console.log('   ⚠️  This may require administrator privileges.')
        console.log('   If a UAC prompt appears, please click "Yes" to allow installation.\n')

        // Try silent install first
        try {
          execSync(`"${installer}" /S`, { stdio: 'inherit', timeout: 120000 })
        } catch (silentErr) {
          // If silent fails, open installer for user
          console.log('⚠️  Silent installation requires admin. Opening installer...')
          execSync(`start "" "${installer}"`, { stdio: 'inherit' })
          console.log('   Please complete the installation wizard, then press Enter...')
          console.log('   Waiting 30 seconds for installation to complete...')
          await sleep(30000)
        }

        // Clean up installer
        try {
          unlinkSync(installer)
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      // Wait for Ollama service to start
      console.log('⏳ Waiting for Ollama service to start...')
      await sleep(5000)

      // Add Ollama to PATH for current session
      const ollamaPath = join(
        process.env.LOCALAPPDATA || process.env.USERPROFILE || '',
        'AppData',
        'Local',
        'Programs',
        'Ollama'
      )
      if (existsSync(ollamaPath)) {
        process.env.PATH = `${ollamaPath};${process.env.PATH}`
      }

      // Verify installation
      let retries = 3
      while (retries > 0) {
        try {
          execSync('ollama --version', {
            stdio: 'ignore',
            env: { ...process.env, PATH: process.env.PATH }
          })
          ollamaInstalled = true
          console.log('✅ Ollama installed successfully!')
          break
        } catch (verifyError) {
          retries--
          if (retries > 0) {
            console.log(`⏳ Waiting for Ollama to be ready... (${retries} retries left)`)
            await sleep(3000)
          }
        }
      }

      if (ollamaInstalled) {
        // Pull recommended model
        console.log('📥 Pulling AI model (llama3.2:1b)... This may take a few minutes...')
        execSync('ollama pull llama3.2:1b', {
          stdio: 'inherit',
          env: { ...process.env, PATH: process.env.PATH }
        })
        console.log('✅ AI model installed successfully\n')
      } else {
        console.log('⚠️  Ollama installed but not responding yet.')
        console.log('   Please restart your terminal, then run: ollama pull llama3.2:1b\n')
      }
    } catch (installError) {
      console.log('⚠️  Automatic installation encountered an issue.')
      console.log('\n📥 Please install Ollama manually:')
      console.log('   1. Download from: https://ollama.com/download/windows')
      console.log('   2. Run the installer (as Administrator if prompted)')
      console.log('   3. After installation, restart your terminal')
      console.log('   4. Run: ollama pull llama3.2:1b\n')
      console.log(
        '💡 Tip: After manual installation, run this setup script again to pull the AI model.\n'
      )
    }
  } else if (osPlatform === 'darwin') {
    console.log('📦 Installing Ollama for macOS...')
    try {
      // Try Homebrew first (most common on macOS)
      let installedViaBrew = false
      try {
        execSync('brew --version', { stdio: 'ignore' })
        console.log('📦 Using Homebrew to install Ollama...')
        execSync('brew install ollama', { stdio: 'inherit' })
        installedViaBrew = true
        ollamaInstalled = true
        console.log('✅ Ollama installed via Homebrew!')
      } catch (brewError) {
        // Fallback: Download and install manually
        console.log('📥 Homebrew not found. Downloading Ollama installer...')
        const latestRelease = execSync(
          'curl -s https://api.github.com/repos/ollama/ollama/releases/latest | grep tag_name | cut -d "\"" -f 4',
          { encoding: 'utf-8' }
        ).trim()
        const downloadUrl = `https://github.com/ollama/ollama/releases/download/${latestRelease}/Ollama-darwin.zip`
        const zipFile = join(
          process.env.HOME || process.env.USERPROFILE || '.',
          'Downloads',
          'Ollama-darwin.zip'
        )

        console.log('📥 Downloading Ollama...')
        execSync(`curl -L -o "${zipFile}" "${downloadUrl}"`, { stdio: 'inherit' })

        console.log('🔧 Extracting and installing...')
        execSync(`unzip -o "${zipFile}" -d /Applications/`, { stdio: 'inherit' })
        execSync(`rm "${zipFile}"`, { stdio: 'ignore' })

        // Start Ollama service
        execSync('open -a Ollama', { stdio: 'ignore' })
        await sleep(5000)

        ollamaInstalled = true
        console.log('✅ Ollama installed successfully!')
      }

      if (ollamaInstalled) {
        // Pull recommended model
        console.log('📥 Pulling AI model (llama3.2:1b)... This may take a few minutes...')
        execSync('ollama pull llama3.2:1b', { stdio: 'inherit' })
        console.log('✅ AI model installed successfully\n')
      }
    } catch (installError) {
      console.log('⚠️  Automatic installation failed. Please install manually:')
      console.log('   Option 1: Install Homebrew, then: brew install ollama')
      console.log('   Option 2: Download from: https://ollama.com/download/mac')
      console.log('   After installation, run: ollama pull llama3.2:1b\n')
    }
  } else {
    // Linux
    console.log('📦 Installing Ollama for Linux...')
    try {
      // Use official install script
      console.log('📥 Downloading and installing Ollama...')
      execSync('curl -fsSL https://ollama.com/install.sh | sh', { stdio: 'inherit' })

      // Wait for service to start
      await sleep(3000)

      // Verify installation
      execSync('ollama --version', { stdio: 'ignore' })
      ollamaInstalled = true
      console.log('✅ Ollama installed successfully!')

      // Pull recommended model
      console.log('📥 Pulling AI model (llama3.2:1b)... This may take a few minutes...')
      execSync('ollama pull llama3.2:1b', { stdio: 'inherit' })
      console.log('✅ AI model installed successfully\n')
    } catch (installError) {
      console.log('⚠️  Automatic installation failed. Please install manually:')
      console.log('   Run: curl -fsSL https://ollama.com/install.sh | sh')
      console.log('   Then: ollama pull llama3.2:1b\n')
      console.log('   Note: You may need sudo privileges for installation.\n')
    }
  }
}

// Step 6: Create .env file if it doesn't exist
console.log('📝 Step 6: Setting up environment variables...')
const envPath = join(projectRoot, '.env')
const envExamplePath = join(projectRoot, '.env.example')

if (!existsSync(envPath)) {
  let envContent = ''

  if (existsSync(envExamplePath)) {
    envContent = readFileSync(envExamplePath, 'utf-8')
  } else {
    envContent = `# Hugging Face API Key (Optional)
# Get your free API key from: https://huggingface.co/settings/tokens
# Without this, the app will use public endpoints (slower, rate-limited)
VITE_HUGGING_FACE_API_KEY=

# Ollama Base URL (Optional)
# Default: http://localhost:11434
# Change this if Ollama is running on a different port or host
# VITE_OLLAMA_BASE_URL=http://localhost:11434
`
  }

  writeFileSync(envPath, envContent)
  console.log('✅ .env file created')
  console.log('   💡 Add your Hugging Face API key to .env for better online AI performance\n')
} else {
  console.log('✅ .env file already exists\n')
}

// Step 7: Summary
console.log('✨ Setup Complete!\n')
console.log('📋 Summary:')
console.log('   ✅ Project dependencies installed')
console.log('   ✅ Git hooks configured')
if (ollamaInstalled) {
  console.log('   ✅ Ollama (Local AI) is ready')
} else {
  console.log('   ⚠️  Ollama (Local AI) - Install manually for local AI features')
}
console.log('   ✅ Environment variables configured')
console.log('\n🚀 Next Steps:')
console.log('   1. Start the development server: pnpm dev')
console.log('   2. Open http://localhost:3000 in your browser')
if (!ollamaInstalled) {
  console.log('   3. (Optional) Install Ollama for local AI features')
}
console.log('   4. (Optional) Add Hugging Face API key to .env for better online AI\n')
console.log('📚 For more information, see README.md\n')
