import { MapPin } from 'lucide-react';
import { MAPS_URL, assetUrl } from '../site';

// Franja breve de marcas: los modelos cambian constantemente y se eligen en tienda,
// así que no se muestra un catálogo.
const BRANDS = [
  { name: 'Ray-Ban', src: 'brand-rayban.png', padded: true },
  { name: 'Vogue', src: 'brand-vogue.png' },
  { name: 'Karün', src: 'brand-karun.png' },
  { name: 'Saturday', src: 'brand-saturday.png' },
  { name: 'Veltom', src: 'brand-veltom.png', padded: true },
];

export default function Coleccion() {
  return (
    <section id="marcas" className="brands-band" aria-labelledby="marcas-title">
      <div className="brands-band__inner reveal">
        <div className="brands-band__copy">
          <h2 id="marcas-title">Modelos que se renuevan siempre</h2>
          <p>
            Nuestras monturas cambian constantemente. Ven a probártelas en la tienda y te ayudamos a elegir.
          </p>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="brands-band__link">
            <MapPin size={15} aria-hidden="true" />Mall Apumanque · Local 132, piso 2
          </a>
        </div>
        <ul className="brands-band__logos" aria-label="Marcas que trabajamos">
          {BRANDS.map((brand) => (
            <li key={brand.name}>
              <img src={assetUrl(brand.src)} alt={brand.name} loading="lazy" className={brand.padded ? 'is-padded' : undefined} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
