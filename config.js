// Configuration globale du site DZ Diaspora
// Remplacer FACEBOOK_URL par l'URL reelle de la page Facebook une fois connue.
const DZDIASPORA_FACEBOOK_URL = "https://www.facebook.com/PLACEHOLDER_A_COMPLETER";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-facebook-link").forEach(function (el) {
    el.href = DZDIASPORA_FACEBOOK_URL;
  });
});
