// Datos del negocio compartidos por las secciones. Cambiar aquí actualiza toda la página.

export const assetUrl = (path) => `${import.meta.env.BASE_URL}assets/${path}`;

export const WHATSAPP_NUMBER = '56992803368';
export const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
export const WHATSAPP_QUOTE = waLink('Hola, quiero cotizar mi receta óptica.');

export const PHONE_DISPLAY = '+56 9 9280 3368';
export const PHONE_TEL = 'tel:+56992803368';
export const INSTAGRAM_URL = 'https://www.instagram.com/optivisionwm/?hl=es';
export const MAPS_URL = 'https://www.google.com/maps/place/OptivisionW%26M/data=!4m2!3m1!1s0x0:0x4dc94297887a9b9b';
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=5605084429836524443';
export const GOOGLE_RATING = { score: '5,0', count: 11 };

export const ADDRESS = { line1: 'Mall Apumanque, local 132, piso 2', line2: 'Las Condes, Santiago' };

// Días: 0 = domingo … 6 = sábado. Horas en formato 24 h (hora de Chile).
export const HOURS = [
  { label: 'Lunes', days: [1], open: '10:00', close: '20:30' },
  { label: 'Martes a sábado', days: [2, 3, 4, 5, 6], open: '10:00', close: '20:00' },
  { label: 'Domingo', days: [0], open: '11:00', close: '20:00' },
];

export const PAYMENT_METHODS = ['Efectivo', 'Débito y crédito', 'Cuotas', 'Transferencia'];

// ¿Está abierta la óptica ahora? Se calcula en hora de Chile.
export function storeStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const toMinutes = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const today = HOURS.find((row) => row.days.includes(day));
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, text: `Abierto ahora · cierra a las ${today.close}` };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { open: false, text: `Cerrado · abre hoy a las ${today.open}` };
  }
  const tomorrow = HOURS.find((row) => row.days.includes((day + 1) % 7));
  return { open: false, text: `Cerrado · abre mañana a las ${tomorrow.open}` };
}
