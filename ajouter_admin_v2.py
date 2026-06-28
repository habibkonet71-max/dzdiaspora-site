import os

EMAIL_ADMIN = "kourrak.habib@hotmail.com"

ANCIEN = '''    onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        window.location.href = "connexion.html";
      }
    });'''

NOUVEAU = '''    const EMAILS_ADMIN = ["''' + EMAIL_ADMIN + '''"];
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "connexion.html";
        return;
      }
      const estAdmin = EMAILS_ADMIN.includes(user.email);
      if (!user.emailVerified && !estAdmin) {
        window.location.href = "connexion.html";
      }
    });'''

fichiers = [
    "securite.html", "sante.html", "finance.html", "justice.html",
    "immobilier.html", "transport.html", "annonces.html",
    "administratif.html", "wilayas.html"
]

for f in fichiers:
    if not os.path.exists(f):
        print("⚠️  " + f + " non trouve, ignore")
        continue
    with open(f, "r", encoding="utf-8") as file:
        contenu = file.read()
    if "EMAILS_ADMIN" in contenu:
        print("⏭️  " + f + " deja a jour, ignore")
        continue
    if ANCIEN in contenu:
        contenu = contenu.replace(ANCIEN, NOUVEAU)
        with open(f, "w", encoding="utf-8") as file:
            file.write(contenu)
        print("✅ " + f + " mis a jour")
    else:
        print("❌ " + f + " : bloc non trouve (a verifier manuellement)")
