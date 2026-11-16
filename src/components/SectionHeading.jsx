import WaveTitle from './WaveTitle';

// Encabezado común de sección: línea dorada + etiqueta + título de dos tonos.
export default function SectionHeading({ id, eyebrow, title, accent, align = 'center', children }) {
  return (
    <div id={id} className={`section-heading section-heading--${align} reveal`}>
      <div className="section-eyebrow">
        <span className="divider" aria-hidden="true" />
        <span>{eyebrow}</span>
        {align === 'center' && <span className="divider" aria-hidden="true" />}
      </div>
      <h2 className="section-title font-outfit font-bold text-brand-text">
        <WaveTitle text={`${title} `} />
        <WaveTitle text={accent} className="text-brand-gold" delayOffset={title.length + 1} />
      </h2>
      {children && <p className="section-lead">{children}</p>}
    </div>
  );
}
