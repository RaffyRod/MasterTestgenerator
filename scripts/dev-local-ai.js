#!/usr/bin/env node

/**
 * Development server with Local AI (Ollama) enabled
 */

import { spawn } from 'child_process'
import net from 'net'
import http from 'http'

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
 * Check Ollama availability
 */
function checkOllama() {
  return new Promise(resolve => {
    console.log('🤖 Checking Ollama (Local AI)...')

    const ollamaUrl = new URL(process.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434')
    const options = {
      hostname: ollamaUrl.hostname,
      port: ollamaUrl.port || 11434,
      path: '/api/tags',
      method: 'GET',
      timeout: 3000
    }

    const req = http.request(options, res => {
      if (res.statusCode === 200) {
        console.log('✅ Ollama is running and available')
        resolve(true)
      } else {
        throw new Error('Ollama not responding')
      }
    })

    req.on('error', () => {
      console.log('⚠️  Ollama is not available')
      console.log('   Make sure Ollama is installed and running:')
      console.log('   1. Install from: https://ollama.com')
      console.log('   2. Start Ollama')
      console.log('   3. Pull a model: ollama pull llama3.2:1b')
      console.log('\n   The app will still work but Local AI features will not be available.')
      resolve(false)
    })

    req.on('timeout', () => {
      req.destroy()
      console.log('⚠️  Ollama check timed out')
      console.log('   Make sure Ollama is installed and running')
      resolve(false)
    })

    req.end()
  })
}

// Main execution
;(async () => {
  try {
    // Check Ollama
    await checkOllama()

    // Set environment variable for local AI
    process.env.VITE_AI_PROVIDER = 'local'
    process.env.VITE_OLLAMA_BASE_URL = process.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'

    console.log('\n🚀 Starting dev server with Local AI (Ollama)...')
    console.log('   AI Provider: Local (Ollama)')
    console.log('   Ollama URL: ' + process.env.VITE_OLLAMA_BASE_URL)
    console.log('')

    // Find available port and start Vite
    const port = await findAvailablePort(3000, 7000)
    console.log(`🚀 Starting dev server on port ${port}...`)

    const vite = spawn('pnpm', ['exec', 'vite', '--port', port.toString()], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        VITE_AI_PROVIDER: 'local',
        VITE_OLLAMA_BASE_URL: process.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'
      }
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
