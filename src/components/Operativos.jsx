import React, { useState } from 'react';
import { ArrowRight, Building } from 'lucide-react';

export default function Operativos() {
  const [btnText, setBtnText] = useState('Solicitar Operativo');

  const handleMailClick = (e) => {
    e.preventDefault();
    const email = 'optivisionwm@gmail.com';
    const subject = 'INFORMACIÓN SOBRE OPERATIVOS A EMPRESAS';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    } else {
      navigator.clipboard.writeText(email).catch(() => {});
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`;
      window.open(gmailUrl, '_blank');
      
      setBtnText('¡Redirigiendo a Gmail (Correo copiado)!');
      setTimeout(() => {
        setBtnText('Solicitar Operativo');
      }, 3500);
    }
  };

  return (
    <section id="operativos" className="py-24 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Icon */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-white border border-brand-border flex items-center justify-center">
              <Building className="w-14 h-14 text-brand-gold" />
            </div>
          </div>
          
          {/* Text */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="divider"></div>
              <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Servicio Empresarial</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-brand-text leading-tight mb-4">
              Operativos <span className="text-brand-gold">Oftalmológicos</span>
            </h2>
            <p className="text-brand-muted leading-relaxed text-[.93rem]">
              Llevamos la salud visual directamente a tu empresa. Como segunda rama, hacemos operativos <strong className="text-brand-text font-medium">Oftalmológicos</strong> para eliminar las barreras de tiempo y traslado que suelen impedir a los colaboradores acceder a una atención óptica de calidad.
            </p>
            <button onClick={handleMailClick} className="btn-primary mt-6 inline-flex text-sm transition-all duration-300">
              <span>{btnText}</span>
              {btnText === 'Solicitar Operativo' && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
