import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-brand-dark pt-20 pb-10 border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        
        {/* Info y Logo */}
        <div>
          <a href="#" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="font-outfit font-bold text-xl text-white">Optivisión W&M</span>
          </a>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
            Democratizamos la salud visual con tecnología de punta y precios justos. Óptica y Clínica Oftalmológica.
          </p>
          
          <div className="flex gap-4">
            <a href="https://www.instagram.com/optivision_wm/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        {/* Contacto Directo */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white font-outfit font-semibold text-lg mb-2">Contáctanos</h4>
          
          <div className="flex items-start gap-4">
            <div className="mt-1"><Phone size={18} className="text-brand-gold" /></div>
            <div>
              <p className="text-white font-medium text-sm">Reserva tu Hora</p>
              <a href="https://wa.me/56994132801" target="_blank" rel="noreferrer" className="text-gray-400 text-sm hover:text-brand-gold transition-colors mt-1 block">
                +56 9 9413 2801
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1"><MapPin size={18} className="text-brand-gold" /></div>
            <div>
              <p className="text-white font-medium text-sm">Visítanos</p>
              <p className="text-gray-400 text-sm mt-1">Av. Las Rastras, Edificio 360, Of 411.<br/>Talca, Región del Maule.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="mt-1"><Mail size={18} className="text-brand-gold" /></div>
            <div>
              <p className="text-white font-medium text-sm">Correo Electrónico</p>
              <p className="text-gray-400 text-sm mt-1">optivisionwm@gmail.com</p>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs text-center md:text-left">
          © {new Date().getFullYear()} Optivisión W&M. Todos los derechos reservados.
        </p>
        <p className="text-gray-600 text-xs text-center md:text-right">
          Desarrollado con ♥ para democratizar la visión.
        </p>
      </div>
    </footer>
  );
}
