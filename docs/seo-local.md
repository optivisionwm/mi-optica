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

Estado comprobado el 9 de octubre de 2026:

- Propiedad de prefijo URL verificada en Search Console con la etiqueta HTML.
- Pruebas en vivo de la página principal y de sitemap.xml: rastreo permitido, descarga exitosa e indexación permitida. La página principal declara la URL canónica correcta.
- El informe del índice aún indica que la página principal no está en Google y que la URL es desconocida. No se ha acreditado indexación ni posiciones de búsqueda.
- Sitemap enviado y reenviado una vez después de comprobar su lectura en vivo. El informe de Sitemaps mantiene `Couldn't fetch`; no hay bloqueo en robots.txt, los archivos públicos responden 200 y el informe de acciones manuales no detecta problemas. Falta comprobar el próximo procesamiento de Google; no se identificó una causa específica dentro del sitio.
- La solicitud manual de indexación devolvió `Quota Exceeded` y Google pide reintentar al día siguiente. La solicitud no fue aceptada.
- En el Perfil de Empresa se guardaron el sitio web, WhatsApp, una descripción específica de ubicación y servicios, y Santiago como única área de servicio, según confirmación del propietario.
- El propietario confirmó cierre del lunes a las 20:30. La página visible y los datos estructurados se ajustaron a ese horario; martes a sábado mantienen 10:00–20:00 y domingo 11:00–20:00.
- La web enlaza ahora a la ficha exacta de la óptica en Maps.
- Google exige volver a verificar el Perfil de Empresa mediante video. Las ediciones guardadas no están confirmadas como públicas hasta completar ese requisito. El flujo ofrece grabación continua en el local: entorno y dirección, cartel permanente con el nombre y acceso que demuestre administración. No se grabó ni envió un video.

Después de cambios: inspeccionar la URL principal y registrar el estado devuelto por Google sin confundir solicitud enviada con URL indexada. Conservar la etiqueta HTML de verificación.

En Perfil de Empresa: mantener el nombre real, categoría Óptica si corresponde, dirección/local/piso, horarios, teléfono y enlace web coherentes; completar productos reales y fotografías propias; solicitar reseñas auténticas sin incentivos. Confirmar la ficha correcta antes de editar.

Medir consultas de búsqueda, impresiones, clics y acciones del perfil; vincular consultas de WhatsApp con ventas en el registro comercial. Un resultado de pruebas técnicas no acredita una mejora de posiciones ni ventas.

## Referencias oficiales

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/business/answer/7091
