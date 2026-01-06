#!/usr/bin/env node

/**
 * Development server with Web AI (Hugging Face) enabled
 */

import { spawn } from 'child_process'
import net from 'net'
import { existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

/**
 * Checks if a port is available
 */
function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer()

    server.listen(port, () => {
      server.once('close', () => {
        resolve(true)
      })
      server.close()
    })

    server.on('error', () => {
      resolve(false)
    })
  })
}

/**
 * Finds an available port in the range [startPort, endPort]
 */
async function findAvailablePort(startPort = 3000, endPort = 7000) {
  for (let port = startPort; port <= endPort; port++) {
    const available = await isPortAvailable(port)
    if (available) {
      return port
    }
  }
  throw new Error(`No available port found in range ${startPort}-${endPort}`)
}

/**
 * Check Hugging Face API key
 */
function checkHuggingFaceKey() {
  const envPath = join(projectRoot, '.env')

  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    const apiKeyMatch = envContent.match(/VITE_HUGGING_FACE_API_KEY=(.+)/)

    if (
      apiKeyMatch &&
      apiKeyMatch[1] &&
      apiKeyMatch[1].trim() &&
      !apiKeyMatch[1].includes('your_')
    ) {
      return apiKeyMatch[1].trim()
    }
  }

  return null
}

// Main execution
;(async () => {
  try {
    // Check Hugging Face API key
    console.log('🌐 Checking Hugging Face configuration...')
    const apiKey = checkHuggingFaceKey()

    if (apiKey) {
      console.log('✅ Hugging Face API key found in .env')
      console.log('   Using authenticated API (faster, higher rate limits)')
    } else {
      console.log('⚠️  No Hugging Face API key found')
      console.log('   Using public endpoints (slower, rate-limited)')
      console.log('   To improve performance:')
      console.log('   1. Get free API key from: https://huggingface.co/settings/tokens')
      console.log('   2. Add to .env: VITE_HUGGING_FACE_API_KEY=your_token_here')
    }

    // Set environment variables for web AI
    process.env.VITE_AI_PROVIDER = 'online'
    if (apiKey) {
      process.env.VITE_HUGGING_FACE_API_KEY = apiKey
    }

    console.log('\n🚀 Starting dev server with Web AI (Hugging Face)...')
    console.log('   AI Provider: Online (Hugging Face)')
    console.log('')

    // Find available port and start Vite
    const port = await findAvailablePort(3000, 7000)
    console.log(`🚀 Starting dev server on port ${port}...`)

    const env = {
      ...process.env,
      VITE_AI_PROVIDER: 'online'
    }

    if (apiKey) {
      env.VITE_HUGGING_FACE_API_KEY = apiKey
    }

    const vite = spawn('pnpm', ['exec', 'vite', '--port', port.toString()], {
      stdio: 'inherit',
      shell: true,
      env
    })

    vite.on('error', error => {
      console.error('Error starting Vite:', error)
      process.exit(1)
    })

    vite.on('exit', code => {
      process.exit(code || 0)
    })
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
})()
