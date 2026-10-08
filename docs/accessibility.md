# Accesibilidad

## Implementación

- Idioma `es-CL`, un `h1`, landmarks y enlace «Saltar al contenido».
- Inputs y selects con etiquetas asociadas; iconos decorativos con `alt=""`.
- Tabla semántica con caption, encabezados `scope="col"`, orden comunicado mediante `aria-sort` y botones con nombre accesible.
- Estados identificados con texto; urgencia indicada mediante fecha, plazo y reloj.
- Controles principales de al menos 44 px y foco visible con contorno azul.
- Cambios de resultados anunciados con `role="status"`; error con `role="alert"`; carga con `aria-busy`.
- Diálogos nativos con `dialog.showModal()`: fondo inerte, navegación de foco contenida, cierre con Escape y devolución de foco al control de apertura.
- Tarjetas con datos adicionales identificados mediante `aria-controls` y botones con `aria-expanded`.
- Preferencia de reducción de movimiento respetada.

## Verificación

Las pruebas automatizadas validan reglas de consulta, estructura semántica y contraste de texto, bordes y foco. La comprobación de build valida sintaxis, assets y referencias locales.

La auditoría visual en navegador, axe y la validación con lector de pantalla están pendientes. La implementación no cuenta con certificación WCAG.

## Revisión manual

1. Probar escritorio a 1440, 1366, 1280 y 768 px, con navegación expandida y compacta. Confirmar la fila de filtros, etiquetas legibles y controles completos.
2. Probar móvil a 360 y 320 px y zoom al 200 %. Confirmar tarjetas, lectura completa y ausencia de desplazamiento horizontal en la página.
3. Navegar con Tab y Shift+Tab: enlace de salto, búsqueda, filtros, orden, filtros activos, listado y paginación. Confirmar foco visible y orden lógico.
4. Abrir los filtros móviles. Confirmar foco contenido, cancelación con Escape y devolución de foco. Aplicar y cancelar cambios para comprobar el borrador.
5. Expandir y contraer tarjetas. Confirmar el estado anunciado y la lectura de los datos adicionales.
6. Ordenar la tabla en ambos sentidos. Confirmar `aria-sort` y continuidad del foco.
7. Revisar `?estado=carga`, `?estado=vacio` y `?estado=error`. Confirmar indicadores, mensajes, acciones de recuperación y conservación del contexto.
8. Con NVDA/Firefox o VoiceOver/Safari, comprobar encabezados, nombres de controles, anuncios y lectura de tabla y tarjetas.

Referencias: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) y [patrón de diálogo modal APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
