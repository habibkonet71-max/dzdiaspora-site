function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "fr", includedLanguages: "fr,en,zh-CN,ar", autoDisplay: false },
    "google_translate_element"
  );
}

function effacerCookiesTraduction() {
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
}

function changerLangueSite(codeLangue) {
  document.documentElement.dir = (codeLangue === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = (codeLangue === 'zh') ? 'zh-CN' : codeLangue;
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  const boutonActif = document.querySelector('.lang-btn[data-lang="' + codeLangue + '"]');
  if (boutonActif) boutonActif.classList.add("active");

  effacerCookiesTraduction();

  if (codeLangue === 'fr' || codeLangue === 'kab') {
    window.location.reload();
    return;
  }

  const codeCible = codeLangue === "zh" ? "zh-CN" : codeLangue;
  document.cookie = "googtrans=/fr/" + codeCible + "; path=/";
  document.cookie = "googtrans=/fr/" + codeCible + "; path=/; domain=." + window.location.hostname;
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);
  const hiddenDiv = document.createElement("div");
  hiddenDiv.id = "google_translate_element";
  hiddenDiv.style.display = "none";
  document.body.appendChild(hiddenDiv);
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.add("notranslate"));
});
