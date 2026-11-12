# Bitácoras de Monitoría

Guías paso a paso para los monitores del laboratorio. La idea es que el monitor que llegue después no tenga que adivinar cómo se hace cada cosa.

Cada guía se abre en un visor que sube encima de la página. Ahí se pasa de un paso a otro con las flechas y la captura de cada paso aparece dentro de un computador dibujado. Si un paso es un comando de Cisco, en la pantalla sale una terminal que lo escribe sola. El avance de cada guía queda guardado en el navegador.

## Cómo abrir la página

### Opción 1: en tu computador, sin instalar nada

Abre la carpeta y dale doble clic a `index.html`. Se abre en el navegador y funciona completa.

Si no hay internet, la página funciona igual pero con otra letra, porque las fuentes se descargan de Google Fonts.

### Opción 2: con Live Server en VS Code (para editar)

Si vas a cambiar cosas, esta opción recarga la página sola cada vez que guardas.

1. Abre la carpeta en VS Code.
2. Instala la extensión **Live Server**.
3. Dale clic derecho a `index.html` y escoge **Open with Live Server**.

### Opción 3: publicada en internet con GitHub Pages

Así cualquier monitor la abre con un enlace, sin descargar nada.

1. Sube el proyecto al repositorio (ver la sección de abajo).
2. En GitHub, entra al repositorio y ve a **Settings**, luego a **Pages**.
3. En **Source** escoge **Deploy from a branch**.
4. En **Branch** escoge `main` y la carpeta `/ (root)`. Dale **Save**.
5. Espera uno o dos minutos y recarga. Arriba sale el enlace, que queda así:
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

Cada vez que hagas `push` a `main`, la página publicada se actualiza sola en uno o dos minutos.

Ojo: si el repositorio es privado, GitHub Pages solo funciona con algunos planes de pago o con GitHub Education. Con un repositorio público funciona gratis.

## Cómo subirlo al repositorio

Lo importante es que `index.html` quede en la raíz del repositorio, no dentro de otra carpeta. Si no, GitHub Pages no lo encuentra.

Copia **el contenido** de esta carpeta (no la carpeta) dentro de la carpeta de tu repositorio clonado, para que quede así:

```
tu-repo/
├── index.html
├── README.md
├── css/
├── js/
└── img/
```

Después, desde una terminal en la carpeta del repositorio:

```bash
git add .
git commit -m "Agrega la página de bitácoras"
git push origin main
```

Si tu rama principal se llama `master`, cambia `main` por `master`.

## Qué hay en cada carpeta

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La estructura de la página |
| `css/styles.css` | Colores, tamaños y el computador dibujado |
| `js/data.js` | **El contenido de todas las guías.** Es el archivo que más vas a tocar |
| `js/app.js` | La lógica: el visor, las flechas, la búsqueda y el progreso |
| `img/` | Las capturas de cada paso |

## Cómo agregar o corregir una guía

Todo el contenido está en `js/data.js`. No hace falta tocar el HTML ni el CSS.

1. Guarda las capturas en `img/`. Ponles un nombre corto y sin espacios, por ejemplo `img/impresora_1.jpg`.
2. Abre `js/data.js`, copia una guía que ya exista y cámbiale los datos. Revisa que `id` no se repita.
3. Si es de un tema nuevo, agrega un grupo en `GRUPOS` y usa su `id` en el campo `grupo` de la guía.

Así se ve un paso:

```js
{ h: "Reinicia el router", p: "Si pregunta <code>Save?</code>, responde <b>no</b>.", cmd: "reload", img: "img/r_7.jpg",
  nota: "Un consejo que sale en un recuadro amarillo." }
```

`h` es el título, `p` la explicación, `img` la captura que va en la pantalla, `cmd` el comando para copiar y `nota` un consejo. Solo `h` es obligatorio.

Para dibujar una ruta de menús se usa `R("This PC", "Properties")`, y para teclas `K("Ctrl", "C")`. Esto solo funciona dentro de textos con comillas invertidas (`` ` ``), como en las guías que ya están.

Cada guía tiene su propio enlace. Por ejemplo, `index.html#router-fabrica` abre directo la guía del router.

## Por qué JavaScript y no Java

La página está hecha con HTML, CSS y JavaScript, sin librerías ni nada que instalar. JavaScript es el lenguaje que corre dentro del navegador, y es lo que hace que funcione el visor, las flechas, la terminal que escribe sola y el progreso guardado.

Java necesitaría un servidor corriendo todo el tiempo, y eso no le sirve a esta página: todo pasa en el navegador. Además, con archivos sueltos se puede publicar gratis en GitHub Pages y abrir con doble clic sin configurar nada.
