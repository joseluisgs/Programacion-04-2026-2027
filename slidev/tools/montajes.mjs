#!/usr/bin/env node
/**
 * montajes.mjs — hojas de contacto con las capturas de visual-check.mjs
 *
 * Convierte N capturas en hojas de 12 (3×4) para revisar de un vistazo.
 * Si hay layout-report.json en la misma carpeta, marca en rojo las slides
 * con fallo (borde rojo + etiqueta "FALLO").
 *
 * Uso:
 *   node tools/montajes.mjs [--entrada tools/out/capturas]
 *        [--salida tools/out/hojas] [--por-hoja 12] [--cols 3] [--ancho 490]
 *
 * Entrada: PNG nombrados <tema>-<n>.png (o <n>.png).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const DECK = path.resolve(__dir, '..');
const req = createRequire(path.join(DECK, 'package.json'));
const { chromium } = req('playwright-chromium');

const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf(k);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d;
};

const ENTRADA = path.resolve(DECK, opt('--entrada', 'tools/out/capturas'));
const SALIDA = path.resolve(DECK, opt('--salida', 'tools/out/hojas'));
const POR_HOJA = Number(opt('--por-hoja', '12'));
const COLS = Number(opt('--cols', '3'));
const ANCHO = Number(opt('--ancho', '490'));
const ALTO = Math.round((ANCHO * 9) / 16);

if (!fs.existsSync(ENTRADA)) {
  console.error(`ERROR: no existe la carpeta de capturas ${ENTRADA}`);
  process.exit(2);
}
fs.mkdirSync(SALIDA, { recursive: true });

// ¿hay informe? → slides con fallo
const fallidas = new Set();
const rutaInforme = path.join(path.dirname(ENTRADA), 'layout-report.json');
if (fs.existsSync(rutaInforme)) {
  try {
    const rep = JSON.parse(fs.readFileSync(rutaInforme, 'utf8'));
    for (const r of rep.resultados || []) if ((r.problemas || []).length) fallidas.add(r.slide);
    console.log(`informe: ${fallidas.size} slides con fallo`);
  } catch (e) {
    console.warn('aviso: no se pudo leer layout-report.json: ' + e.message);
  }
}

// PNGs ordenados numéricamente
const pngs = fs
  .readdirSync(ENTRADA)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .map((f) => ({ f, n: Number((f.match(/(\d+)\.png$/i) || [])[1] || 0) }))
  .sort((a, b) => a.n - b.n || a.f.localeCompare(b.f));

if (!pngs.length) {
  console.log('no hay capturas que montar');
  process.exit(0);
}

const hojas = [];
for (let i = 0; i < pngs.length; i += POR_HOJA) hojas.push(pngs.slice(i, i + POR_HOJA));
console.log(`montando ${pngs.length} capturas en ${hojas.length} hoja(s)`);

const browser = await chromium.launch({ args: ['--no-proxy-server'] });
const page = await browser.newPage({ viewport: { width: COLS * (ANCHO + 20) + 40, height: 1200 } });

let hechas = 0;
for (let h = 0; h < hojas.length; h++) {
  const celdas = hojas[h]
    .map(({ f, n }) => {
      const b64 = fs.readFileSync(path.join(ENTRADA, f)).toString('base64');
      const fail = fallidas.has(n);
      return `<div class="celda${fail ? ' fail' : ''}">
        <img src="data:image/png;base64,${b64}" alt="${f}">
        <div class="etq">${f}${fail ? ' — FALLO' : ''}</div>
      </div>`;
    })
    .join('\n');

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body { margin:0; background:#1a1a1a; font-family:Segoe UI, sans-serif; padding:16px; }
    .rejilla { display:flex; flex-wrap:wrap; gap:14px; }
    .celda { background:#000; border-radius:4px; overflow:hidden; }
    .celda img { display:block; width:${ANCHO}px; height:${ALTO}px; object-fit:cover; }
    .celda.fail { outline:4px solid #f44336; outline-offset:-4px; }
    .etq { color:#eee; font-size:15px; padding:6px 10px; }
    .celda.fail .etq { color:#ff8a80; font-weight:bold; }
    .hoja { color:#888; font-size:13px; margin-bottom:8px; letter-spacing:.08em; }
  </style></head><body>
  <div class="hoja">HOJA ${h + 1}/${hojas.length}</div>
  <div class="rejilla">${celdas}</div>
  </body></html>`;

  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(150);
  const nombre = `hoja-${String(h + 1).padStart(2, '0')}.png`;
  await page.screenshot({ path: path.join(SALIDA, nombre), fullPage: true });
  hechas++;
}

await browser.close();
console.log(`${hechas} hoja(s) en ${path.relative(process.cwd(), SALIDA)}`);
