#!/usr/bin/env node
/**
 * visual-check.mjs — auditoría visual genérica de decks Slidev (plantilla UDxx)
 *
 * Fusiona lo mejor de: nuestro verificar-p4 (gap ≥ umbral con texto culpable) +
 * dwes01/02-audit (espera condicionada, ?clicks=99, footer como límite, mermaid
 * en 2 capas, doble tema light/dark) + ud03-auditoria (captura SOLO de fallos).
 *
 * Uso:
 *   node tools/visual-check.mjs [--url http://[::1]:3030] [--slides 1-60,120]
 *        [--temas light,dark|both] [--capturas fallos|todas|ninguna]
 *        [--umbral 25] [--fuente slides.md] [--salida tools/out]
 *        [--excluir-layout cover] [--solo-mermaid] [--check-enlaces]
 *
 * Salida: <salida>/layout-report.json + capturas <tema>-<n>.png SOLO de fallos.
 * exit 0 = todo OK · exit 1 = hay fallos · exit 2 = error de entorno.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const DECK = path.resolve(__dir, '..'); // raíz del deck (…/slidev)
const req = createRequire(path.join(DECK, 'package.json'));
const { chromium } = req('playwright-chromium');

// ---------- CLI ----------
const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf(k);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d;
};
const flag = (k) => argv.includes(k);

const URL_BASE = opt('--url', 'http://[::1]:3030').replace(/\/+$/, '');
const FUENTE = path.resolve(DECK, opt('--fuente', 'slides.md'));
const SALIDA = path.resolve(DECK, opt('--salida', 'tools/out'));
const TEMAS_ARG = opt('--temas', 'both');
const TEMAS =
  TEMAS_ARG === 'both' || TEMAS_ARG === 'light,dark'
    ? ['light', 'dark']
    : TEMAS_ARG.split(',').map((s) => s.trim()).filter(Boolean);
const CAPTURAS = opt('--capturas', 'fallos'); // fallos | todas | ninguno
const UMBRAL = Number(opt('--umbral', '25'));
const EXCLUIR = new Set(
  opt('--excluir-layout', '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);
const SOLO_MERMAID = flag('--solo-mermaid');
const CHECK_ENLACES = flag('--check-enlaces');
const CLICKS = opt('--clicks', '99');

// ---------- 1. slides del fuente con @slidev/parser (nada de regex) ----------
let slidesSrc = [];
try {
  const P = req('@slidev/parser');
  const parse = P.parse || (P.default && P.default.parse);
  const r = await parse(fs.readFileSync(FUENTE, 'utf8'));
  slidesSrc = Array.isArray(r) ? r : r.slides || [];
} catch (e) {
  console.error('ERROR: no se pudo analizar ' + FUENTE + ' con @slidev/parser → ' + e);
  process.exit(2);
}
const TOTAL = slidesSrc.length;
if (!TOTAL) {
  console.error('ERROR: el parser no devolvió ninguna slide');
  process.exit(2);
}

// rango --slides 1-60,120
let rango = null;
const rangoArg = opt('--slides', null);
if (rangoArg) {
  rango = new Set();
  for (const parte of rangoArg.split(',')) {
    const t = parte.trim();
    const m = t.match(/^(\d+)-(\d+)$/);
    if (m) for (let i = +m[1]; i <= +m[2]; i++) rango.add(i);
    else if (/^\d+$/.test(t)) rango.add(+t);
  }
}

const pendientes = [];
for (let i = 1; i <= TOTAL; i++) {
  const s = slidesSrc[i - 1] || {};
  const fm = s.frontmatter || {};
  const layout = fm.layout || (i === 1 && fm.theme ? 'cover' : 'default');
  if (EXCLUIR.has(layout)) continue;
  if (rango && !rango.has(i)) continue;
  if (SOLO_MERMAID) {
    const c = typeof s.content === 'string' ? s.content : JSON.stringify(s);
    if (!/```mermaid/.test(c)) continue;
  }
  pendientes.push({ n: i, layout });
}

console.log(
  `visual-check · ${TOTAL} slides en el fuente · auditando ${pendientes.length} × ${TEMAS.length} tema(s) · umbral ${UMBRAL}px · ${URL_BASE}`
);

// ---------- 2. comprobación de servidor ----------
try {
  const ctl = new AbortController();
  setTimeout(() => ctl.abort(), 5000);
  await fetch(URL_BASE + '/1', { signal: ctl.signal });
} catch {
  console.error(`ERROR: no responde ${URL_BASE} — arranca el deck (npm run dev) o pasa --url`);
  process.exit(2);
}

// ---------- 3. auditoría ----------
const SALIDA_CAP = path.join(SALIDA, 'capturas');
fs.mkdirSync(SALIDA_CAP, { recursive: true });

const browser = await chromium.launch({ args: ['--no-proxy-server'] });
const resultados = [];
let fallosTotales = 0;
let fallosGotoSeguidos = 0;

const ESPERA = (num) => (num) => {
  const el = document.elementFromPoint(window.innerWidth / 2, 140);
  const pg = el && el.closest('.slidev-page');
  if (!pg) return false;
  const m = String(pg.className).match(/slidev-page-(\d+)/);
  if (!m || +m[1] !== num) return false;
  if (!pg.querySelector('h1, h2')) return false;
  const mer = [...pg.querySelectorAll('.mermaid')];
  if (!mer.every((x) => x.shadowRoot && x.shadowRoot.querySelector('svg'))) return false;
  if (![...pg.querySelectorAll('img')].every((i) => i.complete)) return false;
  return document.fonts.status === 'loaded';
};

for (const tema of TEMAS) {
  const ctx = await browser.newContext({ viewport: { width: 1680, height: 945 } });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('slidev-color-schema', t);
    } catch (e) {
      /* noop */
    }
  }, tema);
  const page = await ctx.newPage();
  let okTema = 0;

  for (const { n, layout } of pendientes) {
    let r;
    try {
      await page.goto(`${URL_BASE}/${n}?clicks=${CLICKS}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      fallosGotoSeguidos = 0;
      await page.waitForFunction(ESPERA(n), n, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(300);
      r = await page.evaluate(
        ({ umbral, conEnlaces }) => {
          const punto = document.elementFromPoint(window.innerWidth / 2, 140);
          const pg = punto && punto.closest('.slidev-page');
          if (!pg) return { error: 'layout no visible' };
          const mm = String(pg.className).match(/slidev-page-(\d+)/);
          const h = pg.querySelector('h1, h2');
          const box = pg.getBoundingClientRect();
          const footer = document.querySelector('.ud-brand-footer');
          const pieTop = footer ? footer.getBoundingClientRect().top : box.bottom;

          const SEL =
            'h1,h2,h3,p,li,pre,table,img,a,.mermaid,[class*="ud-"]';
          const desc = (e) => {
            const t = ((e && (e.innerText || e.alt)) || '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 60);
            let cls = '';
            if (typeof e.className === 'string' && e.className) {
              cls = '.' + e.className.split(/\s+/).filter((c) => c && !/\d/.test(c)).slice(0, 2).join('.');
            }
            return (e.tagName || '?').toLowerCase() + cls + (t ? ` «${t}»` : '');
          };
          const items = [...pg.querySelectorAll(SEL)].filter((e) => {
            if (e.closest && e.closest('.ud-brand-footer')) return false;
            // el propio contenedor (p.ej. .ud-cover-bg en la portada) no es contenido
            if (e.classList && (e.classList.contains('slidev-layout') || e.classList.contains('slidev-page')))
              return false;
            const cs = getComputedStyle(e);
            if (cs.display === 'none' || cs.visibility === 'hidden') return false;
            const rr = e.getBoundingClientRect();
            return rr.width > 0 && rr.height > 0;
          });

          // gap hasta el pie (límite real = top del footer)
          let maxBot = -Infinity,
            peor = null;
          for (const e of items) {
            const b = e.getBoundingClientRect().bottom;
            if (b > maxBot) {
              maxBot = b;
              peor = e;
            }
          }
          const gap = Math.round(pieTop - maxBot);

          // desbordes laterales
          const overflow = [];
          for (const e of items) {
            const rr = e.getBoundingClientRect();
            if (rr.right > box.right + 2)
              overflow.push({ lado: 'derecha', px: Math.round(rr.right - box.right), elem: desc(e) });
            else if (rr.left < box.left - 2)
              overflow.push({ lado: 'izquierda', px: Math.round(box.left - rr.left), elem: desc(e) });
          }

          // mermaid: existe / sintaxis / recorte
          const mer = [];
          for (const host of pg.querySelectorAll('.mermaid')) {
            const sr = host.shadowRoot;
            const svg = sr && sr.querySelector('svg');
            if (!svg) {
              mer.push({ estado: 'sin-svg', elem: desc(host) });
              continue;
            }
            const txt = svg.textContent || '';
            if (/Syntax error/i.test(txt)) {
              mer.push({ estado: 'syntax-error', elem: txt.replace(/\s+/g, ' ').slice(0, 80) });
              continue;
            }
            const hr = host.getBoundingClientRect();
            const vr = svg.getBoundingClientRect();
            if (vr.bottom > hr.bottom + 2)
              mer.push({ estado: 'recortado', px: Math.round(vr.bottom - hr.bottom), elem: desc(host) });
          }

          // código con scroll (desborde interno)
          const scrolls = [];
          for (const pre of pg.querySelectorAll('pre, .slidev-code-wrapper')) {
            const w = pre.scrollWidth - pre.clientWidth;
            const h2 = pre.scrollHeight - pre.clientHeight;
            if (w > 2 || h2 > 2) scrolls.push({ w: Math.max(0, w), h: Math.max(0, h2), elem: desc(pre) });
          }

          // imágenes rotas
          const imgsRotos = [...pg.querySelectorAll('img')]
            .filter((i) => i.complete && i.naturalWidth === 0)
            .map((i) => i.getAttribute('src') || '(sin src)');

          // markdown literal sin renderizar
          const inner = pg.innerText || '';
          let mdLiteral = null;
          const ix = inner.indexOf('**');
          if (ix >= 0) mdLiteral = inner.slice(Math.max(0, ix - 20), ix + 40).replace(/\s+/g, ' ');

          // enlaces externos (solo si --check-enlaces: en nuestra plantilla son legítimos)
          const enlaces = conEnlaces
            ? [...pg.querySelectorAll('a[href^="http"]')].map((a) => a.href)
            : [];

          // v-click aún ocultos (señal de que ?clicks=N no funcionó)
          const ocultos = pg.querySelectorAll('.slidev-vclick-hidden').length;

          return {
            num: mm ? +mm[1] : null,
            titulo: h ? h.innerText.trim().slice(0, 60) : '',
            gap,
            peor: peor ? desc(peor) : '',
            overflow,
            mermaid: mer,
            codeScroll: scrolls,
            imgsRotos,
            mdLiteral,
            enlaces,
            vclickOcultos: ocultos,
            dark: document.documentElement.classList.contains('dark'),
          };
        },
        { umbral: UMBRAL, conEnlaces: CHECK_ENLACES }
      );
    } catch (e) {
      fallosGotoSeguidos++;
      r = { error: String(e && e.message ? e.message : e).slice(0, 140) };
      if (fallosGotoSeguidos >= 3) {
        console.error(`ERROR: 3 navegaciones seguidas fallando en ${URL_BASE} — ¿servidor caído?`);
        await browser.close();
        process.exit(2);
      }
    }

    // construir lista de problemas
    const probs = [];
    if (r.error) probs.push('ERROR: ' + r.error);
    else {
      if (r.num !== n) probs.push(`DESYNC: visible la ${r.num}`);
      if (r.gap < 0) probs.push(`DESBORDA el pie en ${-r.gap}px (${r.peor})`);
      else if (r.gap < UMBRAL) probs.push(`apretado: gap ${r.gap}px < ${UMBRAL} (${r.peor})`);
      for (const o of r.overflow || [])
        probs.push(`overflowX ${o.lado} +${o.px}px (${o.elem})`);
      for (const m of r.mermaid || [])
        probs.push(`mermaid ${m.estado}${m.px ? ' +' + m.px + 'px' : ''}${m.elem ? ' ' + m.elem : ''}`);
      for (const s of r.codeScroll || [])
        probs.push(`codigo con scroll ${s.w}x${s.h}px (${s.elem})`);
      for (const i of r.imgsRotos || []) probs.push(`imagen rota: ${i}`);
      if (r.mdLiteral) probs.push(`** sin renderizar: …${r.mdLiteral}…`);
      for (const l of r.enlaces || []) probs.push(`enlace externo: ${l}`);
      if (r.vclickOcultos > 0) probs.push(`v-click ocultos: ${r.vclickOcultos} (¿falla ?clicks=?)`);
    }

    let captura = null;
    const quiere = CAPTURAS === 'todas' || (CAPTURAS === 'fallos' && probs.length > 0);
    if (quiere) {
      captura = `${tema}-${n}.png`;
      try {
        await page.screenshot({ path: path.join(SALIDA_CAP, captura) });
      } catch (e) {
        captura = null;
      }
    }

    const fila = {
      slide: n,
      layout,
      tema,
      titulo: r.titulo || '',
      gap: r.gap,
      problemas: probs,
      captura,
    };
    if (r.dark !== undefined) fila.dark = r.dark;
    resultados.push(fila);
    if (probs.length) {
      fallosTotales++;
      console.log(`FALLO ${tema}/${n} ${probs[0]}` + (probs.length > 1 ? ` (+${probs.length - 1})` : ''));
      for (const p of probs.slice(1)) console.log(`        · ${p}`);
    } else okTema++;
    if ((n % 25 === 0 || n === pendientes[pendientes.length - 1].n) && !probs.length)
      process.stdout.write(`… ${tema} ${n}/${pendientes[pendientes.length - 1].n}\n`);
  }
  console.log(`tema ${tema}: ${okTema}/${pendientes.length} OK`);
  await ctx.close();
}

await browser.close();

// ---------- 4. informe ----------
const reporte = {
  fecha: new Date().toISOString(),
  url: URL_BASE,
  fuente: path.relative(DECK, FUENTE),
  totalSlides: TOTAL,
  auditadas: pendientes.length,
  temas: TEMAS,
  umbral: UMBRAL,
  clicks: CLICKS,
  capturas: CAPTURAS,
  fallos: fallosTotales,
  resultados,
};
const rutaInforme = path.join(SALIDA, 'layout-report.json');
fs.writeFileSync(rutaInforme, JSON.stringify(reporte, null, 2), 'utf8');

console.log('');
console.log('=== RESUMEN ===');
console.log(`slides auditadas: ${pendientes.length} × ${TEMAS.join(',')}  ·  fallos: ${fallosTotales}`);
console.log(`informe: ${path.relative(process.cwd(), rutaInforme)}`);
console.log(`capturas: ${path.relative(process.cwd(), SALIDA_CAP)} (solo fallos)`);
process.exit(fallosTotales > 0 ? 1 : 0);
