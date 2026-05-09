import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './assets/App.jsx'
import './index.css'

// Import Google Fonts
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)