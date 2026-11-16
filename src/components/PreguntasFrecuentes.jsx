import { Plus } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { WHATSAPP_QUOTE } from '../site';
import { FAQS } from '../faqs';

export default function PreguntasFrecuentes() {
  return (
    <section id="preguntas" className="faq-section">
      <div className="section-shell faq-layout">
        <div className="faq-intro">
          <SectionHeading eyebrow="Dudas" title="Preguntas" accent="frecuentes" align="left">
            Si no encuentras tu respuesta, escríbenos y te ayudamos.
          </SectionHeading>
          <a className="btn-whatsapp whatsapp-flow reveal" href={WHATSAPP_QUOTE} target="_blank" rel="noopener noreferrer" data-cta="preguntas">
            Preguntar por WhatsApp
          </a>
        </div>
        <div className="faq-list reveal" id="faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                <span>{item.q}</span>
                <Plus size={18} strokeWidth={1.8} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
