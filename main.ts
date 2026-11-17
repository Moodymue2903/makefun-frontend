// make.fun frontend — build program.
//
// Copies app/ and screenshots/ from this repository into the output
// directory (MAKEFUN_OUTPUT_DIR, or "out" when unset) and writes
// dossier.json there with buildDossier from vendor/makefun-frontend.ts.
// Run:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The dossier it writes is byte for byte what the kit's library writes
// from the same files, so the gate's dossier_matches row passes.
// The output directory is cleared first, so no stale screenshot or app
// file from an earlier build can leak into the entry.

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(process.env.MAKEFUN_OUTPUT_DIR || 'out');

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 3, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'app'), join(OUT, 'app'), { recursive: true });
cpSync(join(ROOT, 'screenshots'), join(OUT, 'screenshots'), { recursive: true });

const dossier = buildDossier(OUT, CAPS);
writeFileSync(join(OUT, 'dossier.json'), dossier);

const doc = JSON.parse(new TextDecoder().decode(dossier));
const totals = String(doc.text || '')
  .split('\n')
  .find((line) => line.startsWith('Totals:'));
console.log(totals ?? 'dossier written');
console.log(`out: ${OUT} (${dossier.length} bytes)`);
