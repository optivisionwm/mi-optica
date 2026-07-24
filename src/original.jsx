

    {/* ===== PRELOADER ===== */}
    <div id="preloader">
        <p className="font-outfit text-xs tracking-[.3em] uppercase text-brand-muted">CARGANDO A TUS PITILOVERS 😎</p>
        <div className="loader-bar"></div>
    </div>

    {/* ===== LOGO PRINCIPAL (position: fixed, se anima de centro a nav) ===== */}
    {/*
        🖼️ LOGO — Reemplaza "logo-user.png" con tu logo (fondo transparente PNG).
    */}
    <img id="hero-logo" src="assets/logo-user.png" alt="Optivision W&amp;M" />

    {/* ===== NAV (nuevo logo fijo a la izquierda) ===== */}
    <nav id="main-nav" style={{"opacity":"0"}}>
        <img id="nav-logo" src="assets/logo-nav.png" alt="Optivision W&amp;M" className="h-20 md:h-24 lg:h-28" />
        <div className="flex-1"></div>
        <div className="hidden md:flex items-center gap-10 font-outfit">
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
        <a href="#quienes-somos" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Nosotros</a>
        <a href="#optiland" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Tecnología</a>
        <a href="#mision" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Misión</a>
        <a href="#contacto" className="text-brand-text hover:text-brand-gold transition-colors" onClick={() => {}}>Contacto</a>
    </div>


    {/* ===========================================================
         SECCIÓN 1 — HERO
         Logo gigante centrado + carrusel de marcas debajo.
         Al scroll: logo shrink a esquina superior izq, carrusel fade out.
         =========================================================== */}
    <section id="hero" style={{"height":"120vh","position":"relative"}}>

        {/* Subtítulo que aparece debajo del logo */}
        <div className="flex items-center justify-center" style={{"height":"100vh","paddingTop":"8vh"}}>
            <div className="text-center" style={{"marginTop":"28vh"}}>
                <p id="hero-tagline" className="text-xs md:text-sm tracking-[.35em] uppercase font-outfit font-light text-brand-muted" style={{"opacity":"0"}}>
                    Nosotros somos PitiLovers
                </p>
            </div>
        </div>

        {/* Carrusel de marcas asociadas */}
        <div id="brand-carousel" className="absolute w-full" style={{"top":"88vh"}}>
            <p className="text-center text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted/50 mb-4">Marcas que nos respaldan</p>
            <div className="marquee-wrapper">
                <div className="marquee-track">
                    {/*
                        🖼️ LOGOS DE MARCAS — Reemplaza o agrega más imágenes.
                        Duplica el conjunto para que el loop sea continuo.
                    */}
                    {/* Set 1 */}
                    <img src="assets/brand-rayban.png" alt="Ray-Ban" style={{"height":"48px"}} />
                    <img src="assets/brand-veltom.png" alt="Veltom" style={{"height":"48px"}} />
                    <img src="assets/brand-karun.png" alt="Karün" />
                    <img src="assets/brand-vogue.png" alt="Vogue" />
                    <img src="assets/brand-saturday.png" alt="Saturday" />
                    {/* Set 2 */}
                    <img src="assets/brand-rayban.png" alt="Ray-Ban" style={{"height":"48px"}} />
                    <img src="assets/brand-veltom.png" alt="Veltom" style={{"height":"48px"}} />
                    <img src="assets/brand-karun.png" alt="Karün" />
                    <img src="assets/brand-vogue.png" alt="Vogue" />
                    <img src="assets/brand-saturday.png" alt="Saturday" />
                    {/* Set 3 */}
                    <img src="assets/brand-rayban.png" alt="Ray-Ban" style={{"height":"48px"}} />
                    <img src="assets/brand-veltom.png" alt="Veltom" style={{"height":"48px"}} />
                    <img src="assets/brand-karun.png" alt="Karün" />
                    <img src="assets/brand-vogue.png" alt="Vogue" />
                    <img src="assets/brand-saturday.png" alt="Saturday" />
                    {/* Set 4 (extra para loop infinito) */}
                    <img src="assets/brand-rayban.png" alt="Ray-Ban" style={{"height":"48px"}} />
                    <img src="assets/brand-veltom.png" alt="Veltom" style={{"height":"48px"}} />
                    <img src="assets/brand-karun.png" alt="Karün" />
                    <img src="assets/brand-vogue.png" alt="Vogue" />
                    <img src="assets/brand-saturday.png" alt="Saturday" />
                </div>
            </div>
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-text leading-tight">
                    Quiénes <span className="text-brand-gold">Somos</span>
                </h2>
                <p className="mt-6 text-brand-muted leading-relaxed text-[.95rem]">
                    En <strong className="text-brand-text font-medium">Optivisión W&amp;M</strong> somos una empresa óptica especializada en democratizar el acceso a la salud visual de primer nivel, combinando precisión clínica con un modelo de negocio transparente. Trabajamos junto a los laboratorios más avanzados del país para ofrecer cristales y monturas de alta tecnología, eliminando los sobreprecios del marketing tradicional para que el paciente pague exclusivamente por calidad real.
                </p>
            </div>

            {/* IMAGEN LENTE DORADO (Aparece segundo en móvil) */}
            <div className="order-2 lg:order-2 flex justify-center items-center">
                <img id="qs-image" src="assets/glasses-qs.png" alt="Optivision Lentes" className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-xl" />
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
                    Cristales <span className="text-brand-gold">Optiland</span>
                </h2>
                {/* Nuevo Logo de Optiland */}
                <div className="flex justify-center mt-8">
                    <img src="assets/brand-optiland.png" alt="Optiland" className="h-14 md:h-20 object-contain" />
                </div>
                {/* Texto descriptivo más abajo y centrado */}
                <p className="mt-10 text-brand-muted max-w-2xl mx-auto text-[.93rem] leading-relaxed text-center">
                    Trabajamos con cristales del laboratorio óptico <strong className="text-brand-text font-medium">Optiland</strong>, 
                    líderes en cristalería chilena y tratamiento de última generación.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card p-8" id="opt-card-1" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Precisión Freeform</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Cristales tallados punto a punto con tecnología digital. Nitidez visual superior en toda la superficie.</p>
                </div>
                <div className="card p-8" id="opt-card-2" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Tecnología Antiage</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Filtro exclusivo de radiación infrarroja (IR). Protege el contorno ocular y reduce fatiga por pantallas.</p>
                </div>
                <div className="card p-8" id="opt-card-3" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Protección Completa</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">Antireflejo, fotocromaticos, filtro de luz azul y UV400. Alto índice 1.56 a 1.67 y policarbonato.</p>
                    <button id="open-filter-modal" className="btn-ver-mas mt-5 w-full justify-center">
                        Ver más
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            </div>

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4" id="opt-types" style={{"opacity":"0"}}>
                <div className="bg-brand-cream border border-brand-border rounded-xl p-5 text-center">
                    <p className="font-outfit font-semibold text-brand-text text-sm">Monofocales</p>
                    <p className="text-brand-muted text-xs mt-1">Visión simple</p>
                </div>
                <div className="bg-brand-cream border border-brand-border rounded-xl p-5 text-center">
                    <p className="font-outfit font-semibold text-brand-text text-sm">Bifocales</p>
                    <p className="text-brand-muted text-xs mt-1">Flat Top</p>
                </div>
                <div className="bg-brand-cream border border-brand-border rounded-xl p-5 text-center">
                    <p className="font-outfit font-semibold text-brand-text text-sm">Progresivos</p>
                    <p className="text-brand-muted text-xs mt-1">Multifocal digital</p>
                </div>
                <div className="bg-brand-cream border border-brand-border rounded-xl p-5 text-center">
                    <p className="font-outfit font-semibold text-brand-text text-sm">Ocupacionales</p>
                    <p className="text-brand-muted text-xs mt-1">Trabajo en pantalla</p>
                </div>
            </div>
        </div>
    </section>


    {/* ===========================================================
         MODAL — PRUEBA DE FOTOCROMÁTICOS
         =========================================================== */}
    <div id="filter-modal">
        {/* Botón Cerrar */}
        <button className="filter-modal-close" id="close-filter-modal" aria-label="Cerrar">
            <svg className="w-5 h-5" stroke="#1A1A1A" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Header del Modal */}
        <div className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="divider"></div>
                <span className="text-[10px] tracking-[.3em] uppercase font-outfit text-brand-muted">Experiencia Interactiva</span>
                <div className="divider"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-brand-text leading-tight">
                Prueba de <span className="text-brand-gold">Fotocromáticos</span>
            </h2>
            <p className="mt-4 text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">Desliza hacia abajo para ver cómo los cristales fotocromáticos se oscurecen progresivamente al exponerse a la luz solar, protegiendo tus ojos de forma automática.</p>
        </div>

        {/* ===== SIMULADOR FOTOCROMÁTICO ===== */}
        <div className="photo-scroll-container" style={{"height":"400vh","position":"relative"}}>
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
                <div className="photo-scene">
                    {/* Imagen Base (Cristal Claro) */}
                    <img src="assets/filtros_1.jpg" alt="Lentes Transparentes" />
                    {/* Imagen Destino (Cristal Oscuro Fotocromático), posicionada exactamente encima */}
                    <img src="assets/filtros_2.jpg" id="lens-tint" className="capa-fotocromatica" alt="Lentes Oscuros" style={{"position":"absolute","top":"0","left":"0","width":"100%","height":"100%","opacity":"0"}} />
                    {/* Label flotante */}
                    <div className="photo-label" id="photo-label">Cristal Transparente</div>
                    {/* Barra de progreso */}
                    <div className="photo-progress-bar">
                        <div className="photo-progress-fill" id="photo-progress"></div>
                    </div>
                </div>
                <p className="mt-6 text-brand-muted text-xs font-outfit tracking-wider uppercase text-center">↓ Desliza para activar el efecto fotocromático</p>
            </div>
        </div>

        {/* ===========================================================
             SECCIÓN MODAL — PRUEBA DE POLARIZADOS
             =========================================================== */}
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-10 text-center border-t border-gray-100 relative z-10 bg-white">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold text-brand-text leading-tight">
                Lentes <span className="text-brand-gold">Polarizados</span>
            </h2>
            <p className="mt-4 text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
                Desliza hacia abajo para descubrir cómo el filtro polarizado elimina instantáneamente los reflejos cegadores del sol sobre el campo, mejorando drásticamente el contraste, los colores y la claridad visual.
            </p>
        </div>

        {/* ===== SIMULADOR POLARIZADO ===== */}
        <div className="photo-scroll-container-2" style={{"height":"400vh","position":"relative","backgroundColor":"#fff"}}>
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 bg-white">
                <div className="photo-scene shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                    {/* Imagen Base (Visión normal con reflejos) */}
                    <img src="assets/polarizado_1.jpg" alt="Visión Normal con Reflejos" />
                    {/* Imagen Destino (Visión polarizada sin reflejos) */}
                    <img src="assets/polarizado_2.jpg" id="lens-tint-2" className="capa-polarizada" alt="Visión Polarizada" style={{"position":"absolute","top":"0","left":"0","width":"100%","height":"100%","objectFit":"contain","opacity":"0"}} />
                    {/* Label flotante */}
                    <div className="photo-label" id="photo-label-2">Visión Normal (Con Reflejo)</div>
                    {/* Barra de progreso */}
                    <div className="photo-progress-bar">
                        <div className="photo-progress-fill" id="photo-progress-2"></div>
                    </div>
                </div>
                <p className="mt-6 text-brand-muted text-xs font-outfit tracking-wider uppercase text-center">↓ Desliza para activar el polarizado</p>
            </div>
        </div>


        {/* Footer del modal */}
        <div className="py-20 text-center">
            <p className="font-outfit text-brand-muted text-sm mb-6">¿Listo para proteger tu visión?</p>
            <button className="btn-primary" onClick={() => {}}>
                Volver a la Página
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
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
                            <path strokeLinecap="round" strokeWidth="1.3" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
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
                        Operativos <span className="text-brand-gold">Oftalmológicos</span>
                    </h2>
                    {/* ✏️ Reemplaza con tu texto real */}
                    <p className="text-brand-muted leading-relaxed text-[.93rem]">
                        Llevamos la salud visual directamente a tu empresa. Como segunda rama, hacemos operativos 
                        <strong className="text-brand-text font-medium">Oftalmológicos</strong> para eliminar las barreras de tiempo 
                        y traslado que suelen impedir a los colaboradores acceder a una atención Óptica de calidad.
                    </p>
                    <a href="#" onClick={() => {}} className="btn-primary mt-6 inline-flex text-sm transition-all duration-300">
                        <span id="mail-btn-text">Solicitar Operativo</span>
                        <svg id="mail-btn-icon" className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
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
                    Nuestra <span className="text-brand-gold">Misión</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div id="mis-1" className="text-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mx-auto mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Innovación Constante</h3>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">Última tecnología de diagnóstico y tratamiento visual para resultados precisos.</p>
                </div>
                <div id="mis-2" className="text-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mx-auto mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-outfit font-semibold text-brand-text mb-3">Compromiso Social</h3>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-xs mx-auto">Protegemos tu salud visual y tu bolsillo, asegurando que pagues el valor real de tus lentes y no el sobreprecio de las grandes marcas.</p>
                </div>
                <div id="mis-3" className="text-center" style={{"opacity":"0","transform":"translateY(30px)"}}>
                    <div className="feature-icon mx-auto mb-5">
                        <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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
                    Contacto <span className="text-brand-gold">&amp; Ubicación</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Mapa + Dirección */}
                <div id="ct-left" style={{"opacity":"0","transform":"translateX(-30px)"}}>
                    <a href="https://maps.google.com/?q=Mall+Apumanque+Local+132,+Las+Condes" target="_blank" rel="noopener noreferrer" className="block relative h-72 rounded-xl overflow-hidden border border-brand-border group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
                        {/* Capa visual estética al pasar el mouse o tocar */}
                        <div className="absolute inset-0 bg-brand-text/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-white text-brand-text px-5 py-2.5 rounded-full text-sm font-outfit font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                                <svg className="w-4 h-4 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                Abrir en Google Maps
                            </span>
                        </div>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.125134706915!2d-70.5694294!3d-33.4116499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662ce8b4d8d179b%3A0x633fc2ed57270830!2sMall%20Apumanque!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl" width="100%" height="100%" style={{"border":"0","pointerEvents":"none"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </a>
                    <div className="mt-6 flex items-start gap-4">
                        <div className="feature-icon mt-0.5">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <div>
                            <p className="font-outfit font-medium text-brand-text text-sm">Nuestra Ubicación</p>
                            <p className="text-brand-muted text-sm mt-1 leading-relaxed">Mall Apumanque Local 132 piso 2,<br>Las Condes.</p>
                        </div>
                    </div>
                </div>

                {/* Info + Horarios + WhatsApp */}
                <div id="ct-right" className="space-y-5" style={{"opacity":"0","transform":"translateX(30px)"}}>
                    {/* Teléfono */}
                    <div className="card p-5 flex items-center gap-4">
                        <div className="feature-icon">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
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
                            <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path></svg>
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
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Son excelentes 7 de 7. Muchas gracias. Muy educados y amables en la atención al público, lindos Marcos y buena calidad."</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Andreina P.</p>
                </div>
                {/* Reseña 2 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, muy recomendados, y lo mejor precio y calidad, gracias por su profesionalismo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Jonathan S.</p>
                </div>
                {/* Reseña 3 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, calidad en sus productos y los precios muy muy buenos, súper recomendados no duden en visitarlos 🥳"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— mildred t.</p>
                </div>
                {/* Reseña 4 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente Atención y Servicio Profesional!! Los Recomiendo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Carlos B.</p>
                </div>
                {/* Reseña 5 */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente atención , todo de muy buena calidad!! Súper recomendados!!!"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— roneldis c.</p>
                </div>
                
                {/* DUPLICADO (Para ilusión infinita) */}
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Son excelentes 7 de 7. Muchas gracias. Muy educados y amables en la atención al público, lindos Marcos y buena calidad."</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Andreina P.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, muy recomendados, y lo mejor precio y calidad, gracias por su profesionalismo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Jonathan S.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Muy buena atención, calidad en sus productos y los precios muy muy buenos, súper recomendados no duden en visitarlos 🥳"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— mildred t.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    </div>
                    <p className="text-brand-muted text-[.9rem] italic mb-4 leading-relaxed">"Excelente Atención y Servicio Profesional!! Los Recomiendo"</p>
                    <p className="text-brand-text font-semibold font-outfit text-sm">— Carlos B.</p>
                </div>
                <div className="w-80 bg-white p-6 rounded-xl border border-brand-border flex-shrink-0 shadow-sm">
                    <div className="flex gap-1 text-brand-gold mb-3">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
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
            <img src="assets/logo-user.png" alt="Optivision W&amp;M" className="h-8" />
            <p className="text-brand-muted text-xs font-outfit">© 2026 Optivision W&amp;M. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/optivisionwm/?hl=es" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-gold transition-colors" aria-label="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg></a>
                <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors" aria-label="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg></a>
                <a href="#" className="text-brand-muted hover:text-brand-gold transition-colors" aria-label="TikTok"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path></svg></a>
            </div>
        </div>
    </footer>


    {/* ===========================================================
         JAVASCRIPT — GSAP ScrollTrigger
         =========================================================== */}
    



