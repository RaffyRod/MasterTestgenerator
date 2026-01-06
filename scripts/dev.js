import { spawn } from 'child_process'
import net from 'net'

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

// Find available port and start Vite
findAvailablePort(3000, 7000)
  .then(port => {
    console.log(`🚀 Starting dev server on port ${port}...`)

    // Use pnpm exec to run vite from node_modules
    const vite = spawn('pnpm', ['exec', 'vite', '--port', port.toString()], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    })

    vite.on('error', error => {
      console.error('Error starting Vite:', error)
      process.exit(1)
    })

    vite.on('exit', code => {
      process.exit(code || 0)
    })

    // Handle process termination
    process.on('SIGINT', () => {
      vite.kill('SIGINT')
    })
    process.on('SIGTERM', () => {
      vite.kill('SIGTERM')
    })
  })
  .catch(error => {
    console.error('Error finding available port:', error.message)
    process.exit(1)
  })
