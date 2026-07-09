const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require("docx");
const fs = require("fs");

const VERT = "006233"; const ROUGE = "D21034"; const GRIS = "555555"; const BLANC = "FFFFFF"; const DARK = "1C2333";

function cel(children, fill, w) {
  const opts = { margins:{top:100,bottom:100,left:200,right:200}, children };
  if (fill) opts.shading = {type:ShadingType.CLEAR, fill};
  if (w) opts.width = {size:w, type:WidthType.DXA};
  return new TableCell(opts);
}
function p(text, opts={}) {
  return new Paragraph({
    alignment: opts.align||AlignmentType.LEFT,
    spacing: {before:opts.before||60, after:opts.after||60},
    children:[new TextRun({text, size:opts.size||18, bold:opts.bold||false, color:opts.color||DARK, font:opts.ar?"Traditional Arabic":"Calibri"})]
  });
}
function sep() { return new Paragraph({spacing:{before:150,after:150}, border:{bottom:{color:VERT,style:BorderStyle.SINGLE,size:6}}, children:[new TextRun({text:""})]}); }
function tbl(rows) { return new Table({width:{size:9000,type:WidthType.DXA}, rows}); }
function row(cells) { return new TableRow({children:cells}); }
function ligne(fr, ar) {
  return tbl([row([
    cel([p(fr,{bold:true,size:16}), ar?p(ar,{ar:true,size:15,align:AlignmentType.RIGHT}):p("")], "F5F5F5", 3000),
    cel([p(" ")], null, 6000)
  ])]);
}
function chk(fr, ar) {
  return new Paragraph({spacing:{before:60,after:60},indent:{left:360},children:[
    new TextRun({text:"☐  ",size:20,color:VERT,font:"Calibri"}),
    new TextRun({text:fr,size:18,font:"Calibri",color:DARK}),
    ar?new TextRun({text:"  /  "+ar,size:16,font:"Traditional Arabic",color:GRIS}):new TextRun({text:""})
  ]});
}

// PLAQUETTE
const plaquette = new Document({sections:[{properties:{page:{margin:{top:1440,bottom:1440,left:1440,right:1440}}}, children:[
  tbl([row([
    cel([p("🇩🇿 DZ DIASPORA",{size:32,bold:true,color:BLANC}), p("Premier Portail Numérique de la Diaspora Algérienne",{size:15,color:"A8E063"}), p("بوابة الجالية الجزائرية الرقمية الأولى",{size:15,color:"A8E063",ar:true,align:AlignmentType.RIGHT})], VERT, 5500),
    cel([p("NET-HABITA",{size:18,bold:true,color:BLANC,align:AlignmentType.CENTER}), p("SIRET : 488 470 584 00043",{size:13,color:BLANC,align:AlignmentType.CENTER}), p("kourrak.habib@hotmail.com",{size:13,color:BLANC,align:AlignmentType.CENTER}), p("+213 (0) 799 87 28 90",{size:16,bold:true,color:BLANC,align:AlignmentType.CENTER})], ROUGE, 3500),
  ])]),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  p("PRÉSENTATION DU PORTAIL  /  تقديم البوابة",{size:24,bold:true,color:VERT,align:AlignmentType.CENTER}),
  sep(),
  tbl([row([
    cel([p("DZ Diaspora est le premier portail numérique dédié aux 8 millions d'algériens établis à l'étranger. Notre mission : connecter la diaspora aux professionnels de confiance en Algérie."), p("🌐 habibkonet71-max.github.io/dzdiaspora-site",{size:15,color:VERT}), p("📱 Application Android : DZ Diaspora",{size:15,color:VERT})], "F0FFF0", 4500),
    cel([p("DZ Diaspora هي أول بوابة رقمية لـ 8 ملايين جزائري في الخارج.",{ar:true,align:AlignmentType.RIGHT}), p("habibkonet71-max.github.io/dzdiaspora-site 🌐",{size:15,color:VERT,align:AlignmentType.RIGHT}), p("تطبيق أندرويد: DZ Diaspora 📱",{size:15,color:VERT,ar:true,align:AlignmentType.RIGHT})], "FFF8E1", 4500),
  ])]),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  sep(),
  p("CHIFFRES CLÉS  /  أرقام رئيسية",{size:22,bold:true,color:VERT,align:AlignmentType.CENTER}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  tbl([row([
    cel([p("8M+",{size:36,bold:true,color:BLANC,align:AlignmentType.CENTER}), p("Algériens à l'étranger",{size:14,color:BLANC,align:AlignmentType.CENTER}), p("جزائري في الخارج",{size:14,color:"A8E063",ar:true,align:AlignmentType.CENTER})], VERT),
    cel([p("69",{size:36,bold:true,color:BLANC,align:AlignmentType.CENTER}), p("Wilayas couvertes",{size:14,color:BLANC,align:AlignmentType.CENTER}), p("ولاية مغطاة",{size:14,color:"FFC107",ar:true,align:AlignmentType.CENTER})], ROUGE),
    cel([p("4",{size:36,bold:true,color:"4DD0E1",align:AlignmentType.CENTER}), p("Langues / لغات",{size:14,color:BLANC,align:AlignmentType.CENTER}), p("FR/AR/EN/中",{size:14,color:"4DD0E1",align:AlignmentType.CENTER})], DARK),
    cel([p("24/7",{size:36,bold:true,color:DARK,align:AlignmentType.CENTER}), p("Disponible / متاح",{size:14,color:DARK,align:AlignmentType.CENTER})], "A8E063"),
  ])]),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  sep(),
  p("AVANTAGES PROFESSIONNEL  /  مزايا المهني",{size:22,bold:true,color:VERT,align:AlignmentType.CENTER}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  tbl([
    row([cel([p("🌍 Visibilité internationale",{bold:true,color:VERT}), p("Fiche visible par la diaspora en France, Canada, Belgique et dans le monde.")], "F0FFF0", 4500), cel([p("🌍 رؤية دولية",{bold:true,color:VERT,ar:true,align:AlignmentType.RIGHT}), p("ملفك مرئي من قبل الجالية في فرنسا وكندا وبلجيكا وحول العالم.",{ar:true,align:AlignmentType.RIGHT})], "FFF8E1", 4500)]),
    row([cel([p("✅ Badge Professionnel Vérifié",{bold:true,color:"0066CC"}), p("Badge officiel DZ Diaspora renforçant la confiance de vos futurs clients.")], "F0F8FF", 4500), cel([p("✅ شارة المهني الموثق",{bold:true,color:"0066CC",ar:true,align:AlignmentType.RIGHT}), p("شارة رسمية تعزز ثقة عملائك المستقبليين.",{ar:true,align:AlignmentType.RIGHT})], "FFF0F0", 4500)]),
    row([cel([p("📅 Prise de RDV en ligne",{bold:true,color:VERT}), p("Vos clients prennent RDV directement depuis le portail ou l'application.")], "F0FFF0", 4500), cel([p("📅 حجز المواعيد عبر الإنترنت",{bold:true,color:VERT,ar:true,align:AlignmentType.RIGHT}), p("يحجز عملاؤك المواعيد مباشرة من البوابة أو التطبيق.",{ar:true,align:AlignmentType.RIGHT})], "FFF8E1", 4500)]),
    row([cel([p("📧 Notifications automatiques",{bold:true,color:"0066CC"}), p("Recevez un email immédiat à chaque nouvelle demande client.")], "F0F8FF", 4500), cel([p("📧 إشعارات تلقائية",{bold:true,color:"0066CC",ar:true,align:AlignmentType.RIGHT}), p("تلقَّ بريداً إلكترونياً فورياً عند كل طلب عميل.",{ar:true,align:AlignmentType.RIGHT})], "FFF0F0", 4500)]),
  ]),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  sep(),
  p("TARIFS D'ABONNEMENT  /  أسعار الاشتراك",{size:22,bold:true,color:VERT,align:AlignmentType.CENTER}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  tbl([
    row([cel([p("1 MOIS / شهر",{bold:true,color:BLANC,align:AlignmentType.CENTER})],VERT), cel([p("3 MOIS / 3 أشهر",{bold:true,color:BLANC,align:AlignmentType.CENTER})],VERT), cel([p("6 MOIS / 6 أشهر",{bold:true,color:BLANC,align:AlignmentType.CENTER})],VERT), cel([p("12 MOIS ⭐ / 12 شهراً",{bold:true,color:BLANC,align:AlignmentType.CENTER})],ROUGE)]),
    row([cel([p("20 €",{size:30,bold:true,color:VERT,align:AlignmentType.CENTER}), p("~3 040 DZD",{size:14,color:GRIS,align:AlignmentType.CENTER})]), cel([p("55 €",{size:30,bold:true,color:VERT,align:AlignmentType.CENTER}), p("~8 360 DZD — Économie 8%",{size:14,color:"0066CC",align:AlignmentType.CENTER})],"F5FFF5"), cel([p("105 €",{size:30,bold:true,color:VERT,align:AlignmentType.CENTER}), p("~15 960 DZD — Économie 12%",{size:14,color:"0066CC",align:AlignmentType.CENTER})]), cel([p("180 €",{size:30,bold:true,color:ROUGE,align:AlignmentType.CENTER}), p("~27 360 DZD — Économie 25%",{size:14,bold:true,color:ROUGE,align:AlignmentType.CENTER})],"FFF5F5")]),
  ]),
  new Paragraph({spacing:{before:150},children:[new TextRun({text:""})]}),
  p("Paiement : Virement bancaire DZD | Carte bancaire EUR | +213 (0) 799 87 28 90",{size:14,color:GRIS,align:AlignmentType.CENTER}),
  p("الدفع: تحويل بنكي DZD | بطاقة EUR | +213 (0) 799 87 28 90",{size:14,color:GRIS,ar:true,align:AlignmentType.CENTER}),
]}]});

// CONTRAT
const contrat = new Document({sections:[{properties:{page:{margin:{top:1440,bottom:1440,left:1800,right:1440}}}, children:[
  tbl([row([
    cel([p("🇩🇿 DZ DIASPORA",{size:28,bold:true,color:BLANC}), p("Portail Numérique — NET-HABITA",{size:14,color:"A8E063"})], VERT, 5000),
    cel([p("DZ DIASPORA 🇩🇿",{size:28,bold:true,color:BLANC,ar:true,align:AlignmentType.RIGHT}), p("بوابة رقمية — NET-HABITA",{size:14,color:"FFC107",ar:true,align:AlignmentType.RIGHT})], ROUGE, 4000),
  ])]),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  p("CONTRAT D'ABONNEMENT PROFESSIONNEL",{size:24,bold:true,color:VERT,align:AlignmentType.CENTER}),
  p("عقد الاشتراك المهني",{size:24,bold:true,color:VERT,ar:true,align:AlignmentType.CENTER}),
  p("DOUBLE EXEMPLAIRE  /  نسختان",{size:18,color:ROUGE,align:AlignmentType.CENTER}),
  sep(),
  p("PARTIE 1 — DZ DIASPORA (Éditeur)  /  الطرف الأول",{size:18,bold:true,color:ROUGE}),
  tbl([row([cel([p("NET-HABITA — Kourrak Habib | SIRET : 488 470 584 00043 | Toulouse, France"), p("kourrak.habib@hotmail.com | +213 (0) 799 87 28 90")],"F0FFF0")])]),
  new Paragraph({spacing:{before:150},children:[new TextRun({text:""})]}),
  p("PARTIE 2 — LE PROFESSIONNEL  /  الطرف الثاني — المهني",{size:20,bold:true,color:ROUGE}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  ligne("Nom (Français) / الاسم (بالفرنسية)","الاسم (بالعربية) / Nom (Arabe)"),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("Prénom (Français) / اللقب (بالفرنسية)","اللقب (بالعربية) / Prénom (Arabe)"),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("Profession / المهنة","Spécialité / التخصص"),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("N° d'ordre professionnel / رقم الانتساب المهني",""),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("N° CNI ou Passeport / رقم بطاقة الهوية",""),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("Wilaya / الولاية","Adresse cabinet / عنوان المكتب"),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("Téléphone / الهاتف","Email / البريد الإلكتروني"),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  sep(),
  p("ABONNEMENT CHOISI  /  الاشتراك المختار",{size:20,bold:true,color:ROUGE}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  chk("1 MOIS — 20€ / ~3 040 DZD","شهر واحد"),
  chk("3 MOIS — 55€ / ~8 360 DZD  (Économie 8%)","3 أشهر — توفير 8٪"),
  chk("6 MOIS — 105€ / ~15 960 DZD  (Économie 12%)","6 أشهر — توفير 12٪"),
  chk("12 MOIS — 180€ / ~27 360 DZD  (Économie 25%) ⭐","12 شهراً — توفير 25٪"),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  p("Mode de paiement / طريقة الدفع :",{bold:true}),
  chk("Virement bancaire DZD / تحويل بنكي DZD"),
  chk("Carte bancaire EUR / بطاقة بنكية EUR"),
  chk("Paiement en espèces / دفع نقدي"),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  ligne("Date début / تاريخ البداية","Date fin / تاريخ الانتهاء"),
  new Paragraph({spacing:{before:60},children:[new TextRun({text:""})]}),
  ligne("Montant payé / المبلغ المدفوع","Référence paiement / مرجع الدفع"),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  sep(),
  p("CONDITIONS ET CLAUSES  /  الشروط والبنود",{size:20,bold:true,color:ROUGE}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  p("Art. 1 — Moralité et authenticité professionnelle / م. 1 — الأخلاق والأصالة المهنية",{bold:true,color:ROUGE}),
  p("Le professionnel certifie sur l'honneur exercer légalement la profession indiquée, être titulaire du diplôme requis et inscrit à l'ordre professionnel compétent. Toute usurpation de titre constitue une infraction pénale.",{size:17}),
  p("يؤكد المهني شرفاً مزاولة المهنة بصورة قانونية وحمل الشهادة المطلوبة والتسجيل في النقابة المختصة. انتحال اللقب المهني جريمة جنائية.",{size:17,ar:true,align:AlignmentType.RIGHT}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  p("Art. 2 — Obligations / م. 2 — الالتزامات",{bold:true,color:ROUGE}),
  p("Le professionnel s'engage à : fournir des informations exactes, répondre aux clients dans les 48h, respecter le secret professionnel et la déontologie, informer DZ Diaspora de tout changement de situation.",{size:17}),
  p("يلتزم المهني بما يلي: معلومات دقيقة، الرد خلال 48 ساعة، احترام السرية المهنية وأخلاقيات المهنة، إبلاغ DZ Diaspora بأي تغيير.",{size:17,ar:true,align:AlignmentType.RIGHT}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  p("Art. 3 — Résiliation / م. 3 — الفسخ وإنهاء العقد",{bold:true,color:ROUGE}),
  p("DZ Diaspora peut résilier immédiatement sans remboursement en cas de fausse déclaration, comportement contraire à l'éthique ou plainte fondée. Le professionnel peut résilier avec 30 jours de préavis, sans remboursement.",{size:17}),
  p("يحق لـ DZ Diaspora فسخ العقد فوراً دون استرداد في حال التصريح الكاذب أو السلوك المخالف للأخلاق. يمكن للمهني الفسخ مع إشعار 30 يوماً دون استرداد.",{size:17,ar:true,align:AlignmentType.RIGHT}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  p("Art. 4 — Poursuites judiciaires / م. 4 — الملاحقة القضائية",{bold:true,color:ROUGE}),
  p("Tout professionnel reconnu coupable d'usurpation ou d'escroquerie s'expose à des poursuites judiciaires en droit algérien et/ou français. DZ Diaspora se réserve le droit de signaler tout comportement frauduleux aux autorités compétentes (Parquet, Barreau, Ordre professionnel).",{size:17}),
  p("كل مهني مُثبتٌ إدانته بانتحال لقب أو احتيال يتعرض للملاحقة القضائية وفق القانون الجزائري و/أو الفرنسي. تحتفظ DZ Diaspora بحق إبلاغ السلطات المختصة عن أي سلوك احتيالي.",{size:17,ar:true,align:AlignmentType.RIGHT}),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  sep(),
  p("SIGNATURES  /  التوقيعات",{size:20,bold:true,color:ROUGE}),
  new Paragraph({spacing:{before:100},children:[new TextRun({text:""})]}),
  tbl([row([
    cel([p("Fait à / حُرِّر في : _______________________"), p("Le / بتاريخ : ___________________________"), new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}), p("Signature et cachet du Professionnel / توقيع وختم المهني",{bold:true,color:VERT}), new Paragraph({spacing:{before:300},children:[new TextRun({text:""})]}), p("________________________________")],"F9F9F9",4500),
    cel([p("Pour DZ Diaspora / لـ DZ Diaspora",{bold:true,color:ROUGE}), p("NET-HABITA — Kourrak Habib"), new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}), p("Signature / التوقيع",{bold:true,color:ROUGE}), new Paragraph({spacing:{before:300},children:[new TextRun({text:""})]}), p("________________________________"), p("Kourrak Habib")],null,4500),
  ])]),
  new Paragraph({spacing:{before:200},children:[new TextRun({text:""})]}),
  p("⚠️ Contrat en double exemplaire — Un exemplaire remis au professionnel, l'autre conservé par DZ Diaspora.",{size:14,color:GRIS,align:AlignmentType.CENTER}),
  p("⚠️ عقد في نسختين — نسخة للمهني، نسخة تحتفظ بها DZ Diaspora.",{size:14,color:GRIS,ar:true,align:AlignmentType.CENTER}),
]}]});

Packer.toBuffer(plaquette).then(b => { fs.writeFileSync(process.env.HOME+"/dzdiaspora_site/plaquette-pro.docx", b); console.log("✅ Plaquette OK"); });
Packer.toBuffer(contrat).then(b => { fs.writeFileSync(process.env.HOME+"/dzdiaspora_site/contrat-abonnement.docx", b); console.log("✅ Contrat OK"); });
