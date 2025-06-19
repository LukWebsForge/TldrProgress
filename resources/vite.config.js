import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get tag & hash of the latest commit (https://stackoverflow.com/a/70558835)
const commitTag = require('child_process')
  .execSync('git tag --points-at HEAD')
  .toString()
  .trim()

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

export default defineConfig(() => {
  return {
    define: {
      __COMMIT__HASH__: JSON.stringify({ tag: commitTag, commit: commitHash }),
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  }
})
