import { lazy, Suspense, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import WaveTitle from './components/WaveTitle';
import AnimatedLogo from './components/AnimatedLogo';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const HeroLogo3D = lazy(() => import('./components/HeroLogo3D'));
const Sunglasses3D = lazy(() => import('./components/Sunglasses3D'));
const assetUrl = (path) => `${import.meta.env.BASE_URL}assets/${path}`;

const HERO_BRANDS = [
    { name: 'Ray-Ban', src: assetUrl('brand-rayban.png') },
    { name: 'Veltom', src: assetUrl('brand-veltom.png') },
    { name: 'Karün', src: assetUrl('brand-karun.png') },
    { name: 'Vogue', src: assetUrl('brand-vogue.png') },
    { name: 'Saturday', src: assetUrl('brand-saturday.png') },
    { name: 'Hoya', src: assetUrl('brand-hoya.svg') },
    { name: 'Optiland', src: assetUrl('brand-optiland.png') },
];

const LENS_TYPES = [
    {
        name: 'Monofocales',
        description: 'Una sola graduación para corregir la visión de lejos o de cerca, con diseños que pueden personalizarse según la posición de uso.',
    },
    {
        name: 'Bifocales',
        description: 'Dos zonas de visión en un mismo cristal: lejos y cerca. Los diseños Bisoft combinan adaptación y tallado Freeform.',
    },
    {
        name: 'Multifocales',
        description: 'Visión lejana, intermedia y cercana en una sola lente, con campos optimizados para una adaptación cómoda.',
    },
    {
        name: 'Ocupacionales',
        description: 'Diseñados para tareas de oficina, priorizan las distancias intermedias y cercanas según la actividad.',
    },
];

const OPERATIVOS_GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=optivisionwm@gmail.com&su=${encodeURIComponent('SOLICITUD DE INFORMACIÓN: OPERATIVO OFTALMOLÓGICO')}&body=${encodeURIComponent(`Hola Optivision W&M:

Quisiera solicitar información sobre un operativo oftalmológico para nuestra empresa.

Empresa:
Cantidad aproximada de colaboradores:
Comuna:
Fecha tentativa:

Quedo atento/a. Gracias.`)}`;

export default function App() {
  const [heroLogoReady, setHeroLogoReady] = useState(false);

  useEffect(() => { 
    // Wait a tick for DOM to be ready
    const setupTimer = setTimeout(() => {
        try {
            
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // --- Menú móvil ---
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        let menuOpen = false;
        menuToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            mobileMenu.style.opacity    = menuOpen ? '1' : '0';
            mobileMenu.style.visibility = menuOpen ? 'visible' : 'hidden';
        });
        function closeMobileMenu() {
            menuOpen = false;
            mobileMenu.style.opacity = '0';
            mobileMenu.style.visibility = 'hidden';
        }

        // --- Forzar inicio de página al recargar ---
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });
        
        // --- Preloader + Intro ---
        const runPreloader = () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
                ScrollTrigger.refresh();
            }, 50);

            gsap.to('#preloader', {
                opacity:0, duration:.8, delay:.7,
                onComplete: () => {
                    const el = document.getElementById('preloader');
                    if(el) el.classList.add('hidden');
                }
            });
            // La animación de entrada del logo se elimina porque entraba en conflicto con el ScrollTrigger al recargar (F5)
            // El preloader ya cumple la función de revelar la pantalla con suavidad.
            gsap.timeline({ delay: 1.1 })
                .fromTo('#hero-logo-shell', { opacity:0, y:10 }, { opacity:1, y:0, duration:.8, ease:'power3.out' })
                .fromTo('#brand-carousel', { opacity:0, y:8 }, { opacity:1, y:0, duration:.55, ease:'power2.out' }, '-=.55')
                .fromTo('#hero-scroll-hint', { opacity:0 }, { opacity:1, duration:.55, ease:'power2.out' }, '-=.35')
                .to('#main-nav', { opacity:1, duration:.7, ease:'power2.out' }, '-=.45');
        };

        if (document.readyState === 'complete') {
            runPreloader();
        } else {
            window.addEventListener('load', runPreloader);
        }


        // ============================================================
        // 1. HERO OPTICO: el scroll atraviesa el visor derecho.
        // ============================================================
        const heroViewport = document.getElementById('hero-viewport');
        const heroPhotoStage = document.getElementById('hero-photo-stage');
        const heroPhoto = document.getElementById('hero-photo-sharp');
        const lensGeometry = {
            x: window.innerWidth * 0.7,
            y: window.innerHeight * 0.64,
            maxRadius: window.innerWidth
        };

        const updateLensGeometry = () => {
            if (!heroViewport || !heroPhotoStage || !heroPhoto) return;

            const viewportRect = heroViewport.getBoundingClientRect();
            const photoRect = heroPhoto.getBoundingClientRect();
            const naturalWidth = heroPhoto.naturalWidth || 3225;
            const naturalHeight = heroPhoto.naturalHeight || 2148;
            const objectPositionX = window.matchMedia('(max-width: 640px)').matches ? 0.7 : 0.5;
            const renderScale = Math.max(photoRect.width / naturalWidth, photoRect.height / naturalHeight);
            const renderedWidth = naturalWidth * renderScale;
            const renderedHeight = naturalHeight * renderScale;
            const offsetX = (photoRect.width - renderedWidth) * objectPositionX;
            const offsetY = photoRect.height - renderedHeight;

            lensGeometry.x = photoRect.left - viewportRect.left + offsetX + naturalWidth * 0.703 * renderScale;
            lensGeometry.y = photoRect.top - viewportRect.top + offsetY + naturalHeight * 0.643 * renderScale;
            lensGeometry.maxRadius = Math.hypot(
                Math.max(lensGeometry.x, viewportRect.width - lensGeometry.x),
                Math.max(lensGeometry.y, viewportRect.height - lensGeometry.y)
            ) + 80;

            heroViewport.style.setProperty('--lens-x', `${lensGeometry.x}px`);
            heroViewport.style.setProperty('--lens-y', `${lensGeometry.y}px`);
            gsap.set(heroPhotoStage, { transformOrigin: `${lensGeometry.x}px ${lensGeometry.y}px` });
        };

        updateLensGeometry();
        if (!heroPhoto.complete) {
            heroPhoto.addEventListener('load', () => {
                updateLensGeometry();
                ScrollTrigger.refresh();
            }, { once: true });
        }

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const heroScrollDistance = () => window.innerHeight;
            const heroTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: () => `+=${heroScrollDistance()}`,
                    scrub: 0.65,
                    pin: heroViewport,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onRefreshInit: updateLensGeometry,
                    onUpdate: (self) => {
                        if (self.progress > .005) return;
                        gsap.set(['#hero-scroll-hint', '#brand-carousel'], {
                            opacity: 1,
                            y: 0,
                        });
                    },
                }
            });

            heroTimeline
                .fromTo('#hero-scroll-hint',
                    { opacity:1, y:0 },
                    { opacity:0, y:-14, duration:.14, ease:'power2.out', immediateRender:false },
                    0
                )
                .fromTo('#brand-carousel',
                    { opacity:1, y:0 },
                    { opacity:0, y:12, duration:.16, ease:'power2.out', immediateRender:false },
                    0
                )
                .to('#hero-logo-shell', { opacity:0, scale:.78, filter:'blur(5px)', duration:.28, ease:'power2.in' }, .08)
                .to(heroPhotoStage, { scale:4.2, duration:1, ease:'none' }, 0)
                .to('#hero-vignette', { opacity:.82, duration:.38, ease:'none' }, 0)
                .to(heroViewport, {
                    '--portal-radius': () => `${lensGeometry.maxRadius}px`,
                    duration:.66,
                    ease:'power2.inOut'
                }, .3);
        }


        // ============================================================
        // 2. NAV: cambia de contraste al terminar la transición óptica.
        // ============================================================
        const updateNavState = (passedHero) => {
            const nav = document.getElementById('main-nav');
            if (!nav) return;
            if (heroViewport) heroViewport.style.pointerEvents = passedHero ? 'none' : 'auto';
            nav.classList.toggle('is-over-hero', !passedHero);
            nav.style.background = passedHero ? 'rgba(250, 248, 244, 0.88)' : 'transparent';
            nav.style.backdropFilter = passedHero ? 'blur(24px)' : 'none';
            nav.style.WebkitBackdropFilter = passedHero ? 'blur(24px)' : 'none';
            nav.style.borderBottom = passedHero ? '1px solid rgba(26, 26, 26, 0.08)' : 'none';
            nav.style.boxShadow = passedHero ? '0 10px 36px rgba(0, 0, 0, 0.05)' : 'none';
        };

        ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: () => `+=${window.innerHeight}`,
            onUpdate: (self) => updateNavState(self.progress > 0.86),
            onLeave: () => updateNavState(true),
            onEnterBack: () => updateNavState(false),
        });


        // ============================================================
        // 4. QUIÉNES SOMOS — Fade in & out en ambas direcciones
        // ============================================================
        gsap.fromTo(['#qs-text-container', '#qs-image-container'], 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#quienes-somos',
                    start: 'top 75%',
                    end: 'bottom 25%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );

        // ============================================================
        // 5. SECCIONES RESTANTES — Fade in & out unificado
        // ============================================================

        // Optiland
        gsap.fromTo(['#optiland-header', '#opt-card-2', '#opt-card-3', '#opt-types'],
            { opacity: 0, y: 40 },
            { 
                opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power2.out',
                scrollTrigger: { trigger: '#optiland', start: 'top 75%', end: 'bottom 25%', toggleActions: 'play reverse play reverse' }
            }
        );

        // Operativos
        gsap.fromTo('#operativos-content',
            { opacity: 0, y: 40 },
            { 
                opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
                scrollTrigger: { trigger: '#operativos', start: 'top 75%', end: 'bottom 25%', toggleActions: 'play reverse play reverse' }
            }
        );

        // Misión
        gsap.fromTo(['#mision-header', '#mis-1', '#mis-2', '#mis-3', '#mis-quote'],
            { opacity: 0, y: 40 },
            { 
                opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power2.out',
                scrollTrigger: { trigger: '#mision', start: 'top 75%', end: 'bottom 25%', toggleActions: 'play reverse play reverse' }
            }
        );

        // Contacto
        gsap.fromTo(['#ct-header', '#ct-left', '#ct-right'],
            { opacity: 0, y: 40 },
            { 
                opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power2.out',
                scrollTrigger: { trigger: '#contacto', start: 'top 80%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            }
        );


        // ============================================================
        // SMOOTH SCROLL — Links de navegación
        // ============================================================
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e) {
                e.preventDefault(); closeMobileMenu();
                const t = document.querySelector(this.getAttribute('href'));
                if (t) gsap.to(window, { duration:1.2, scrollTo:{y:t,offsetY:70}, ease:'power2.inOut' });
            });
        });


        // ============================================================
        // MODAL — PRUEBA DE FOTOCROMÁTICOS
        // ============================================================
        const filterModal = document.getElementById('filter-modal');
        const openBtn = document.getElementById('open-filter-modal');
        const closeBtn = document.getElementById('close-filter-modal');
        let modalScrollTriggers = [];

        function openFilterModal() {
            filterModal.scrollTop = 0;
            filterModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            gsap.fromTo(filterModal, 
                { opacity: 0, scale: 0.95 }, 
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                    onComplete: () => gsap.set(filterModal, { clearProps: 'transform' }),
                }
            );
            setTimeout(initPhotoScrollTrigger, 150);
        }

        function closeFilterModal() {
            gsap.to(filterModal, {
                opacity: 0, scale: 0.96, duration: 0.35, ease: 'power2.in',
                onComplete: () => {
                    filterModal.classList.remove('active');
                    document.body.style.overflow = '';
                    filterModal.scrollTop = 0;
                    modalScrollTriggers.forEach((trigger) => trigger.kill());
                    modalScrollTriggers = [];
                    filterModal.querySelectorAll('[data-filter-overlay], [data-filter-rays]').forEach((element) => {
                        element.style.opacity = '';
                        element.style.transform = '';
                    });
                    filterModal.querySelectorAll('.photo-progress-fill').forEach((element) => {
                        element.style.width = '0%';
                    });
                }
            });
        }

        openBtn.addEventListener('click', openFilterModal);
        closeBtn.addEventListener('click', closeFilterModal);

        function initPhotoScrollTrigger() {
            modalScrollTriggers.forEach((trigger) => trigger.kill());
            modalScrollTriggers = [];

            const experiences = [
                {
                    selector: '.photo-scroll-container',
                    labels: ['Cristal transparente', 'Activando con luz solar', 'Oscurecimiento en curso', 'Filtro fotocromático activo'],
                },
                {
                    selector: '.photo-scroll-container-2',
                    labels: ['Sin filtro', 'Luz azul detectada', 'Filtro Blue Cut activo', 'Exposición reducida'],
                },
                {
                    selector: '.photo-scroll-container-3',
                    labels: ['Sin filtro UV', 'Radiación UV detectada', 'Filtro UV activo', 'Protección solar activa'],
                },
            ];

            experiences.forEach(({ selector, labels }) => {
                const container = filterModal.querySelector(selector);
                if (!container) return;
                const overlay = container.querySelector('[data-filter-overlay]');
                const rays = container.querySelector('[data-filter-rays]');
                const progressBar = container.querySelector('.photo-progress-fill');
                const label = container.querySelector('.photo-label');

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        scroller: filterModal,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 0.8,
                        onUpdate: (self) => {
                            const p = self.progress;
                            if (progressBar) progressBar.style.width = `${p * 100}%`;
                            if (label) {
                                if (p < 0.12) label.textContent = labels[0];
                                else if (p < 0.42) label.textContent = labels[1];
                                else if (p < 0.76) label.textContent = labels[2];
                                else label.textContent = labels[3];
                            }
                        }
                    }
                });
                if (rays) {
                    timeline
                        .fromTo(rays, { opacity: 0, xPercent: 12 }, { opacity: 0.9, xPercent: 0, duration: 0.42, ease: 'power1.out' }, 0)
                        .to(rays, { opacity: 0.12, xPercent: -8, duration: 0.58, ease: 'power1.inOut' }, 0.42);
                }
                if (overlay) timeline.to(overlay, { opacity: 1, duration: 0.78, ease: 'power1.inOut' }, 0.2);
                modalScrollTriggers.push(timeline.scrollTrigger);
            });

            ScrollTrigger.refresh();
        }

        } catch(e) {
            console.error(e);
        }
    }, 100);

    const closeMobileMenu = () => {
      const el = document.getElementById('mobile-menu');
      if(el) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      }
    };
    window.closeMobileMenu = closeMobileMenu;
    return () => clearTimeout(setupTimer);
  }, []);

  return (
    <>
      

    {/* ===== PRELOADER ===== */}
    <div id="preloader">
        <p className="font-outfit text-xs tracking-[.3em] uppercase text-brand-muted">CARGANDO A TUS PITILOVERS 😎</p>
        <div className="loader-bar"></div>
    </div>

    {/* ===== NAV (nuevo logo fijo a la izquierda) ===== */}
    <nav id="main-nav" className="is-over-hero" style={{"opacity":"0"}}>
        <a 
            href="#top" 
            onClick={(e) => { 
                e.preventDefault(); 
                gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power2.inOut' }); 
            }}
            className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 block"
            aria-label="Volver al inicio"
        >
            <AnimatedLogo id="nav-logo" src={assetUrl('logo-nav.png')} alt="Optivision W&M" className="h-20 md:h-24 lg:h-28" />
        </a>
        <div className="flex-1"></div>
        <div className="hidden md:flex items-center gap-6 xl:gap-10 font-outfit">
            <a
                href="https://wa.me/56992803368?text=Hola%2C%20quiero%20cotizar%20mi%20receta%20%C3%B3ptica."
                target="_blank"
                rel="noreferrer"
                className="nav-link"
            >
                Cotiza aquí ↓
            </a>
            <a href="#operativos" className="nav-link">Servicio empresas</a>
            <a href="#quienes-somos" className="nav-link">Nosotros</a>
            <a href="#optiland" className="nav-link">Tecnología</a>
            <a href="#mision" className="nav-link">Misión</a>
            <a href="#contacto" className="nav-link">Contacto</a>
        </div>
        <button id="menu-toggle" className="md:hidden flex flex-col gap-1.5 p-2 ml-4" aria-label="Menú">
            <span className="block w-5 h-[1.5px] bg-brand-text"></span>
            <span className="block w-5 h-[1.5px] bg-brand-text"></span>
            <span className="block w-3.5 h-[1.5px] bg-brand-text"></span>
        </button>
    </nav>

    {/* Menú móvil */}
    <div id="mobile-menu" className="fixed inset-0 z-40 bg-brand-cream/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-xl font-outfit" style={{"opacity":"0","visibility":"hidden"}}>
        <a
            href="https://wa.me/56992803368?text=Hola%2C%20quiero%20cotizar%20mi%20receta%20%C3%B3ptica."
            target="_blank"
            rel="noreferrer"
            className="text-brand-text hover:text-brand-gold transition-colors"
        >
            Cotiza aquí ↓
        </a>
        <a href="#operativos" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Servicio empresas</a>
        <a href="#quienes-somos" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Nosotros</a>
        <a href="#optiland" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Tecnología</a>
        <a href="#mision" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Misión</a>
        <a href="#contacto" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Contacto</a>
    </div>


    {/* ===========================================================
         SECCIÓN 1 — HERO ÓPTICO
         Fotografía full-bleed, logo 3D y transición por el visor.
         =========================================================== */}
    <section id="hero" className="optical-hero">
        <div id="hero-viewport" className="optical-hero-viewport">
            <div id="hero-photo-stage" className="hero-photo-stage">
                <img
                    className="hero-photo-blur"
                    src={assetUrl('persona-sosteniendo-lentes.jpg')}
                    alt=""
                />
                <img
                    id="hero-photo-sharp"
                    className="hero-photo-sharp"
                    src={assetUrl('persona-sosteniendo-lentes.jpg')}
                    alt="Persona sosteniendo un armazón de prueba durante un examen visual"
                />
            </div>

            <div id="hero-vignette" className="hero-vignette" aria-hidden="true" />

            <div
                id="hero-logo-shell"
                className={`hero-logo-shell${heroLogoReady ? ' is-ready' : ''}`}
            >
                <img
                    className="hero-logo-fallback"
                    src={assetUrl('logo-user.png')}
                    alt="Optivision W&M"
                />
                <Suspense fallback={null}>
                    <HeroLogo3D onReady={() => setHeroLogoReady(true)} />
                </Suspense>
            </div>

            <div id="brand-carousel" className="hero-brand-carousel">
                <div className="marquee-wrapper">
                    <div className="marquee-track">
                        {[0, 1, 2, 3].flatMap((setIndex) => HERO_BRANDS.map((brand) => (
                            <img
                                key={`${setIndex}-${brand.name}`}
                                src={brand.src}
                                alt={setIndex === 0 ? brand.name : ''}
                                aria-hidden={setIndex > 0 ? 'true' : undefined}
                                className={brand.name === 'Ray-Ban' || brand.name === 'Veltom' ? 'brand-logo-padded' : undefined}
                            />
                        )))}
                    </div>
                </div>
            </div>

            <button
                id="hero-scroll-hint"
                className="hero-scroll-hint"
                type="button"
                onClick={() => gsap.to(window, {
                    duration: .9,
                    scrollTo: { y: window.innerHeight * .86 },
                    ease: 'power3.inOut'
                })}
            >
                <span>Desliza para ver</span>
                <ChevronDown size={19} strokeWidth={1.6} />
            </button>

        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 2 — QUIÉNES SOMOS + CROSSFADE DE LENTES
         Pantalla dividida: izquierda = imagen, derecha = texto.
         Las imágenes hacen crossfade sincronizado con el scroll.
         =========================================================== */}
    {/* ===========================================================
         SECCIÓN 2 — QUIÉNES SOMOS (Estática)
         =========================================================== */}
    <section id="quienes-somos" className="py-24 lg:py-32 bg-brand-cream relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* TEXTO (Aparece primero en móvil) */}
            <div id="qs-text-container" className="order-1 lg:order-1 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 mb-5">
                    <div className="divider"></div>
                    <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Conócenos</span>
                </div>
                <h2 className="wave-title text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
                    <WaveTitle text="Quiénes " /><WaveTitle text="Somos" className="text-brand-gold" delayOffset={8} />
                </h2>
                <p className="qs-copy mt-6 text-brand-muted leading-relaxed text-[.98rem]">
                    Tus lentes no deberían obligarte a elegir entre <strong>ver con nitidez, sentirte cómodo y verte bien</strong>. En <strong>Optivisión W&M</strong> combinamos asesoría cercana, monturas cuidadosamente seleccionadas y cristales de laboratorios líderes para que encuentres unos lentes que realmente quieras usar, sin pagar sobreprecios innecesarios.
                </p>
                <dl className="qs-proof-list" aria-label="Fortalezas de Optivisión W&M">
                    <div>
                        <dt>2 días hábiles</dt>
                        <dd>Listos para retiro</dd>
                    </div>
                    <div>
                        <dt>Cristales premium</dt>
                        <dd>De laboratorios líderes</dd>
                    </div>
                    <div>
                        <dt>Precio transparente</dt>
                        <dd>Pagas por calidad real</dd>
                    </div>
                </dl>
            </div>

            {/* LENTES 3D (Aparecen segundos en móvil) */}
            <div id="qs-image-container" className="order-2 lg:order-2 flex justify-center items-center">
                <Suspense fallback={<img src={assetUrl('glasses-qs.png')} alt="Lentes de sol Optivisión" className="qs-glasses-static" />}>
                    <Sunglasses3D />
                </Suspense>
            </div>

        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 3 — TECNOLOGÍA ÓPTICA: CRISTALES OPTILAND
         =========================================================== */}
    <section id="optiland" className="py-28 lg:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div id="optiland-header" className="text-center mb-20" style={{"opacity":"0"}}>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="divider"></div>
                    <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Tecnología</span>
                    <div className="divider"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
                    <WaveTitle text="Cristales " /><WaveTitle text="Optiland" className="text-brand-gold" />
                </h2>
                {/* Nuevo Logo de Optiland */}
                <div className="flex justify-center mt-8">
                    <img src={assetUrl('brand-optiland.png')} alt="Optiland" className="h-14 md:h-20 object-contain"  />
                </div>
                {/* Texto descriptivo más abajo y centrado */}
                <p className="mt-10 text-brand-muted max-w-2xl mx-auto text-[.93rem] leading-relaxed text-center">
                    Trabajamos con cristales del laboratorio óptico <strong className="text-brand-text font-medium">Optiland</strong>, 
                    líderes en cristalería chilena y tratamiento de última generación.
                </p>
            </div>

            <div className="technology-card-grid">
                <div className="card p-8 flex flex-col" id="opt-card-2" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Tecnología HOYA</h3>
                    <p className="text-brand-muted text-sm leading-relaxed flex-grow">Cristales japoneses de precisión con tratamientos premium. Nitidez inigualable, resistencia superior y confort visual para las más altas exigencias.</p>
                    <a href="https://www.hoyavision.com/es/productos-de-visi%C3%B3n/" target="_blank" rel="noopener noreferrer" className="btn-ver-mas mt-5 w-full justify-center">
                        Ver más
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                </div>
                <div className="card p-8 flex flex-col" id="opt-card-3" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Protección Completa</h3>
                    <p className="text-brand-muted text-sm leading-relaxed flex-grow">Comprueba cómo actúan los tratamientos fotocromático, Blue Cut y UV directamente sobre los cristales.</p>
                    <button id="open-filter-modal" className="btn-ver-mas mt-5 w-full justify-center">
                        Explorar filtros
                        <ChevronDown size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="lens-type-group" id="opt-types" style={{"opacity":"0"}}>
                <div className="lens-type-grid">
                    {LENS_TYPES.map((lensType) => (
                        <article className="lens-type-card" key={lensType.name}>
                            <h3>{lensType.name}</h3>
                            <p>{lensType.description}</p>
                        </article>
                    ))}
                </div>
                <a
                    href="https://optiland.cl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ver-mas lens-type-shared-link"
                    aria-label="Ver más sobre cristales en Optiland"
                >
                    Ver más sobre cristales
                    <ArrowUpRight size={15} aria-hidden="true" />
                </a>
            </div>
        </div>
    </section>


    {/* ===========================================================
         MODAL — EXPERIENCIA DE FILTROS ÓPTICOS
         =========================================================== */}
    <div id="filter-modal" className="fixed inset-0 bg-brand-bg z-[100] overflow-y-auto">
        <button className="filter-modal-close" id="close-filter-modal" aria-label="Cerrar">
            <svg className="w-5 h-5" stroke="#1A1A1A" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="filter-experience photo-scroll-container">
            <div className="filter-experience__sticky">
                <header className="filter-experience__header">
                    <p className="filter-experience__index">Filtro 1 de 3</p>
                    <h2><WaveTitle text="Lentes " /><WaveTitle text="Fotocromáticos" className="text-brand-gold" delayOffset={7} /></h2>
                    <p>Se activan con la luz solar y vuelven a aclararse en interiores. Desliza para ver cómo el cristal se adapta a la intensidad de la luz.</p>
                </header>

                <div className="photo-scene filter-demo-stage">
                    <img src={assetUrl('filtros_1.jpg')} alt="Lentes antes de activar el tratamiento fotocromático" />
                    <img src={assetUrl('filtros_2.jpg')} className="capa-fotocromatica" data-filter-overlay alt="Lentes con el tratamiento fotocromático activado" />
                    <div className="photo-label">Cristal transparente</div>
                    <div className="photo-progress-bar"><div className="photo-progress-fill"></div></div>
                </div>
                <p className="filter-demo-note">Representación visual del funcionamiento del filtro.</p>
                <p className="filter-scroll-hint">Desliza para activar <ChevronDown size={15} aria-hidden="true" /></p>
            </div>
        </div>

        <div className="filter-experience photo-scroll-container-2">
            <div className="filter-experience__sticky">
                <header className="filter-experience__header">
                    <p className="filter-experience__index">Filtro 2 de 3</p>
                    <h2><WaveTitle text="Filtro " /><WaveTitle text="Blue Cut" className="text-brand-gold" delayOffset={7} /></h2>
                    <p>El tratamiento Blue Cut filtra parte de la luz azul-violeta emitida por pantallas y dispositivos electrónicos.</p>
                </header>

                <div className="photo-scene filter-demo-stage">
                    <img src={assetUrl('bluecut-before.jpg')} alt="Lentes con reflejo de luz azul antes de activar el filtro Blue Cut" />
                    <img src={assetUrl('bluecut-after.jpg')} className="bluecut-filter-layer" data-filter-overlay alt="Lentes con el reflejo azul reducido después de activar el filtro Blue Cut" />
                    <div className="photo-label">Sin filtro</div>
                    <div className="photo-progress-bar"><div className="photo-progress-fill"></div></div>
                </div>
                <p className="filter-demo-note">Representación visual del funcionamiento del filtro.</p>
                <p className="filter-scroll-hint">Desliza para activar <ChevronDown size={15} aria-hidden="true" /></p>
            </div>
        </div>

        <div className="filter-experience photo-scroll-container-3">
            <div className="filter-experience__sticky">
                <header className="filter-experience__header">
                    <p className="filter-experience__index">Filtro 3 de 3</p>
                    <h2><WaveTitle text="Protección " /><WaveTitle text="UV" className="text-brand-gold" delayOffset={11} /></h2>
                    <p>El tratamiento UV está diseñado para bloquear la radiación ultravioleta del sol antes de que llegue a tus ojos.</p>
                </header>

                <div className="photo-scene filter-demo-stage">
                    <img src={assetUrl('uv-before.jpg')} alt="Lentes sin protección UV expuestos a la luz solar" />
                    <img src={assetUrl('uv-after.jpg')} className="uv-filter-layer" data-filter-overlay alt="Lentes con protección UV400 activada" />
                    <div className="photo-label">Sin filtro UV</div>
                    <div className="photo-progress-bar"><div className="photo-progress-fill"></div></div>
                </div>
                <p className="filter-demo-note">Representación visual del funcionamiento del filtro.</p>
                <p className="filter-scroll-hint">Desliza para activar <ChevronDown size={15} aria-hidden="true" /></p>
            </div>
        </div>

        <div className="filter-modal-footer">
            <p>Ahora puedes elegir el tratamiento que mejor acompaña tu rutina.</p>
            <button className="btn-primary" onClick={() => document.getElementById('close-filter-modal').click()}>
                Volver a Tecnología
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
            </button>
        </div>
    </div>


    {/* ===========================================================
         SECCIÓN 4 — OPERATIVOS OFTALMOLÓGICOS
         =========================================================== */}
    <section id="operativos" className="py-24 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <div id="operativos-content" className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                {/* Ícono */}
                <div className="lg:col-span-2 flex justify-center">
                    <div className="w-32 h-32 rounded-3xl bg-white border border-brand-border flex items-center justify-center">
                        <svg className="w-14 h-14 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeWidth="1.3" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                </div>
                {/* Texto */}
                <div className="lg:col-span-3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="divider"></div>
                        <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Servicio Empresarial</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-outfit font-bold text-brand-text leading-tight mb-4">
                        <WaveTitle text="Operativos " /><WaveTitle text="Oftalmológicos" className="text-brand-gold" />
                    </h2>
                    <p className="text-brand-text leading-relaxed text-[1rem] font-medium">
                        Cuando atender la salud visual exige traslados, permisos y horas fuera del puesto, suele postergarse.
                    </p>
                    <p className="mt-3 text-brand-muted leading-relaxed text-[.88rem]">
                        Optivision W&M lleva la atención óptica a tus dependencias y coordina una jornada ordenada para que tus colaboradores puedan evaluarse sin convertirlo en media jornada fuera de la empresa.
                    </p>
                    <ul className="mt-6 border-y border-brand-border divide-y divide-brand-border" aria-label="Beneficios para la empresa">
                        <li className="flex items-center gap-3 py-3 text-sm text-brand-text"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden="true"></span>Menos tiempo fuera del puesto</li>
                        <li className="flex items-center gap-3 py-3 text-sm text-brand-text"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden="true"></span>Atención en tus dependencias</li>
                        <li className="flex items-center gap-3 py-3 text-sm text-brand-text"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden="true"></span>Coordinación simple para RR.HH.</li>
                    </ul>
                    <a
                        href={OPERATIVOS_GMAIL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary mt-6 inline-flex text-sm transition-all duration-300"
                        aria-label="Solicitar información sobre un operativo oftalmológico por Gmail"
                    >
                        Solicitar Operativo
                        <ArrowUpRight size={16} className="ml-2" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 5 — NUESTRA MISIÓN
         =========================================================== */}
    <section id="mision" className="py-28 lg:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div id="mision-header" className="text-center mb-20" style={{"opacity":"0"}}>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="divider"></div>
                    <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Propósito</span>
                    <div className="divider"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
                    <WaveTitle text="Nuestra " /><WaveTitle text="Misión" className="text-brand-gold" />
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div id="mis-1" className="text-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mx-auto mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Innovación Constante</h3>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">Última tecnología de diagnóstico y tratamiento visual para resultados precisos.</p>
                </div>
                <div id="mis-2" className="text-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mx-auto mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Compromiso Social</h3>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">Protegemos tu salud visual y tu bolsillo, asegurando que pagues el valor real de tus lentes y no el sobreprecio de las grandes marcas.</p>
                </div>
                <div id="mis-3" className="text-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mx-auto mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Compromiso Humano</h3>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">Tu bienestar visual es nuestra prioridad con un servicio cálido y profesional.</p>
                </div>
            </div>
            <div id="mis-quote" className="mt-20 text-center" style={{"opacity":"0"}}>
                <div className="divider mx-auto mb-8"></div>
                <blockquote className="text-xl md:text-2xl font-outfit font-light text-brand-muted italic max-w-2xl mx-auto leading-relaxed">
                    "Ver bien es vivir bien. Transformamos miradas,
                    <span className="text-brand-gold not-italic font-medium">una visión a la vez.</span>"
                </blockquote>
            </div>
        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 6 — CONTACTO
         =========================================================== */}
    <section id="contacto" className="py-28 lg:py-36">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div id="ct-header" className="text-center mb-16" style={{"opacity":"0"}}>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="divider"></div>
                    <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Encuéntranos</span>
                    <div className="divider"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
                    <WaveTitle text="Contacto " /><WaveTitle text="& Ubicación" className="text-brand-gold" />
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Mapa + Dirección */}
                <div id="ct-left" style={{"opacity":"0","transform":"translateX(-30px)"}}>
                    <a href="https://maps.google.com/?q=Mall+Apumanque+Local+132,+Las+Condes" target="_blank" rel="noopener noreferrer" className="block relative h-72 rounded-xl overflow-hidden border border-brand-border group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
                        {/* Capa visual estética al pasar el mouse o tocar */}
                        <div className="absolute inset-0 bg-brand-text/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-white text-brand-text px-5 py-2.5 rounded-full text-sm font-outfit font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                Abrir en Google Maps
                            </span>
                        </div>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.125134706915!2d-70.5694294!3d-33.4116499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662ce8b4d8d179b%3A0x633fc2ed57270830!2sMall%20Apumanque!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl" 
                            width="100%" 
                            height="100%" 
                            style={{"border":"0","pointerEvents":"none"}} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </a>
                    <div className="mt-6 flex items-start gap-4">
                        <div className="feature-icon mt-0.5">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div>
                            <p className="font-outfit font-medium text-brand-text text-sm">Nuestra Ubicación</p>
                            <p className="text-brand-muted text-sm mt-1 leading-relaxed">Mall Apumanque Local 132 piso 2,<br />Las Condes.</p>
                        </div>
                    </div>
                </div>

                {/* Info + Horarios + WhatsApp */}
                <div id="ct-right" className="space-y-5" style={{"opacity":"0","transform":"translateX(30px)"}}>
                    {/* Teléfono */}
                    <div className="card p-5 flex items-center gap-4">
                        <div className="feature-icon">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-outfit font-medium text-brand-text text-sm">Llámanos</p>
                            <p className="text-brand-muted text-sm">+56 9 9280 3368</p>
                        </div>
                        <a href="tel:+56992803368" className="btn-primary text-xs py-2.5 px-5">Llamar</a>
                    </div>

                    {/* Horarios */}
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <h3 className="font-outfit font-semibold text-brand-text text-sm">Horarios</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-brand-border">
                                <span className="text-brand-muted font-outfit">Lunes – Sábado</span>
                                <span className="text-brand-text font-medium font-outfit">10:00 — 20:00 hrs</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-brand-muted font-outfit">Domingo</span>
                                <span className="text-brand-text font-medium font-outfit">11:00 — 20:00 hrs</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp — Botón llamativo */}
                    <div className="text-center pt-4">
                        {/* ✏️ Cambia el número en el href */}
                        <a href="https://wa.me/56992803368" target="_blank" className="btn-whatsapp">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                            Escríbenos por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 7 — RESEÑAS (CARRUSEL)
         =========================================================== */}
    <section id="reviews" className="py-16 bg-brand-cream overflow-hidden border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-brand-text">
                Lo que dicen nuestros <span className="text-brand-gold">Pacientes</span>
            </h2>
            <p className="text-brand-muted text-sm mt-3">Opiniones reales en Google Maps</p>
        </div>
        
        <div className="relative w-full flex overflow-hidden">
            {/* Doble track para efecto infinito */}
            <div className="flex w-max animate-marquee gap-6 px-3">
                {/* Reseña 1 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Son excelentes 7 de 7. Muchas gracias. Muy educados y amables en la atención al público, lindos Marcos y buena calidad."</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Andreina P.</p>
                </div>
                {/* Reseña 2 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, muy recomendados, y lo mejor precio y calidad, gracias por su profesionalismo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Jonathan S.</p>
                </div>
                {/* Reseña 3 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, calidad en sus productos y los precios muy muy buenos, súper recomendados no duden en visitarlos 🥳"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— mildred t.</p>
                </div>
                {/* Reseña 4 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente Atención y Servicio Profesional!! Los Recomiendo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Carlos B.</p>
                </div>
                {/* Reseña 5 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente atención , todo de muy buena calidad!! Súper recomendados!!!"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— roneldis c.</p>
                </div>
                
                {/* DUPLICADO (Para ilusión infinita) */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Son excelentes 7 de 7. Muchas gracias. Muy educados y amables en la atención al público, lindos Marcos y buena calidad."</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Andreina P.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, muy recomendados, y lo mejor precio y calidad, gracias por su profesionalismo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Jonathan S.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, calidad en sus productos y los precios muy muy buenos, súper recomendados no duden en visitarlos 🥳"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— mildred t.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente Atención y Servicio Profesional!! Los Recomiendo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Carlos B.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente atención , todo de muy buena calidad!! Súper recomendados!!!"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— roneldis c.</p>
                </div>
            </div>
        </div>
    </section>

    {/* FOOTER */}
    <footer className="border-t border-brand-border py-10 px-6 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            <img src={assetUrl('logo-user.png')} alt="Optivision W&M" className="h-8"  />
            <p className="text-brand-muted text-xs font-outfit">© 2026 Optivision W&M. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/optivisionwm/?hl=es" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-gold transition-colors" aria-label="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors" aria-label="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors" aria-label="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
            </div>
        </div>
    </footer>


    {/* ===========================================================
         JAVASCRIPT — GSAP ScrollTrigger
         =========================================================== */}
    


    </>
  );
}
