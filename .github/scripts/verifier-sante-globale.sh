#!/usr/bin/env bash
# Verifie la sante globale du site dzdiaspora_site : ce depot n'a aucune
# Cloud Function (contrairement a ot_app et dzdiaspora_app), il sert
# uniquement du contenu statique (Hosting). Vérifie donc uniquement :
#  1) que le site repond
#  2) que le verrou PIN (id="ecran-pin" + validerPin) est toujours present
#     dans le HTML reellement servi des 3 pages admin - meme convention
#     que scripts/check-pages-admin.js (lint local) et
#     dzdiaspora_app/functions/sentinelle.js:verifierPageAdmin (alerte
#     seule, sans auto-correction, car ce depot n'avait jusqu'ici aucun
#     pipeline de deploiement automatise).
# Imprime "sain" ou "souci_majeur" comme derniere ligne de stdout ; le
# detail des echecs va sur stderr.
#
# Souci majeur = le site est injoignable, OU le verrou PIN a disparu d'au
# moins une des 3 pages admin. Aucune tolerance sur le verrou PIN : une
# page admin sans son verrou est une regression de securite en soi, pas un
# alea reseau possible.
set -uo pipefail

SITE_URL="https://dzdiaspora.online/"
PAGES_ADMIN="admin-pro admin-pub admin-rdv"

code_site=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$SITE_URL")
if [ "$code_site" != "200" ]; then
  echo "- site public injoignable (code HTTP $code_site)" >&2
  echo "souci_majeur"
  exit 0
fi

for page in $PAGES_ADMIN; do
  html=$(curl -s --max-time 15 "https://dzdiaspora.online/$page.html")
  # Note : grep <<< (here-string) plutot que echo "$html" | grep -q - avec
  # pipefail actif, un `echo` d'un gros contenu (~90 Ko) peut recevoir
  # SIGPIPE quand grep -q trouve sa correspondance tot et ferme le tuyau,
  # ce qui fait remonter un code 141 meme si grep a bien trouve le motif.
  if ! grep -q 'id="ecran-pin"' <<< "$html" || ! grep -q "validerPin" <<< "$html"; then
    echo "- verrou PIN absent sur $page.html (site en ligne)" >&2
    echo "souci_majeur"
    exit 0
  fi
done

echo "sain"
