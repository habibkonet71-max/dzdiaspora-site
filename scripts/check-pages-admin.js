#!/usr/bin/env node
// Verifie que toute page admin-*.html porte bien le verrou PIN standard du
// site (meme convention que admin-pro.html). But : empecher qu'une nouvelle
// page admin soit livree sans protection, ou qu'un refactor supprime le
// verrou par erreur — exactement le bug trouve sur admin-pub.html (et
// retrouve independamment sur admin-rdv.html) lors de l'audit du 2026-08-16.
// Ce check est un proxy syntaxique : il verifie la presence du HTML/JS du
// verrou, pas que la securite reelle (regles Firestore cote serveur) est
// correcte — ca reste du ressort d'un audit manuel.
"use strict";
const fs = require("fs");
const path = require("path");

const fichiers = process.argv.slice(2);
if (fichiers.length === 0) {
  console.error("Usage: check-pages-admin.js <admin-*.html> [...]");
  process.exit(2);
}

const MARQUEURS = [
  { motif: /id=["']ecran-pin["']/, label: "ecran PIN (id=\"ecran-pin\")" },
  { motif: /validerPin/, label: "fonction validerPin" },
];

let totalProblemes = 0;

for (const fichier of fichiers) {
  const html = fs.readFileSync(fichier, "utf8");
  const rel = path.relative(process.cwd(), fichier);
  const manquants = MARQUEURS.filter((m) => !m.motif.test(html));
  if (manquants.length > 0) {
    totalProblemes++;
    console.error(
      `${rel}: verrou PIN absent ou incomplet — manque : ${manquants.map((m) => m.label).join(", ")}`
    );
  }
}

if (totalProblemes > 0) {
  console.error(`\n${totalProblemes} page(s) admin non protegee(s) trouvee(s).`);
  process.exit(1);
}
