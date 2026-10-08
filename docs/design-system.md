# Equivalencias Figma → código

Fuente: [DS Base seisvente](https://www.figma.com/design/aZ1CwbpxxWbsPSuBXBal19?node-id=1623-855) y [piezas locales de la entrega](https://www.figma.com/design/cwY0sXUDRVNIPXU4piUcUE?node-id=17-28). No había un paquete de componentes consumible; se implementaron adaptaciones locales. Los valores están centralizados en `dist/tokens.css`; `styles.css` los consume.

| Figma | Código | Criterio |
| --- | --- | --- |
| Background/Color-Background-Primary | `--background-color-background-primary` | Fondo principal |
| Text/Color-Text-Primary y Secondary | `--text-color-text-primary`, `--text-color-text-secondary` | Jerarquía y texto legible |
| Border/Color-Border-Primary | `--border-color-border-primary` | Divisores y contenedores |
| Size/2XS, XS, S, M, L | `--size-2xs`, `--size-xs`, `--size-s`, `--size-m`, `--size-l` | Espaciado 4, 8, 16, 24, 32 |
| Borders/S, M, L | `--borders-s`, `--borders-m`, `--borders-l` | Radios 4, 6, 8 |
| Hanken Grotesk y estilos de texto | `--font-family`, variables de tamaño, peso e interlineado | Fuentes locales 400, 500, 600 |
| Button / Licitaciones | `.btn`, `.primary`, `.ghost` | Controles nativos con altura mínima 44 |
| Badge / Estado licitación | `.badge.publicada`, `.cerrada`, `.adjudicada`, `.desierta` | Color acompañado de etiqueta |
| Metric / Licitaciones | `.metric` | Cuatro indicadores calculados antes de paginar |
| Metric / Cierres próximos | `.metric.closing` | Reloj y señal de plazo; no representa un error |

## Ajustes para código y accesibilidad

- El borde de inputs/selects usa `--control-border`, alias de gris neutral DS. El divisor claro de Figma no alcanza 3:1 sobre blanco para identificar un control.
- Adjudicada conserva fondo/borde verde DS y usa texto primario oscuro. Esto asegura contraste del texto sin depender del color para comunicar el estado.
- Desierta usa el mismo naranja rojizo en texto y borde: `--status-desierta-foreground` (`#b8441a`) sobre el fondo de advertencia DS (`#fcf6f4`). El tono original del borde (`#c74e1e`) da 4.33:1 al usarlo como texto sobre ese fondo; el ajuste local alcanza 5.06:1. El token de advertencia general se conserva.
- El foco usa Brand/700 y contorno visible. Hover, disabled y foco se definen por separado.
- Los chips conservan centrado vertical y gap XS; frente a «Limpiar filtros» se distribuyen con `justify-content: space-between`. A 360 px pueden envolver sin perder acciones.
- La geometría propia de la vista —sidebar, controles, tarjetas, modal— queda en tokens de aplicación. Los breakpoints y proporciones de columna son reglas de layout.
- El rango de fechas pasa de un campo ilustrativo a dos inputs de fecha reales. Las etiquetas «Publicación desde» y «Publicación hasta» son visibles. Cada fecha tiene una base de 180 px y el grupo ocupa al menos 368 px; los filtros envuelven a otra fila según el espacio disponible, incluida la sidebar expandida o compacta. Se usa el calendario nativo sin superponer un segundo icono. Los encabezados pasan a botones de orden; los filtros móviles se implementan como diálogo inferior.
- Todos los SVG proceden de exportaciones de las capas originales de la entrega. Se alojan en `dist/assets`, sin URLs temporales ni redibujado.

Estas adaptaciones se documentan como candidatos para contrastar con el DS. El archivo fuente del DS no fue modificado.
