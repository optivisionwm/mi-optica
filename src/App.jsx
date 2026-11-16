import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowDown, ArrowUpRight, ChevronDown, MapPin, MessageCircle, Pause, Play, Copy, Check, Moon, Sun } from 'lucide-react';
import WaveTitle from './components/WaveTitle';
import AnimatedLogo from './components/AnimatedLogo';
import Coleccion from './components/Coleccion';
import ComoFunciona from './components/ComoFunciona';
import PreguntasFrecuentes from './components/PreguntasFrecuentes';
import SiteFooter from './components/SiteFooter';
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL } from './site';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const HeroLogo3D = lazy(() => import('./components/HeroLogo3D'));
const assetUrl = (path) => `${import.meta.env.BASE_URL}assets/${path}`;
const WHATSAPP_URL = 'https://wa.me/56992803368?text=Hola%2C%20quiero%20cotizar%20mi%20receta%20%C3%B3ptica.';
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const REVIEWS = [
    { author: 'Andreina P.', text: 'Son excelentes 7 de 7. Muchas gracias. Muy educados y amables en la atención al público, lindos Marcos y buena calidad.' },
    { author: 'Jonathan S.', text: 'Muy buena atención, muy recomendados, y lo mejor precio y calidad, gracias por su profesionalismo' },
    { author: 'mildred t.', text: 'Muy buena atención, calidad en sus productos y los precios muy muy buenos, súper recomendados no duden en visitarlos 🥳' },
    { author: 'Carlos B.', text: 'Excelente Atención y Servicio Profesional!! Los Recomiendo' },
    { author: 'roneldis c.', text: 'Excelente atención , todo de muy buena calidad!! Súper recomendados!!!' },
];

const FILTER_EXPERIENCES = [
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

// En Windows sin app de correo configurada un mailto: no abre nada,
// así que se usa Gmail web y se ofrece copiar la dirección.
const OPERATIVOS_EMAIL = 'optivisionwm@gmail.com';
const OPERATIVOS_MAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${OPERATIVOS_EMAIL}&su=${encodeURIComponent('SOLICITUD DE INFORMACIÓN: OPERATIVO OFTALMOLÓGICO')}&body=${encodeURIComponent(`Hola Optivision W&M:

Quisiera solicitar información sobre un operativo oftalmológico para nuestra empresa.

Empresa:
Cantidad aproximada de colaboradores:
Comuna:
Fecha tentativa:

Quedo atento/a. Gracias.`)}`;

function StarRow({ className = 'mb-3' }) {
    return (
        <div className={`flex gap-1 text-brand-gold ${className}`} aria-label="5 de 5 estrellas" role="img">
            {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            ))}
        </div>
    );
}

// Aplica el tema (claro u oscuro) a toda la página y avisa a quien deba redibujarse.
function applyTheme(next, { persist }) {
    const root = document.documentElement;
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    if (persist) {
        try { localStorage.setItem('theme', next); } catch { /* sin almacenamiento */ }
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0f2219' : '#FAF8F4');
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    window.setTimeout(() => root.classList.remove('theme-switching'), 450);
}

// Scroll suave a un ancla, dejando la URL y el foco en el destino.
function scrollToHash(hash, { push = true } = {}) {
    const nav = document.getElementById('main-nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const target = hash === '#top' || hash === '' ? 0 : document.querySelector(hash);
    if (target === null) return;
    gsap.to(window, {
        duration: prefersReducedMotion() ? 0 : .75,
        // "Quiénes Somos" se alcanza justo cuando el lente terminó de abrirse.
        scrollTo: { y: target, offsetY: target === 0 || hash === '#quienes-somos' ? 0 : navHeight + 20 },
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
            if (target && target.getAttribute('tabindex') !== null) target.focus({ preventScroll: true });
        },
    });
    if (push) {
        const url = hash === '#top' ? window.location.pathname + window.location.search : hash;
        if (url !== window.location.hash) history.pushState(null, '', url);
    }
}

export default function App() {
  const [heroLogoReady, setHeroLogoReady] = useState(false);
  const [use3DLogo, setUse3DLogo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterImagesRequested, setFilterImagesRequested] = useState(false);
  const [reviewsPaused, setReviewsPaused] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [theme, setTheme] = useState('light');

  // Modo noche: lee el tema aplicado antes de pintar y sigue al sistema si la persona no eligió.
  useEffect(() => {
    const root = document.documentElement;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (event) => {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch { /* sin almacenamiento */ }
      if (saved) return;
      applyTheme(event.matches ? 'dark' : 'light', { persist: false });
      setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);
  const toggleTheme = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, { persist: true });
    setTheme(next);
  }, []);
  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(OPERATIVOS_EMAIL);
    } catch {
      const field = document.createElement('textarea');
      field.value = OPERATIVOS_EMAIL;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2200);
  }, []);
  const filterOpenerRef = useRef(null);

  // Logo 3D en todos los dispositivos; solo se usa la imagen fija con "ahorro de datos" o conexión 2G/3G.
  useEffect(() => {
    const connection = navigator.connection;
    const slowConnection = Boolean(connection && (connection.saveData || /(^|-)(2g|3g)$/.test(connection.effectiveType || '')));
    if (!slowConnection) setUse3DLogo(true);
  }, []);

  // Menú móvil
  useEffect(() => {
    document.getElementById('main-nav')?.classList.toggle('menu-is-open', menuOpen);
    if (!menuOpen) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const openFilterModal = useCallback((event) => {
    filterOpenerRef.current = event?.currentTarget ?? document.activeElement;
    setFilterImagesRequested(true);
    setFilterOpen(true);
  }, []);
  const closeFilterModal = useCallback(() => setFilterOpen(false), []);

  // Modal de filtros: animación, scroll interno, Escape y foco.
  useEffect(() => {
    const filterModal = document.getElementById('filter-modal');
    if (!filterModal) return undefined;

    if (!filterOpen) {
        if (!filterModal.classList.contains('active')) return undefined;
        const tween = gsap.to(filterModal, {
            opacity: 0, duration: prefersReducedMotion() ? 0 : .2, ease: 'power1.out', overwrite: true,
            onComplete: () => {
                filterModal.classList.remove('active');
                document.body.style.overflow = '';
                filterModal.scrollTop = 0;
                filterModal.querySelectorAll('[data-filter-overlay], [data-filter-rays]').forEach((element) => {
                    element.style.opacity = '';
                    element.style.transform = '';
                });
                filterModal.querySelectorAll('.photo-progress-fill').forEach((element) => {
                    element.style.width = '0%';
                });
                filterOpenerRef.current?.focus?.({ preventScroll: true });
            },
        });
        return () => tween.kill();
    }

    let triggers = [];
    filterModal.scrollTop = 0;
    filterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(filterModal, { opacity: 0 }, {
        opacity: 1,
        duration: prefersReducedMotion() ? 0 : .25,
        ease: 'power3.out',
        overwrite: true,
    });
    document.getElementById('close-filter-modal')?.focus({ preventScroll: true });

    const initTimer = setTimeout(() => {
        FILTER_EXPERIENCES.forEach(({ selector, labels }) => {
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
                    scrub: prefersReducedMotion() ? true : 0.65,
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
            triggers.push(timeline.scrollTrigger);
        });
        ScrollTrigger.refresh();
    }, 150);

    // Escape cierra; Tab queda dentro del modal.
    const onKey = (event) => {
        if (event.key === 'Escape') { setFilterOpen(false); return; }
        if (event.key !== 'Tab') return;
        const focusables = [...filterModal.querySelectorAll('button, a[href]')].filter((el) => el.offsetParent !== null || el.id === 'close-filter-modal');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
        clearTimeout(initTimer);
        document.removeEventListener('keydown', onKey);
        triggers.forEach((trigger) => trigger.kill());
        triggers = [];
    };
  }, [filterOpen]);

  // Botón atrás/adelante del navegador entre secciones
  useEffect(() => {
    const onPopState = () => scrollToHash(window.location.hash || '#top', { push: false });
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let sectionMotion;
    let preloaderFallback;
    let lensGL = null;
    let disposed = false;
    // Wait a tick for DOM to be ready
    const setupTimer = setTimeout(() => {
        try {

        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        ScrollTrigger.config({ ignoreMobileResize: false });
        const reduceMotion = prefersReducedMotion();

        // --- Forzar inicio de página al recargar ---
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });

        // --- Preloader + Intro ---
        // Se retira apenas carga la foto principal (no espera las imágenes del resto de la página).
        let preloaderDone = false;
        const runPreloader = () => {
            if (preloaderDone) return;
            preloaderDone = true;
            clearTimeout(preloaderFallback);
            setTimeout(() => {
                window.scrollTo(0, 0);
                ScrollTrigger.refresh();
            }, 50);

            gsap.to('#preloader', {
                opacity:0, duration: reduceMotion ? 0 : .35, delay: reduceMotion ? 0 : .15,
                onComplete: () => {
                    const el = document.getElementById('preloader');
                    if(el) el.classList.add('hidden');
                }
            });
            // La animación de entrada del logo se elimina porque entraba en conflicto con el ScrollTrigger al recargar (F5)
            // El preloader ya cumple la función de revelar la pantalla con suavidad.
            // La entrada anima a los hijos de #hero-wayfinding; el scroll anima al contenedor.
            gsap.fromTo(['#hero-main', '#hero-wayfinding > *', '#main-nav'],
                { opacity: 0 },
                { opacity: 1, duration: reduceMotion ? 0 : .65, delay: reduceMotion ? 0 : .25, stagger: reduceMotion ? 0 : .06, ease: 'power2.out' }
            );
        };

        const heroPhotoForPreloader = document.getElementById('hero-photo-sharp');
        if (!heroPhotoForPreloader || (heroPhotoForPreloader.complete && heroPhotoForPreloader.naturalWidth > 0)) {
            runPreloader();
        } else {
            heroPhotoForPreloader.addEventListener('load', runPreloader, { once: true });
            heroPhotoForPreloader.addEventListener('error', runPreloader, { once: true });
            preloaderFallback = setTimeout(runPreloader, 3000);
        }
        // ============================================================
        // 1. HERO OPTICO: el scroll atraviesa el visor derecho.
        // ============================================================
        const heroViewport = document.getElementById('hero-viewport');
        const heroPhotoStage = document.getElementById('hero-photo-stage');
        const heroPhoto = document.getElementById('hero-photo-sharp');
        const heroMain = document.getElementById('hero-main');
        const heroLogo = document.getElementById('hero-logo-shell');
        const lensPortal = document.getElementById('lens-portal');
        const lensPortalInner = document.getElementById('lens-portal-inner');
        const lensPortalClone = document.getElementById('lens-portal-clone');
        const lensGeometry = {
            x: window.innerWidth * 0.7,
            y: window.innerHeight * 0.64,
            r: 80,
            maxRadius: window.innerWidth
        };

        // Copia visual de "Quiénes Somos" para verla (borrosa) dentro del lente.
        const buildPortalClone = () => {
            const source = document.getElementById('quienes-somos');
            if (!source || !lensPortalClone) return;
            const clone = source.cloneNode(true);
            clone.removeAttribute('id');
            clone.querySelectorAll('svg [id]').forEach((el) => {
                const next = `${el.id}-portal`;
                clone.querySelectorAll(`[href="#${el.id}"]`).forEach((ref) => ref.setAttribute('href', `#${next}`));
                el.id = next;
            });
            clone.querySelectorAll('[id]:not([id$="-portal"])').forEach((el) => el.removeAttribute('id'));
            clone.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
            clone.style.opacity = '';
            clone.querySelectorAll('[style]').forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
            lensPortalClone.replaceChildren(clone);
        };

        const updateLensGeometry = () => {
            if (!heroViewport || !heroPhotoStage || !heroPhoto) return;

            const viewportRect = heroViewport.getBoundingClientRect();
            // Layout dimensions stay stable while the photograph is zooming.
            const photoWidth = heroPhoto.offsetWidth;
            const photoHeight = heroPhoto.offsetHeight;
            const naturalWidth = heroPhoto.naturalWidth || 3225;
            const naturalHeight = heroPhoto.naturalHeight || 2148;
            const objectPositionX = window.matchMedia('(max-width: 640px)').matches ? 0.7 : 0.5;
            const renderScale = Math.max(photoWidth / naturalWidth, photoHeight / naturalHeight);
            const renderedWidth = naturalWidth * renderScale;
            const renderedHeight = naturalHeight * renderScale;
            const offsetX = (photoWidth - renderedWidth) * objectPositionX;
            const offsetY = photoHeight - renderedHeight;

            // Centro de la abertura del aro derecho, medido sobre la foto original (3225 × 2148).
            lensGeometry.x = heroPhoto.offsetLeft + offsetX + naturalWidth * 0.689 * renderScale;
            lensGeometry.y = heroPhoto.offsetTop + offsetY + naturalHeight * 0.612 * renderScale;
            // Radio interior del aro derecho del probador (medido sobre la foto).
            lensGeometry.r = Math.max(28, renderedWidth * 0.096);
            lensGeometry.maxRadius = Math.hypot(
                Math.max(lensGeometry.x, viewportRect.width - lensGeometry.x),
                Math.max(lensGeometry.y, viewportRect.height - lensGeometry.y)
            ) + 40;

            heroViewport.style.setProperty('--lens-x', `${lensGeometry.x}px`);
            heroViewport.style.setProperty('--lens-y', `${lensGeometry.y}px`);
            heroViewport.style.setProperty('--portal-w', `${viewportRect.width}px`);
            if (lensPortal) lensPortal.style.setProperty('--lens-r', `${lensGeometry.r}px`);
            gsap.set(heroPhotoStage, { transformOrigin: `${lensGeometry.x}px ${lensGeometry.y}px` });
        };

        updateLensGeometry();
        if (!heroPhoto.complete) {
            heroPhoto.addEventListener('load', () => {
                updateLensGeometry();
                ScrollTrigger.refresh();
            }, { once: true });
        }

        const heroScrollDistance = () => heroViewport.offsetHeight;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.getElementById('hero').classList.add('is-scroll-scene');
            buildPortalClone();

            // El portal crece con transform (GPU); el contenido se contra-escala
            // para quedar alineado con la pantalla mientras el círculo se abre.
            // El círculo sigue al aro mientras la foto avanza (escala de la foto)
            // y luego se abre extra hasta cubrir la pantalla.
            const PHOTO_END_SCALE = 2.4;
            const portal = { extra: 1 };
            // Efectos del cristal (WebGL): lupa, curvatura alrededor del aro, suavizado y brillo.
            const glass = { lensK: .55, warp: 0, soft: 1.6, rim: 1, pull: 0 };
            const lensCanvas = document.getElementById('lens-gl');
            const heroVignette = document.getElementById('hero-vignette');

            // Rectángulo donde el navegador dibuja la foto (object-fit: cover; object-position: 50% 100%).
            const photoDrawRect = () => {
                const box = heroPhoto.getBoundingClientRect();
                const viewportBox = heroViewport.getBoundingClientRect();
                const nw = heroPhoto.naturalWidth || 3225;
                const nh = heroPhoto.naturalHeight || 2148;
                const fit = Math.max(box.width / nw, box.height / nh);
                const w = nw * fit;
                const h = nh * fit;
                return {
                    x: box.left - viewportBox.left + (box.width - w) * 0.5,
                    y: box.top - viewportBox.top + (box.height - h),
                    w,
                    h,
                };
            };

            const applyPortal = () => {
                const s = Number(gsap.getProperty(heroPhotoStage, 'scale')) * portal.extra;
                lensPortal.style.transform = `translateZ(0) scale(${s})`;
                lensPortalInner.style.transform = `scale(${1 / s})`;
                if (lensGL && heroViewport.style.visibility !== 'hidden') {
                    const reveal = Number(gsap.getProperty(lensPortal, 'opacity'));
                    // Hueco en la viñeta oscura para que el cristal se vea limpio.
                    heroVignette.style.setProperty('--hole-r', `${lensGeometry.r * s * reveal}px`);
                    lensGL.render({
                        photoRect: photoDrawRect(),
                        cx: lensGeometry.x,
                        cy: lensGeometry.y,
                        radius: lensGeometry.r * s,
                        reveal,
                        lensK: glass.lensK,
                        warp: glass.warp,
                        soft: glass.soft,
                        rim: glass.rim,
                        pull: glass.pull,
                    });
                }
            };

            // Captura de "Quiénes Somos" para verla a través del cristal.
            const snapshotQs = async (domToCanvas) => {
                const section = document.getElementById('quienes-somos');
                const width = section.offsetWidth;
                const height = Math.min(section.offsetHeight, heroViewport.offsetHeight);
                const canvas = await domToCanvas(section, {
                    width,
                    height,
                    scale: Math.min(window.devicePixelRatio || 1, 1.5),
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#FAF8F4',
                    style: { marginTop: '0px' },
                });
                return { canvas, width, height };
            };

            const startLensGL = async () => {
                const connection = navigator.connection;
                const slowConnection = Boolean(connection && (connection.saveData || /(^|-)(2g|3g)$/.test(connection.effectiveType || '')));
                if (!lensCanvas || window.matchMedia('(max-width: 640px)').matches || slowConnection) return;
                try {
                    const [{ createLensGL }, { domToCanvas }] = await Promise.all([
                        import('./lensGL.js'),
                        import('modern-screenshot'),
                    ]);
                    if (!heroPhoto.complete) await new Promise((resolve) => heroPhoto.addEventListener('load', resolve, { once: true }));
                    await document.fonts?.ready;
                    const shot = await snapshotQs(domToCanvas);
                    if (disposed) return;
                    lensGL = createLensGL(lensCanvas, heroPhoto);
                    lensGL.resize(heroViewport.clientWidth, heroViewport.clientHeight);
                    lensGL.setQs(shot.canvas, shot.width, shot.height);
                    heroViewport.classList.add('has-lens-gl');
                    applyPortal();

                    // Al cambiar el tamaño de la ventana se rehace la captura.
                    let resizeTimer;
                    const onResize = () => {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(async () => {
                            if (!lensGL) return;
                            lensGL.resize(heroViewport.clientWidth, heroViewport.clientHeight);
                            const next = await snapshotQs(domToCanvas);
                            lensGL?.setQs(next.canvas, next.width, next.height);
                            applyPortal();
                        }, 300);
                    };
                    window.addEventListener('resize', onResize);
                    // Al cambiar a modo noche o día, se vuelve a capturar la sección con los colores nuevos.
                    window.addEventListener('themechange', () => {
                        window.setTimeout(async () => {
                            if (!lensGL) return;
                            const next = await snapshotQs(domToCanvas);
                            lensGL?.setQs(next.canvas, next.width, next.height);
                            applyPortal();
                        }, 500);
                    });
                } catch (error) {
                    // Sin WebGL o sin captura: queda el portal en HTML.
                    console.warn('Cristal WebGL no disponible:', error);
                    heroViewport.classList.remove('has-lens-gl');
                }
            };
            const idle = window.requestIdleCallback || ((callback) => setTimeout(callback, 700));
            idle(() => { startLensGL(); });
            const portalExtraScale = () => Math.max(1, lensGeometry.maxRadius / lensGeometry.r / PHOTO_END_SCALE);

            // Centro de un elemento medido dentro del hero (sin contar transforms).
            const centerInHero = (element) => {
                let x = element.offsetWidth / 2;
                let y = element.offsetHeight / 2;
                let node = element;
                while (node && node !== heroViewport) {
                    x += node.offsetLeft;
                    y += node.offsetTop;
                    node = node.offsetParent;
                }
                return node ? { x, y } : null;
            };
            const intoLens = (element, duration, rotation) => ({
                x: () => { const c = centerInHero(element); return c ? lensGeometry.x - c.x : 0; },
                y: () => { const c = centerInHero(element); return c ? lensGeometry.y - c.y : 0; },
                scale: .03,
                rotation,
                duration,
                ease: 'power2.in',
            });
            const heroCopy = heroMain.querySelector('.hero-copy');
            const heroScrollHint = document.getElementById('hero-scroll-hint');
            const heroLocation = heroViewport.querySelector('.hero-location');
            const brandCarousel = document.getElementById('brand-carousel');

            const heroTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: () => `+=${heroScrollDistance()}`,
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onRefreshInit: () => { updateLensGeometry(); buildPortalClone(); },
                    onUpdate: (self) => {
                        if (self.progress > .005) return;
                        gsap.set('#hero-wayfinding', { opacity: 1 });
                    },
                },
                onUpdate: applyPortal,
            });

            heroTimeline
                // Todo el inicio cae al agujero: textos, botón, ubicación y marcas.
                .to(heroCopy, intoLens(heroCopy, .4, 28), .03)
                .to(heroCopy, { opacity:0, duration:.08, ease:'power1.in' }, .36)
                .to(heroScrollHint, intoLens(heroScrollHint, .42, -30), .05)
                .to(heroLocation, intoLens(heroLocation, .42, 34), .07)
                .to(brandCarousel, intoLens(brandCarousel, .45, -22), .08)
                .to('#hero-wayfinding', { opacity:0, duration:.08, ease:'power1.in' }, .45)
                // La foto se arremolina hacia el lente.
                .fromTo(glass, { pull: 0 }, { pull: 1, duration: .5, ease: 'power2.in', immediateRender:false }, .1)
                .to(heroLogo, {
                    x: () => lensGeometry.x - heroMain.offsetLeft - heroLogo.offsetLeft - heroLogo.offsetWidth / 2,
                    y: () => lensGeometry.y - heroMain.offsetTop - heroLogo.offsetTop - heroLogo.offsetHeight / 2,
                    scale: .04,
                    duration: .42,
                    ease: 'power2.inOut',
                }, .04)
                .to(heroLogo, { opacity:0, duration:.1, ease:'power1.in' }, .38)
                // La foto avanza hacia el lente derecho.
                .to(heroPhotoStage, { scale:PHOTO_END_SCALE, duration:1, ease:'power1.in' }, 0)
                .to('#hero-vignette', { opacity:.9, duration:.45, ease:'none' }, 0)
                // El "agujero": aparece la siguiente sección dentro del lente...
                .fromTo(lensPortal, { opacity:0 }, { opacity:1, duration:.14, ease:'none', immediateRender:false }, .04)
                // Cristal: la foto se curva hacia el aro y la lupa se endereza al abrirse.
                .fromTo(glass, { warp: 0 }, { warp: .55, duration: .36, ease: 'sine.inOut', immediateRender:false }, .08)
                .to(glass, { warp: 0, duration: .32, ease: 'sine.in' }, .56)
                .fromTo(glass, { lensK: .55 }, { lensK: 0, duration: .5, ease: 'sine.inOut', immediateRender:false }, .4)
                .fromTo(glass, { soft: 1.6 }, { soft: 0, duration: .45, ease: 'sine.out', immediateRender:false }, .35)
                .fromTo(glass, { rim: 1 }, { rim: 0, duration: .25, ease: 'none', immediateRender:false }, .7)
                // ...y se abre hasta cubrir la pantalla.
                .fromTo(portal, { extra: 1 }, {
                    extra: portalExtraScale,
                    duration: .52,
                    ease: 'power2.in',
                    immediateRender: false,
                }, .42)
                .to('.lens-portal-edge', { opacity:0, duration:.25, ease:'none' }, .62)
                .to('.lens-portal-blur', { opacity:0, duration:.3, ease:'power1.out' }, .66)
                // Cuando el portal cubre todo, se entrega a la sección real (idéntica debajo).
                .set(heroViewport, { autoAlpha: 0 }, .995);
            applyPortal();
        }


        // ============================================================
        // 2. NAV: cambia de contraste al terminar la transición óptica.
        // ============================================================
        const updateNavState = (passedHero) => {
            const nav = document.getElementById('main-nav');
            if (!nav) return;
            if (heroViewport) heroViewport.style.pointerEvents = passedHero ? 'none' : 'auto';
            setPastHero(passedHero);
            nav.classList.toggle('is-over-hero', !passedHero);
            nav.style.background = passedHero ? 'var(--nav-bg)' : 'transparent';
            nav.style.backdropFilter = passedHero ? 'blur(24px)' : 'none';
            nav.style.WebkitBackdropFilter = passedHero ? 'blur(24px)' : 'none';
            nav.style.borderBottom = passedHero ? '1px solid var(--nav-border)' : 'none';
            nav.style.boxShadow = passedHero ? '0 10px 36px rgba(0, 0, 0, 0.05)' : 'none';
        };

        ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: () => `+=${heroScrollDistance()}`,
            onUpdate: (self) => updateNavState(self.progress > 0.8),
            onLeave: () => updateNavState(true),
            onEnterBack: (self) => updateNavState(self.progress > 0.8),
        });


        // ============================================================
        // 4. Reveal content once, with no residual horizontal offsets.
        // ============================================================
        const revealTargets = '.reveal, #optiland-header, #opt-card-2, #opt-card-3, #opt-types, #operativos-content, #mision-header, #mis-1, #mis-2, #mis-3, #mis-quote, #ct-header, #ct-left, #ct-right';
        sectionMotion = gsap.matchMedia();
        sectionMotion.add({ reduce: '(prefers-reduced-motion: reduce)', animate: '(prefers-reduced-motion: no-preference)' }, (context) => {
            gsap.utils.toArray(revealTargets).forEach((element) => {
                if (context.conditions.reduce) {
                    gsap.set(element, { opacity: 1, clearProps: 'transform' });
                    return;
                }
                // Each block reveals when it enters, and stays readable on return scroll.
                gsap.fromTo(element, { opacity: 0, x: 0, y: 12 }, {
                    opacity: 1, x: 0, y: 0, duration: .65, ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: { trigger: element, start: 'top 92%', once: true },
                });
            });
        });


        // ============================================================
        // SMOOTH SCROLL — Links de navegación (actualiza la URL)
        // ============================================================
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                setMenuOpen(false);
                const href = this.getAttribute('href');
                if (href === '#') return;
                scrollToHash(href);
            });
        });

        } catch(e) {
            console.error(e);
        }
    }, 100);

    return () => {
        disposed = true;
        clearTimeout(setupTimer);
        clearTimeout(preloaderFallback);
        sectionMotion?.revert();
        lensGL?.dispose();
    };
  }, []);

  return (
    <>
    <a href="#contenido" className="skip-link">Saltar al contenido</a>

    {/* ===== PRELOADER ===== */}
    <div id="preloader">
        <p className="font-outfit text-sm text-brand-muted">CARGANDO A TUS PITILOVERS 😎</p>
        <div className="loader-bar"></div>
    </div>

    {/* ===== NAV (nuevo logo fijo a la izquierda) ===== */}
    <nav id="main-nav" className="is-over-hero">
        <a 
            href="#top" 
            className="nav-home block"
            aria-label="Volver al inicio"
        >
            <AnimatedLogo id="nav-logo" src={assetUrl('logo-nav.png')} alt="Optivision W&M" className="h-16" />
        </a>
        <div className="flex-1"></div>
        <div className="hidden lg:flex items-center gap-7 font-outfit">
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="nav-link"
                data-cta="nav"
            >
                Cotizar por WhatsApp
            </a>
            <a href="#quienes-somos" className="nav-link">Nosotros</a>
            <a href="#optiland" className="nav-link">Tecnología</a>
            <a href="#contacto" className="nav-link">Contacto</a>
        </div>
        <a href="#operativos" className="nav-link hero-enterprise"><span>Servicio para empresas</span><ArrowDown size={15} aria-hidden="true" /></a>
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo día' : 'Activar modo noche'}
            title={theme === 'dark' ? 'Modo día' : 'Modo noche'}
        >
            {theme === 'dark' ? <Sun size={19} strokeWidth={1.7} aria-hidden="true" /> : <Moon size={19} strokeWidth={1.7} aria-hidden="true" />}
        </button>
        <button
            id="menu-toggle"
            type="button"
            className="lg:hidden flex flex-col justify-center gap-1.5 p-3 ml-2 min-w-11 min-h-11"
            aria-label={menuOpen ? 'Cerrar menú' : 'Menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
        >
            <span className="block w-5 h-[1.5px] bg-brand-text"></span>
            <span className="block w-5 h-[1.5px] bg-brand-text"></span>
            <span className="block w-3.5 h-[1.5px] bg-brand-text"></span>
        </button>
    </nav>

    {/* Menú móvil */}
    <div
        id="mobile-menu"
        inert={!menuOpen}
        className="fixed inset-0 z-40 bg-brand-cream/95 backdrop-blur-lg flex flex-col items-center justify-center gap-4 text-xl font-outfit"
        style={{ opacity: menuOpen ? 1 : 0, visibility: menuOpen ? 'visible' : 'hidden' }}
    >
        <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mobile-menu-link"
            data-cta="menu"
            onClick={() => setMenuOpen(false)}
        >
            Cotizar por WhatsApp
        </a>
        <a href="#operativos" className="mobile-menu-link">Servicio empresas</a>
        <a href="#quienes-somos" className="mobile-menu-link">Nosotros</a>
        <a href="#preguntas" className="mobile-menu-link">Preguntas frecuentes</a>
        <a href="#optiland" className="mobile-menu-link">Tecnología</a>
        <a href="#contacto" className="mobile-menu-link">Contacto</a>
    </div>

    <main id="contenido" tabIndex={-1} className="outline-none">


    {/* ===========================================================
         SECCIÓN 1 — HERO ÓPTICO
         Fotografía full-bleed, logo 3D y transición por el visor.
         =========================================================== */}
    <section id="hero" className="optical-hero">
        <div id="hero-viewport" className="optical-hero-viewport">
            <div id="hero-photo-stage" className="hero-photo-stage">
                <img
                    className="hero-photo-blur"
                    src={assetUrl('persona-sosteniendo-lentes-1280.webp')}
                    alt=""
                />
                <img
                    id="hero-photo-sharp"
                    className="hero-photo-sharp"
                    src={assetUrl('persona-sosteniendo-lentes.webp')}
                    srcSet={`${assetUrl('persona-sosteniendo-lentes-1280.webp')} 1280w, ${assetUrl('persona-sosteniendo-lentes.webp')} 2400w`}
                    sizes="100vw"
                    alt="Persona sosteniendo un armazón de prueba durante un examen visual"
                    fetchPriority="high"
                />
            </div>

            <canvas id="lens-gl" className="lens-gl" aria-hidden="true" />
            <div id="hero-vignette" className="hero-vignette" aria-hidden="true" />
            <div id="lens-portal" className="lens-portal" aria-hidden="true">
                <div id="lens-portal-inner" className="lens-portal-inner" inert>
                    <div id="lens-portal-clone" className="lens-portal-clone" />
                    <div className="lens-portal-blur" />
                </div>
                <div className="lens-portal-edge" />
            </div>
            <h1 className="sr-only">Óptica en Apumanque, Las Condes — Optivision W&M</h1>

            <div id="hero-main" className="hero-main">
            <div
                id="hero-logo-shell"
                className={`hero-logo-shell${heroLogoReady ? ' is-ready' : ''}`}
            >
                <img
                    className="hero-logo-fallback"
                    src={assetUrl('logo-hero.webp')}
                    width="602"
                    height="255"
                    alt="Optivision W&M"
                />
                <Suspense fallback={null}>
                    {use3DLogo && <HeroLogo3D onReady={() => setHeroLogoReady(true)} />}
                </Suspense>
            </div>
            <div className="hero-copy">
                <p className="hero-description">
                    <span>Encuentra el marco que va contigo.</span>
                    <span>Cristales para tu receta. Asesoría personal.</span>
                </p>
                <div className="hero-actions">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp whatsapp-flow hero-quote" data-cta="hero">
                        <MessageCircle size={20} aria-hidden="true" /><span>Cotizar por WhatsApp</span>
                    </a>
                </div>
            </div>
            </div>

            <div id="hero-wayfinding" className="hero-wayfinding">
            <button
                id="hero-scroll-hint"
                className="hero-scroll-hint"
                type="button"
                onClick={() => gsap.to(window, {
                    duration: prefersReducedMotion() ? 0 : 1.6,
                    scrollTo: { y: '#quienes-somos', offsetY: 0 },
                    ease: 'power1.inOut', overwrite: 'auto'
                })}
            >
                <span>Desliza para ver</span>
                <ChevronDown size={19} strokeWidth={1.6} />
            </button>
            <a className="hero-location" href="https://www.google.com/maps/place/OptivisionW%26M/data=!4m2!3m1!1s0x0:0x4dc94297887a9b9b" target="_blank" rel="noopener noreferrer">
                <MapPin size={13} aria-hidden="true" />Mall Apumanque · Local 132, piso 2
            </a>
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
            </div>

        </div>
    </section>


    {/* SECCIÓN 2 — QUIÉNES SOMOS */}
    <section id="quienes-somos" className="qs-section bg-brand-cream relative">
        {/* Aros con marcas como el dial del probador, eco de la portada */}
        <svg className="qs-dial" viewBox="0 0 600 600" aria-hidden="true">
            <circle cx="300" cy="300" r="292" className="qs-dial-line" />
            <circle cx="300" cy="300" r="268" className="qs-dial-ticks" />
            <circle cx="300" cy="300" r="268" className="qs-dial-ticks qs-dial-ticks--major" />
            <circle cx="300" cy="300" r="214" className="qs-dial-line qs-dial-line--soft" />
        </svg>

        <div className="qs-layout">
            <div id="qs-text-container" className="qs-text">
                <div className="qs-eyebrow">
                    <div className="divider"></div>
                    <span>Conócenos</span>
                </div>
                <h2 className="wave-title qs-title font-outfit font-bold text-brand-text">
                    <WaveTitle text="Quiénes " /><WaveTitle text="Somos" className="text-brand-gold" delayOffset={8} />
                </h2>
                <div className="qs-copy">
                    <p className="qs-lead">Tus lentes te acompañan al trabajar, leer y disfrutar lo que te gusta.</p>
                    <p>
                        En <strong>Optivision W&M</strong>, nuestra óptica en Mall Apumanque, Las Condes, te ayudamos a elegir una montura cómoda y los cristales para tu receta, tu rutina y tu presupuesto. Te acompañamos con atención personal, desde la elección hasta el retiro.
                    </p>
                </div>
                <dl className="qs-stats" aria-label="Plazos de entrega de Optivision W&M">
                    <div className="qs-stat">
                        <dt>Monofocales</dt>
                        <dd className="qs-stat-value"><span className="qs-stat-num">2</span><span className="qs-stat-unit">días hábiles</span></dd>
                        <dd className="qs-stat-note">Listos para retiro en tienda</dd>
                    </div>
                    <div className="qs-stat">
                        <dt>Bifocales y multifocales</dt>
                        <dd className="qs-stat-value"><span className="qs-stat-num">5</span><span className="qs-stat-unit">días hábiles</span></dd>
                        <dd className="qs-stat-note">Listos para retiro en tienda</dd>
                    </div>
                </dl>
                <p className="delivery-note">Los plazos se cuentan desde la compra de tus lentes.</p>
            </div>

            <figure id="qs-image-container" className="qs-figure">
                <div className="qs-arch">
                    <img
                        src={assetUrl('modelo-optivision-integrada-v2.webp')}
                        alt="Asesora de Optivision W&M con polera verde sosteniendo unos lentes en la óptica"
                        className="qs-model"
                        width="1122"
                        height="1402"
                        decoding="async"
                    />
                </div>
                <div className="qs-seal" aria-hidden="true">
                    <svg viewBox="0 0 120 120" className="qs-seal-ring">
                        <defs>
                            <path id="qs-seal-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
                        </defs>
                        <text>
                            <textPath href="#qs-seal-path" startOffset="0" textLength="279" lengthAdjust="spacing">ÓPTICA · MALL APUMANQUE · LAS CONDES ·</textPath>
                        </text>
                    </svg>
                    <img src={assetUrl('logo-footer.png')} alt="" className="qs-seal-logo" width="505" height="285" />
                </div>
                <figcaption className="qs-badge">
                    <span className="qs-badge-label">Cristales</span>
                    <span className="qs-badge-logos">
                        <img src={assetUrl('brand-hoya.svg')} alt="HOYA" width="70" height="24" />
                        <span className="qs-badge-sep" aria-hidden="true" />
                        <img src={assetUrl('brand-optiland.png')} alt="Optiland" width="62" height="24" />
                    </span>
                    <span className="qs-badge-note">Te orientamos según tu receta</span>
                </figcaption>
            </figure>
        </div>
    </section>


    <Coleccion />
    <ComoFunciona />


    {/* ===========================================================
         SECCIÓN 3 — TECNOLOGÍA ÓPTICA: CRISTALES OPTILAND
         =========================================================== */}
    <section id="optiland" className="py-28 lg:py-36 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div id="optiland-header" className="text-center mb-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="divider"></div>
                    <span className="text-xs tracking-[.3em] uppercase font-outfit text-brand-muted">Tecnología</span>
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
                <div className="card p-8 flex flex-col" id="opt-card-2">
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
                <div className="card p-8 flex flex-col" id="opt-card-3">
                    <div className="feature-icon mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Protección Completa</h3>
                    <p className="text-brand-muted text-sm leading-relaxed flex-grow">Comprueba cómo actúan los tratamientos fotocromático, Blue Cut y UV directamente sobre los cristales.</p>
                    <button id="open-filter-modal" type="button" className="btn-ver-mas mt-5 w-full justify-center" aria-haspopup="dialog" onClick={openFilterModal} onPointerEnter={() => setFilterImagesRequested(true)} onFocus={() => setFilterImagesRequested(true)}>
                        Explorar filtros
                        <ChevronDown size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="lens-type-group" id="opt-types">
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
    <div id="filter-modal" className="fixed inset-0 bg-brand-bg z-[100] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Experiencia de filtros ópticos" inert={!filterOpen}>
        <button type="button" className="filter-modal-close" id="close-filter-modal" aria-label="Cerrar filtros" onClick={closeFilterModal}>
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
                    <img src={filterImagesRequested ? assetUrl('filtros_1.webp') : undefined} decoding="async" alt="Lentes antes de activar el tratamiento fotocromático" />
                    <img src={filterImagesRequested ? assetUrl('filtros_2.webp') : undefined} decoding="async" className="capa-fotocromatica" data-filter-overlay alt="Lentes con el tratamiento fotocromático activado" />
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
                    <img src={filterImagesRequested ? assetUrl('bluecut-before.webp') : undefined} decoding="async" alt="Lentes con reflejo de luz azul antes de activar el filtro Blue Cut" />
                    <img src={filterImagesRequested ? assetUrl('bluecut-after.webp') : undefined} decoding="async" className="bluecut-filter-layer" data-filter-overlay alt="Lentes con el reflejo azul reducido después de activar el filtro Blue Cut" />
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
                    <img src={filterImagesRequested ? assetUrl('uv-before.webp') : undefined} decoding="async" alt="Lentes sin protección UV expuestos a la luz solar" />
                    <img src={filterImagesRequested ? assetUrl('uv-after.webp') : undefined} decoding="async" className="uv-filter-layer" data-filter-overlay alt="Lentes con protección UV400 activada" />
                    <div className="photo-label">Sin filtro UV</div>
                    <div className="photo-progress-bar"><div className="photo-progress-fill"></div></div>
                </div>
                <p className="filter-demo-note">Representación visual del funcionamiento del filtro.</p>
                <p className="filter-scroll-hint">Desliza para activar <ChevronDown size={15} aria-hidden="true" /></p>
            </div>
        </div>

        <div className="filter-modal-footer">
            <p>Ahora puedes elegir el tratamiento que mejor acompaña tu rutina.</p>
            <button type="button" className="btn-primary" onClick={closeFilterModal}>
                Volver a Tecnología
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
            </button>
        </div>
    </div>


    {/* ===========================================================
         SECCIÓN 4 — OPERATIVOS OFTALMOLÓGICOS (empresas)
         =========================================================== */}
    <section id="operativos" className="ops-section">
        <div id="operativos-content" className="ops-card">
            <div className="ops-copy">
                <div className="section-eyebrow">
                    <span className="divider" aria-hidden="true" />
                    <span>Servicio para empresas</span>
                </div>
                <h2 className="section-title font-outfit font-bold">
                    <WaveTitle text="Operativos " /><WaveTitle text="Oftalmológicos" className="text-brand-gold" />
                </h2>
                <p className="ops-lead">
                    Cuando atender la salud visual exige traslados, permisos y horas fuera del puesto, suele postergarse.
                </p>
                <p className="ops-text">
                    Optivision W&M lleva la atención óptica a tus dependencias y coordina una jornada ordenada para que tus colaboradores puedan evaluarse sin convertirlo en media jornada fuera de la empresa.
                </p>
                <ul className="ops-benefits" aria-label="Beneficios para la empresa">
                    <li><Check size={16} aria-hidden="true" />Menos tiempo fuera del puesto</li>
                    <li><Check size={16} aria-hidden="true" />Atención en tus dependencias</li>
                    <li><Check size={16} aria-hidden="true" />Coordinación simple para RR.HH.</li>
                </ul>
                <div className="ops-actions">
                    <a
                        href={OPERATIVOS_MAIL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ops-cta"
                        aria-label="Solicitar información sobre un operativo oftalmológico por Gmail"
                    >
                        Solicitar operativo
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                    <p className="ops-mail">
                        <span>o escríbenos a</span>
                        <a href={`mailto:${OPERATIVOS_EMAIL}`}>{OPERATIVOS_EMAIL}</a>
                        <button type="button" onClick={copyEmail} className="ops-copy-btn">
                            {emailCopied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                            <span aria-live="polite">{emailCopied ? 'Copiado' : 'Copiar'}</span>
                        </button>
                    </p>
                </div>
            </div>
            <ol className="ops-timeline" aria-label="Cómo es un operativo">
                <li>
                    <span className="ops-step">01</span>
                    <div><h3>Coordinamos con RR.HH.</h3><p>Definimos fecha, horario, lugar y cuántas personas se atenderán.</p></div>
                </li>
                <li>
                    <span className="ops-step">02</span>
                    <div><h3>Vamos a tu empresa</h3><p>Llevamos la atención óptica a tus dependencias en una jornada ordenada por turnos.</p></div>
                </li>
                <li>
                    <span className="ops-step">03</span>
                    <div><h3>Tu equipo se evalúa</h3><p>Sin traslados ni permisos largos: cada colaborador vuelve pronto a su puesto.</p></div>
                </li>
            </ol>
        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 5 — PROPÓSITO (banda con la frase de la marca)
         =========================================================== */}
    <section id="mision" className="mision-band">
        <div id="mision-header" className="mision-inner">
            <p className="mision-eyebrow">Nuestro propósito</p>
            <blockquote className="mision-quote">
                <p>Ver bien es vivir bien.</p>
                <p className="mision-quote__accent">Transformamos miradas, una visión a la vez.</p>
            </blockquote>
            <ul className="mision-values">
                <li>Precio justo, sin el sobreprecio de las grandes marcas</li>
                <li>Atención cálida y profesional</li>
                <li>Cristales de laboratorios reconocidos</li>
            </ul>
        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 6 — RESEÑAS (CARRUSEL)
         =========================================================== */}
    <section id="reviews" className="reviews-section">
        <div className="reviews-head reveal">
            <h2 className="section-title font-outfit font-bold text-brand-text">
                Lo que dicen nuestros <span className="text-brand-gold">pacientes</span>
            </h2>
            <a className="rating-pill" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" data-cta="google-reviews">
                <span className="rating-pill__score">{GOOGLE_RATING.score}</span>
                <StarRow className="" />
                <span className="rating-pill__count">{GOOGLE_RATING.count} reseñas en Google</span>
                <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <div className="reviews-actions">
                <a className="reviews-link" href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">Ver todas y dejar tu reseña</a>
                <button
                    type="button"
                    className="reviews-toggle"
                    aria-pressed={reviewsPaused}
                    onClick={() => setReviewsPaused((paused) => !paused)}
                >
                    {reviewsPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                    {reviewsPaused ? 'Reanudar' : 'Pausar'}
                </button>
            </div>
        </div>

        <div className="reviews-viewport relative w-full flex overflow-hidden">
            {/* Doble track para efecto infinito: la copia se oculta a lectores de pantalla */}
            <div className={`reviews-track flex w-max animate-marquee gap-6 px-3${reviewsPaused ? ' is-paused' : ''}`}>
                {[0, 1].flatMap((copy) => REVIEWS.map((review) => (
                    <figure
                        key={`${copy}-${review.author}`}
                        className="review-card"
                        aria-hidden={copy === 1 ? 'true' : undefined}
                    >
                        <StarRow />
                        <blockquote>"{review.text}"</blockquote>
                        <figcaption>{review.author} <span>· Google</span></figcaption>
                    </figure>
                )))}
            </div>
        </div>
    </section>


    {/* ===========================================================
         SECCIÓN 6 — CONTACTO
         =========================================================== */}
    <section id="contacto" className="contact-section py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
            <div id="ct-header" className="text-center mb-10 lg:mb-14">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="divider"></div>
                    <span className="text-xs tracking-[.3em] uppercase font-outfit text-brand-muted">Encuéntranos</span>
                    <div className="divider"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
                    <WaveTitle text="Contacto " /><WaveTitle text="& Ubicación" className="text-brand-gold" />
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Mapa + Dirección */}
                <div id="ct-left">
                    <a href="https://www.google.com/maps/place/OptivisionW%26M/data=!4m2!3m1!1s0x0:0x4dc94297887a9b9b" target="_blank" rel="noopener noreferrer" className="block relative h-72 rounded-xl overflow-hidden border border-brand-border group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
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
                            title="Ubicación de Optivision W&M en Mall Apumanque"
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
                <div id="ct-right" className="space-y-5">
                    {/* Teléfono */}
                    <div className="card contact-phone p-5">
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
                    <div className="card contact-hours p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <h3 className="font-outfit font-semibold text-brand-text text-sm">Horarios</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-brand-border">
                                <span className="text-brand-muted font-outfit">Lunes</span>
                                <span className="text-brand-text font-medium font-outfit">10:00 — 20:30 hrs</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-brand-border">
                                <span className="text-brand-muted font-outfit">Martes – Sábado</span>
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
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp whatsapp-flow" data-cta="contacto">
                            <MessageCircle size={20} aria-hidden="true" /><span>Escríbenos por WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>


    {/* SECCIÓN 8 — PREGUNTAS FRECUENTES (después de Contacto) */}
    <PreguntasFrecuentes />
    </main>

    <SiteFooter />

    {/* Botón flotante de WhatsApp: aparece al pasar la portada */}
    <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`wa-float${pastHero && !menuOpen && !filterOpen ? ' is-visible' : ''}`}
        aria-label="Cotizar por WhatsApp"
        aria-hidden={pastHero && !menuOpen && !filterOpen ? undefined : 'true'}
        tabIndex={pastHero && !menuOpen && !filterOpen ? undefined : -1}
        data-cta="flotante"
    >
        <MessageCircle size={22} aria-hidden="true" />
        <span>Cotizar</span>
    </a>
    </>
  );
}
