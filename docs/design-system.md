# Design System

La interfaz utiliza como referencia el [DS Base seisvente](https://www.figma.com/design/aZ1CwbpxxWbsPSuBXBal19?node-id=1623-855) y los [componentes de la propuesta](https://www.figma.com/design/cwY0sXUDRVNIPXU4piUcUE?node-id=17-28). La aplicación implementa componentes locales en HTML y CSS; el DS de referencia no dispone de un paquete de código consumible.

## Fundamentos

Los valores de diseño están centralizados en `dist/tokens.css`. `dist/styles.css` consume estos tokens para definir componentes y distribución.

| Referencia | Token de código | Uso |
| --- | --- | --- |
| Background/Color-Background-Primary | `--background-color-background-primary` | Fondo principal |
| Text/Color-Text-Primary y Secondary | `--text-color-text-primary`, `--text-color-text-secondary` | Jerarquía de texto |
| Border/Color-Border-Primary | `--border-color-border-primary` | Divisores y contenedores |
| Size/2XS, XS, S, M, L | `--size-2xs`, `--size-xs`, `--size-s`, `--size-m`, `--size-l` | Espaciados de 4, 8, 16, 24 y 32 px |
| Borders/S, M, L | `--borders-s`, `--borders-m`, `--borders-l` | Radios de 4, 6 y 8 px |
| Hanken Grotesk | `--font-family` y variables de texto | Fuente local en pesos 400, 500 y 600 |

Los tokens de aplicación incluyen dimensiones de navegación, controles, tarjetas y diálogos. Los breakpoints y las proporciones de las columnas se definen en CSS.

## Componentes

| Componente | Código | Criterio |
| --- | --- | --- |
| Botón | `.btn`, `.primary`, `.ghost` | Control nativo con altura mínima de 44 px y estados de foco, hover y deshabilitado |
| Estado de licitación | `.badge` | Etiqueta de texto acompañada de color |
| Indicador | `.metric` | Valor calculado sobre todos los resultados filtrados |
| Cierres próximos | `.metric.closing` | Reloj y señal de plazo |
| Filtro activo | `.chip` | Texto centrado, separación XS y acción para quitar el filtro |
| Barra de filtros | `.filters` | Una fila en escritorio; búsqueda, región, estado y rango de publicación |
| Filtros móviles | `.bottom-sheet` | Panel inferior modal con aplicación y cancelación del borrador |

## Color y accesibilidad

- Publicada: azul; Cerrada: gris; Adjudicada: verde; Desierta: naranja rojizo. Cada estado incluye su nombre.
- Desierta utiliza `--status-desierta-foreground` para texto y borde sobre el fondo de advertencia; su contraste de texto es 5.06:1.
- Adjudicada utiliza fondo y borde verdes con texto primario oscuro para mantener la legibilidad.
- Los bordes de los controles utilizan `--control-border`, alias del gris neutral. El foco utiliza Brand/700 y un contorno visible.
- Las etiquetas de los campos están asociadas a sus controles. Las fechas utilizan inputs nativos y etiquetas visibles.

Los ajustes de contraste son extensiones locales documentadas en código. El archivo fuente del DS permanece como referencia. Los SVG de la interfaz se exportan desde las capas de la propuesta y se alojan en `dist/assets/`.
