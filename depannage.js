(function () {
  const LANG = {
    fr: {
      titre: "🔧 Helliot Slem",
      intro: "Bonjour ! Je suis Helliot Slem, votre assistant DzDiaspora. Comment puis-je vous aider ?",
      retour: "← Retour", nonResolu: "Probleme non resolu ?", contact: "Contactez-nous",
      problemes: {
        tarifs: { label: "💰 Tarifs et abonnements", etapes: ["Compte standard : GRATUIT — inscription avec email verifie.","Annonces : 4 gratuites par compte, puis 2 euros par annonce supplementaire.","Abonnement Pro Immobilier : 14 euros/semaine ou 60 euros/mois.","Abonnement Pro Metier (medecin, avocat, pharmacien...) : 20 euros/mois ou 240 euros/an.","Publicite sur le site : tarif sur devis — contactez-nous via la page Contact."]},
        connexion: { label: "🔐 Probleme de connexion", etapes: ["Verifiez que vous utilisez bien l onglet Connexion (pas Inscription).","Verifiez votre email et mot de passe — attention aux espaces.","Mot de passe oublie ? Cliquez sur le lien sous le formulaire.","Venez de vous inscrire ? Confirmez d abord votre email avant de vous connecter.","Toujours bloque ? Nous sommes la pour vous — page Contact."]},
        inscription: { label: "📝 Probleme d inscription", etapes: ["Allez sur la page Connexion et cliquez sur Inscription.","Saisissez un email valide et un mot de passe d au moins 6 caracteres.","Un email de confirmation vous sera envoye — verifiez vos spams.","Cliquez sur le lien dans l email puis connectez-vous.","Email non recu apres 5 minutes ? Reessayez avec un autre email."]},
        annonce: { label: "📋 Probleme avec une annonce", etapes: ["Vous devez etre connecte avec un email verifie pour deposer une annonce.","4 annonces gratuites sont offertes. Au-dela, chaque annonce coute 2 euros.","Annonce non visible ? Attendez quelques secondes et rechargez.","Mot interdit detecte ? Modifiez le contenu et reessayez.","Pour supprimer une annonce, contactez-nous avec son titre."]},
        paiement: { label: "💳 Probleme de paiement", etapes: ["Le paiement est securise via Stripe. Verifiez que votre carte est valide.","Page de paiement bloquee ? Desactivez votre bloqueur de publicites.","Echec du paiement ? Attendez 5 minutes et reessayez.","Paiement debite sans resultat ? Contactez-nous avec votre email et la date.","Si Stripe affiche une erreur de service, patientez 15-30 minutes — c est une panne temporaire."]},
        abonnement: { label: "⭐ Devenir Pro / Abonnement", etapes: ["Pro Immobilier : page Devenir Pro, choisissez 14 euros/semaine ou 60 euros/mois.","Pro Metier (medecin, avocat, pharmacien...) : 20 euros/mois ou 240 euros/an.","Votre abonnement donne acces a des fonctionnalites avancees et a la visibilite professionnelle.","Pour la publicite sur le site, contactez-nous pour un devis personnalise.","Annulation d abonnement ? Contactez-nous via la page Contact."]},
        page404: { label: "🔴 Page introuvable (404)", etapes: ["La page n existe pas encore ou a ete deplacee.","Retournez a l accueil et naviguez via le menu.","Session expiree ? Reconnectez-vous.","Probleme persistant ? Signalez-le via la page Contact."]},
        traduction: { label: "🌐 Probleme de traduction", etapes: ["Les boutons FR / EN / AR / 中文 sont en haut de chaque page.","Traduction inactive ? Verifiez votre connexion internet.","Rechargez la page si les boutons ne reagissent pas.","Les imprecisions viennent de Google Translate."]},
        autre: { label: "❓ Autre probleme", etapes: ["Decrivez votre probleme sur la page Contact — nous repondons rapidement.","Precisez la page, le message d erreur et votre email.","Rechargez la page (Ctrl+Shift+R) pour vider le cache.","Probleme sur l app Android ? Precisez la version de votre telephone."]}
      }
    },
    en: {
      titre: "🔧 Helliot Slem",
      intro: "Hello! I'm Helliot Slem, your DzDiaspora assistant. How can I help you today?",
      retour: "← Back", nonResolu: "Problem not resolved?", contact: "Contact us",
      problemes: {
        tarifs: { label: "💰 Pricing & subscriptions", etapes: ["Standard account: FREE — register with a verified email.","Ads: 4 free per account, then 2 euros per additional ad.","Pro Real Estate: 14 euros/week or 60 euros/month.","Pro Trade (doctor, lawyer, pharmacist...): 20 euros/month or 240 euros/year.","Advertising: quote on request — contact us via the Contact page."]},
        connexion: { label: "🔐 Login issue", etapes: ["Make sure you are using the Login tab, not Register.","Check your email and password — watch out for spaces.","Forgot your password? Click the link below the login form.","Just registered? Please confirm your email before logging in.","Still stuck? We are here to help — visit the Contact page."]},
        inscription: { label: "📝 Registration issue", etapes: ["Go to the Login page and click Register.","Enter a valid email and a password of at least 6 characters.","A confirmation email will be sent — check your spam folder.","Click the link in the email, then log in.","No email after 5 minutes? Try registering with another email."]},
        annonce: { label: "📋 Ad issue", etapes: ["You must be logged in with a verified email to post an ad.","4 free ads are offered. Beyond that, each ad costs 2 euros.","Ad not visible? Wait a few seconds and reload the page.","Forbidden word detected? Edit the content and try again.","To delete an ad, contact us with the ad title."]},
        paiement: { label: "💳 Payment issue", etapes: ["Payments are secured via Stripe. Check that your card is valid.","Payment page blocked? Disable your ad blocker.","Payment failed? Wait 5 minutes and try again.","Payment taken but nothing happened? Contact us with your email and date.","If Stripe shows a service error, wait 15-30 minutes — it is a temporary outage."]},
        abonnement: { label: "⭐ Go Pro / Subscription", etapes: ["Pro Real Estate: go to Become Pro page, choose 14 euros/week or 60 euros/month.","Pro Trade (doctor, lawyer, pharmacist...): 20 euros/month or 240 euros/year.","Your subscription gives access to advanced features and professional visibility.","For advertising, contact us for a personalized quote.","Cancel subscription? Contact us via the Contact page."]},
        page404: { label: "🔴 Page not found (404)", etapes: ["The page does not exist yet or has been moved.","Return to the homepage and navigate using the menu.","Session expired? Please log in again.","Persistent issue? Report it via the Contact page."]},
        traduction: { label: "🌐 Translation issue", etapes: ["The FR / EN / AR / 中文 buttons are at the top of each page.","Translation not working? Check your internet connection.","Reload the page if the buttons are not responding.","Translation errors come from Google Translate."]},
        autre: { label: "❓ Other issue", etapes: ["Describe your issue on the Contact page — we respond quickly.","Specify the page, the error message, and your email.","Reload the page (Ctrl+Shift+R) to clear the cache.","Issue on the Android app? Please mention your phone version."]}
      }
    },
    ar: {
      titre: "🔧 هيليوت سليم",
      intro: "مرحباً! أنا هيليوت سليم، مساعدك في DzDiaspora. كيف يمكنني مساعدتك؟",
      retour: "← رجوع", nonResolu: "لم يُحل المشكل؟", contact: "تواصل معنا",
      problemes: {
        tarifs: { label: "💰 الأسعار والاشتراكات", etapes: ["الحساب العادي: مجاني — التسجيل ببريد إلكتروني مؤكد.","الإعلانات: 4 مجانية، ثم 2 يورو لكل إعلان إضافي.","Pro العقاري: 14 يورو/أسبوع أو 60 يورو/شهر.","Pro المهني (طبيب، محامي، صيدلي...): 20 يورو/شهر أو 240 يورو/سنة.","الإعلانات على الموقع: بالتفاوض — تواصل معنا."]},
        connexion: { label: "🔐 مشكلة تسجيل الدخول", etapes: ["تأكد أنك تستخدم تبويب تسجيل الدخول وليس الاشتراك.","تحقق من بريدك الإلكتروني وكلمة المرور.","نسيت كلمة المرور؟ انقر على الرابط أسفل النموذج.","اشتركت للتو؟ تحقق أولاً من بريدك قبل تسجيل الدخول.","لا تزال عالقاً؟ تواصل معنا عبر صفحة الاتصال."]},
        inscription: { label: "📝 مشكلة في الاشتراك", etapes: ["انتقل إلى صفحة تسجيل الدخول وانقر على الاشتراك.","أدخل بريداً إلكترونياً صالحاً وكلمة مرور من 6 أحرف.","سيُرسل إليك بريد تأكيد — تحقق من البريد المزعج.","انقر على الرابط في البريد ثم سجل الدخول.","لم يصل البريد بعد 5 دقائق؟ جرب بريداً آخر."]},
        annonce: { label: "📋 مشكلة في الإعلان", etapes: ["يجب أن تكون مسجلاً بإيميل مؤكد لنشر إعلان.","4 إعلانات مجانية. بعد ذلك، كل إعلان بيورين.","الإعلان غير ظاهر؟ انتظر لحظة وأعد تحميل الصفحة.","كلمة محظورة؟ عدّل المحتوى وحاول مجدداً.","لحذف إعلان، تواصل معنا مع عنوانه."]},
        paiement: { label: "💳 مشكلة في الدفع", etapes: ["الدفع مؤمّن عبر Stripe. تحقق من صلاحية بطاقتك.","صفحة الدفع محجوبة؟ أوقف مانع الإعلانات.","فشل الدفع؟ انتظر 5 دقائق وحاول مجدداً.","تم الخصم دون نتيجة؟ تواصل معنا مع تاريخ العملية.","إذا أظهر Stripe خطأ، انتظر 15-30 دقيقة — إنها عطل مؤقت."]},
        abonnement: { label: "⭐ الاشتراك الاحترافي", etapes: ["Pro العقاري: صفحة Devenir Pro، اختر 14 يورو/أسبوع أو 60 يورو/شهر.","Pro المهني: 20 يورو/شهر أو 240 يورو/سنة.","اشتراكك يتيح الوصول إلى ميزات متقدمة وظهور احترافي.","للإعلان، تواصل معنا للحصول على عرض سعر.","إلغاء الاشتراك؟ تواصل معنا عبر صفحة الاتصال."]},
        page404: { label: "🔴 الصفحة غير موجودة", etapes: ["الصفحة غير موجودة بعد أو تم نقلها.","عُد إلى الصفحة الرئيسية واستخدم القائمة.","انتهت الجلسة؟ سجّل الدخول مجدداً.","المشكلة مستمرة؟ أبلغنا عبر صفحة الاتصال."]},
        traduction: { label: "🌐 مشكلة في الترجمة", etapes: ["أزرار FR / EN / AR / 中文 في أعلى كل صفحة.","الترجمة لا تعمل؟ تحقق من اتصالك.","أعد تحميل الصفحة إذا لم تستجب الأزرار.","أخطاء الترجمة تأتي من Google Translate."]},
        autre: { label: "❓ مشكلة أخرى", etapes: ["صف مشكلتك في صفحة الاتصال — نرد بسرعة.","حدّد الصفحة ورسالة الخطأ وبريدك الإلكتروني.","أعد تحميل الصفحة (Ctrl+Shift+R).","مشكلة في التطبيق؟ حدّد إصدار هاتفك."]}
      }
    },
    zh: {
      titre: "🔧 赫利奥特",
      intro: "您好！我是赫利奥特，您的DzDiaspora客服助手。有什么可以帮您？",
      retour: "← 返回", nonResolu: "问题未解决？", contact: "联系我们",
      problemes: {
        tarifs: { label: "💰 价格与订阅", etapes: ["标准账户：免费 — 注册并验证电子邮件。","广告：每个账户4条免费，之后每条2欧元。","房地产Pro：14欧元/周或60欧元/月。","职业Pro（医生、律师、药剂师...）：20欧元/月或240欧元/年。","网站广告：报价请联系我们。"]},
        connexion: { label: "🔐 登录问题", etapes: ["请确保您使用的是登录选项卡，而非注册。","检查您的电子邮件和密码，注意空格。","忘记密码？点击登录表单下方的链接。","刚注册？请先验证邮箱再登录。","仍然无法登录？请通过联系页面联系我们。"]},
        inscription: { label: "📝 注册问题", etapes: ["进入登录页面并点击注册。","输入有效的电子邮件和至少6位密码。","将向您发送确认邮件 — 请检查垃圾邮件。","点击邮件中的链接，然后登录。","5分钟后未收到邮件？请用其他邮箱重试。"]},
        annonce: { label: "📋 广告问题", etapes: ["您需要使用已验证邮箱的账号才能发布广告。","提供4条免费广告，超出后每条2欧元。","广告不可见？等几秒钟后刷新页面。","检测到禁用词？修改内容后重试。","删除广告请联系我们并提供广告标题。"]},
        paiement: { label: "💳 支付问题", etapes: ["支付通过Stripe安全进行。请确认您的银行卡有效。","支付页面被屏蔽？请关闭广告拦截器。","支付失败？等待5分钟后重试。","已扣款但无结果？请联系我们并提供邮箱和日期。","如果Stripe显示服务错误，请等待15-30分钟 — 这是临时故障。"]},
        abonnement: { label: "⭐ 专业订阅", etapes: ["房地产Pro：Devenir Pro页面，选择14欧元/周或60欧元/月。","职业Pro：20欧元/月或240欧元/年。","您的订阅提供高级功能和专业展示。","网站广告请联系我们获取个性化报价。","取消订阅？请通过联系页面联系我们。"]},
        page404: { label: "🔴 页面未找到", etapes: ["该页面尚不存在或已移动。","返回首页并使用菜单导航。","会话过期？请重新登录。","问题持续？请通过联系页面报告。"]},
        traduction: { label: "🌐 翻译问题", etapes: ["FR / EN / AR / 中文 按钮位于每页顶部。","翻译无效？检查您的网络连接。","如果按钮无响应，请刷新页面。","翻译错误来自Google翻译。"]},
        autre: { label: "❓ 其他问题", etapes: ["在联系页面描述您的问题 — 我们会迅速回复。","请注明相关页面、错误信息和您的电子邮件。","刷新页面（Ctrl+Shift+R）以清除缓存。","安卓应用有问题？请注明您的手机版本。"]}
      }
    }
  };

  function detecterLang(){const c=document.cookie;if(c.includes("googtrans=/fr/zh"))return"zh";if(c.includes("googtrans=/fr/ar"))return"ar";if(c.includes("googtrans=/fr/en"))return"en";return"fr";}

  function creerAssistant(){
    const style=document.createElement("style");
    style.textContent=`#dep-btn{position:fixed;bottom:24px;right:24px;z-index:9999;width:54px;height:54px;border-radius:50%;background:#FF7043;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(255,112,67,0.4);font-size:22px;display:flex;align-items:center;justify-content:center;transition:transform 0.2s;}#dep-btn:hover{transform:scale(1.1);}#dep-fenetre{position:fixed;bottom:90px;right:24px;z-index:9999;width:320px;max-height:460px;background:#1C2333;border-radius:16px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px rgba(0,0,0,0.4);display:none;flex-direction:column;overflow:hidden;}.dep-header{background:#FF7043;color:white;padding:12px 16px;font-weight:bold;font-size:14px;display:flex;justify-content:space-between;align-items:center;}#dep-contenu{flex:1;overflow-y:auto;padding:12px;max-height:380px;}.dep-menu-item{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 14px;margin-bottom:8px;cursor:pointer;font-size:13px;color:white;transition:background 0.15s;}.dep-menu-item:hover{background:rgba(255,112,67,0.15);border-color:#FF7043;}.dep-etape{background:rgba(255,255,255,0.05);border-left:3px solid #FF7043;border-radius:0 8px 8px 0;padding:10px 12px;margin-bottom:8px;font-size:13px;color:rgba(255,255,255,0.85);line-height:1.5;}.dep-num{color:#FF7043;font-weight:bold;margin-right:6px;}.dep-retour{background:none;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);border-radius:20px;padding:6px 14px;font-size:12px;cursor:pointer;margin-bottom:12px;display:inline-block;}.dep-titre{color:#FF7043;font-weight:bold;font-size:14px;margin-bottom:10px;}`;
    document.head.appendChild(style);
    const btn=document.createElement("button");btn.id="dep-btn";btn.innerHTML="🔧";
    const fenetre=document.createElement("div");fenetre.id="dep-fenetre";
    document.body.appendChild(btn);document.body.appendChild(fenetre);
    function getLang(){return LANG[detecterLang()]||LANG.fr;}
    function afficherMenu(){const l=getLang();btn.title=l.titre;let html=`<div class="dep-header">${l.titre}<button onclick="document.getElementById('dep-fenetre').style.display='none'" style="background:none;border:none;cursor:pointer;font-size:16px;color:white;">✕</button></div><div id="dep-contenu"><p style="color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:12px;">${l.intro}</p>`;for(const[cle,prob]of Object.entries(l.problemes)){html+=`<div class="dep-menu-item" onclick="window.depAfficher('${cle}')">${prob.label}</div>`;}html+=`</div>`;fenetre.innerHTML=html;}
    window.depAfficher=function(cle){const l=getLang();const prob=l.problemes[cle];if(!prob)return;let html=`<div class="dep-header">${l.titre}<button onclick="document.getElementById('dep-fenetre').style.display='none'" style="background:none;border:none;cursor:pointer;font-size:16px;color:white;">✕</button></div><div id="dep-contenu"><button class="dep-retour" onclick="window.depMenu()">${l.retour}</button><div class="dep-titre">${prob.label}</div>`;prob.etapes.forEach((etape,i)=>{html+=`<div class="dep-etape"><span class="dep-num">${i+1}.</span>${etape}</div>`;});html+=`<div style="margin-top:12px;padding:10px;background:rgba(255,112,67,0.1);border-radius:8px;font-size:12px;color:rgba(255,255,255,0.6);">${l.nonResolu} <a href="contact.html" style="color:#FF7043;">${l.contact}</a></div></div>`;fenetre.innerHTML=html;};
    window.depMenu=function(){afficherMenu();};
    btn.addEventListener("click",function(){if(fenetre.style.display==="flex"){fenetre.style.display="none";}else{afficherMenu();fenetre.style.display="flex";}});
  }

  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",creerAssistant);}else{creerAssistant();}
})();
