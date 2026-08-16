(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDdOF-MYm0nTq0aNG6pk-wQLaYujiNuMWQ",
    appId: "1:223003656315:web:100de190b8b5e74ddae2de",
    messagingSenderId: "223003656315",
    projectId: "dzdiaspora-7260a",
    authDomain: "dzdiaspora-7260a.firebaseapp.com",
    storageBucket: "dzdiaspora-7260a.firebasestorage.app"
  };

  let functions = null;
  let ouvert = false;
  let messages = [];

  const CATEGORIES_PROBLEME = [
    {valeur: "tarifs", label: "💰 Tarifs et abonnements"},
    {valeur: "connexion", label: "🔐 Probleme de connexion"},
    {valeur: "annonce", label: "📋 Probleme avec une annonce"},
    {valeur: "paiement", label: "💳 Probleme de paiement"},
    {valeur: "abonnement_pro", label: "⭐ Abonnement Pro"},
    {valeur: "autre", label: "❓ Autre probleme"},
  ];

  async function initFirebase() {
    if (functions) return functions;
    const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getFunctions, httpsCallable } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js");
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    functions = { instance: getFunctions(app), httpsCallable };
    return functions;
  }

  function creerAssistant() {
    const style = document.createElement("style");
    style.textContent = `
      #karina-btn { position:fixed; bottom:24px; right:16px; z-index:9997; background:#4DD0E1; color:#0D1117; border:none; border-radius:30px; padding:10px 16px; font-weight:700; font-size:12px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.3); display:flex; align-items:center; gap:6px; }
      #karina-fenetre { position:fixed; bottom:76px; right:16px; left:16px; max-width:360px; margin-left:auto; height:420px; background:#1C2333; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.4); z-index:9998; display:none; flex-direction:column; overflow:hidden; }
      #karina-header { background:#4DD0E1; color:#0D1117; padding:12px; display:flex; align-items:center; gap:8px; font-weight:700; font-size:14px; }
      #karina-header button { margin-left:auto; background:none; border:none; color:#0D1117; font-size:16px; cursor:pointer; }
      #karina-messages { flex:1; overflow-y:auto; padding:10px; }
      .karina-msg { max-width:80%; padding:8px 10px; border-radius:10px; margin-bottom:8px; font-size:13px; }
      .karina-msg.user { background:#4DD0E1; color:#0D1117; margin-left:auto; }
      .karina-msg.bot { background:#0D1117; color:white; }
      #karina-input-zone { display:flex; gap:6px; padding:8px; }
      #karina-input { flex:1; padding:8px 12px; border-radius:20px; border:none; background:#0D1117; color:white; font-size:13px; }
      #karina-send { background:none; border:none; color:#4DD0E1; font-size:18px; cursor:pointer; }
      #karina-signal-form { padding:12px; overflow-y:auto; }
      #karina-signal-form label { display:block; color:white; font-size:12px; margin-bottom:8px; cursor:pointer; }
      #karina-signal-form textarea { width:100%; padding:8px; border-radius:8px; border:none; background:#0D1117; color:white; box-sizing:border-box; margin-top:8px; font-size:12px; }
      #karina-signal-form button { width:100%; margin-top:10px; padding:9px; background:#4DD0E1; color:#0D1117; border:none; border-radius:8px; font-weight:700; font-size:12px; cursor:pointer; }
    `;
    document.head.appendChild(style);

    const btn = document.createElement("button");
    btn.id = "karina-btn";
    btn.innerHTML = "🤖 Karina DZ";

    const fenetre = document.createElement("div");
    fenetre.id = "karina-fenetre";
    fenetre.innerHTML = `
      <div id="karina-header">
        🤖 Karina DZ
        <button id="karina-signaler" title="Signaler un probleme">⚠️</button>
        <button id="karina-fermer">✕</button>
      </div>
      <div id="karina-messages"></div>
      <div id="karina-input-zone">
        <input type="text" id="karina-input" placeholder="Posez votre question...">
        <button id="karina-send">➤</button>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(fenetre);

    function afficherMessage(texte, estUtilisateur, sources, lienSecours) {
      const div = document.getElementById("karina-messages");
      const msg = document.createElement("div");
      msg.className = "karina-msg " + (estUtilisateur ? "user" : "bot");
      msg.textContent = texte;
      if (sources && sources.length > 0) {
        const src = document.createElement("div");
        src.style.cssText = "font-size:10px;opacity:0.6;margin-top:4px;";
        src.textContent = "📌 " + sources.join(", ");
        msg.appendChild(src);
      }
      if (lienSecours && lienSecours.url) {
        const lien = document.createElement("a");
        lien.href = lienSecours.url;
        lien.target = "_blank";
        lien.textContent = "🔗 " + (lienSecours.label || "Voir la page");
        lien.style.cssText = "display:inline-block;margin-top:6px;color:#0D1117;background:#4DD0E1;padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none;";
        msg.appendChild(document.createElement("br"));
        msg.appendChild(lien);
      }
      div.appendChild(msg);
      div.scrollTop = div.scrollHeight;
    }

    afficherMessage("Bonjour, je suis Karina DZ ! Posez-moi une question ou signalez un probleme.", false);

    async function envoyerQuestion() {
      const input = document.getElementById("karina-input");
      const question = input.value.trim();
      if (!question) return;
      afficherMessage(question, true);
      input.value = "";
      const historique = messages.slice(-6);
      messages.push({ role: "user", texte: question });
      try {
        const fb = await initFirebase();
        const demander = fb.httpsCallable(fb.instance, "demanderAssistant");
        const result = await demander({ question, historique });
        const reponse = result.data.reponse || "Je n ai pas pu generer de reponse.";
        const sources = (result.data.sources || []).map((s) => s.titre).filter(Boolean);
        afficherMessage(reponse, false, sources, result.data.lien_secours);
        messages.push({ role: "model", texte: reponse });
      } catch {
        afficherMessage("Karina n arrive pas a repondre pour le moment. Reessayez dans un instant, ou signalez le probleme via le bouton ⚠️ ci-dessus.", false);
      }
    }

    document.getElementById("karina-send").addEventListener("click", envoyerQuestion);
    document.getElementById("karina-input").addEventListener("keypress", (e) => {
      if (e.key === "Enter") envoyerQuestion();
    });

    function afficherFormulaireSignalement() {
      const div = document.getElementById("karina-messages");
      div.innerHTML = `
        <div id="karina-signal-form">
          <p style="color:white;font-size:13px;font-weight:700;margin-bottom:10px;">🚨 Signaler un probleme</p>
          ${CATEGORIES_PROBLEME.map((c) => `<label><input type="radio" name="karina-cat" value="${c.valeur}"> ${c.label}</label>`).join("")}
          <textarea id="karina-signal-desc" rows="3" placeholder="Decrivez le probleme..."></textarea>
          <button id="karina-signal-envoyer">Envoyer</button>
        </div>
      `;
      document.getElementById("karina-signal-envoyer").addEventListener("click", async () => {
        const categorie = document.querySelector('input[name="karina-cat"]:checked')?.value || "autre";
        const description = document.getElementById("karina-signal-desc").value.trim();
        try {
          const fb = await initFirebase();
          const signaler = fb.httpsCallable(fb.instance, "signalerProbleme");
          await signaler({ categorie, description, emailUtilisateur: "anonyme" });
          div.innerHTML = "";
          afficherMessage("✅ Signalement envoye a l admin. Merci !", false);
        } catch {
          div.innerHTML = "";
          afficherMessage("❌ Erreur lors du signalement.", false);
        }
      });
    }

    document.getElementById("karina-signaler").addEventListener("click", afficherFormulaireSignalement);

    btn.addEventListener("click", function () {
      ouvert = !ouvert;
      fenetre.style.display = ouvert ? "flex" : "none";
    });
    document.getElementById("karina-fermer").addEventListener("click", function () {
      ouvert = false;
      fenetre.style.display = "none";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", creerAssistant);
  } else {
    creerAssistant();
  }
})();
