function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "fr",
      includedLanguages: "fr,en,zh-CN,ar",
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    "google_translate_element"
  );
}

function changerLangueSite(codeLangue) {
  // RTL automatique pour l arabe
  document.documentElement.dir = (codeLangue === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = (codeLangue === 'zh') ? 'zh-CN' : codeLangue;
  document.querySelectorAll(".lang-btn").forEach(function (bouton) {
    bouton.classList.remove("active");
  });
  const boutonActif = document.querySelector('.lang-btn[data-lang="' + codeLangue + '"]');
  if (boutonActif) {
    boutonActif.classList.add("active");
  }

  if (codeLangue === "fr") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    window.location.reload();
    return;
  }

  const codeCible = codeLangue === "zh" ? "zh-CN" : codeLangue;
  const select = document.querySelector("#google_translate_element select.goog-te-combo");
  if (select) {
    select.value = codeCible;
    select.dispatchEvent(new Event("change"));
  } else {
    document.cookie = "googtrans=/fr/" + codeCible + "; path=/";
    window.location.reload();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);

  const hiddenDiv = document.createElement("div");
  hiddenDiv.id = "google_translate_element";
  hiddenDiv.style.display = "none";
  document.body.appendChild(hiddenDiv);

  document.querySelectorAll(".lang-btn").forEach(function (bouton) {
    bouton.classList.add("notranslate");
  });
});

// Traduction Tamazight (Kabyle) — mots cles interface
const TRAD_KAB = {
  fr: {
    'Securite': 'Taɣellist',
    'Sante': 'Tazmert',
    'Finance': 'Idrimsen',
    'Immobilier': 'Tigejdit',
    'Annonces': 'Tizrawin',
    'Transport': 'Taneqquḍt',
    'Administratif': 'Aseɣzef',
    'Connexion': 'Kcem',
    'Inscription': 'Asekcem',
    'Contact': 'Amesten',
    'Retour': 'Tuɣalin',
    'Bonjour': 'Azul',
    'Rechercher': 'Nadi',
    'Publier': 'Siɣel',
    'Aide': 'Tanmirt'
  }
};

// Extension changerLangueSite pour Tamazight
const _changerLangueOriginal = changerLangueSite;
function changerLangueSite(codeLangue) {
  if (codeLangue === 'kab') {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const btnKab = document.querySelector('.lang-btn[data-lang="kab"]');
    if (btnKab) btnKab.classList.add('active');
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.title = document.title;
    return;
  }
  _changerLangueOriginal(codeLangue);
}
