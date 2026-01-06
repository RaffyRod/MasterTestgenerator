#!/usr/bin/env node

/**
 * Script to help users install Ollama for local AI
 */

import { execSync } from 'child_process'
import { platform } from 'os'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🤖 Ollama Installation Helper\n')

const osPlatform = platform()

console.log(`Detected OS: ${osPlatform}\n`)

console.log('To use local AI, you need to install Ollama:\n')

if (osPlatform === 'win32') {
  console.log('📥 Windows Installation:')
  console.log('1. Download Ollama from: https://ollama.com/download/windows')
  console.log('2. Run the installer')
  console.log('3. After installation, pull a model:')
  console.log('   ollama pull llama3.2:1b')
  console.log('   (or llama3.2:3b for better quality)\n')
} else if (osPlatform === 'darwin') {
  console.log('📥 macOS Installation:')
  console.log('1. Download Ollama from: https://ollama.com/download/mac')
  console.log('2. Run the installer')
  console.log('3. After installation, pull a model:')
  console.log('   ollama pull llama3.2:1b')
  console.log('   (or llama3.2:3b for better quality)\n')
} else {
  console.log('📥 Linux Installation:')
  console.log('Run the following command:')
  console.log('curl -fsSL https://ollama.com/install.sh | sh')
  console.log('\nAfter installation, pull a model:')
  console.log('ollama pull llama3.2:1b')
  console.log('(or llama3.2:3b for better quality)\n')
}

console.log('✅ After installation:')
console.log('1. Start Ollama (it should start automatically)')
console.log("2. Verify it's running: ollama list")
console.log('3. The app will automatically detect Ollama when you select "Local AI" mode\n')

console.log('💡 Tip: The llama3.2:1b model is small (~1.3GB) and fast.')
console.log('   For better quality, use llama3.2:3b (~2GB) or llama3.2 (~4.7GB)\n')

// Check if Ollama is already installed
try {
  execSync('ollama --version', { stdio: 'ignore' })
  console.log('✅ Ollama appears to be installed!')
  console.log('   Run "ollama list" to see available models\n')
} catch (error) {
  console.log('⚠️  Ollama not found. Please install it using the instructions above.\n')
}
