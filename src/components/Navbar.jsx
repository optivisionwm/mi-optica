import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* LOGO */}
        <a href="#" className="flex items-center gap-3 relative group" onClick={(e) => { e.preventDefault(); scrollTo('inicio'); }}>
          <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight text-brand-dark">Optivisión W&M</span>
        </a>

        {/* NAV LINKS DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('inicio')} className="nav-link">Inicio</button>
          <button onClick={() => scrollTo('quienes-somos')} className="nav-link">Nosotros</button>
          <button onClick={() => scrollTo('optiland')} className="nav-link">Tecnología</button>
          <button onClick={() => scrollTo('operativos')} className="nav-link">Operativos</button>
          <button onClick={() => scrollTo('contacto')} className="btn-primary py-2.5 px-6 text-sm">
            Agenda tu visita
          </button>
        </nav>

        {/* MENU BTN MOBILE */}
        <button className="md:hidden p-2 text-brand-dark" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl mobile-menu-enter">
          <div className="flex flex-col p-6 gap-4">
            <button onClick={() => scrollTo('inicio')} className="text-left font-semibold text-lg text-brand-dark">Inicio</button>
            <button onClick={() => scrollTo('quienes-somos')} className="text-left font-semibold text-lg text-brand-dark">Nosotros</button>
            <button onClick={() => scrollTo('optiland')} className="text-left font-semibold text-lg text-brand-dark">Tecnología</button>
            <button onClick={() => scrollTo('operativos')} className="text-left font-semibold text-lg text-brand-dark">Operativos</button>
            <button onClick={() => scrollTo('contacto')} className="btn-primary w-full justify-center mt-2">
              Agenda tu visita
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
