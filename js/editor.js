/*
  Editor de guías.
  Toma las guías de js/data.js, deja editarlas con un formulario y genera el archivo data.js
  completo para pegarlo en GitHub. No guarda nada en el servidor: el borrador vive en este navegador.
*/
(function () {
  "use strict";

  // Repositorio donde vive la página. Si algún día cambia de nombre, se cambia aquí.
  const REPO = "Laboratorio-de-Informatica/Bitacoras_manuales";
  const RAMA = "main";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin borrador */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* nada */ } }
  };

  $("#lnkEdit").href = `https://github.com/${REPO}/edit/${RAMA}/js/data.js`;
  $("#lnkUpload").href = `https://github.com/${REPO}/upload/${RAMA}/img`;

  /* ---------- Texto sencillo <-> HTML ---------- */
  // Lo que escribe el monitor:  **negrita**  `código`  _cursiva_  [[Ctrl+C]]  {This PC > Properties}  [texto](#guia)
  const escHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const unesc = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

  function aHTML(txt) {
    if (!txt) return "";
    const guard = [];
    const keep = (html) => `\u0000${guard.push(html) - 1}\u0000`;
    let s = txt.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${escHTML(c)}</code>`));
    s = s.replace(/\{([^{}]+)\}/g, (_, r) => keep(R(...r.split(/\s*>\s*/).map((x) => escHTML(x.trim())))));
    s = s.replace(/\[\[([^\]]+)\]\]/g, (_, k) => keep(K(...k.split("+").map((x) => escHTML(x.trim())))));
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => keep(`<a href="${escHTML(u)}">${escHTML(t)}</a>`));
    s = escHTML(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    s = s.replace(/(^|[\s(¿¡])_([^_]+)_(?=[\s.,;:!?)]|$)/g, "$1<i>$2</i>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => guard[+i]);
  }

  function aTexto(html) {
    if (!html) return "";
    let s = html;
    s = s.replace(/(<kbd>[^<]*<\/kbd>(?:\s*\+\s*<kbd>[^<]*<\/kbd>)*)/g, (m) => `[[${[...m.matchAll(/<kbd>([^<]*)<\/kbd>/g)].map((x) => unesc(x[1])).join("+")}]]`);
    s = s.replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => "`" + unesc(c) + "`");
    s = s.replace(/<a href="([^"]*)">([\s\S]*?)<\/a>/g, (_, u, t) => `[${unesc(t)}](${unesc(u)})`);
    s = s.replace(/<b>([\s\S]*?)<\/b>/g, "**$1**");
    s = s.replace(/<i>([\s\S]*?)<\/i>/g, "_$1_");
    s = s.replace(/<[^>]+>/g, "");
    return unesc(s);
  }

  // Las rutas guardadas en data.js tienen spans anidados; esta versión los encuentra completos
  function rutasATexto(html) {
    return html.replace(/<span class="ruta">((?:<span>[\s\S]*?<\/span>(?:<svg[\s\S]*?<\/svg>)?)+)<\/span>/g, (_, inner) =>
      `{${[...inner.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((x) => unesc(x[1])).join(" > ")}}`);
  }
  const html2txt = (h) => aTexto(rutasATexto(h || ""));
  const lineas = (arr) => (arr || []).map(html2txt).join("\n");
  const deLineas = (t) => t.split("\n").map((x) => x.trim()).filter(Boolean).map(aHTML);

  /* ---------- Estado ---------- */
  const ORIGINAL = clone(GUIAS);
  let work = store.get("bm-editor-borrador", null) || clone(GUIAS);
  let cur = 0;
  let pv = 0;
  let idManual = true;
  const fotos = {};        // ruta -> URL temporal de la foto escogida
  const porSubir = {};     // ruta -> nombre del archivo que hay que subir a img/

  const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "guia";

  /* ---------- Selector de guía ---------- */
  function pintarSelector() {
    $("#pick").innerHTML = work.map((g, i) => `<option value="${i}" ${i === cur ? "selected" : ""}>${escHTML(g.titulo || "Guía sin título")}</option>`).join("")
      + `<option value="nueva">+ Crear una guía nueva</option>`;
    $("#grupo").innerHTML = GRUPOS.map((g) => `<option value="${g.id}">${escHTML(g.titulo)}</option>`).join("");
  }

  $("#pick").addEventListener("change", (e) => {
    if (e.target.value === "nueva") {
      work.push({ id: "", grupo: GRUPOS[0].id, portada: "", titulo: "", resumen: "", necesitas: [], pasos: [{ h: "" }], ojo: [], pendientes: [] });
      cur = work.length - 1;
      idManual = false;
    } else {
      cur = +e.target.value;
      idManual = true;
    }
    pv = 0;
    pintarSelector();
    cargar();
    guardar();
    $("#titulo").focus();
  });

  /* ---------- Formulario ---------- */
  function cargar() {
    const g = work[cur];
    $("#titulo").value = g.titulo || "";
    $("#id").value = g.id || "";
    $("#grupo").value = g.grupo;
    $("#resumen").value = html2txt(g.resumen);
    $("#portada").value = g.portada || "";
    $("#necesitas").value = lineas(g.necesitas);
    $("#ojo").value = lineas(g.ojo);
    $("#pendientes").value = lineas(g.pendientes);
    $("#del").hidden = false;
    pintarPasos();
    $("#idEcho").textContent = g.id || "…";
    previa();
  }

  const ICO = {
    up: '<svg viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    del: '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
  };

  function pintarPasos() {
    const g = work[cur];
    $("#pasos").innerHTML = g.pasos.map((s, i) => `
      <div class="paso ${i === pv ? "on" : ""}" data-i="${i}">
        <div class="paso-head">
          <span class="paso-n">${i + 1}</span>
          <input data-k="h" value="${escHTML(s.h || "")}" placeholder="Título del paso, ej. Reinicia el router" aria-label="Título del paso ${i + 1}">
          <div class="paso-tools">
            <button type="button" data-mv="-1" aria-label="Subir paso" ${i === 0 ? "disabled" : ""}>${ICO.up}</button>
            <button type="button" data-mv="1" aria-label="Bajar paso" ${i === g.pasos.length - 1 ? "disabled" : ""}>${ICO.down}</button>
            <button type="button" data-rm aria-label="Borrar paso">${ICO.del}</button>
          </div>
        </div>
        <textarea data-k="p" rows="2" placeholder="Qué hay que hacer en este paso">${escHTML(html2txt(s.p))}</textarea>
        <div class="imgpick">
          <input data-k="img" value="${escHTML(s.img || "")}" placeholder="img/captura.jpg (opcional)">
          <label class="btn ghost small">Escoger foto<input type="file" accept="image/*" data-paso="${i}" hidden></label>
        </div>
        <div class="more">
          <textarea data-k="cmd" class="mono" rows="2" placeholder="Comando para copiar (opcional)">${escHTML(s.cmd || "")}</textarea>
          <textarea data-k="nota" rows="2" placeholder="Consejo extra (opcional)">${escHTML(html2txt(s.nota))}</textarea>
        </div>
      </div>`).join("");
  }

  function leerFormulario() {
    const g = work[cur];
    g.titulo = $("#titulo").value.trim();
    if (!idManual) $("#id").value = slug(g.titulo);
    let id = slug($("#id").value || g.titulo);
    const otros = work.filter((x, i) => i !== cur).map((x) => x.id);
    let base = id, n = 2;
    while (otros.includes(id)) id = `${base}-${n++}`;
    g.id = id;
    $("#idEcho").textContent = id;
    g.grupo = $("#grupo").value;
    g.resumen = aHTML($("#resumen").value.trim());
    g.portada = $("#portada").value.trim();
    g.necesitas = deLineas($("#necesitas").value);
    g.ojo = deLineas($("#ojo").value);
    g.pendientes = deLineas($("#pendientes").value);
    g.pasos = $$(".paso").map((el, i) => {
      const viejo = g.pasos[i] || {};
      const v = (k) => $(`[data-k="${k}"]`, el).value;
      const paso = { h: v("h").trim() };
      if (v("p").trim()) paso.p = aHTML(v("p").trim());
      if (v("img").trim()) paso.img = v("img").trim();
      if (v("cmd").trim()) paso.cmd = v("cmd").replace(/\s+$/, "");
      if (v("nota").trim()) paso.nota = aHTML(v("nota").trim());
      if (viejo.prompt) paso.prompt = viejo.prompt;
      return paso;
    });
  }

  let t = null;
  $("#form").addEventListener("input", (e) => {
    if (e.target.id === "id") idManual = true;
    leerFormulario();
    clearTimeout(t);
    t = setTimeout(() => { guardar(); pintarSelector(); }, 250);
    const paso = e.target.closest(".paso");
    if (paso) marcarPaso(+paso.dataset.i);
    previa();
  });
  $("#form").addEventListener("submit", (e) => e.preventDefault());

  $("#form").addEventListener("focusin", (e) => {
    const paso = e.target.closest(".paso");
    if (paso && +paso.dataset.i !== pv) { marcarPaso(+paso.dataset.i); previa(); }
  });

  function marcarPaso(i) {
    pv = i;
    $$(".paso").forEach((el) => el.classList.toggle("on", +el.dataset.i === i));
  }

  $("#pasos").addEventListener("click", (e) => {
    const el = e.target.closest(".paso");
    if (!el) return;
    const i = +el.dataset.i, g = work[cur];
    const mv = e.target.closest("[data-mv]");
    if (mv) {
      const j = i + +mv.dataset.mv;
      [g.pasos[i], g.pasos[j]] = [g.pasos[j], g.pasos[i]];
      pv = j;
    } else if (e.target.closest("[data-rm]")) {
      if (g.pasos.length === 1) { toast("La guía necesita al menos un paso"); return; }
      g.pasos.splice(i, 1);
      pv = Math.min(pv, g.pasos.length - 1);
    } else return;
    pintarPasos(); guardar(); previa();
  });

  $("#addPaso").addEventListener("click", () => {
    work[cur].pasos.push({ h: "" });
    pv = work[cur].pasos.length - 1;
    pintarPasos(); guardar(); previa();
    $$(".paso").at(-1).querySelector("input").focus();
  });

  // Escoger foto: se muestra de una vez en la vista previa y queda anotada para subirla a img/
  document.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const nombre = f.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^A-Za-z0-9._-]/g, "");
    const ruta = "img/" + nombre;
    fotos[ruta] = URL.createObjectURL(f);
    porSubir[ruta] = nombre;
    if (e.target.dataset.for === "portada") $("#portada").value = ruta;
    else {
      const el = $(`.paso[data-i="${e.target.dataset.paso}"]`);
      $('[data-k="img"]', el).value = ruta;
      marcarPaso(+e.target.dataset.paso);
    }
    e.target.value = "";
    leerFormulario(); guardar(); previa();
  });

  /* ---------- Vista previa ---------- */
  const src = (ruta) => fotos[ruta] || ruta;

  function previa() {
    const g = work[cur];
    const n = g.pasos.length;
    pv = Math.max(0, Math.min(pv, n - 1));
    const s = g.pasos[pv] || { h: "" };
    $("#pvCount").textContent = `Paso ${pv + 1} de ${n}`;
    $("#pvPrev").disabled = pv === 0;
    $("#pvNext").disabled = pv >= n - 1;

    let scr;
    if (s.img) {
      scr = `<div class="scr scr-img"><img class="blur" src="${escHTML(src(s.img))}" alt=""><img class="main-img" src="${escHTML(src(s.img))}" alt="" onerror="this.closest('.scr').classList.add('broken')"></div>`;
    } else if (s.cmd) {
      scr = `<div class="scr scr-term"><div class="bar-top"><i></i><i></i><i></i><span>PuTTY, consola del router</span></div>${s.cmd.split("\n").map((l) => `<div><span class="pr">${escHTML(s.prompt || "Router#")}</span> ${escHTML(l)}</div>`).join("")}<span class="caret"></span></div>`;
    } else {
      scr = `<div class="scr scr-wall"><div class="big">${String(pv + 1).padStart(2, "0")}</div><h3>${escHTML(s.h || "Título del paso")}</h3></div>`;
    }
    $("#pvScreen").innerHTML = scr;
    $("#pvInfo").innerHTML = `<span class="eyebrow">Paso ${pv + 1} de ${n}</span>
      <h3>${escHTML(s.h || "Título del paso")}</h3>
      ${s.p ? `<p class="txt">${s.p}</p>` : ""}
      ${s.cmd ? `<pre class="cmd">${escHTML(s.cmd)}</pre>` : ""}
      ${s.nota ? `<div class="note"><svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg><p>${s.nota}</p></div>` : ""}`;
  }
  $("#pvPrev").addEventListener("click", () => { marcarPaso(pv - 1); previa(); });
  $("#pvNext").addEventListener("click", () => { marcarPaso(pv + 1); previa(); });

  /* ---------- Guardar borrador y estado ---------- */
  function guardar() {
    store.set("bm-editor-borrador", work);
    estado();
  }

  function cambios() {
    const orig = new Map(ORIGINAL.map((g) => [g.id, JSON.stringify(g)]));
    const ids = new Set(work.map((g) => g.id));
    const nuevas = work.filter((g) => !orig.has(g.id));
    const editadas = work.filter((g) => orig.has(g.id) && orig.get(g.id) !== JSON.stringify(g));
    const borradas = ORIGINAL.filter((g) => !ids.has(g.id));
    return { nuevas, editadas, borradas, total: nuevas.length + editadas.length + borradas.length };
  }

  function estado() {
    const c = cambios();
    const partes = [];
    if (c.editadas.length) partes.push(`cambiaste <b>${c.editadas.map((g) => escHTML(g.titulo)).join(", ")}</b>`);
    if (c.nuevas.length) partes.push(`agregaste <b>${c.nuevas.map((g) => escHTML(g.titulo || "una guía sin título")).join(", ")}</b>`);
    if (c.borradas.length) partes.push(`borraste <b>${c.borradas.map((g) => escHTML(g.titulo)).join(", ")}</b>`);
    $("#status").innerHTML = c.total ? `En este borrador ${partes.join(", ")}.` : "Sin cambios todavía.";
    const subir = Object.keys(porSubir).filter((r) => work.some((g) => g.portada === r || g.pasos.some((s) => s.img === r)));
    $("#uploads").hidden = !subir.length;
    $("#uploads").innerHTML = subir.length ? `<b>Antes de pegar, sube estas fotos a img:</b>${subir.map((r) => `<li>${escHTML(porSubir[r])}</li>`).join("")}` : "";
  }

  /* ---------- Generar data.js ---------- */
  const q = (s) => JSON.stringify(s);
  const lista = (arr, sangria) => arr.length ? `[\n${arr.map((x) => `${sangria}  ${q(x)}`).join(",\n")}\n${sangria}]` : "[]";

  function generar() {
    const pasoTxt = (s) => {
      const campos = ["h", "p", "img", "cmd", "prompt", "nota"].filter((k) => s[k]).map((k) => `${k}: ${q(s[k])}`);
      return `    { ${campos.join(", ")} }`;
    };
    const guiaTxt = (g) => `{
  id: ${q(g.id)}, grupo: ${q(g.grupo)}, portada: ${q(g.portada || "")},
  titulo: ${q(g.titulo)},
  resumen: ${q(g.resumen)},
  necesitas: ${lista(g.necesitas, "  ")},
  pasos: [
${g.pasos.map(pasoTxt).join(",\n")}
  ],
  ojo: ${lista(g.ojo, "  ")},
  pendientes: ${lista(g.pendientes, "  ")}
}`;
    return `/*
  CONTENIDO DE LAS GUÍAS
  ======================
  Este archivo se puede editar a mano o con el editor visual (editor.html).
  Si usas el editor, copia todo lo que genera y reemplaza este archivo completo.

  Cada guía tiene: id, grupo, titulo, resumen, portada, necesitas, pasos, ojo y pendientes.
  Cada paso puede tener: h (título), p (explicación), img (captura), cmd (comando), nota (consejo).

  Ayudas para escribir a mano:
    R("This PC","Properties")  dibuja una ruta de menús
    K("Ctrl","C")              dibuja teclas
*/

const CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
const R = (...a) => \`<span class="ruta">\${a.map(x => \`<span>\${x}</span>\`).join(CHEV)}</span>\`;
const K = (...a) => a.map(x => \`<kbd>\${x}</kbd>\`).join(" + ");

const GRUPOS = [
${GRUPOS.map((g) => `  { id: ${q(g.id)}, titulo: ${q(g.titulo)}, resumen: ${q(g.resumen)} }`).join(",\n")}
];

const GUIAS = [
${work.map(guiaTxt).join(",\n")}
];
`;
  }

  function problemas() {
    const malos = [];
    work.forEach((g) => {
      if (!g.titulo) malos.push("hay una guía sin título");
      if (g.pasos.some((s) => !s.h)) malos.push(`"${g.titulo || "sin título"}" tiene pasos sin título`);
    });
    return malos;
  }

  $("#copyAll").addEventListener("click", () => {
    const p = problemas();
    if (p.length) { toast("Falta algo: " + p[0]); return; }
    const texto = generar();
    const ok = () => toast("Copiado. Ahora pégalo en data.js en GitHub");
    const respaldo = () => {
      const ta = document.createElement("textarea");
      ta.value = texto; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) { toast("No se pudo copiar. Usa Descargar data.js"); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, respaldo);
    else respaldo();
  });

  $("#download").addEventListener("click", () => {
    const p = problemas();
    if (p.length) { toast("Falta algo: " + p[0]); return; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([generar()], { type: "text/javascript" }));
    a.download = "data.js";
    document.body.appendChild(a); a.click(); a.remove();
  });

  // Botones que piden confirmación con un segundo clic
  function dobleClic(btn, textoConfirmar, accion) {
    let armado = null;
    const original = btn.textContent;
    btn.addEventListener("click", () => {
      if (armado) { clearTimeout(armado); armado = null; btn.textContent = original; accion(); return; }
      btn.textContent = textoConfirmar;
      armado = setTimeout(() => { armado = null; btn.textContent = original; }, 3000);
    });
  }

  dobleClic($("#reset"), "¿Seguro? Toca otra vez", () => {
    store.del("bm-editor-borrador");
    work = clone(GUIAS); cur = 0; pv = 0; idManual = true;
    pintarSelector(); cargar(); estado();
    toast("Listo, volviste a las guías publicadas");
  });

  dobleClic($("#del"), "¿Borrarla? Toca otra vez", () => {
    const titulo = work[cur].titulo;
    work.splice(cur, 1);
    if (!work.length) work.push({ id: "", grupo: GRUPOS[0].id, portada: "", titulo: "", resumen: "", necesitas: [], pasos: [{ h: "" }], ojo: [], pendientes: [] });
    cur = 0; pv = 0;
    pintarSelector(); cargar(); guardar();
    toast(`Quitaste "${titulo || "la guía"}" del borrador`);
  });

  let tt = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- Tema ---------- */
  $("#themeBtn").addEventListener("click", () => {
    const oscuro = document.documentElement.dataset.theme !== "dark";
    if (oscuro) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    store.set("bm-tema", oscuro ? "dark" : "light");
  });

  pintarSelector();
  cargar();
  estado();

  // Para pruebas: permite revisar desde la consola que el texto vaya y vuelva igual
  window.__editor = { aHTML, html2txt, generar };
})();
