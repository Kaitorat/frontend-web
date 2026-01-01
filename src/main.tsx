import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Aplicar estilos al body y root para el dashboard
document.body.className = 'm-0 p-0 min-w-[320px] min-h-screen font-sans antialiased bg-[#101010] text-white overflow-hidden'

const rootElement = document.getElementById('root')!
rootElement.className = 'w-full h-screen'

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
