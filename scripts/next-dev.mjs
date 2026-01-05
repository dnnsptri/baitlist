import os from 'node:os'

// Next.js calls os.networkInterfaces() during startup to print the "Network" URL.
// On some macOS setups this can throw: uv_interface_addresses returned Unknown system error 1.
// We defensively catch and return an empty object so Next can continue.
const originalNetworkInterfaces = os.networkInterfaces.bind(os)
os.networkInterfaces = () => {
  try {
    return originalNetworkInterfaces()
  } catch {
    return {}
  }
}

// Run `next dev` programmatically
process.argv = [
  process.execPath,
  'next',
  'dev',
  '-H',
  '127.0.0.1',
]

await import('next/dist/bin/next')

