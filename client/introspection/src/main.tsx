import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components'

import App from './App'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FluentProvider theme={teamsDarkTheme}>
    <App />
  </FluentProvider>
)
