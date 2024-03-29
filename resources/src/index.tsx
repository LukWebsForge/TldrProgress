import { App } from './App'
import { createRoot } from 'react-dom/client'

// Learn more about TypeScript + React:
// https://2ality.com/2018/04/type-notation-typescript.html
// https://github.com/typescript-cheatsheets/react#section-1-setup-typescript-with-react
// https://create-react-app.dev/docs/adding-typescript/

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
