import React from 'react';
import { ArrowRight, Zap, Shield, Sun } from 'lucide-react';

export default function Technology({ onOpenModal }) {
  return (
    <section id="optiland" className="py-28 lg:py-36 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="divider"></div>
            <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Tecnología</span>
            <div className="divider"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
            Cristales <span className="text-brand-gold">Optiland</span>
          </h2>
          <div className="flex justify-center mt-8">
            <img src="/assets/brand-optiland.png" alt="Optiland" className="h-14 md:h-20 object-contain" />
          </div>
          <p className="mt-10 text-brand-muted max-w-2xl mx-auto text-[.93rem] leading-relaxed text-center">
            Trabajamos con cristales del laboratorio óptico <strong className="text-brand-text font-medium">Optiland</strong>, líderes en cristalería chilena y tratamiento de última generación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8">
            <div className="feature-icon mb-5">
              <Zap className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Precisión Freeform</h3>
            <p className="text-brand-muted text-sm leading-relaxed">Cristales tallados punto a punto con tecnología digital. Nitidez visual superior en toda la superficie.</p>
          </div>
          <div className="card p-8">
            <div className="feature-icon mb-5">
              <Shield className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Tecnología Antiage</h3>
            <p className="text-brand-muted text-sm leading-relaxed">Filtro exclusivo de radiación infrarroja (IR). Protege el contorno ocular y reduce fatiga por pantallas.</p>
          </div>
          <div className="card p-8 border-brand-gold/30">
            <div className="feature-icon mb-5">
              <Sun className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Protección Completa</h3>
            <p className="text-brand-muted text-sm leading-relaxed">Antireflejo, fotocromáticos, filtro de luz azul, polarizados y UV400. Experiencia visual inigualable.</p>
            <button onClick={onOpenModal} className="btn-ver-mas mt-5 w-full justify-center">
              Experiencias Interactivas
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
