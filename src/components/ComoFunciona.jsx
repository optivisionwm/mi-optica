import { CreditCard, FileText, Glasses, PackageCheck, Receipt, ScanEye } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { PAYMENT_METHODS, WHATSAPP_QUOTE } from '../site';

const STEPS = [
  {
    icon: FileText,
    title: 'Trae tu receta',
    text: 'Llega con tu receta vigente de oftalmólogo u optometrista, o envíanos una foto por WhatsApp para cotizar.',
  },
  {
    icon: Glasses,
    title: 'Elige tu montura',
    text: 'Te asesoramos según tu rostro, tu estilo y tu presupuesto.',
  },
  {
    icon: ScanEye,
    title: 'Elige tus cristales',
    text: 'Monofocales, bifocales o multifocales HOYA y Optiland, con los tratamientos que necesites.',
  },
  {
    icon: PackageCheck,
    title: 'Retira tus lentes',
    text: 'Monofocales en 2 días hábiles; bifocales y multifocales en 5. Los retiras en la tienda.',
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="steps-section">
      <div className="section-shell">
        <SectionHeading eyebrow="Paso a paso" title="Cómo" accent="funciona" />

        <ol className="steps-grid reveal" id="steps-grid">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="step-card">
                <span className="step-card__num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="step-card__icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            );
          })}
        </ol>

        <div className="steps-extras reveal" id="steps-extras">
          <div className="steps-extra">
            <CreditCard size={20} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <p className="steps-extra__title">Medios de pago</p>
              <ul className="pay-chips">
                {PAYMENT_METHODS.map((method) => <li key={method}>{method}</li>)}
              </ul>
            </div>
          </div>
          <div className="steps-extra">
            <Receipt size={20} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <p className="steps-extra__title">Reembolso</p>
              <p className="steps-extra__text">Te entregamos la boleta para que solicites el reembolso en tu Isapre o seguro complementario.</p>
            </div>
          </div>
          <a className="btn-whatsapp whatsapp-flow steps-cta" href={WHATSAPP_QUOTE} target="_blank" rel="noopener noreferrer" data-cta="como-funciona">
            Cotizar con mi receta
          </a>
        </div>
      </div>
    </section>
  );
}
