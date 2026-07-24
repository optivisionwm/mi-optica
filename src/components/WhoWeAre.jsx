import React from 'react';

export default function WhoWeAre() {
  return (
    <section id="quienes-somos" className="py-24 lg:py-32 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* TEXTO */}
        <div className="order-1 lg:order-1 max-w-xl mx-auto lg:mx-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="divider"></div>
            <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Conócenos</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
            Quiénes <span className="text-brand-gold">Somos</span>
          </h2>
          <p className="mt-6 text-brand-muted leading-relaxed text-[.95rem]">
            En <strong className="text-brand-text font-medium">Optivisión W&M</strong> somos una empresa óptica especializada en democratizar el acceso a la salud visual de primer nivel, combinando precisión clínica con un modelo de negocio transparente. Trabajamos junto a los laboratorios más avanzados del país para ofrecer cristales y monturas de alta tecnología, eliminando los sobreprecios del marketing tradicional para que el paciente pague exclusivamente por calidad real.
          </p>
        </div>

        {/* IMAGEN */}
        <div className="order-2 lg:order-2 flex justify-center items-center">
          <img src="/assets/glasses-qs.png" alt="Lentes" className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
}
