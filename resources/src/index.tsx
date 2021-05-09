import {StrictMode} from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './App'

// Learn more about TypeScript + React:
// https://2ality.com/2018/04/type-notation-typescript.html
// https://github.com/typescript-cheatsheets/react#section-1-setup-typescript-with-react
// https://create-react-app.dev/docs/adding-typescript/

ReactDOM.render(
    <StrictMode>
        <App/>
    </StrictMode>,
    document.getElementById('root')
)
