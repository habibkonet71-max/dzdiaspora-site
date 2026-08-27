// Logique pure du tableau de bord "Sentinelles" de admin-pro.html
// (chantier "sentinelle analyste", etape 4/9). "Qui surveille le
// surveillant" : lit la collection etat_securite_global (un heartbeat par
// sentinelle, ecrit en fin de run par les Cloud Functions) et en derive un
// etat affichable, DONT une detection de fraicheur cote client -- une
// sentinelle qui a cesse de tourner en silence laisse un dernier doc fige
// sur "sain", seul l'ecart entre derniere_execution et maintenant le
// revele.
//
// Ce fichier est volontairement sans DOM ni Firebase : entrees = objets
// simples, sorties = objets / chaines HTML. Il est charge tel quel par la
// page (<script src>, expose window.SentinellesSante) et require() par le
// test hors-ligne (scripts de CI / verification manuelle). Aucune des deux
// voies ne doit necessiter de reseau.
"use strict";

(function () {
  // Marge de retard unique pour tout le systeme : une sentinelle est "en
  // retard" quand elle n'a pas tourne depuis plus de 1.5x sa frequence
  // attendue. Meme valeur que le heartbeat de la future cheffe sentinelle
  // -- une seule regle coherente, pas deux seuils differents sans raison.
  var MARGE_RETARD = 1.5;

  var MS_PAR_MIN = 60 * 1000;
  var MS_PAR_HEURE = 60 * MS_PAR_MIN;
  var MS_PAR_JOUR = 24 * MS_PAR_HEURE;

  function estNombreFini(v) {
    return typeof v === "number" && isFinite(v);
  }

  function echapper(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }

  // doc : forme deja aplatie du document etat_securite_global/<sentinelle>
  //   { sentinelle, statut, derniere_execution_ms, frequence_attendue_min,
  //     code_resume, resume, perimetre_declare }
  //   derniere_execution_ms = epoch en millisecondes (l'appelant convertit
  //   le Timestamp Firestore) ou null/absent si jamais execute.
  // maintenantMs : Date.now() au moment du rendu (injecte pour testabilite).
  function classerSentinelle(doc, maintenantMs) {
    doc = doc || {};
    var nom = typeof doc.sentinelle === "string" && doc.sentinelle ? doc.sentinelle : "(inconnue)";
    // Tout ce qui n'est pas exactement "anomalie" est traite comme "sain" :
    // un statut absent ou inattendu ne doit pas se faire passer pour une
    // alerte rouge, mais la fraicheur ci-dessous reste calculee.
    var statut = doc.statut === "anomalie" ? "anomalie" : "sain";

    var derniereExecMs = estNombreFini(doc.derniere_execution_ms) ? doc.derniere_execution_ms : null;
    var jamaisExecutee = derniereExecMs === null;
    var ageMs = jamaisExecutee ? null : maintenantMs - derniereExecMs;

    var frequenceMin =
      estNombreFini(doc.frequence_attendue_min) && doc.frequence_attendue_min > 0
        ? doc.frequence_attendue_min
        : null;

    var enRetard;
    if (jamaisExecutee) {
      enRetard = true;
    } else if (frequenceMin === null) {
      // Pas de frequence declaree : aucune base pour juger un retard.
      enRetard = false;
    } else if (ageMs < 0) {
      // Horloge du navigateur en avance / timestamp futur : on ne crie pas
      // au retard pour un ecart negatif.
      enRetard = false;
    } else {
      enRetard = ageMs > frequenceMin * MS_PAR_MIN * MARGE_RETARD;
    }

    return {
      nom: nom,
      statut: statut,
      enRetard: enRetard,
      jamaisExecutee: jamaisExecutee,
      derniereExecMs: derniereExecMs,
      ageMs: ageMs,
      frequenceMin: frequenceMin,
      codeResume: typeof doc.code_resume === "string" ? doc.code_resume : "",
      resume: typeof doc.resume === "string" ? doc.resume : "",
      perimetre: Array.isArray(doc.perimetre_declare)
        ? doc.perimetre_declare.filter(function (x) { return typeof x === "string"; })
        : [],
    };
  }

  function formaterAge(deltaMs) {
    if (deltaMs === null || deltaMs === undefined || !isFinite(deltaMs)) return "—";
    if (deltaMs < 0) return "a l'instant";
    if (deltaMs < MS_PAR_MIN) return "il y a moins d'une minute";
    if (deltaMs < MS_PAR_HEURE) return "il y a " + Math.floor(deltaMs / MS_PAR_MIN) + " min";
    if (deltaMs < 2 * MS_PAR_JOUR) return "il y a " + Math.floor(deltaMs / MS_PAR_HEURE) + " h";
    return "il y a " + Math.floor(deltaMs / MS_PAR_JOUR) + " j";
  }

  // Frequence attendue en clair : "toutes les 24 h" / "toutes les 90 min".
  function formaterFrequence(frequenceMin) {
    if (frequenceMin === null || frequenceMin === undefined || !isFinite(frequenceMin)) {
      return "frequence non declaree";
    }
    if (frequenceMin % 60 === 0) return "toutes les " + frequenceMin / 60 + " h";
    return "toutes les " + frequenceMin + " min";
  }

  // Tri : anomalies d'abord, puis retards / jamais executees, puis saines.
  // A rang egal, ordre alphabetique du nom. Trie la liste en place ET la
  // renvoie (pratique pour chainer).
  function trierSentinelles(liste) {
    function rang(s) {
      if (s.statut === "anomalie") return 0;
      if (s.enRetard || s.jamaisExecutee) return 1;
      return 2;
    }
    liste.sort(function (a, b) {
      return rang(a) - rang(b) || a.nom.localeCompare(b.nom, "fr");
    });
    return liste;
  }

  // s : sortie de classerSentinelle(). Rend une carte HTML (chaine).
  // Reutilise les classes CSS existantes de admin-pro.html : .card-alerte
  // pour le cadre, .pastille(.ok|.bloque|.retard) pour les indicateurs.
  function carteSentinelle(s) {
    var pastilleStatut =
      s.statut === "anomalie"
        ? '<span class="pastille bloque">Anomalie</span>'
        : '<span class="pastille ok">Sain</span>';

    var pastilleRetard = "";
    if (s.jamaisExecutee) {
      pastilleRetard = '<span class="pastille retard">Jamais executee</span>';
    } else if (s.enRetard) {
      pastilleRetard = '<span class="pastille retard">En retard</span>';
    }

    var age = s.jamaisExecutee ? "Jamais executee" : formaterAge(s.ageMs);

    var perimetre = s.perimetre.length
      ? '<div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:6px;">Perimetre : ' +
        s.perimetre.map(echapper).join(" &middot; ") +
        "</div>"
      : "";

    var resume = s.resume
      ? '<div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px;">' +
        echapper(s.resume) +
        "</div>"
      : "";

    var codeResume = s.codeResume
      ? '<span style="color:rgba(255,255,255,0.4);font-size:11px;font-family:ui-monospace,Menlo,Consolas,monospace;">' +
        echapper(s.codeResume) +
        "</span>"
      : "";

    return (
      '<div class="card-alerte" style="display:block;">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">' +
      '<span style="color:white;font-size:14px;font-weight:700;">' + echapper(s.nom) + "</span>" +
      pastilleStatut +
      pastilleRetard +
      "</div>" +
      '<div style="color:rgba(255,255,255,0.5);font-size:12px;">' +
      "Derniere execution : " + echapper(age) +
      ' &nbsp;|&nbsp; attendue ' + echapper(formaterFrequence(s.frequenceMin)) +
      (codeResume ? " &nbsp;|&nbsp; " + codeResume : "") +
      "</div>" +
      resume +
      perimetre +
      "</div>"
    );
  }

  var api = {
    MARGE_RETARD: MARGE_RETARD,
    classerSentinelle: classerSentinelle,
    formaterAge: formaterAge,
    formaterFrequence: formaterFrequence,
    trierSentinelles: trierSentinelles,
    carteSentinelle: carteSentinelle,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.SentinellesSante = api;
})();
