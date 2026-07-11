function changerLangueSite(codeLangue) {
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector('.lang-btn[data-lang="' + codeLangue + '"]');
  if (btn) btn.classList.add("active");
  document.documentElement.dir = (codeLangue === 'ar') ? 'rtl' : 'ltr';
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
  if (codeLangue === 'fr' || codeLangue === 'kab') {
    window.location.reload();
    return;
  }
  const code = codeLangue === "zh" ? "zh-CN" : codeLangue;
  document.cookie = "googtrans=/fr/" + code + "; path=/";
  document.cookie = "googtrans=/fr/" + code + "; path=/; domain=." + window.location.hostname;
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  var gt = document.createElement("script");
  gt.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  gt.onerror = function() { console.log("Google Translate indisponible"); };
  document.body.appendChild(gt);
  var div = document.createElement("div");
  div.id = "google_translate_element";
  div.style.display = "none";
  document.body.appendChild(div);
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.add("notranslate"));
});

function googleTranslateElementInit() {
  if (window._gtDone) return;
  window._gtDone = true;
  try {
    new google.translate.TranslateElement(
      { pageLanguage: "fr", includedLanguages: "fr,en,zh-CN,ar", autoDisplay: false },
      "google_translate_element"
    );
  } catch(e) { console.log("GT init error:", e); }
}
