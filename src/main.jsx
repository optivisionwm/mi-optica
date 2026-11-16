import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/outfit'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'
import { inject, track } from '@vercel/analytics'

// Vercel Web Analytics (sin cookies). Solo en el sitio publicado, no en local.
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
if (!isLocal) inject()

// Cuenta los clics de contacto; cada botón indica su ubicación con data-cta.
document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href*="wa.me"], a[href^="tel:"], a[href*="mail.google.com"], a[href^="mailto:"]')
  if (!link) return
  const kind = link.href.includes('wa.me') ? 'whatsapp' : link.href.startsWith('tel:') ? 'llamada' : 'correo'
  track(`contacto_${kind}`, { lugar: link.dataset.cta || 'otro' })
})

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const root = document.getElementById('root')
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
