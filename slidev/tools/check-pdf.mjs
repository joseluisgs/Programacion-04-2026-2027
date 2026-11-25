#!/usr/bin/env node
/**
 * check-pdf.mjs — valida los PDF exportados contra el fuente
 *
 * Comprobaciones (patrones de los snippets pdf-lib de Copilot + los nuestros):
 *   1. Existen los PDF (claro/oscuro) en --pdf-dir
 *   2. Nº de páginas del PDF == nº de slides del fuente (@slidev/parser)
 *   3. sha256(claro) != sha256(oscuro)  (si son iguales, el oscuro no se exportó)
 *   4. Todas las páginas del mismo tamaño
 *   5. README.md enlaza a los PDF que existen de verdad
 *   6. (opcional --png <dir>) píxeles por debajo del pie en PNGs exportados
 *
 * Uso:
 *   node tools/check-pdf.mjs [--pdf-dir ../presentaciones] [--fuente slides.md]
 *        [--readme ../README.md] [--png <dir>] [--px-umbral 30]
 *
 * exit 0 = OK · exit 1 = fallos · exit 2 = error de entorno
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const DECK = path.resolve(__dir, '..');
const req = createRequire(path.join(DECK, 'package.json'));

const argv = process.argv.slice(2);
const opt = (k, d) => {
  const i = argv.indexOf(k);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d;
};

const PDF_DIR = path.resolve(DECK, opt('--pdf-dir', '../presentaciones'));
const FUENTE = path.resolve(DECK, opt('--fuente', 'slides.md'));
const README = path.resolve(DECK, opt('--readme', '../README.md'));
const PNG_DIR = opt('--png', null) ? path.resolve(DECK, opt('--png')) : null;
const PX_UMBRAL = Number(opt('--px-umbral', '30'));

const fallos = [];
const avisos = [];

// ---------- slides esperadas ----------
let esperadas = 0;
try {
  const P = req('@slidev/parser');
  const parse = P.parse || (P.default && P.default.parse);
  const r = await parse(fs.readFileSync(FUENTE, 'utf8'));
  esperadas = (Array.isArray(r) ? r : r.slides || []).length;
} catch (e) {
  console.error('ERROR: parser del fuente → ' + e.message);
  process.exit(2);
}
if (!esperadas) {
  console.error('ERROR: el parser no devolvió slides');
  process.exit(2);
}

// ---------- localizar PDFs ----------
if (!fs.existsSync(PDF_DIR)) {
  console.error(`ERROR: no existe ${PDF_DIR}`);
  process.exit(2);
}
const archivos = fs.readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith('.pdf'));
const claro = archivos.find((f) => /claro/i.test(f));
const oscuro = archivos.find((f) => /oscuro/i.test(f));
if (!claro) fallos.push('no se encontró ningún PDF *-claro* en ' + PDF_DIR);
if (!oscuro) fallos.push('no se encontró ningún PDF *-oscuro* en ' + PDF_DIR);

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(PDF_DIR, f))).digest('hex');

// ---------- 1-4: páginas, hash, tamaños ----------
const { PDFDocument } = req('pdf-lib');
const resumen = [];
for (const nombre of [claro, oscuro].filter(Boolean)) {
  const ruta = path.join(PDF_DIR, nombre);
  const bytes = fs.readFileSync(ruta);
  let doc;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch (e) {
    fallos.push(`${nombre}: PDF ilegible → ${e.message}`);
    continue;
  }
  const paginas = doc.getPageCount();
  if (paginas !== esperadas)
    fallos.push(`${nombre}: ${paginas} páginas, pero el fuente tiene ${esperadas} slides`);

  // tamaños homogéneos
  const t0 = doc.getPage(0).getSize();
  let distintos = 0;
  for (let i = 1; i < paginas; i++) {
    const t = doc.getPage(i).getSize();
    if (Math.abs(t.width - t0.width) > 1 || Math.abs(t.height - t0.height) > 1) distintos++;
  }
  if (distintos) fallos.push(`${nombre}: ${distintos} páginas con tamaño distinto (${Math.round(t0.width)}×${Math.round(t0.height)})`);

  // anotaciones de enlace (info)
  let enlaces = 0;
  try {
    for (const p of doc.getPages()) {
      const annots = p.node.Annots && p.node.Annots();
      if (annots) enlaces += annots.size();
    }
  } catch (e) {
    enlaces = -1;
  }

  resumen.push({
    pdf: nombre,
    paginas,
    bytes: bytes.length,
    tamano: `${Math.round(t0.width)}×${Math.round(t0.height)}`,
    enlaces: enlaces >= 0 ? enlaces : 'n/d',
    sha256: sha(nombre).slice(0, 16),
  });
}

// ---------- 3: hashes distintos ----------
if (claro && oscuro) {
  const h1 = sha(claro);
  const h2 = sha(oscuro);
  if (h1 === h2) fallos.push('claro y oscuro son IDÉNTICOS: el tema oscuro no se exportó bien');
}

// ---------- 5: README enlaza a PDF existentes ----------
if (fs.existsSync(README)) {
  const md = fs.readFileSync(README, 'utf8');
  const enlaces = [...md.matchAll(/\(([^()]+\.pdf)\)/gi)].map((m) => m[1]);
  for (const rel of enlaces) {
    const destino = path.resolve(path.dirname(README), rel);
    if (!fs.existsSync(destino)) fallos.push(`README enlaza a ${rel} pero no existe`);
  }
  if (!enlaces.length) avisos.push('README sin enlaces a PDF');
  resumen.push({ readme: path.basename(README), enlacesPdf: enlaces.length });
} else {
  avisos.push('no se encontró ' + README + ' (omite con --readme "")');
}

// ---------- 6: píxeles bajo el pie (solo con --png) ----------
if (PNG_DIR) {
  if (!fs.existsSync(PNG_DIR)) {
    fallos.push(`--png: no existe ${PNG_DIR}`);
  } else {
    const pngs = fs.readdirSync(PNG_DIR).filter((f) => f.toLowerCase().endsWith('.png'));
    if (!pngs.length) avisos.push(`--png: sin PNGs en ${PNG_DIR}`);
    const { chromium } = req('playwright-chromium');
    const browser = await chromium.launch({ args: ['--no-proxy-server'] });
    const page = await browser.newPage();
    let conPx = 0;
    for (const f of pngs) {
      const b64 = fs.readFileSync(path.join(PNG_DIR, f)).toString('base64');
      const cuenta = await page.evaluate(async (src) => {
        const img = new Image();
        img.src = 'data:image/png;base64,' + src;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext('2d');
        g.drawImage(img, 0, 0);
        // franja inferior en TANTO POR CIENTO (genérica a cualquier resolución):
        // x 15%-85%, y 97%-100% → por debajo del pie
        const x1 = Math.floor(img.width * 0.15);
        const x2 = Math.floor(img.width * 0.85);
        const y1 = Math.floor(img.height * 0.97);
        const d = g.getImageData(x1, y1, x2 - x1, img.height - y1).data;
        let px = 0;
        for (let i = 0; i < d.length; i += 4)
          if (d[i] < 235 || d[i + 1] < 235 || d[i + 2] < 235) px++;
        return px;
      }, b64);
      if (cuenta > PX_UMBRAL) {
        conPx++;
        fallos.push(`${f}: ${cuenta} px no blancos bajo el pie (umbral ${PX_UMBRAL})`);
      }
    }
    resumen.push({ pngAuditados: pngs.length, conPxelesBajoPie: conPx });
    await browser.close();
  }
}

// ---------- informe ----------
const informe = {
  fecha: new Date().toISOString(),
  pdfDir: PDF_DIR,
  slidesEsperadas: esperadas,
  fallos,
  avisos,
  resumen,
};
fs.mkdirSync(path.join(DECK, 'tools', 'out'), { recursive: true });
fs.writeFileSync(path.join(DECK, 'tools', 'out', 'pdf-report.json'), JSON.stringify(informe, null, 2), 'utf8');

console.log('=== CHECK-PDF ===');
console.log(`slides esperadas: ${esperadas}`);
for (const r of resumen) console.log('  ' + JSON.stringify(r));
for (const a of avisos) console.log('AVISO: ' + a);
for (const f of fallos) console.log('FALLO: ' + f);
console.log(`informe: tools/out/pdf-report.json`);
process.exit(fallos.length ? 1 : 0);
