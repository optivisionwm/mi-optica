import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveExperiences({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const photoContainerRef = useRef(null);
  const polarContainerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    document.body.style.overflow = 'hidden';

    // Animar entrada del modal
    gsap.fromTo(modalRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
    );

    // Timeout para asegurar el renderizado
    const timer = setTimeout(() => {
      // 1. Fotocromático
      const pBar1 = document.getElementById('photo-progress-1');
      const pLabel1 = document.getElementById('photo-label-1');
      const tint1 = document.querySelector('.capa-fotocromatica');

      if (photoContainerRef.current && tint1) {
        gsap.timeline({
          scrollTrigger: {
            trigger: photoContainerRef.current,
            scroller: modalRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
              const p = self.progress;
              if (pBar1) pBar1.style.width = (p * 100) + '%';
              if (pLabel1) {
                if (p < 0.05) pLabel1.textContent = 'Cristal Transparente';
                else if (p < 0.35) pLabel1.textContent = 'Activando Fotocromático…';
                else if (p < 0.7) pLabel1.textContent = 'Protección Media';
                else pLabel1.textContent = 'Protección Total';
              }
            }
          }
        }).to(tint1, { opacity: 1, duration: 1, ease: 'power1.inOut' }, 0);
      }

      // 2. Polarizado
      const pBar2 = document.getElementById('photo-progress-2');
      const pLabel2 = document.getElementById('photo-label-2');
      const tint2 = document.querySelector('.capa-polarizada');

      if (polarContainerRef.current && tint2) {
        gsap.timeline({
          scrollTrigger: {
            trigger: polarContainerRef.current,
            scroller: modalRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
              const p = self.progress;
              if (pBar2) pBar2.style.width = (p * 100) + '%';
              if (pLabel2) {
                if (p < 0.05) pLabel2.textContent = 'Visión Normal';
                else if (p < 0.35) pLabel2.textContent = 'Activando Polarizado…';
                else if (p < 0.7) pLabel2.textContent = 'Bloqueando Reflejos';
                else pLabel2.textContent = 'Visión 100% Sin Reflejos';
              }
            }
          }
        }).to(tint2, { opacity: 1, duration: 1, ease: 'power1.inOut' }, 0);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      ScrollTrigger.getAll().forEach(t => {
        if (t.scroller === modalRef.current) t.kill();
      });
    };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-white z-[100] overflow-y-auto"
    >
      <button 
        onClick={handleClose} 
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/80 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      {/* HEADER FOTOCROMATICO */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="divider"></div>
          <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Experiencia Interactiva 1</span>
          <div className="divider"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-outfit font-bold text-brand-text leading-tight">
          Prueba de <span className="text-brand-gold">Fotocromáticos</span>
        </h2>
        <p className="mt-4 text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
          Desliza hacia abajo para ver cómo los cristales fotocromáticos se oscurecen progresivamente al exponerse a la luz solar, protegiendo tus ojos de forma automática.
        </p>
      </div>

      {/* SCROLL FOTOCROMATICO */}
      <div ref={photoContainerRef} className="h-[400vh] relative">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
          <div className="photo-scene">
            <img src="/assets/filtros_1.jpg" alt="Transparente" />
            <img src="/assets/filtros_2.jpg" className="capa-fotocromatica absolute top-0 left-0 w-full h-full opacity-0" alt="Oscuro" />
            <div className="photo-label" id="photo-label-1">Cristal Transparente</div>
            <div className="photo-progress-bar">
              <div className="photo-progress-fill" id="photo-progress-1"></div>
            </div>
          </div>
          <p className="mt-6 text-brand-muted text-xs font-outfit tracking-wider uppercase text-center">↓ Desliza para activar</p>
        </div>
      </div>

      {/* HEADER POLARIZADO */}
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-10 text-center border-t border-gray-100 bg-white relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="divider"></div>
          <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Experiencia Interactiva 2</span>
          <div className="divider"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-outfit font-bold text-brand-text leading-tight">
          Lentes <span className="text-brand-gold">Polarizados</span>
        </h2>
        <p className="mt-4 text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
          Descubre cómo el filtro polarizado elimina instantáneamente los reflejos cegadores del sol sobre el campo, mejorando drásticamente el contraste, los colores y la claridad visual.
        </p>
      </div>

      {/* SCROLL POLARIZADO */}
      <div ref={polarContainerRef} className="h-[400vh] relative bg-white">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 bg-white">
          <div className="photo-scene border border-gray-100 shadow-2xl">
            <img src="/assets/polarizado_1.jpg" alt="Normal" />
            <img src="/assets/polarizado_2.jpg" className="capa-polarizada absolute top-0 left-0 w-full h-full opacity-0 object-contain" alt="Polarizada" />
            <div className="photo-label" id="photo-label-2">Visión Normal</div>
            <div className="photo-progress-bar">
              <div className="photo-progress-fill" id="photo-progress-2"></div>
            </div>
          </div>
          <p className="mt-6 text-brand-muted text-xs font-outfit tracking-wider uppercase text-center">↓ Desliza para activar</p>
        </div>
      </div>

      <div className="py-32 text-center bg-white relative z-10 border-t border-gray-100">
        <button onClick={handleClose} className="btn-primary">
          Volver a la página
        </button>
      </div>
    </div>
  );
}
