/*
  Lógica de la página. Normalmente no hace falta tocar este archivo:
  el contenido de las guías vive en js/data.js.
*/
(function () {
  "use strict";

  /* ---------- Utilidades ---------- */
  const $ = (s) => document.querySelector(s);
  const byId = (id) => GUIAS.find((g) => g.id === id);
  const grupoDe = (g) => GRUPOS.find((x) => x.id === g.grupo);
  const plain = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // localStorage puede fallar (modo privado, archivos locales en algunos navegadores): nunca debe romper la página
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin guardar */ } }
  };
  const hechos = (id) => new Set(store.get("bm-hechos-" + id, []));
  const guardarHechos = (id, set) => store.set("bm-hechos-" + id, [...set]);

  const ICON = {
    copias: '<svg viewBox="0 0 24 24"><path d="M8 8h11v11H8z"/><path d="M5 16V5h11"/></svg>',
    dominio: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    router: '<svg viewBox="0 0 24 24"><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 16.5h.01M11 16.5h.01M8 9a6 6 0 0 1 8 0M5.5 6.5a10 10 0 0 1 13 0"/></svg>',
    steps: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>',
    bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>',
    warn: '<svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>',
    ask: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    zoom: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 5v14l11-7z"/></svg>',
    keys: '<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>',
    restart: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>'
  };

  // Foto de la tarjeta: la que se escogió, o la primera captura de la guía
  const portada = (g) => g.portada || (g.pasos.find((s) => s.img) || {}).img || "";
  const imgPortada = (g) => portada(g) ? `<img src="${portada(g)}" alt="" loading="lazy">` : `<span class="no-img">${ICON[g.grupo] || ICON.steps}</span>`;

  function ring(p) {
    const c = 2 * Math.PI * 10;
    return `<svg class="ring" viewBox="0 0 26 26" aria-hidden="true"><circle class="t" cx="13" cy="13" r="10" stroke-width="4"/><circle class="v" cx="13" cy="13" r="10" stroke-width="4" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/></svg>`;
  }

  function estado(g) {
    const d = hechos(g.id).size, n = g.pasos.length;
    if (d === 0) return { txt: "Sin empezar", p: 0, d, n };
    if (d === n) return { txt: "Terminada", p: 1, d, n };
    return { txt: `Vas en ${d} de ${n}`, p: d / n, d, n };
  }

  /* ---------- Inicio ---------- */
  let filtro = "todas";

  function visibles() {
    const q = norm($("#q").value.trim());
    return GUIAS.filter((g) => {
      if (filtro !== "todas" && g.grupo !== filtro) return false;
      if (!q) return true;
      const texto = [g.titulo, g.resumen, grupoDe(g).titulo, ...g.necesitas, ...g.pasos.map((p) => `${p.h} ${p.p || ""} ${p.cmd || ""}`)].join(" ");
      return norm(plain(texto)).includes(q);
    });
  }

  function renderTabs() {
    const cuenta = (id) => GUIAS.filter((g) => id === "todas" || g.grupo === id).length;
    const tabs = [{ id: "todas", titulo: "Todas" }, ...GRUPOS];
    $("#tabs").innerHTML = tabs.map((t) =>
      `<button class="tab" data-filtro="${t.id}" aria-pressed="${filtro === t.id}">${t.titulo}<b>${cuenta(t.id)}</b></button>`
    ).join("");
  }

  function renderCards() {
    const lista = visibles();
    const g0 = GRUPOS.find((x) => x.id === filtro);
    $("#secTitle").textContent = g0 ? g0.titulo : "Todas las guías";
    $("#secCount").textContent = `${lista.length} ${lista.length === 1 ? "guía" : "guías"}`;
    $("#cards").innerHTML = lista.map((g, i) => {
      const e = estado(g);
      return `<article class="card" style="animation-delay:${i * 50}ms">
        <a class="cover" href="#${g.id}" tabindex="-1" aria-hidden="true">
          ${imgPortada(g)}
          <span class="cover-chip">${grupoDe(g).titulo}</span>
          <span class="cover-steps">${ICON.steps}${g.pasos.length} pasos</span>
        </a>
        <div class="card-body">
          <h3>${g.titulo}</h3>
          <p>${g.resumen}</p>
          <div class="card-foot">
            <span class="status">${ring(e.p)}${e.txt}</span>
            <a class="pill" href="#${g.id}">${e.d && e.d < e.n ? "Seguir" : "Abrir"}${ICON.arrow}</a>
          </div>
        </div>
      </article>`;
    }).join("");
    $("#empty").hidden = lista.length > 0;
  }

  function renderGroups() {
    $("#groups").innerHTML = GRUPOS.map((gr) => {
      const n = GUIAS.filter((g) => g.grupo === gr.id).length;
      return `<div class="group">
        <span class="group-ico">${ICON[gr.id] || ICON.steps}</span>
        <h3>${gr.titulo}</h3>
        <p>${gr.resumen}</p>
        <button class="pill" data-filtro="${gr.id}">Ver ${n} ${n === 1 ? "guía" : "guías"}${ICON.arrow}</button>
      </div>`;
    }).join("");
  }

  function renderSide() {
    const ultima = byId(store.get("bm-ultima", ""));
    const enCurso = ultima && estado(ultima).d < ultima.pasos.length ? ultima : null;
    const g = enCurso || GUIAS.find((x) => estado(x).d === 0) || GUIAS[0];
    const e = estado(g);
    const pendientes = GUIAS.flatMap((x) => x.pendientes.map((p) => ({ g: x, p })));

    $("#side").innerHTML = `
      <section class="side-card feature">
        <h2>${ICON.play}${enCurso ? "Sigue donde ibas" : "Empieza por aquí"}</h2>
        <div class="feature-img">${imgPortada(g)}</div>
        <h3>${g.titulo}</h3>
        <div class="row"><span>${grupoDe(g).titulo}</span><span>${e.d} de ${e.n}</span></div>
        <div class="bar"><i style="width:${e.p * 100}%"></i></div>
        <a class="pill" href="#${g.id}">${enCurso ? "Continuar" : "Empezar"}${ICON.arrow}</a>
      </section>
      <section class="side-card">
        <h2>${ICON.keys}Atajos dentro de una guía</h2>
        <div class="keys">
          <span><kbd>←</kbd> <kbd>→</kbd></span><span>Pasar entre pasos</span>
          <span><kbd>Esc</kbd></span><span>Cerrar la guía</span>
          <span><kbd>Clic</kbd></span><span>Ampliar la captura</span>
        </div>
      </section>
      ${pendientes.length ? `<section class="side-card">
        <h2>${ICON.ask}Pendiente por confirmar</h2>
        <ul class="todo">${pendientes.map(({ g, p }) => `<li><span>${p}<a href="#${g.id}">${g.titulo}</a></span></li>`).join("")}</ul>
      </section>` : ""}`;
  }

  function renderHome() { renderTabs(); renderCards(); renderGroups(); renderSide(); }

  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-filtro]");
    if (!f) return;
    filtro = f.dataset.filtro;
    renderTabs(); renderCards();
    if (!f.classList.contains("tab")) $("#tabs").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#q").addEventListener("input", renderCards);

  /* ---------- Visor de pasos ---------- */
  // Diapositivas: 0 = antes de empezar, 1..n = pasos, n+1 = cierre
  let guia = null;
  let slide = 0;
  let typing = null;

  const total = () => guia.pasos.length + 2;

  function abrir(id) {
    const g = byId(id);
    if (!g) return;
    const yaAbierta = guia && guia.id === id;
    guia = g;
    store.set("bm-ultima", g.id);
    if (!yaAbierta) slide = Math.min(store.get("bm-pos-" + g.id, 0), total() - 1);
    $("#vGroup").textContent = grupoDe(g).titulo;
    $("#vTitle").textContent = g.titulo;
    $("#viewer").hidden = false;
    document.body.classList.add("locked");
    mostrar(slide);
    $("#vFwd").focus({ preventScroll: true });
  }

  function cerrar() {
    if (!guia) return;
    clearInterval(typing);
    guia = null;
    $("#viewer").hidden = true;
    document.body.classList.remove("locked");
    renderHome();
  }

  function mostrar(i) {
    slide = Math.max(0, Math.min(total() - 1, i));
    store.set("bm-pos-" + guia.id, slide);
    const n = guia.pasos.length;
    const d = hechos(guia.id);

    // Barra de progreso por pasos
    $("#vDots").innerHTML = Array.from({ length: total() }, (_, j) => {
      const cls = j === 0 || j === n + 1 ? "edge" : d.has(j - 1) ? "done" : "";
      const label = j === 0 ? "Antes de empezar" : j === n + 1 ? "Cierre" : `Paso ${j}`;
      return `<button class="${cls}" data-ir="${j}" ${j === slide ? 'aria-current="step"' : ""} aria-label="${label}" title="${label}"></button>`;
    }).join("");

    $("#vScreen").innerHTML = pantalla(slide);
    $("#vInfo").innerHTML = info(slide);
    $("#vInfo").scrollTop = 0;
    $(".v-body").scrollTop = 0;
    animarTerminal();

    $("#vPrev").disabled = $("#vBack").disabled = slide === 0;
    $("#vNext").disabled = slide === total() - 1;
    $("#vCount").textContent = slide === 0 ? "Antes de empezar" : slide === n + 1 ? "Final" : `Paso ${slide} de ${n}`;

    const fwd = $("#vFwd");
    if (slide === 0) fwd.innerHTML = `Empezar${ICON.arrow}`;
    else if (slide === n + 1) fwd.innerHTML = "Cerrar guía";
    else if (slide === n) fwd.innerHTML = `${d.has(slide - 1) ? "Ver final" : "Listo, terminar"}${ICON.check}`;
    else fwd.innerHTML = `${d.has(slide - 1) ? "Siguiente" : "Listo, siguiente"}${ICON.arrow}`;
  }

  function prompts(lineas, inicial) {
    let p = inicial;
    return lineas.map((l) => {
      const actual = p;
      if (l === "enable") p = "Router#";
      else if (/^conf(ig)?( t(erminal)?)?$/.test(l)) p = "Router(config)#";
      else if (l === "exit" || l === "end") p = "Router#";
      return { p: actual, l };
    });
  }

  function pantalla(i) {
    const n = guia.pasos.length;
    if (i === 0) {
      return `<div class="scr scr-wall">
        <div class="big">${n} pasos</div>
        <h3>Antes de empezar, ten a la mano:</h3>
        <ul>${guia.necesitas.map((x) => `<li>${ICON.check}<span>${plain(x)}</span></li>`).join("")}</ul>
      </div>`;
    }
    if (i === n + 1) {
      const d = hechos(guia.id).size;
      const ok = d === n;
      return `<div class="scr scr-wall">
        ${ok ? `<div class="done-ico">${ICON.check}</div><h3>¡Guía terminada!</h3><p>Marcaste los ${n} pasos.</p>`
             : `<div class="big">${d}/${n}</div><h3>Te faltan ${n - d} ${n - d === 1 ? "paso" : "pasos"} por marcar</h3><p>Puedes volver a cualquiera con la barra de arriba.</p>`}
      </div>`;
    }
    const s = guia.pasos[i - 1];
    if (s.img) {
      return `<div class="scr scr-img">
        <img class="blur" src="${s.img}" alt="">
        <img class="main-img" src="${s.img}" alt="Captura del paso ${i}" data-zoom="${s.img}">
        <span class="scr-zoom">${ICON.zoom}Ampliar</span>
      </div>`;
    }
    if (s.cmd) {
      const lineas = prompts(s.cmd.split("\n"), s.prompt || (s.cmd.startsWith("enable") ? "Router>" : "Router#"));
      return `<div class="scr scr-term" data-term='${JSON.stringify(lineas).replace(/'/g, "&#39;")}'>
        <div class="bar-top"><i></i><i></i><i></i><span>PuTTY, consola del router</span></div>
        <div class="term-out"></div>
      </div>`;
    }
    return `<div class="scr scr-wall">
      <div class="big">${String(i).padStart(2, "0")}</div>
      <h3>${s.h}</h3>
    </div>`;
  }

  function animarTerminal() {
    clearInterval(typing);
    const el = $("#vScreen .scr-term");
    if (!el) return;
    const lineas = JSON.parse(el.dataset.term);
    const out = el.querySelector(".term-out");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      out.innerHTML = lineas.map((x) => `<div><span class="pr">${esc(x.p)}</span> ${esc(x.l)}</div>`).join("") + '<span class="caret"></span>';
      return;
    }
    let li = 0, ch = 0;
    out.innerHTML = "";
    let row = null;
    typing = setInterval(() => {
      if (li >= lineas.length) { clearInterval(typing); out.insertAdjacentHTML("beforeend", '<span class="caret"></span>'); return; }
      if (ch === 0) {
        row = document.createElement("div");
        row.innerHTML = `<span class="pr">${esc(lineas[li].p)}</span> <span class="tx"></span><span class="caret"></span>`;
        out.appendChild(row);
      }
      const tx = row.querySelector(".tx");
      tx.textContent = lineas[li].l.slice(0, ++ch);
      if (ch >= lineas[li].l.length) { row.querySelector(".caret").remove(); li++; ch = 0; }
    }, 55);
  }

  function info(i) {
    const n = guia.pasos.length;
    if (i === 0) {
      return `<span class="eyebrow">${grupoDe(guia).titulo}</span>
        <h3>De qué se trata</h3>
        <p class="txt">${guia.resumen}</p>
        <h4>Antes de empezar</h4>
        <ul>${guia.necesitas.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    }
    if (i === n + 1) {
      return `<span class="eyebrow">Para cerrar</span>
        <h3>Antes de irte</h3>
        <div class="box-ojo"><h4>${ICON.warn}Ten en cuenta</h4><ul>${guia.ojo.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        ${guia.pendientes.length ? `<div class="box-tbd"><h4>${ICON.ask}Pendiente por confirmar</h4><ul>${guia.pendientes.map((x) => `<li>${x}</li>`).join("")}</ul></div>` : ""}
        <div class="end-actions">
          <button class="btn ghost" id="vReset">${ICON.restart}Empezar de nuevo</button>
        </div>`;
    }
    const s = guia.pasos[i - 1];
    const done = hechos(guia.id).has(i - 1);
    return `<span class="eyebrow">Paso ${i} de ${n}</span>
      <h3>${s.h}</h3>
      ${s.p ? `<p class="txt">${s.p}</p>` : ""}
      ${s.cmd ? `<pre class="cmd">${esc(s.cmd)}<button class="copy" data-copy="${encodeURIComponent(s.cmd)}">${ICON.copy}Copiar</button></pre>` : ""}
      ${s.nota ? `<div class="note">${ICON.bulb}<p>${s.nota}</p></div>` : ""}
      <button class="check" id="vCheck" aria-pressed="${done}"><span class="box">${ICON.check}</span>${done ? "Ya hice este paso" : "Marcar como hecho"}</button>`;
  }

  function marcar(paso, valor) {
    const d = hechos(guia.id);
    if (valor) d.add(paso); else d.delete(paso);
    guardarHechos(guia.id, d);
  }

  function adelante() {
    const n = guia.pasos.length;
    if (slide === n + 1) { location.hash = ""; return; }
    if (slide >= 1 && slide <= n) marcar(slide - 1, true);
    mostrar(slide + 1);
  }

  $("#vFwd").addEventListener("click", adelante);
  $("#vBack").addEventListener("click", () => mostrar(slide - 1));
  $("#vPrev").addEventListener("click", () => mostrar(slide - 1));
  $("#vNext").addEventListener("click", () => mostrar(slide + 1));

  $("#viewer").addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) { location.hash = ""; return; }
    const ir = e.target.closest("[data-ir]");
    if (ir) { mostrar(+ir.dataset.ir); return; }
    if (e.target.closest("#vCheck")) {
      const paso = slide - 1;
      marcar(paso, !hechos(guia.id).has(paso));
      mostrar(slide);
      return;
    }
    if (e.target.closest("#vReset")) {
      guardarHechos(guia.id, new Set());
      toast("Listo, la guía quedó en cero");
      mostrar(0);
      return;
    }
    const cp = e.target.closest(".copy");
    if (cp) { copiar(decodeURIComponent(cp.dataset.copy), cp); return; }
    const z = e.target.closest("[data-zoom], .scr-zoom");
    if (z) {
      const img = $("#vScreen .main-img");
      if (img) { $("#zoomImg").src = img.src; $("#zoom").hidden = false; }
    }
  });

  function cerrarZoom() { $("#zoom").hidden = true; }
  $("#zoom").addEventListener("click", cerrarZoom);

  function copiar(texto, btn) {
    const ok = () => {
      btn.classList.add("ok");
      btn.innerHTML = `${ICON.check}Copiado`;
      setTimeout(() => { btn.classList.remove("ok"); btn.innerHTML = `${ICON.copy}Copiar`; }, 1500);
    };
    const respaldo = () => {
      const t = document.createElement("textarea");
      t.value = texto; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); ok(); } catch (err) { toast("No se pudo copiar, selecciónalo a mano"); }
      t.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, respaldo);
    else respaldo();
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (!$("#zoom").hidden && e.key === "Escape") { cerrarZoom(); return; }
    if (!guia) {
      if (e.key === "/" && document.activeElement !== $("#q")) { e.preventDefault(); $("#q").focus(); }
      return;
    }
    if (e.key === "Escape") location.hash = "";
    else if (e.key === "ArrowRight") mostrar(slide + 1);
    else if (e.key === "ArrowLeft") mostrar(slide - 1);
  });

  // Deslizar con el dedo en celular
  let x0 = null, y0 = null;
  const body = $(".v-body");
  body.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  body.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) mostrar(slide + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  /* ---------- Tema claro y oscuro ---------- */
  const themeBtn = $("#themeBtn");
  function pintarTema() {
    const oscuro = document.documentElement.dataset.theme === "dark";
    themeBtn.setAttribute("aria-label", oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    document.querySelector('meta[name="theme-color"]').content = oscuro ? "#0a2614" : "#e7f6eb";
  }
  themeBtn.addEventListener("click", () => {
    const oscuro = document.documentElement.dataset.theme !== "dark";
    if (oscuro) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    store.set("bm-tema", oscuro ? "dark" : "light");
    pintarTema();
  });
  pintarTema();

  /* ---------- Enlaces: index.html#id-de-la-guia abre esa guía ---------- */
  function ruta() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (byId(id)) abrir(id);
    else cerrar();
  }
  window.addEventListener("hashchange", ruta);

  renderHome();
  ruta();
})();
