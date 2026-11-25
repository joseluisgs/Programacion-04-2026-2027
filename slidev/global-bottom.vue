<template>
  <div class="ud-brand-footer">
    <span class="ud-brand-footer-left">UD04 · Programación Orientada a Objetos (POO)</span>
    <span class="ud-brand-footer-right">Programación · 1DAW · IES Luis Vives · joseluisgs.dev</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

/* ============================================================
   Ajuste de Mermaid: el SVG vive en un shadowRoot, así que el CSS
   externo NO llega a él y el host lo corta con max-height + overflow
   (bug: "diagrama recortado por abajo, nodo a medias").
   Solución: cuando el SVG supera el alto del host, reducimos SU ANCHO
   proporcionalmente; como lleva viewBox, el alto baja solo y el
   diagrama queda COMPLETO (sin recorte) y centrado.
   Nunca se agranda: solo se estrecha.
   ============================================================ */
const RESERVA_ALTO = 350; // respaldo si el host no tiene max-height

function ajustarMermaid(host: Element): void {
  const raiz = (host as Element & { shadowRoot: ShadowRoot | null }).shadowRoot;
  const svg = raiz?.querySelector('svg');
  if (!svg) return;
  // Borde fino de marca en los clusters, sin sombra: se fija en línea para
  // que gane siempre a cualquier regla inyectada por el look de Mermaid.
  raiz.querySelectorAll<SVGRectElement>('.cluster rect').forEach((r) => {
    if (r.style.stroke !== '#7289da') r.style.stroke = '#7289da';
    if (r.style.fill !== 'transparent') r.style.fill = 'transparent';
    if (r.style.filter !== 'none') r.style.filter = 'none';
  });
  // El SVG sale con display:inline (defecto) y la línea de texto le añade
  // ~6px de espacio bajo la línea de base → el host se pasa y se corta.
  // En bloque desaparece ese gap. Además lo centramos: los diagramas
  // estrechos se quedaban pegados a la izquierda con un hueco enorme.
  if (svg.style.display !== 'block') svg.style.display = 'block';
  if (svg.style.marginInline !== 'auto') svg.style.marginInline = 'auto';

  /* --------------------------------------------------------------
     Cálculo ESTABLE: nunca a partir del tamaño actual del SVG (que
     ya lleva nuestro propio estilo) sino del viewBox y de la caja del
     host. Así la segunda pasada calcula lo MISMO y no vuelve a
     escribir: si no, el observador dispara otra pasada → bucle
     infinito → el navegador se queda colgado.
     -------------------------------------------------------------- */
  const vb = (svg as SVGSVGElement).viewBox?.baseVal;
  const vbW = vb?.width || 0;
  const vbH = vb?.height || 0;
  if (!vbW || !vbH) return;
  const ratio = vbW / vbH;

  const hostW = host.clientWidth;
  if (!hostW) return; // aún no se ha pintado

  const maxCss = parseFloat(getComputedStyle(host).maxHeight) || RESERVA_ALTO;
  let tope = maxCss;

  const cont = host.parentElement;
  if (cont && getComputedStyle(cont).display.includes('flex')) {
    // Hueco libre real en el contenedor (sin tocar los márgenes del host).
    // El fondo NO es el bottom del layout sino la LÍNEA DEL PIE menos aire:
    // si no, el diagrama se lleva el hueco del pie y lo que va debajo
    // (TipBox, ejemplos) desborda (bug: "mermaid recortado" → al arreglar
    // el recorte aparecía "DESBORDA el pie").
    // OJO: el layout lleva padding (40px): clientHeight lo INCLUYE pero la
    // suma de hijos no → hay que restarlo, si no `libre` sale inflado y el
    // JS no encoge nunca (bug: "svg 282 vs host 253 → gap negativo").
    const csCont = getComputedStyle(cont);
    const padTop = parseFloat(csCont.paddingTop) || 0;
    const padBot = parseFloat(csCont.paddingBottom) || 0;
    let fondo = cont.clientHeight - padTop - padBot;
    const pie = document.querySelector('.ud-brand-footer');
    if (pie) {
      const cr = cont.getBoundingClientRect();
      const escala = cont.clientWidth ? cr.width / cont.clientWidth : 1;
      const hastaPie = (pie.getBoundingClientRect().top - cr.top) / escala;
      // hastaPie es desde el BORDE: se pasa a coordenadas de contenido
      // 20px de reserva ≈ 34px en pantalla > umbral gap ≥25
      if (hastaPie > 60) fondo = Math.min(fondo, hastaPie - padTop - 20);
    }
    let libre = fondo;
    for (const h of Array.from(cont.children)) {
      if (h === host) continue;
      const hs = getComputedStyle(h);
      libre -= h.offsetHeight + (parseFloat(hs.marginTop) || 0) + (parseFloat(hs.marginBottom) || 0);
    }
    const ms = getComputedStyle(host);
    libre -= (parseFloat(ms.marginTop) || 0) + (parseFloat(ms.marginBottom) || 0);
    // OJO: NUNCA usar la caja del host como límite: su alto depende del SVG
    // que acabamos de encoger → se retroalimenta y el diagrama se queda
    // clavado en el mínimo (bug: "diagrama enanito"). `libre` ya es estable.
    tope = Math.max(40, Math.min(maxCss, libre));
  }

  /* --------------------------------------------------------------
     Reserva del pie: el footer (.ud-brand-footer) se superpone al
     layout; el host no puede cruzar su línea (bug: "mermaid invade
     el pie en la 27"). Se mide desde EL PROPIO host hasta la línea
     del pie en px de layout: un diagrama en medio de la slide no se
     encoge si aún queda contenido debajo.
     -------------------------------------------------------------- */
  if (cont) {
    const cr = cont.getBoundingClientRect();
    const escala = cont.clientWidth ? cr.width / cont.clientWidth : 1;
    const pie = document.querySelector('.ud-brand-footer');
    if (pie && escala > 0) {
      const hostTop = host.getBoundingClientRect().top;
      const lineaPie = pie.getBoundingClientRect().top;
      // -20px de aire (≈34px en pantalla) además de no cruzar el pie:
      // cubre también los contenedores NO flex (wrapper de bloque vacío)
      // donde no pasa la rama de `fondo`.
      const altoMax = (lineaPie - hostTop) / escala - 20;
      if (altoMax > 0 && tope > altoMax) tope = Math.max(40, altoMax);
    }
  }

  const ancho = Math.max(40, Math.min(hostW, Math.floor(tope * ratio)));
  const alto = Math.floor(ancho / ratio);
  // Escritura SOLO si el valor cambió (evita el bucle de mutaciones).
  if (svg.style.width !== ancho + 'px') {
    svg.style.width = ancho + 'px';
    svg.style.height = alto + 'px';
    svg.style.maxWidth = ''; // limpia restos de versiones anteriores
  }
}

function barrerMermaid(): void {
  document.querySelectorAll('.mermaid').forEach((host) => {
    ajustarMermaid(host);
    const raiz = (host as Element & { shadowRoot: ShadowRoot | null }).shadowRoot;
    if (raiz && !host.hasAttribute('data-ud-obs')) {
      host.setAttribute('data-ud-obs', '1');
      // El SVG se pinta de forma asíncrona: observamos su shadowRoot.
      // Observamos también el atributo style: al estrechar el SVG vuelve a
      // correr el ajuste (converge: solo se estrecha, nunca se agranda).
      new MutationObserver(() => ajustarMermaid(host)).observe(raiz, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });
    }
  });
}

onMounted(() => {
  barrerMermaid();
  // Mermaid puede tardar en renderizar tras montar la slide
  setTimeout(barrerMermaid, 250);
  setTimeout(barrerMermaid, 800);
  // Tras cargar las fuentes crecen los hermanos del host (títulos, TipBox) y
  // el hueco libre REAL se reduce: sin este barrido el SVG queda escrito con
  // el hueco de antes y el flex recorta el diagrama (bug: "mermaid recortado
  // +50px en 10 slides"). Se re-ejecuta con la maqueta ya asentada.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      barrerMermaid();
      setTimeout(barrerMermaid, 400);
    });
  }
  setTimeout(barrerMermaid, 1600); // barrido final de seguridad
});
</script>

<style scoped>
.ud-brand-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35em 1.5em;
  font-size: 0.6em;
  letter-spacing: 0.02em;
  color: var(--ud-text-subtle);
  border-top: 1px solid var(--ud-divider);
  background: transparent;
  pointer-events: none;
  z-index: 20;
}
</style>
