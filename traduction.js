function changerLangueSite(codeLangue) {
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector('.lang-btn[data-lang="' + codeLangue + '"]');
  if (btn) btn.classList.add("active");
  document.documentElement.dir = (codeLangue === 'ar') ? 'rtl' : 'ltr';

  // Effacer TOUS les cookies googtrans d'abord
  var domain = window.location.hostname;
  var expiry = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "googtrans=; " + expiry + "; path=/";
  document.cookie = "googtrans=; " + expiry + "; path=/; domain=" + domain;
  document.cookie = "googtrans=; " + expiry + "; path=/; domain=." + domain;

  if (codeLangue === 'fr' || codeLangue === 'kab') {
    window.location.reload();
    return;
  }

  // Attendre que les cookies soient effacés puis définir le nouveau
  var code = codeLangue === "zh" ? "zh-CN" : codeLangue;
  setTimeout(function() {
    document.cookie = "googtrans=/fr/" + code + "; path=/";
    document.cookie = "googtrans=/fr/" + code + "; path=/; domain=." + domain;
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
