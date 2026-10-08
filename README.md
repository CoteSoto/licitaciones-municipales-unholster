# Licitaciones públicas municipales · Unholster

Vista de consulta para que un analista encuentre y monitoree licitaciones municipales. Implementa la propuesta UX/UI de la prueba técnica con datos ficticios, filtros simples, cuatro indicadores, orden, paginación y lectura móvil.

## Enlaces de la entrega

- [Vista en GitHub Pages](https://cotesoto.github.io/licitaciones-municipales-unholster/). Vista publicada; se actualiza automáticamente al guardar cambios en `main`.
- [Propuesta de escritorio](https://www.figma.com/design/cwY0sXUDRVNIPXU4piUcUE?node-id=16-24).
- [Propuesta móvil de 360 px](https://www.figma.com/design/cwY0sXUDRVNIPXU4piUcUE?node-id=16-25).
- [Roadmap del DS, etapa 1](https://www.figma.com/design/cwY0sXUDRVNIPXU4piUcUE?node-id=7-17).
- [Reglas del MVP](https://www.figma.com/design/cwY0sXUDRVNIPXU4piUcUE?node-id=21-90).
- [Copia del DS de referencia](https://www.figma.com/design/aZ1CwbpxxWbsPSuBXBal19?node-id=1623-855).

## Cómo levantarla

Requisito: **Node.js 20 o superior**. No requiere instalar dependencias ni configurar claves. Desde la carpeta del proyecto:

```sh
npm run dev
```

Abrir **http://localhost:4173**. `PORT=3000 npm run dev` permite cambiar el puerto en macOS/Linux; en PowerShell: `$env:PORT=3000; npm run dev`.

```sh
npm test
npm run build
```

`build` verifica sintaxis, assets y referencias locales. La carpeta `dist/` ya contiene la aplicación estática; no necesita compilación. Puede alojarse en un proveedor estático con directorio de publicación **dist**. No abrir `index.html` mediante `file://`: los módulos JavaScript necesitan un servidor HTTP.

## Cómo modificar la vista

La interfaz usa **HTML, CSS y JavaScript**. Su HTML está en [dist/index.html](dist/index.html); la carpeta `dist` contiene los archivos que publica GitHub Pages. `package.json` configura los comandos del proyecto y no define la pantalla.

| Quiero modificar… | Archivo |
| --- | --- |
| Título, descripción, etiquetas y textos fijos | [dist/index.html](dist/index.html) |
| Colores, tamaños, espacios y radios | [dist/tokens.css](dist/tokens.css) |
| Distribución y comportamiento responsive | [dist/styles.css](dist/styles.css) |
| Textos de indicadores, encabezados, tabla y tarjetas generadas | [dist/app.js](dist/app.js) |
| Datos ficticios de las licitaciones | [dist/data.js](dist/data.js) |

La [guía de edición con ejemplos](docs/editar-la-vista.md) explica qué buscar, qué conservar y cómo guardar un cambio desde GitHub para que Pages lo publique. El HTML y el CSS están organizados por bloques legibles.

## Cómo revisar los estados

Los parámetros funcionan tanto localmente como en la vista alojada. El estado forzado se mantiene hasta usar la acción de recuperación o volver a la vista normal; no depende de provocar un fallo real.

| URL local | Qué permite revisar |
| --- | --- |
| `http://localhost:4173/` | Vista inicial: todos los estados y publicación reciente primero |
| `http://localhost:4173/?estado=carga` | Esqueletos y cuatro indicadores «—»; «Ver resultados» termina el ejemplo |
| `http://localhost:4173/?estado=vacio` | Mensaje sin resultados y cuatro ceros; limpiar recupera el listado |
| `http://localhost:4173/?estado=error` | Error y reintento; conserva filtros y orden |
| `http://localhost:4173/?estado=error&region=La+Araucan%C3%ADa` | Recuperación del error con contexto aplicado |
| `http://localhost:4173/?q=biblioteca` | Vacío producido por una búsqueda real sobre los fixtures |
| `http://localhost:4173/?pagina=2` | Segunda página con un registro adjudicado |

`estado` controla **la revisión visual**. `situacion` filtra **el estado de la licitación**: por ejemplo `?situacion=Publicada`. Se mantienen separados para evitar ambigüedad. La URL conserva además `q`, `region`, `desde`, `hasta`, `orden`, `direccion` y `pagina`. El botón Atrás respeta los cambios de página. Los valores de URL se validan y el texto se escapa antes de renderizarse.

## Decisiones de diseño

### Objetivo y lectura

El enfoque principal es monitorear la actividad de compra de los municipios. La vista inicial muestra todos los estados y ordena por publicación más reciente. La fecha de cierre sigue disponible para ordenar y detectar plazos próximos.

Se tomó GRC como referencia del lenguaje de producto: navegación lateral, jerarquía sobria y tabla de datos. La selección por checkbox no se incluyó porque este MVP se centra en consulta, sin una acción colectiva definida.

### Seis columnas para ocho campos

Nombre y código se agrupan en **Licitación**; municipio y región en **Municipalidad**. Estado, monto estimado, fecha de cierre y ofertas tienen columnas propias. Esta agrupación deja más espacio a nombres largos sin eliminar información. Los encabezados permiten ordenar; un selector comunica el criterio completo, incluida publicación, que no tiene columna propia.

### Cuatro indicadores útiles

Se calculan sobre **todos los resultados filtrados, antes de paginar**:

| Indicador | Regla |
| --- | --- |
| Licitaciones encontradas | Cantidad de registros que coinciden con los filtros |
| Municipalidades representadas | Compradores municipales distintos |
| Publicadas últimos 7 días | Fecha de publicación entre hoy y seis días anteriores, ambos incluidos; no equivale al estado «Publicada» |
| Cierran próximos 7 días | Estado «Publicada» y cierre a 0–7 días de la referencia, incluidos |

Los cierres de hoy/mañana añaden una señal con reloj y texto. El monto estimado se mantiene por licitación: sumarlo en el encabezado no representa gasto ejecutado y no era necesario para esta tarea.

### Filtros y estados

- Búsqueda por nombre, código y municipalidad, sin distinguir tildes o mayúsculas.
- Región y estado con selección única; rango inclusivo de publicación. Las condiciones se aplican con AND.
- Chips removibles muestran cada filtro activo. La limpieza conserva el orden y vuelve a página 1; cualquier cambio de filtro u orden vuelve a página 1.
- Desde no puede superar hasta: se informa el error y se impide aplicar el rango.
- Publicada: azul. Cerrada: gris. Adjudicada: verde. Desierta: naranja de advertencia. Cada badge incluye texto.
- Carga/error usan «—» en los indicadores, sin cifras anteriores; vacío usa cero. Los estados sin datos no muestran paginación.

### Responsive

Por debajo de **768 px**, la tabla pasa a una lista de tarjetas. A **360 px**, nombre, código, municipio, estado, monto y cierre quedan visibles; región, ofertas y publicación se consultan mediante «Ver más datos».

Los filtros pasan a un **panel inferior modal** con borrador: aplicar confirma los cambios, cerrar/Escape los cancela. El orden permanece fuera del panel para consultarlo directamente. El menú móvil sustituye a la sidebar; en escritorio esta puede compactarse.

## Stack y organización

HTML semántico, CSS con variables y JavaScript en módulos ES. Se eligió una aplicación estática porque los datos son ficticios y la consulta es local: no necesita backend, autenticación ni un framework para resolver el alcance. Node se usa para el servidor de desarrollo y las verificaciones.

| Ruta | Responsabilidad |
| --- | --- |
| `dist/index.html` | Estructura semántica, controles y diálogos |
| `dist/app.js` | Componentes de presentación, eventos, URL y recuperación |
| `dist/model.js` | Filtrado, orden, indicadores, fechas y paginación |
| `dist/data.js` | Once registros ficticios y fecha de referencia |
| `dist/tokens.css` | Valores del DS y extensiones semánticas de la vista |
| `dist/styles.css` | Layout, estados de componentes y responsive |
| `dist/assets/` | SVG originales de Figma y Hanken Grotesk local con licencia OFL |
| `tests/` | Reglas de negocio, URL, estructura y contraste |
| `docs/design-system.md` | Equivalencias y ajustes respecto del DS |
| `docs/accessibility.md` | Repaso y recorrido de revisión manual |

## Supuestos y límites

- Los once registros son ficticios: ocho casos publicados y tres adicionales para mostrar Cerrada, Desierta y Adjudicada y habilitar página 2.
- La referencia de la demostración queda fija en **08-10-2026** para reproducir las cifras de Figma: **11 / 9 / 5 / 6**. Filtrando La Araucanía: **2 / 1 / 0 / 1**.
- Las fechas son días de calendario, sin hora. En una integración real, «hoy» debe obtenerse en `America/Santiago`; la fuente debe aportar zona horaria si el cierre incluye hora. No se debe mover automáticamente el reloj de estos fixtures porque dejarían de coincidir con la propuesta.
- Cada registro tiene fecha de publicación adicional a los ocho campos solicitados para permitir filtro, orden e indicador de actividad reciente.
- Diez registros por página. Montos en CLP sin decimales. Empates de orden se resuelven por código; datos ausentes quedarían al final.
- Carga y error son estados de demostración sobre una fuente local. «Reintentar» simula una recarga breve y recupera los fixtures; no llama a una API real.
- Multiselección, filtros en encabezados, consultas guardadas, exportación y comparación de municipios quedan fuera de este MVP.

## Design System y accesibilidad

Los estilos consumen tokens centralizados y documentados. No existía un paquete de código del DS para importar: botones, badges y métricas son adaptaciones locales de las piezas de Figma. Las diferencias necesarias para controles reales y contraste se explican en [equivalencias del DS](docs/design-system.md).

Se implementaron etiquetas, foco visible, navegación nativa por teclado, tabla semántica, mensajes de estado y diálogos con cierre y devolución de foco. Las pruebas verifican contraste de texto ≥4.5:1 y de bordes/foco ≥3:1. **Nueve pruebas y la verificación de build aprobadas.**

No se ejecutó en esta sesión una auditoría de navegador ni de lector de pantalla. El [repaso de accesibilidad](docs/accessibility.md) distingue lo comprobado en código del recorrido manual pendiente, incluida la validación visual a 360 px. No se afirma certificación WCAG.

## Uso de IA

Se utilizó **ChatGPT/Codex** para apoyar la definición de reglas, contrastar el alcance, traducir la propuesta de Figma a código, generar fixtures adicionales, redactar documentación y preparar pruebas. El conector de Figma aportó contexto de diseño, variables y exportaciones de assets; **Sites** se utilizó para alojar la vista de revisión.

Las decisiones se iteraron con el criterio de la persona candidata. La automatización no reemplaza la revisión final del diseño ni la validación manual de accesibilidad: sus límites están indicados arriba. El código de referencia obtenido de Figma se adaptó a HTML/CSS/JS y a controles semánticos; no se usó como una imagen de la interfaz. GitHub Pages es el destino de alojamiento de la entrega.

## Entrega en GitHub

El repositorio puede mantenerse privado, dando acceso al equipo evaluador. Al configurarlo, incluir el proyecto completo, `README.md` y la carpeta `dist/`; no subir credenciales, `.env` ni `node_modules`.

La carpeta `.github/workflows/` ejecuta las pruebas y la verificación de build en push/PR. El workflow `pages.yml` publica exclusivamente `dist/` en GitHub Pages después de aprobar ambas verificaciones; se ejecuta con cada push a `main` o manualmente desde Actions.

### Activación inicial de GitHub Pages

1. En el repositorio, abrir **Settings → Pages**.
2. En **Build and deployment → Source**, seleccionar **GitHub Actions**.
3. En **Actions → Publicar en GitHub Pages**, ejecutar **Run workflow** sobre `main`. Si el primer intento ocurrió antes de activar Pages, usar **Re-run failed jobs**.
4. Esperar que el trabajo `deploy` finalice correctamente y abrir la dirección mostrada por el entorno `github-pages`.

GitHub Pages admite repositorios privados con GitHub Pro, Team o Enterprise; en GitHub Free requiere un repositorio público. [Disponibilidad y configuración oficial](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). La visibilidad del código y la del sitio son independientes: antes de cambiar la visibilidad del repositorio, decidir cómo se compartirá con el equipo evaluador.

Las rutas de scripts, estilos y assets son relativas para funcionar bajo `/licitaciones-municipales-unholster/`. Los parámetros de revisión siguen funcionando, por ejemplo `https://cotesoto.github.io/licitaciones-municipales-unholster/?estado=error`.
