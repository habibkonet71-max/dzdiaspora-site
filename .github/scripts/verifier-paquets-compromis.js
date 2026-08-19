#!/usr/bin/env node
// Bloque le CI si un paquet npm connu comme compromis est detecte dans un
// package-lock.json de ce depot - attaque de la chaine d'approvisionnement
// keyv/cacheable du 4 aout 2026 ("Shai-Hulud"/"mini Shai-Hulud") : compte
// GitHub du mainteneur pris, versions piegees publiees avec un hook
// preinstall voleur d'identifiants (npm/GitHub/cloud/CI) et capable de
// planter des hooks de persistance dans .claude/settings.json et
// .vscode/tasks.json. Sources : Snyk, Socket.dev, Wiz, The Hacker News,
// Chainguard (aout 2026).
//
// Cette liste devient perimee avec le temps (nouvelles versions saines
// publiees, ou nouvelle vague d'attaque) - c'est un filet immediat pour
// cet incident precis, pas une protection permanente. La protection
// permanente est ignore-scripts=true (.npmrc) partout ou c'est sans
// risque (voir les depots concernes).
const fs = require('fs');
const path = require('path');

const PAQUETS_COMPROMIS = {
  keyv: ['6.0.0'],
  '@keyv/redis': ['6.0.0'],
  '@keyv/sqlite': ['6.0.0'],
  '@keyv/mongo': ['6.0.0'],
  cacheable: ['2.5.1'],
  'cacheable-request': ['13.0.20'],
  'flat-cache': ['6.1.24'],
  'file-entry-cache': ['11.1.7'],
  'cache-manager': ['7.2.10'],
  '@cacheable/utils': ['2.5.1'],
  '@cacheable/memory': ['2.2.1'],
  '@cacheable/node-cache': ['3.1.2'],
  '@cacheable/net': ['2.1.1'],
};

function trouverLockfiles(dir, resultats = []) {
  for (const entree of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entree.name === 'node_modules' || entree.name === '.git') continue;
    const p = path.join(dir, entree.name);
    if (entree.isDirectory()) {
      trouverLockfiles(p, resultats);
    } else if (entree.name === 'package-lock.json') {
      resultats.push(p);
    }
  }
  return resultats;
}

const compromis = [];
for (const lockfile of trouverLockfiles(process.cwd())) {
  const data = JSON.parse(fs.readFileSync(lockfile, 'utf8'));
  for (const [cle, info] of Object.entries(data.packages || {})) {
    if (cle === '') continue;
    const nom = info.name || cle.split('node_modules/').pop();
    const version = info.version;
    if (PAQUETS_COMPROMIS[nom] && PAQUETS_COMPROMIS[nom].includes(version)) {
      compromis.push(`${nom}@${version} dans ${lockfile}`);
    }
  }
}

if (compromis.length > 0) {
  console.error('SOUCI MAJEUR : paquet(s) npm connu(s) comme compromis detecte(s) :');
  compromis.forEach((c) => console.error(`  - ${c}`));
  console.error('npm ci/install NON execute. Details : https://socket.dev/blog/popular-npm-packages-in-the-keyv-and-cacheable-namespaces-compromised-in-active-supply-chain');
  process.exit(1);
}

console.log('Aucun paquet npm compromis connu detecte.');
