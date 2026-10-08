# Cómo editar esta vista

La pantalla está hecha con HTML, CSS y JavaScript. **No necesitas editar JSON para cambiar la interfaz.** `dist/` es la carpeta que contiene y publica la aplicación; `index.html` es su página de entrada.

## Qué archivo abrir

| Cambio | Archivo | Qué buscar |
| --- | --- | --- |
| Título «Licitaciones» | `dist/index.html` | `<h1>` |
| Descripción introductoria | `dist/index.html` | `desktop-description` y `mobile-description` |
| Texto de una etiqueta | `dist/index.html` | El `<label>` del control |
| Placeholder de búsqueda | `dist/index.html` | `placeholder=` en el input `search` |
| Color de Desierta | `dist/tokens.css` | `--status-desierta-foreground` |
| Espacio entre filtros | `dist/styles.css` | `.filters` y su propiedad `gap` |
| Ancho de cada fecha | `dist/tokens.css` | `--date-control-width` |
| Texto de los cuatro indicadores | `dist/app.js` | La lista `titles` dentro de `metrics()` |
| Encabezados de tabla | `dist/app.js` | La lista `columns` |
| Contenido de un registro ficticio | `dist/data.js` | El código o el nombre de la licitación |

Parte del HTML está escrito en `app.js`, dentro de funciones como `table()` y `cards()`: JavaScript lo completa para cada licitación y lo coloca en la página. Por eso las once filas no están copiadas a mano en `index.html`.

## Ejemplo 1: cambiar el título

En `dist/index.html`, busca este bloque con Ctrl + F:

```html
<h1>Licitaciones</h1>
```

Puedes cambiar el texto entre las etiquetas:

```html
<h1>Licitaciones municipales</h1>
```

Conserva las etiquetas `<h1>` y `</h1>`. Para modificar las descripciones, cambia el texto de los párrafos `desktop-description` y `mobile-description`.

## Ejemplo 2: cambiar una etiqueta

Busca el control por su `for`, por ejemplo:

```html
<label for="from">Publicación desde</label>
```

Edita solamente «Publicación desde». Conserva `for="from"` y el `id="from"` del input: relacionan la etiqueta con el campo y permiten que el filtro funcione. Conviene que los textos de los filtros sean breves para conservar la fila.

## Ejemplo 3: cambiar un color

En `dist/tokens.css`, busca:

```css
--status-desierta-foreground: #b8441a;
```

El valor hexadecimal define el color de texto y borde de Desierta. Su fondo se define en `--status-warning-background`. Si cambias un color, las pruebas comprueban su contraste: conserva al menos 4.5:1 para el texto.

## Ejemplo 4: cambiar un dato ficticio

En `dist/data.js`, cada fila contiene, en este orden:

```text
código, nombre, municipio, región, monto, cierre, ofertas, publicación, estado
```

Busca `2410-38-LE26` para encontrar la licitación de Temuco. Puedes modificar su nombre dentro de las comillas. Mantén las comillas, comas y el orden de los campos. Los montos son números sin `$` ni puntos; las fechas usan `AAAA-MM-DD`. Cambiar datos puede alterar los indicadores y las pruebas que comparan las cifras de la demostración.

## Guardar desde GitHub sin instalar programas

1. Abre el archivo desde el repositorio y pulsa el icono de **lápiz** para editarlo.
2. Haz un cambio pequeño y revisa qué líneas se modificaron. La pestaña Preview muestra el cambio del archivo; la vista de la aplicación se revisa en Pages después del despliegue.
3. Pulsa **Commit changes…** y escribe una descripción, por ejemplo «Cambiar título de la vista».
4. Para una modificación directa de esta entrega, guarda en `main`. Si prefieres revisar antes de publicar, elige una rama nueva y crea un pull request; se publicará al integrarlo en `main`.
5. Abre **Actions → Publicar en GitHub Pages**. Espera que `build` y `deploy` estén en verde.
6. Abre la vista publicada y recarga con **Ctrl + F5**.

[Cómo editar archivos: documentación de GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files).

## Antes de mostrar un cambio

Revisa la fila de filtros con la sidebar expandida y compacta, la versión móvil a 360 px y los ejemplos `?estado=carga`, `?estado=vacio` y `?estado=error`. Las verificaciones automáticas revisan código, estructura y contraste; la distribución requiere comprobarse visualmente.

Si editas en tu computador, ejecuta `npm run dev` y abre `http://localhost:4173`. Después usa `npm test` y `npm run build`. No necesitas instalar paquetes de la aplicación.
