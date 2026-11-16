import { ADDRESS, PAYMENT_METHODS } from './site';

// Preguntas frecuentes. La página las muestra y el prerenderizado las publica
// como datos estructurados FAQPage para Google, desde esta misma lista.
export const FAQS = [
  {
    q: '¿Necesito receta para comprar mis lentes ópticos?',
    a: 'Sí. Trabajamos con tu receta vigente de oftalmólogo u optometrista; en la óptica no realizamos exámenes de la vista. Puedes enviarnos una foto de tu receta por WhatsApp para cotizar.',
  },
  {
    q: '¿Cuánto demoran mis lentes?',
    a: 'Los monofocales están listos en 2 días hábiles y los bifocales y multifocales en 5 días hábiles, contados desde la compra. Los retiras en la tienda.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: `${PAYMENT_METHODS.slice(0, -1).join(', ')} y ${PAYMENT_METHODS.at(-1).toLowerCase()}. Con tarjeta de crédito puedes pagar en cuotas.`,
  },
  {
    q: '¿Me sirve la compra para el reembolso de mi Isapre o seguro?',
    a: 'Sí. Te entregamos la boleta para que solicites el reembolso en tu Isapre o seguro complementario.',
  },
  {
    q: '¿Mis lentes tienen garantía?',
    a: 'Sí. Al momento de la compra te explicamos el plazo y lo que cubre la garantía de tus lentes.',
  },
  {
    q: '¿Puedo cotizar sin ir a la tienda?',
    a: 'Sí. Escríbenos por WhatsApp con una foto de tu receta y te enviamos opciones de cristales y monturas.',
  },
  {
    q: '¿Dónde están y cuál es su horario?',
    a: `Estamos en ${ADDRESS.line1}, Las Condes. Atendemos los lunes de 10:00 a 20:30, de martes a sábado de 10:00 a 20:00 y los domingos de 11:00 a 20:00.`,
  },
];
