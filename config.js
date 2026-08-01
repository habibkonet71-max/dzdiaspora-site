// Configuration globale du site DZ Diaspora
// Lien temporaire (profil personnel) en attendant la creation d'une vraie Page Facebook pro.
const DZDIASPORA_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61578631118662";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-facebook-link").forEach(function (el) {
    el.href = DZDIASPORA_FACEBOOK_URL;
  });
});
