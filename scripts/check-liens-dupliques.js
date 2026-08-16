#!/usr/bin/env node
// Detecte les <a href="..."> duplique. Deux heuristiques, pour couvrir les
// deux bugs coemtiques trouves lors de l'audit du 2026-08-16 :
//  1) meme href repete parmi les enfants directs d'un meme parent (menu,
//     nav...) — attrape le lien "Accueil" duplique.
//  2) meme href + meme texte repetes dans la meme section, meme si le HTML
//     malforme autour (balise mal fermee) les place a des profondeurs DOM
//     differentes — attrape la carte "BNH" dupliquee (div grid-cartes
//     imbriquee par erreur, qui aurait fait rater l'heuristique 1 seule).
"use strict";
const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");

const fichiers = process.argv.slice(2);
if (fichiers.length === 0) {
  console.error("Usage: check-liens-dupliques.js <fichier.html> [...]");
  process.exit(2);
}

let totalProblemes = 0;

function normaliserTexte(t) {
  return t.replace(/\s+/g, " ").trim();
}

for (const fichier of fichiers) {
  const html = fs.readFileSync(fichier, "utf8");
  const root = parse(html);
  const rel = path.relative(process.cwd(), fichier);

  // Heuristique 1 : href duplique parmi les enfants directs d'un meme parent.
  for (const parent of root.querySelectorAll("*")) {
    const hrefsVus = new Map();
    for (const enfant of parent.childNodes) {
      if (!enfant.rawTagName || enfant.rawTagName.toLowerCase() !== "a") continue;
      const href = (enfant.getAttribute("href") || "").trim();
      if (!href || href === "#") continue;
      if (!hrefsVus.has(href)) hrefsVus.set(href, []);
      hrefsVus.get(href).push(enfant);
    }
    for (const [href, occurrences] of hrefsVus) {
      if (occurrences.length > 1) {
        totalProblemes++;
        const texte = occurrences[0].text.trim().slice(0, 40);
        console.error(
          `${rel}: lien "${href}" (${JSON.stringify(texte)}) repete ${occurrences.length} fois dans le meme bloc`
        );
      }
    }
  }

  // Heuristique 2 : meme href + meme texte, n'importe ou dans la meme
  // <section>, meme a des profondeurs DOM differentes. Limite aux liens qui
  // contiennent un titre (h1-h6) — les vraies "cartes" (BNH...) en ont un,
  // les boutons d'appel a l'action repetes sous plusieurs offres (ex:
  // "Commander cet espace" sous 4 formules de prix) n'en ont pas et ne
  // doivent pas etre signales.
  for (const section of root.querySelectorAll("section")) {
    const vus = new Map();
    for (const a of section.querySelectorAll("a")) {
      if (!a.querySelector("h1, h2, h3, h4, h5, h6")) continue;
      const href = (a.getAttribute("href") || "").trim();
      if (!href || href === "#") continue;
      const texte = normaliserTexte(a.text);
      if (!texte) continue;
      const cle = JSON.stringify([href, texte]);
      if (!vus.has(cle)) vus.set(cle, { href, texte, occurrences: [] });
      vus.get(cle).occurrences.push(a);
    }
    for (const { href, texte, occurrences } of vus.values()) {
      if (occurrences.length > 1) {
        totalProblemes++;
        console.error(
          `${rel}: lien "${href}" (${JSON.stringify(texte.slice(0, 40))}) repete ${occurrences.length} fois dans la meme section`
        );
      }
    }
  }
}

if (totalProblemes > 0) {
  console.error(`\n${totalProblemes} lien(s) duplique(s) trouve(s).`);
  process.exit(1);
}
