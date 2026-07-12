const TRAD_KAB_SITE = {
  'Accueil': 'ⴰⵅⵅⴰⵎ', 'Securite': 'ⵜⴰⵖⴻⵍⵍⴻⵙⵜ', 'Sante': 'ⵜⴰⵣⵎⴻⵔⵜ',
  'Finance': 'ⵉⴷⵔⵉⵎⵙⴻⵏ', 'Justice': 'ⵜⵉⵣⴻⵔⴼⴰⵏ', 'Immobilier': 'ⵜⵉⴳⴻⵊⴷⵉⵜ',
  'Administratif': 'ⴰⵙⴻⴳⵣⴻⴼ', 'Wilayas': 'ⵜⵉⵍⴰⵡⵉⵏ', 'Transport': 'ⵜⴰⵏⴻⵇⵇⴰⵍⵜ',
  'Annonces': 'ⵜⵉⵣⵔⴰⵡⵉⵏ', 'Contact': 'ⴰⵎⴻⵙⵜⴻⵏ', 'Annuaire Pro': 'ⴰⵎⴰⵡⴰⵍ ⴰⵎⴻⵙⵏⴰⴷ',
  'Inscription Pro': 'ⴰⵙⴻⴽⵛⴻⵎ ⴰⵎⴻⵙⵏⴰⴷ', 'Devenir Pro': 'ⵉⵍⵉ ⴰⵎⴻⵙⵏⴰⴷ',
  'S inscrire': 'ⴰⵙⴻⴽⵛⴻⵎ', 'Mon Espace': 'ⴰⵎⵉⴷⴰⵏ ⵉⵏⵓ',
  'Connexion': 'ⴰⴽⵛⴻⵎ', 'Deconnexion': 'ⴰⴼⴼⴻⵖ', 'Rechercher': 'ⴰⵏⴰⴷⵉ',
  'Nos offres': 'ⵉⵎⴻⵇⵍⵓⴱⴻⵏ ⵏⵏⴻⵖ', 'Bonjour': 'ⴰⵣⵓⵍ', 'Merci': 'ⵜⴰⵏⵎⵉⵔⵜ',
  'Urgences': 'ⵜⵉⵍⴰⵙ', 'Police': 'ⴰⵙⴻⵔⴷⴰⵙ', 'Hopital': 'ⵙⴱⵉⵜⴰⵔ',
  'Passeport': 'ⵜⴻⵙⴽⵉⵔⵜ', 'Visa': 'ⵜⴰⴽⵔⴻⵙⵜ', 'Douane': 'ⵜⴰⵎⴻⴽⵙⴰ',
  'Medecin': 'ⴰⵎⵙⴻⴱⴷⴻⴷ', 'Avocat': 'ⴰⵎⴻⵍⵍⴰⵢ', 'Notaire': 'ⴰⵎⵙⴻⴱⴷⴻⴷ ⴰⵙⴻⴼⵙⴰⵏ'
};

const _textes_originaux = new Map();

function appliquerTamazight() {
  document.querySelectorAll('a, button, h1, h2, h3, h4, li, span, p').forEach(el => {
    if (el.children.length === 0) {
      const texte = el.textContent.trim();
      if (!_textes_originaux.has(el)) _textes_originaux.set(el, texte);
      const trad = TRAD_KAB_SITE[texte];
      if (trad) el.textContent = trad;
    }
  });
}

function restaurerOriginal() {
  _textes_originaux.forEach((texte, el) => { el.textContent = texte; });
  _textes_originaux.clear();
}

function effacerCookies() {
  var d = window.location.hostname;
  var e = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "googtrans=; " + e + "; path=/";
  document.cookie = "googtrans=; " + e + "; path=/; domain=" + d;
  document.cookie = "googtrans=; " + e + "; path=/; domain=." + d;
}

function changerLangueSite(codeLangue) {
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector('.lang-btn[data-lang="' + codeLangue + '"]');
  if (btn) btn.classList.add("active");
  document.documentElement.dir = (codeLangue === 'ar') ? 'rtl' : 'ltr';

  effacerCookies();

  if (codeLangue === 'kab') {
    restaurerOriginal();
    setTimeout(appliquerTamazight, 200);
    return;
  }

  restaurerOriginal();

  if (codeLangue === 'fr') {
    window.location.reload();
    return;
  }

  var code = codeLangue === "zh" ? "zh-CN" : codeLangue;
  setTimeout(function() {
    document.cookie = "googtrans=/fr/" + code + "; path=/";
    document.cookie = "googtrans=/fr/" + code + "; path=/; domain=." + window.location.hostname;
    window.location.reload();
  }, 100);
}

window._gtDone = false;
function googleTranslateElementInit() {
  if (window._gtDone) return;
  window._gtDone = true;
  try {
    new google.translate.TranslateElement(
      { pageLanguage: "fr", includedLanguages: "fr,en,zh-CN,ar", autoDisplay: false },
      "google_translate_element"
    );
  } catch(e) {}
}

document.addEventListener("DOMContentLoaded", function () {
  var div = document.createElement("div");
  div.id = "google_translate_element";
  div.style.display = "none";
  document.body.appendChild(div);
  var gt = document.createElement("script");
  gt.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(gt);
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.add("notranslate"));
});
