#!/usr/bin/env node
// Bloque le CI si le mutex entre .github/workflows/deploy.yml et
// .github/workflows/sentinelle.yml est casse.
//
// Les deux workflows mutent le MEME etat -- le contenu deploye en prod
// (hosting) ET la branche main (deploy.yml via restauration scopee hors
// .github/ + tag last-known-good ; sentinelle.yml via restauration scopee
// + push). Ils ne doivent jamais tourner en parallele. GitHub Actions le
// garantit UNIQUEMENT si les deux declarent, au niveau workflow, un bloc
// `concurrency` avec :
//   - le MEME `group:` litteral (mot pour mot), et
//   - `cancel-in-progress: false` (le 2e run attend, il n'interrompt
//     jamais un deploiement / une restauration en cours).
//
// COEUR DU MUTEX (generique, sans valeur en dur -- byte-identique a la
// version dzdiaspora_app / ot_app) : le nom du groupe n'a jamais ete le
// mecanisme de securite -- seule l'EGALITE litterale des deux groupes
// compte, quelle que soit la chaine choisie. Verifier une valeur
// "attendue" precise ajouterait une config a synchroniser sans garantie
// reelle en plus (chaque depot choisit un nom distinct par lisibilite
// humaine seulement -- GitHub scope `concurrency` par depot, jamais de
// collision inter-depots meme avec un nom identique).
//
// CHECKS DE NON-REGRESSION (deuxieme partie) : propres a la forme reelle
// de CE depot -- ne portent pas la garantie de securite du mutex,
// verifient juste qu'on ne l'a pas cassee en l'ajoutant.
"use strict";
const {readFileSync} = require("fs");
const {join} = require("path");

const WF = ".github/workflows";
const echecs = [];
const oks = [];
const check = (cond, msg) => (cond ? oks : echecs).push(msg);

// Extrait le bloc indente sous une cle de premier niveau (ex: "concurrency:"
// suivi de lignes indentees), jusqu'a la prochaine ligne non indentee.
function blocCleRacine(texte, cle) {
  const lignes = texte.split("\n");
  const i = lignes.findIndex((l) => l === cle + ":" || l.startsWith(cle + ":"));
  if (i === -1) return null;
  const corps = [];
  for (let j = i + 1; j < lignes.length; j++) {
    const l = lignes[j];
    if (l.trim() === "" || l.startsWith("#")) continue;
    if (/^\s/.test(l)) corps.push(l);
    else break;
  }
  return corps.join("\n");
}

function litYaml(nom) {
  return readFileSync(join(WF, nom), "utf8");
}

const deploy = litYaml("deploy.yml");
const sentinelle = litYaml("sentinelle.yml");
const lintYml = litYaml("lint.yml");

// --- COEUR (generique) -------------------------------------------------
const groupes = {};
for (const [nom, txt] of [["deploy.yml", deploy], ["sentinelle.yml", sentinelle]]) {
  const bloc = blocCleRacine(txt, "concurrency");
  check(bloc !== null, `${nom} : bloc 'concurrency' present au niveau workflow`);
  if (bloc === null) continue;

  const mg = bloc.match(/^\s+group:\s*(.+)$/m);
  const groupe = mg ? mg[1].trim().replace(/^["']|["']$/g, "") : null;
  groupes[nom] = groupe;
  check(groupe !== null && groupe.length > 0, `${nom} : concurrency.group present et non vide`);
  check(groupe !== null && !groupe.includes("${{"),
    `${nom} : concurrency.group est une chaine litterale (pas d'expression)`);

  const mc = bloc.match(/^\s+cancel-in-progress:\s*(.+)$/m);
  const cancel = mc ? mc[1].trim() : null;
  check(cancel === "false",
    `${nom} : cancel-in-progress explicitement 'false' (recu: ${JSON.stringify(cancel)})`);
}
check(groupes["deploy.yml"] != null && groupes["deploy.yml"] === groupes["sentinelle.yml"],
  `deploy.yml et sentinelle.yml partagent le meme groupe litteral ` +
  `(${JSON.stringify(groupes["deploy.yml"])} == ${JSON.stringify(groupes["sentinelle.yml"])})`);

// --- NON-REGRESSION (propre a dzdiaspora_site) --------------------------
const onDeploy = blocCleRacine(deploy, "on") || "";
check(/^\s+push:/m.test(onDeploy), "deploy.yml : toujours declenche sur push");
check(/paths-ignore:/.test(onDeploy) && /\.github\/\*\*/.test(onDeploy),
  "deploy.yml : paths-ignore inclut toujours .github/**");
check(!/^\s+schedule:/m.test(onDeploy),
  "deploy.yml : pas de schedule (ne partage pas le declencheur de sentinelle)");

const onSent = blocCleRacine(sentinelle, "on") || "";
check(/^\s+schedule:/m.test(onSent) && /cron:\s*["']0 4 \* \* \*["']/.test(onSent),
  "sentinelle.yml : toujours declenche par cron 0 4 * * *");
check(/^\s+workflow_dispatch:/m.test(onSent),
  "sentinelle.yml : workflow_dispatch (dry-run manuel) toujours present");
check(!/^\s+push:/m.test(onSent),
  "sentinelle.yml : pas de push (ne partage pas le declencheur de deploy)");

// --- 3e workflow hors mutex (equivalent app-ci.yml de dzdiaspora_app) ----
check(blocCleRacine(lintYml, "concurrency") === null,
  "lint.yml : aucun bloc concurrency -> pas serialise inutilement");

for (const o of oks) console.log("  ok   " + o);
for (const e of echecs) console.log("  FAIL " + e);
console.log("");
if (echecs.length) {
  console.error(`verifier-mutex-workflows : ${echecs.length} echec(s).`);
  process.exit(1);
}
console.log(`verifier-mutex-workflows : tous les controles passent (${oks.length}).`);
