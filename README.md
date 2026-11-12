# Bitácoras de Monitoría

Guías paso a paso para los monitores del Laboratorio de Informática.

Cada guía se abre en un visor que sube encima de la página. Ahí se pasa de un paso a otro con las flechas y la captura de cada paso aparece dentro de un computador dibujado. Si un paso es un comando de Cisco, en la pantalla sale una terminal que lo escribe sola. El avance de cada guía queda guardado en el navegador.

**Página publicada:** https://laboratorio-de-informatica.github.io/Bitacoras_manuales/
(funciona cuando GitHub Pages esté activado, ver abajo)

## Cómo agregar o corregir una guía (la forma fácil)

No hace falta saber programar ni instalar nada. Todo se hace desde el navegador.

1. Abre **editor.html** (en la página publicada, el enlace "Agregar o editar una guía" está al final).
2. Escoge una guía para corregirla o "Crear una guía nueva", y llena el formulario. A la derecha vas viendo cómo queda cada paso dentro del computador.
3. Si agregaste fotos nuevas, súbelas a la carpeta `img` del repositorio con el enlace "Abrir carpeta img en GitHub" (arrastras los archivos y le das **Commit changes**). El editor te dice exactamente qué fotos faltan por subir.
4. Dale al botón verde **Copiar data.js completo**.
5. Abre `js/data.js` en GitHub con el enlace "Abrir data.js en GitHub", borra todo (`Ctrl + A` y `Supr`), pega (`Ctrl + V`) y dale **Commit changes**.
6. Espera uno o dos minutos y recarga la página publicada. Ya sale el cambio para todos.

Lo que vas escribiendo se queda guardado como borrador en tu navegador, así que si cierras la pestaña no se pierde.

Para dar formato al texto en el editor:

| Escribes | Sale |
| --- | --- |
| `**Restart Now**` | negrita |
| `` `C:\Isos` `` | texto de código |
| `[[Ctrl+C]]` | teclas |
| `{This PC > Properties}` | ruta de menús |
| `_texto_` | cursiva |
| `[otra guía](#router-fabrica)` | enlace a otra guía |

## Cómo abrir la página

**Para todos, con el enlace:** https://laboratorio-de-informatica.github.io/Bitacoras_manuales/

**En tu computador, sin internet:** descarga el repositorio (botón verde **Code** y luego **Download ZIP**), descomprímelo y dale doble clic a `index.html`. Funciona completa. Sin internet solo cambia la letra, porque las fuentes vienen de Google Fonts.

**Para editar el código con VS Code:** abre la carpeta, instala la extensión **Live Server**, dale clic derecho a `index.html` y escoge **Open with Live Server**. La página se recarga sola cada vez que guardas.

## Activar GitHub Pages (se hace una sola vez)

1. En el repositorio entra a **Settings** y luego a **Pages**.
2. En **Source** escoge **Deploy from a branch**.
3. En **Branch** escoge `main` y la carpeta `/ (root)`. Dale **Save**.
4. Espera uno o dos minutos y recarga. Arriba sale el enlace.

Desde ese momento, cada cambio que llegue a `main`, sea desde el editor, desde GitHub o con `git push`, se publica solo en uno o dos minutos.

En un repositorio privado de una organización, GitHub Pages solo funciona si la organización tiene plan GitHub Team o Enterprise (o el beneficio de GitHub Education para organizaciones). Si no aparece la opción, la salida más sencilla es dejar el repositorio público. Las guías no tienen contraseñas, solo nombres de usuario como admin y rescate.

## Qué hay en cada carpeta

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La página de las bitácoras |
| `editor.html` | El editor visual de guías |
| `css/styles.css` | Colores, temas claro y oscuro, y el computador dibujado |
| `css/editor.css` | Estilos del editor |
| `js/data.js` | **El contenido de todas las guías** |
| `js/app.js` | La lógica de la página: visor, flechas, búsqueda, tema y progreso |
| `js/editor.js` | La lógica del editor |
| `img/` | Las capturas de cada paso |

## Editar data.js a mano (para quien prefiera)

También se puede editar `js/data.js` directamente. Cada guía tiene `id`, `grupo`, `titulo`, `resumen`, `portada`, `necesitas`, `pasos`, `ojo` y `pendientes`. Así se ve un paso:

```js
{ h: "Reinicia el router", p: "Si pregunta <code>Save?</code>, responde <b>no</b>.", cmd: "reload", img: "img/r_7.jpg",
  nota: "Un consejo que sale en un recuadro amarillo." }
```

`h` es el título, `p` la explicación, `img` la captura, `cmd` el comando para copiar y `nota` un consejo. Solo `h` es obligatorio. Si un grupo es nuevo, se agrega en `GRUPOS`.

Cada guía tiene su propio enlace. Por ejemplo, `index.html#router-fabrica` abre directo la guía del router.
