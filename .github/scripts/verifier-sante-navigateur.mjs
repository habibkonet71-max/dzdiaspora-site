#!/usr/bin/env node
// Sante NAVIGATEUR synthetique de dzdiaspora.online : charge N pages
// critiques dans Chromium headless (contexte neuf, sans extension) et
// echoue si le JS d'une page est casse -- ce que curl + HTTP 200
// (verifier-sante-globale.sh) ne peut pas voir. Motif : incident el_main
// du 2026-08-30 (double-load du widget Google Translate -> "RangeError:
// Maximum call stack size exceeded" sur 12 pages, invisible ~7 semaines
// car le HTML servait toujours 200).
//
// Contrat de sortie IDENTIQUE a verifier-sante-globale.sh : derniere ligne
// de stdout = "sain" | "souci_majeur" ; le detail va sur stderr ;
// process.exit(0) TOUJOURS (l'appelant lit la derniere ligne stdout).
import { chromium } from "playwright";

// Reutilisable pour ot_app / ot_app_commercial : surcharger SITE_BASE_URL
// et PAGES (liste separee par des virgules) sans toucher au code.
const BASE = process.env.SITE_BASE_URL || "https://dzdiaspora.online";
const PAGES = (process.env.PAGES || [
  "/", "/objets-trouves.html", "/annuaire-pro.html", "/transport.html",
  "/contact.html", "/connexion.html", "/deposer-demande.html", "/tourisme.html",
].join(",")).split(",").map((s) => s.trim()).filter(Boolean);

// Hotes ou un statut >= 400 est un vrai echec fonctionnel (pas du bruit tiers).
const HOTES_CRITIQUES = [
  "firestore.googleapis.com", "identitytoolkit.googleapis.com",
  "cloudfunctions.net", "www.gstatic.com", // firebasejs
];

// Hotes dont un 4xx est ATTENDU dans un navigateur synthetique et sans
// consequence pour un vrai visiteur :
//  - firebaseappcheck : reCAPTCHA v3 ne peut pas aboutir sans jeton de
//    debug ; un vrai probleme d'App Check se verrait de toute facon en 403
//    sur firestore/functions, qui SONT dans HOTES_CRITIQUES ;
//  - gc.zgo.at : beacon GoatCounter, coupe par les bloqueurs.
const HOTES_IGNORES = ["firebaseappcheck.googleapis.com", "gc.zgo.at"];

// Erreurs console tierces benignes -> ignorees. Demarrer TRES court ;
// n'elargir que sur preuve d'un faux positif recurrent (rodage sur les
// premiers runs, cf. design du chantier).
// requestStorageAccess : reCAPTCHA v3 (charge par initializeAppCheck sur
// objets-trouves.html, seule page a l'utiliser) ne peut pas obtenir l'acces
// au storage dans un contexte synthetique sans geste utilisateur -- meme
// cause deja excusee cote reseau via HOTES_IGNORES ("firebaseappcheck :
// reCAPTCHA v3 ne peut pas aboutir sans jeton de debug"), simplement
// jamais ajoutee cote console. Preuve de recurrence : 3 occurrences reelles
// sur cette page (deploy.yml du 2026-09-03, health-check + recheck de
// sentinelle.yml du 2026-09-04).
const CONSOLE_ALLOWLIST = [/gc\.zgo\.at/, /translate\.googleapis\.com/, /requestStorageAccess/];

const TIMEOUT_GOTO_MS = 20000;
const SETTLE_MS = 3500; // laisse chargerAlertes / l'init traduction tourner
const RETRIES = 1; // 1 retry par page en echec (absorbe un transitoire)

// En CI : chromium bundle (npx playwright install chromium) -> channel non
// defini. En local, si le navigateur bundle n'est pas telecharge, pointer
// vers un Chrome/Chromium deja installe : PW_CHANNEL=chrome node ...
const PW_CHANNEL = process.env.PW_CHANNEL || undefined;

const err = (m) => process.stderr.write(m + "\n");

async function verifierPage(context, chemin) {
  const url = BASE + chemin;
  const page = await context.newPage();
  const pb = [];

  page.on("pageerror", (e) => {
    pb.push(`exception JS non catchee : ${e.name}: ${e.message}`);
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // Chrome emet un console.error pour CHAQUE requete reseau en echec
    // ("Failed to load resource: ... status 4xx/5xx") -- redondant avec
    // page.on('response') qui a l'URL et filtre sur les hotes critiques.
    if (/Failed to load resource/i.test(t)) return;
    if (CONSOLE_ALLOWLIST.some((re) => re.test(t))) return;
    pb.push(`console.error : ${t.slice(0, 200)}`);
  });
  page.on("response", (r) => {
    if (r.status() < 400) return;
    let u;
    try {
      u = new URL(r.url());
    } catch {
      return;
    }
    if (HOTES_IGNORES.some((h) => u.hostname === h || u.hostname.endsWith("." + h))) return;
    if (HOTES_CRITIQUES.some((c) => u.hostname === c || u.hostname.endsWith("." + c))) {
      pb.push(`HTTP ${r.status()} sur ${u.hostname}${u.pathname}`);
    }
  });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: TIMEOUT_GOTO_MS });
  } catch (e) {
    // networkidle peut ne jamais arriver (polling, iframe) -> on tolere le
    // timeout de navigation et on continue avec ce qui est charge.
    if (!/Timeout/.test(String(e))) pb.push(`goto a echoue : ${e.message}`);
  }
  await page.waitForTimeout(SETTLE_MS);

  // Signaux DOM UNIVERSELS (les 8 pages ont des en-tetes heterogenes -- le
  // nombre de liens de nav va de 0 a 7 -- donc on ne s'appuie que sur ce
  // qui est present partout) : le selecteur de langue rendu, et
  // #auth-btn-header peuple (prouve que le module Firebase Auth a execute
  // son onAuthStateChanged ; "Connexion" si non connecte, sinon le bouton
  // du compte -- dans les deux cas, non vide).
  const dom = await page
    .evaluate(() => ({
      langs: document.querySelectorAll(".lang-btn").length,
      authRempli: !!(
        document.getElementById("auth-btn-header") &&
        document.getElementById("auth-btn-header").textContent.trim()
      ),
    }))
    .catch((e) => ({ langs: -1, authRempli: false, evalErr: e.message }));

  if (dom.langs < 1) {
    pb.push(`DOM : selecteur de langue absent (.lang-btn = ${dom.langs}) -- en-tete non rendu ?`);
  }
  if (!dom.authRempli) {
    pb.push(`DOM : #auth-btn-header vide -- JS Firebase Auth (onAuthStateChanged) non execute`);
  }

  await page.close();
  return pb;
}

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: PW_CHANNEL });
  } catch (e) {
    err(`- Chromium n'a pas pu demarrer : ${e.message}`);
    console.log("souci_majeur"); // env de test casse = a traiter comme souci
    process.exit(0);
    return;
  }
  const context = await browser.newContext({
    locale: "fr-FR",
    userAgent: "DZ-Sentinelle-Navigateur/1.0 (+https://dzdiaspora.online)",
  });

  const echecs = [];
  for (const chemin of PAGES) {
    let pb = [];
    for (let i = 0; i <= RETRIES; i++) {
      pb = await verifierPage(context, chemin);
      if (pb.length === 0) break;
      if (i < RETRIES) err(`  (retry ${chemin} apres : ${pb[0]})`);
    }
    if (pb.length) {
      echecs.push(chemin);
      err(`- ${chemin} :`);
      for (const p of pb) err(`    ${p}`);
    }
  }

  await browser.close();

  if (echecs.length) {
    err(`\n${echecs.length} page(s) en echec : ${echecs.join(", ")}`);
    console.log("souci_majeur");
  } else {
    err(`${PAGES.length} pages verifiees -- aucun probleme JS / reseau / DOM.`);
    console.log("sain");
  }
  process.exit(0);
}

main();
