# Repaso de accesibilidad

## Implementado y comprobado en código

- Idioma `es-CL`, un `h1`, landmarks y enlace «Saltar al contenido».
- Inputs y selects con etiquetas asociadas. Iconos decorativos con `alt=""`.
- Tabla semántica, caption, encabezados `scope="col"`, orden comunicado mediante `aria-sort` y botones con nombre accesible.
- Estados con texto; urgencia con fecha, plazo y reloj. El color no es la única señal.
- Controles principales de al menos 44 px y foco visible con contorno azul.
- Cambios de resultados anunciados con `role="status"`; error con `role="alert"`; carga con `aria-busy`.
- Filtros inferiores y menú con `dialog.showModal()`: fondo inerte, foco contenido por el navegador, cierre con Escape y devolución de foco al control de apertura. Cancelar filtros no aplica el borrador.
- Tarjetas con datos adicionales identificados y botones con `aria-expanded` / `aria-controls`.
- No hay animaciones necesarias para comprender los estados. Se respeta reducción de movimiento.
- Texto, estados, bordes de control y foco comprobados con pruebas de contraste.

## Límite de verificación de esta entrega

Pasaron las pruebas de reglas, estructura y contraste y la comprobación de sintaxis y assets. No se ejecutó una auditoría en navegador, axe ni pruebas con lector de pantalla en esta sesión. Esto no constituye una certificación WCAG. Las siguientes comprobaciones deben hacerse antes de la entrega final al equipo.

## Recorrido manual

1. Abrir a 1440 px y a **360 px**. Revisar también 1280 y 1366 px con sidebar expandida/compacta: los campos «Publicación desde» y «Publicación hasta» deben conservar texto y controles completos al envolver a otra fila. Confirmar tarjetas en móvil, ausencia de desplazamiento horizontal y textos completos. Revisar también zoom 200 % y viewport 320 px.
2. Navegar con Tab/Shift+Tab desde el enlace de salto: búsqueda → filtros/orden → chips → listado → paginación. Confirmar foco visible y orden lógico.
3. En móvil, abrir «Filtros». Verificar que el panel nace abajo, Tab permanece dentro, Escape cancela y el foco vuelve al botón. Cambiar una región y aplicar; volver a abrir y cancelar otra selección.
4. Expandir y contraer varias tarjetas. Confirmar el anuncio del estado y que los datos aparecen en lectura.
5. En la tabla, ordenar cierre en ambos sentidos; comprobar `aria-sort` y foco después del cambio.
6. Abrir `?estado=carga`, `?estado=vacio` y `?estado=error`. Comprobar que no aparecen cifras anteriores, que vacío muestra cuatro ceros y que reintentar conserva filtros/orden.
7. Con NVDA/Firefox o VoiceOver/Safari, comprobar encabezados, nombres de control, anuncios y contexto de tabla/tarjetas.

Referencias para esta implementación: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) y [patrón de diálogo modal APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
