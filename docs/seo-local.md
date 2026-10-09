# SEO local de Optivision W&M

La URL canónica actual es https://optivisionwm.vercel.app/. Si se conecta un dominio propio, actualizar las referencias absolutas del index.html, robots.txt, sitemap.xml y las comprobaciones SEO; redirigir la dirección anterior al dominio elegido.

## Preparación del sitio

- Título y descripción orientados a óptica en Apumanque, Las Condes.
- Idioma es-CL, URL canónica y metadatos para compartir.
- Datos estructurados Optician con ubicación, teléfono, horarios e Instagram ya publicados en la página. No se añadieron calificaciones, reseñas, coordenadas ni precios no verificados.
- Contenido React prerenderizado en el HTML durante el build; el navegador hidrata el mismo árbol. Sin servicios de render externos ni Chromium en el proceso de publicación.
- robots.txt y sitemap.xml; no se incluyen anclas como páginas independientes.
- Preview del modelo 3D marcado noindex; /index.html redirige a / mediante Vercel.
- Etiqueta de verificación de Search Console para la propiedad de prefijo URL. Conservarla mientras se use esa cuenta.

## Verificación

Ejecutar `npm run build` y después `npm run seo:verify`. El segundo comando comprueba el HTML de distribución, la identidad comercial, el contenido sin JavaScript, los datos estructurados y los archivos de rastreo. Comprobar también la navegación y la consola del navegador después de cambios en la hidratación.

El lint global tiene errores anteriores en src/original.jsx (archivo antiguo fuera de la entrada actual); el lint de los archivos de este cambio está limpio. No atribuir una aprobación global de lint al proyecto.

## Operación en Google

Después de publicar: verificar propiedad en Search Console, enviar sitemap.xml e inspeccionar la URL principal para solicitar indexación. Registrar el estado devuelto por Google sin confundir solicitud enviada con URL indexada.

En Perfil de Empresa: mantener el nombre real, categoría Óptica si corresponde, dirección/local/piso, horarios, teléfono y enlace web coherentes; completar productos reales y fotografías propias; solicitar reseñas auténticas sin incentivos. Confirmar la ficha correcta antes de editar.

Medir consultas de búsqueda, impresiones, clics y acciones del perfil; vincular consultas de WhatsApp con ventas en el registro comercial. Un resultado de pruebas técnicas no acredita una mejora de posiciones ni ventas.

## Referencias oficiales

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/business/answer/7091
