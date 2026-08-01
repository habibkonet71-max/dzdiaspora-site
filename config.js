// Configuration globale du site DZ Diaspora
const DZDIASPORA_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61592582571378";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-facebook-link").forEach(function (el) {
    el.href = DZDIASPORA_FACEBOOK_URL;
  });
});
