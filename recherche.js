const indexRecherche = [
  { motsCles: ["securite", "urgence", "police", "pompier", "samu", "danger"], page: "securite.html" },
  { motsCles: ["sante", "medecin", "hopital", "pharmacie", "maladie", "vaccin"], page: "sante.html" },
  { motsCles: ["finance", "banque", "argent", "change", "devise", "transfert"], page: "finance.html" },
  { motsCles: ["administratif", "passeport", "consulat", "carte identite", "visa", "papier"], page: "administratif.html" },
  { motsCles: ["wilaya", "wilayas", "region", "ville algerie"], page: "wilayas.html" },
  { motsCles: ["annonce", "annonces", "immobilier", "covoiturage", "vehicule", "service", "vente", "location"], page: "annonces.html" },
  { motsCles: ["abonnement", "pro", "professionnel", "premium"], page: "abonnement.html" },
  { motsCles: ["contact", "ecrire", "email"], page: "contact.html" },
  { motsCles: ["cgu", "mention legale", "condition", "confidentialite"], page: "cgu.html" }
];

const motsClesVol = ["vol", "vols", "avion", "billet", "aeroport", "alger", "oran", "constantine", "annaba", "paris", "marseille", "lyon", "alicante", "barcelone", "madrid", "istanbul", "londres"];

function normaliserTexteRecherche(texte) {
  const avecAccents = "àâäáãåèéêëìíîïòóôõöùúûüçñÀÂÄÁÃÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÇÑ";
  const sansAccents = "aaaaaaeeeeiiiiooooouuuucnAAAAAAEEEEIIIIOOOOOUUUUCN";
  let resultat = texte.toLowerCase();
  for (let i = 0; i < avecAccents.length; i++) {
    resultat = resultat.split(avecAccents[i]).join(sansAccents[i]);
  }
  return resultat;
}

function rechercheEstLieeAuxVols(texteNormalise) {
  return motsClesVol.some((mot) => texteNormalise.includes(mot));
}

function trouverPageCorrespondante(texteNormalise) {
  for (const entree of indexRecherche) {
    for (const motCle of entree.motsCles) {
      const motCleNormalise = normaliserTexteRecherche(motCle);
      if (texteNormalise.includes(motCleNormalise)) {
        return entree.page;
      }
    }
  }
  return null;
}

function lancerRechercheUniverselle(texteOriginal) {
  const texte = texteOriginal.trim();
  if (texte === "") return;

  const texteNormalise = normaliserTexteRecherche(texte);

  if (rechercheEstLieeAuxVols(texteNormalise)) {
    const requete = encodeURIComponent(texte);
    window.open(`https://www.skyscanner.fr/transport/vols?query=${requete}`, "_blank");
    return;
  }

  const pageCorrespondante = trouverPageCorrespondante(texteNormalise);
  if (pageCorrespondante) {
    window.location.href = pageCorrespondante;
    return;
  }

  const requeteGoogle = encodeURIComponent(texte + " Algerie diaspora");
  window.open(`https://www.google.com/search?q=${requeteGoogle}`, "_blank");
}

document.addEventListener("DOMContentLoaded", function () {
  const inputRecherche = document.getElementById("rechercheInput");
  if (inputRecherche) {
    inputRecherche.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        lancerRechercheUniverselle(this.value);
      }
    });
  }
});
