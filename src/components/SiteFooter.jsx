import { useEffect, useState } from 'react';
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  ADDRESS, HOURS, INSTAGRAM_URL, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_QUOTE, assetUrl, storeStatus,
} from '../site';

const LINKS = [
  ['#quienes-somos', 'Nosotros'],
  ['#como-funciona', 'Cómo funciona'],
  ['#optiland', 'Tecnología'],
  ['#operativos', 'Servicio para empresas'],
  ['#contacto', 'Contacto'],
  ['#preguntas', 'Preguntas frecuentes'],
];

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  );
}

export default function SiteFooter() {
  // Se calcula en el navegador para no fijar la hora del prerenderizado.
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const update = () => setStatus(storeStatus());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <img src={assetUrl('logo-footer.png')} alt="Optivision W&M" width="505" height="285" loading="lazy" />
          <p>Óptica en Mall Apumanque, Las Condes. Monturas y cristales para tu receta, con asesoría personal.</p>
          <a className="site-footer__social" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Optivision W&M">
            <InstagramIcon />
          </a>
        </div>

        <div>
          <p className="site-footer__title">Visítanos</p>
          <a className="site-footer__line" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} aria-hidden="true" />
            <span>{ADDRESS.line1}<br />{ADDRESS.line2}</span>
          </a>
          <div className="site-footer__line">
            <Clock size={16} aria-hidden="true" />
            <div>
              {status && (
                <p className={`store-status ${status.open ? 'is-open' : 'is-closed'}`}>
                  <span aria-hidden="true" />{status.text}
                </p>
              )}
              <dl className="site-footer__hours">
                {HOURS.map((row) => (
                  <div key={row.label}><dt>{row.label}</dt><dd>{row.open} – {row.close}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div>
          <p className="site-footer__title">Contacto</p>
          <a className="site-footer__line" href={WHATSAPP_QUOTE} target="_blank" rel="noopener noreferrer" data-cta="footer">
            <MessageCircle size={16} aria-hidden="true" /><span>Cotizar por WhatsApp</span>
          </a>
          <a className="site-footer__line" href={PHONE_TEL}>
            <Phone size={16} aria-hidden="true" /><span>{PHONE_DISPLAY}</span>
          </a>
        </div>

        <nav aria-label="Secciones">
          <p className="site-footer__title">Secciones</p>
          <ul className="site-footer__links">
            {LINKS.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </nav>
      </div>
      <p className="site-footer__legal" suppressHydrationWarning>© {new Date().getFullYear()} Optivision W&M. Todos los derechos reservados.</p>
    </footer>
  );
}
