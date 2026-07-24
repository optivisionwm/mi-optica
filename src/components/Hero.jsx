import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* FONDO DE VIDEO O IMAGEN */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-bg.jpg" 
          alt="Optivisión background" 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.style.display = 'none'; // fallback in case no hero image exists yet
          }}
        />
        {/* Overlay dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 w-full h-full">
        {/* Lado Izquierdo - Textos */}
        <div className="flex flex-col justify-center py-20 lg:py-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-max mb-8">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-pulse"></span>
            <span className="text-white text-xs tracking-wider uppercase font-semibold">Salud visual de primer nivel</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-bold text-white leading-[1.1] mb-6">
            Visión perfecta,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">
              precio justo.
            </span>
          </h1>
          
          <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed mb-10">
            Democratizamos el acceso a la salud visual. Tecnología de punta, cristales de laboratorio avanzado y monturas exclusivas sin los sobreprecios de las grandes cadenas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => document.getElementById('contacto').scrollIntoView({behavior: 'smooth'})} className="btn-primary justify-center">
              Reserva tu hora
              <ArrowRight size={18} />
            </button>
            <button onClick={() => document.getElementById('optiland').scrollIntoView({behavior: 'smooth'})} className="btn-secondary justify-center bg-transparent border-white/30 text-white hover:bg-white hover:text-brand-dark">
              Ver tecnología
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
