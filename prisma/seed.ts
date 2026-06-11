import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Duke mbushur bazën...");

  // -------- ADMIN --------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@fleteza.com";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "Fleteza123!";
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: await bcrypt.hash(adminPass, 10),
      name: "Administratori",
      role: "admin",
    },
  });
  console.log(`✅ Admin: ${adminEmail} / ${adminPass}`);

  // -------- PRODUKTET --------
  await prisma.product.deleteMany();

  // Produkti 1 — Kartat Fletëza (set i plotë 1-6+ vjeç)
  await prisma.product.create({
    data: {
      slug: "kartat-fleteza",
      name: "Kartat Fletëza",
      shortDesc:
        "Transporti për Kosovë, Shqipëri dhe Maqedoninë e Veriut është i përfshirë në çmim.",
      price: "29.99",
      shippingNote: "Transporti për Kosovë, Shqipëri dhe Maqedoninë e Veriut është i përfshirë në çmim.",
      ageRange: "12 muaj – 6+ vjeç",
      stock: 100,
      sku: "FL-KARTAT",
      active: true,
      featured: true,
      sortOrder: 1,
      description: `Ndihmoni fëmijën tuaj të mësojë dhe të zbulojë botën përmes kartave edukative Fletëza. Të krijuara nga ekspertë të zhvillimit të hershëm, kartat ndihmojnë në stimulimin e gjuhës, komunikimit dhe zhvillimit kognitiv në fazat më të rëndësishme të fëmijërisë.

Me gjashtë kategori të ndryshme, kartat angazhojnë mendjet e vogla duke i njohur fëmijët me shkronja, numra, kafshë, fruta e perime, profesione dhe veprime. Në anën e pasme të secilës kartë gjenden ilustrime interesante që e bëjnë procesin e mësuarit edhe më tërheqës.

Kartat kanë përmasa 14 × 11 cm dhe janë të dizajnuara me ngjyra të gjalla, ilustrime të qarta dhe germa të mëdha, duke ndihmuar zhvillimin vizual, njohës dhe gjuhësor të fëmijëve.

Kartat Fletëza janë të qëndrueshme dhe të lehta për t'u mirëmbajtur. Të laminuara me një shtresë mbrojtëse, kartat janë 100% të sigurta për fëmijët, rezistente ndaj ujit, lotëve dhe jargëve.`,
      images: {
        create: [
          { url: "/images/kartat-box.png", alt: "Kutia Fletëza", sortOrder: 0 },
        ],
      },
      bullets: {
        create: [
          { text: "6 kategori edukative", sortOrder: 0 },
          { text: "Karta të laminuara me ilustrime të plota në të dy anët", sortOrder: 1 },
          { text: "Informacione dhe aktivitete të përshtatura për fëmijët e vegjël", sortOrder: 2 },
          { text: "Të krijuara nga ekspertë të zhvillimit të hershëm", sortOrder: 3 },
        ],
      },
      features: {
        create: [
          { title: "Alfabeti/shkronjat, Objektet, Veglat, Mjetet e transportit", colorTag: "#FBE3D6", sortOrder: 0 },
          { title: "Numrat dhe numërimin, Dallimet ndër madhësive", colorTag: "#D8E9F5", sortOrder: 1 },
          { title: "Frutat dhe perimet, Karakteristikat, Dallimet, Shijet", colorTag: "#DCEBD6", sortOrder: 2 },
          { title: "Kafshët (karakteristikat, veprimet, tingujt), Ndërlidhjen me ushqimet", colorTag: "#FBF0CF", sortOrder: 3 },
          { title: "Veprimet & njerëzve, Komentimi rreth tyre, Bashkëbisedim", colorTag: "#F6DCE8", sortOrder: 4 },
          { title: "Profesionet, Mjetet e punës, Përdorimin e tyre", colorTag: "#E8E2F2", sortOrder: 5 },
        ],
      },
      infoCards: {
        create: [
          { label: "180 karta", sortOrder: 0 },
          { label: "14 × 11 cm", sortOrder: 1 },
          { label: "Të ilustruara në të dyja anët", sortOrder: 2 },
          { label: "100% të sigurta", sortOrder: 3 },
        ],
      },
      faqs: {
        create: [
          { question: 'Cila është rëndësia e kartave "Fletëza"?', answer: "Pjesa më e madhe e zhvillimit të trurit ndodh në vitet e para të jetës. Mësimi dhe arritur rezultate të reja, ata fitojnë më shumë vetëbesim dhe zhvillojnë aftësi të rëndësishme për të ardhmen.", sortOrder: 0 },
          { question: "Si ndihmon bashkëveprimi me karta në fëmijërinë e hershme?", answer: "Bashkëveprimi me karta ndihmon në zhvillimin e hershëm të fëmijëve dhe forcon lidhjen emocionale me prindërit.", sortOrder: 1 },
          { question: 'Çka përmban kutia "Fletëza"?', answer: "Kutia përmban 180 karta të dyanshme në 6 kategori edukative, të laminuara dhe 100% të sigurta.", sortOrder: 2 },
          { question: 'Për çfarë moshe janë kartat "Fletëza"?', answer: "Rekomandohet për fëmijë nga 12 muaj deri në 6+ vjeç.", sortOrder: 3 },
          { question: 'Cili është qëllimi i përdorimit të kartave "Fletëza"?', answer: "Të nxisin zhvillimin gjuhësor, kognitiv dhe komunikimin përmes lojës.", sortOrder: 4 },
          { question: "Kujt i dedikohet ajo?", answer: "Prindërve, edukatorëve dhe profesionistëve që punojnë me fëmijë.", sortOrder: 5 },
          { question: 'Sa karta janë në kuti Fletëza?', answer: "180 karta të dyanshme.", sortOrder: 6 },
          { question: "Çfarë e dallon këtë produkt?", answer: "Cilësia e lartë, dizajni nga ekspertë dhe siguria 100% për fëmijët.", sortOrder: 7 },
          { question: "Sa kategori janë në kutinë Fletëza?", answer: "6 kategori edukative.", sortOrder: 8 },
        ],
      },
    },
  });

  // Produkti 2 — Kartat stimuluese për bebin 0+
  await prisma.product.create({
    data: {
      slug: "kartat-stimuluese-bebin-0",
      name: "Kartat stimuluese për bebin 0+",
      shortDesc:
        "Transporti për Kosovë është i përfshirë në çmim. Për Shqipëri dhe Maqedoni të Veriut, transporti kushton 3€.",
      price: "9.99",
      shippingNote: "Transporti për Kosovë është i përfshirë në çmim. Për Shqipëri dhe Maqedoni të Veriut, transporti kushton 3€.",
      ageRange: "0 muaj – 12+ muaj",
      stock: 100,
      sku: "FL-BEBIN",
      active: true,
      featured: true,
      sortOrder: 2,
      description: `Çdo kartë përfshin ngjyra të forta, kontraste të theksuara dhe vizatime tërheqëse, të cilat e ndihmojnë bebin të përqendrohet, t'i ndjekë objektet dhe të fillojë të kuptojë realitetin përreth.

Kartat Stimuluese për Bebin, me dimensione 14×11 cm, janë të petëzuara, të papërshkueshme nga uji dhe rezistente ndaj lotëve e jargëve, 100% të sigurta dhe të qëndrueshme.

Zhvillon aftësitë vizuale: Ngjyrat e ndritshme dhe kontrastet e forta stimulojnë shqisën e të parit.
Forcon lidhjen emocionale: Mundëson komunikimin dhe lidhjen me prindërit.
Nxit zhvillimin kognitiv dhe komunikimin: Bebi fillon t'i dallojë ngjyrat dhe format duke i shoqëruar me të folur.`,
      images: {
        create: [
          { url: "/images/bebin-box.png", alt: "Kutia Fletëza për bebin", sortOrder: 0 },
        ],
      },
      bullets: {
        create: [
          { text: "30 karta me 60 ilustrime të ndryshme", sortOrder: 0 },
          { text: "Të dizajnuara posaçërisht për të nxitur zhvillimin vizual, motorik dhe kognitiv", sortOrder: 1 },
          { text: "100% të sigurta dhe të qëndrueshme", sortOrder: 2 },
        ],
      },
      features: {
        create: [
          { title: "0 - 3 muaj", body: "20 ilustrime bardhë e zi me kontrast të lartë, të përshtatura për shikimin e hershëm të bebes.", colorTag: "#000000", sortOrder: 0 },
          { title: "6 - 12 muaj", body: "20 figura me ngjyra të kuqe, të bardha dhe të zeza, të përzgjedhura për të stimuluar zhvillimin vizual të bebes.", colorTag: "#E8645A", sortOrder: 1 },
          { title: "6 - 12+ muaj", body: "20 imazhe të larmishme dhe tërheqëse, të dizajnuara për të nxitur vëmendjen dhe eksplorimin kognitiv.", colorTag: "#F5C73E", sortOrder: 2 },
        ],
      },
      infoCards: {
        create: [
          { label: "30 karta", sortOrder: 0 },
          { label: "60 ilustrime", sortOrder: 1 },
          { label: "14 × 11 cm", sortOrder: 2 },
          { label: "100% të sigurta", sortOrder: 3 },
        ],
      },
      faqs: {
        create: [
          { question: "Çfarë janë Kartat Stimuluese për Bebin?", answer: "Kartat Stimuluese për Bebin janë një set edukativ i dizajnuar posaçërisht për zhvillimin e hershëm nga 0 muaj. Ato përmbajnë ilustrime të thjeshta, të qarta dhe me kontraste të larta që ndihmojnë bebin të fillojë të dallojë forma, ngjyra dhe objekte në botën përreth.", sortOrder: 0 },
          { question: "Për cilën moshë janë të përshtatshme dhe pse janë të ndara në faza?", answer: "Janë të ndara në faza (0-3, 6-12, 6-12+ muaj) sepse zhvillimi vizual i bebes ndryshon me moshën.", sortOrder: 1 },
          { question: "Sa karta përmban seti dhe çfarë e bën të veçantë?", answer: "Seti përmban 30 karta me 60 ilustrime të ndryshme.", sortOrder: 2 },
          { question: "Si ndihmojnë kartat në zhvillimin vizual të bebes?", answer: "Kontrastet e larta dhe ngjyrat stimulojnë shqisën e të parit.", sortOrder: 3 },
          { question: "A ndikojnë kartat në zhvillimin e trurit (kognitiv)?", answer: "Po, stimulimi i hershëm vizual ndihmon zhvillimin kognitiv.", sortOrder: 4 },
          { question: "Si ndihmojnë kartat në zhvillimin e gjuhës dhe komunikimit?", answer: "Duke shoqëruar imazhet me të folur, nxisin zhvillimin gjuhësor.", sortOrder: 5 },
          { question: "Si duhet të përdoren kartat në mënyrë efektive?", answer: "Sipas manualit udhëzues të përfshirë, hap pas hapi.", sortOrder: 6 },
          { question: "A përfshihet manual udhëzues dhe çfarë përmban ai?", answer: "Po, përfshihet një manual i përgatitur nga profesionistë të zhvillimit të hershëm.", sortOrder: 7 },
        ],
      },
    },
  });

  // Produkti 3 — Alfabeti Fletëza
  await prisma.product.create({
    data: {
      slug: "alfabeti-fleteza",
      name: 'Alfabeti "Fletëza"',
      shortDesc: "Karta për të mësuar alfabetin shqip në mënyrë argëtuese.",
      price: "9.99",
      shippingNote: "Transporti për Kosovë është i përfshirë në çmim.",
      ageRange: "3 – 7 vjeç",
      stock: 100,
      sku: "FL-ALFABETI",
      active: true,
      featured: true,
      sortOrder: 3,
      description:
        "Karta edukative për të mësuar alfabetin shqip në mënyrë vizuale dhe argëtuese, me ilustrime për secilën shkronjë.",
      images: {
        create: [{ url: "/images/kartat-box.png", alt: "Alfabeti Fletëza", sortOrder: 0 }],
      },
      bullets: {
        create: [
          { text: "Të gjitha shkronjat e alfabetit shqip", sortOrder: 0 },
          { text: "Ilustrime për secilën shkronjë", sortOrder: 1 },
        ],
      },
    },
  });
  console.log("✅ 3 produkte u krijuan");

  // -------- HOME: Pse FLETËZA --------
  await prisma.homeReason.deleteMany();
  await prisma.homeReason.createMany({
    data: [
      { title: "Rrisin vetëbesimin", body: "Bashkëveprimi me kartat ndihmon në zhvillimin e komunikimit, kreativitetit dhe kujtesës së fëmijëve. Duke mësuar dhe arritur rezultate të reja, ata fitojnë më shumë vetëbesim dhe zhvillojnë aftësi të rëndësishme për të ardhmen.", sortOrder: 0 },
      { title: "Ndihmojnë në shumë aspekte në zhvillimin e fëmijëve", body: "Bashkëveprimi me karta ndihmon në zhvillimin e hershëm të fëmijëve. Pjesa më e madhe e zhvillimit të trurit ndodh në vitet e para të jetës.", sortOrder: 1 },
      { title: "Përmirësojnë aftësitë gjuhësore", body: "Kartat ndikojnë pozitivisht në pasurimin e fjalorit, ashtu siç u zhvillojnë aftësinë për të ndërtuar fjali dhe për t'u përshkruar situata në mënyrë të pavarur.", sortOrder: 2 },
      { title: "Nxit zhvillimin kognitiv dhe komunikimin", body: "Bebi fillon t'i dallojë ngjyrat dhe format duke i shoqëruar me të folur. Po ashtu, reagon ndaj zërave dhe mimikës dhe kështu i shpreh fjalët e para.", sortOrder: 3 },
      { title: "Forcojnë kujtesën", body: "Kartat ua mundësojnë fëmijëve të ndërveprojnë me informacionin, duke e bërë më të lehtë ruajtjen e tij.", sortOrder: 4 },
      { title: "Angazhohen përmes bashkëveprimit", body: "Fëmijët fitojnë të mësojnë që në momentin që lindin. Ata njohin njerëzit, vendet, kafshët, ngjyrat, shijet, tingujt.", sortOrder: 5 },
    ],
  });

  // -------- EXPERTS --------
  await prisma.expertCard.deleteMany();
  await prisma.expertCard.createMany({
    data: [
      { label: "LOGOPEDË", sortOrder: 0 },
      { label: "PSIKOLOGË", sortOrder: 1 },
      { label: "GJUHËTARË", sortOrder: 2 },
      { label: "PEDAGOGË", sortOrder: 3 },
    ],
  });

  // -------- REVIEWS --------
  await prisma.review.deleteMany();
  await prisma.review.createMany({
    data: [
      { authorName: "Kalta C.", text: "Rëndësia e zhvillimit të hershëm për shëndetin mendor — i vlerësoj shumë materialet që ofrojnë mbështetje, promovojnë shëndetin dhe ndihmojnë fëmijën të rritet me dashuri.", rating: 5, sortOrder: 0 },
      { authorName: "Zade S.", text: "Shpesh në kohën e lirë i marrim 'Fletëzat' dhe mësojmë bashkë me nipin dhe mbesën. Është bërë një mënyrë shumë e bukur për të kaluar kohë cilësore me ta.", rating: 5, sortOrder: 1 },
      { authorName: "Klea C.", text: "I vlerësoj shumë që ofrojnë mbështetje dhe dizajn cilësor. Kanë bërë një ndikim të madh te fëmijët tanë.", rating: 5, sortOrder: 2 },
    ],
  });

  // -------- MOMENTS --------
  await prisma.momentMedia.deleteMany();
  await prisma.momentMedia.createMany({
    data: Array.from({ length: 6 }).map((_, i) => ({
      imageUrl: "/images/moment.jpg",
      sortOrder: i,
    })),
  });

  // -------- BLOG --------
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({
    data: [
      {
        slug: "mesojini-femijet-te-perballen-me-sfidat-e-veshtira",
        title: "Mësojini fëmijët të përballen me sfidat e vështira",
        excerpt: "Si t'i ndihmojmë fëmijët të zhvillojnë qëndrueshmëri dhe besim përballë sfidave.",
        coverImage: "/images/blog-1.jpg",
        content: `<p>Fëmijët mësojnë më mirë kur përballen me sfida të përshtatshme për moshën e tyre. Përmes lojës dhe materialeve edukative, ne mund t'i ndihmojmë të zhvillojnë qëndrueshmëri.</p><h2>Pse është e rëndësishme</h2><p>Aftësia për t'u përballur me vështirësitë është një nga shkathtësitë më të rëndësishme që një fëmijë mund të zhvillojë.</p>`,
        author: "FLETËZA",
        published: true,
      },
      {
        slug: "perdorimi-i-telefonit-nga-femijet",
        title: "Përdorimi i telefonit nga fëmijët — çfarë thonë studimet?",
        excerpt: "Rekomandimet globale për kohën e ekranit te fëmijët.",
        coverImage: "/images/blog-2.jpg",
        content: `<p>Studimet e fundit tregojnë se koha e tepërt para ekranit mund të ndikojë në zhvillimin e fëmijëve. Materialet fizike edukative janë një alternativë e shkëlqyer.</p>`,
        author: "FLETËZA",
        published: true,
      },
      {
        slug: "rendesia-e-lojes-ne-zhvillimin-e-hershem",
        title: "Rëndësia e lojës në zhvillimin e hershëm",
        excerpt: "Loja si mjeti kryesor i të mësuarit te fëmijët e vegjël.",
        coverImage: "/images/blog-3.jpg",
        content: `<p>Loja nuk është thjesht argëtim — është mënyra kryesore përmes së cilës fëmijët mësojnë për botën përreth tyre.</p>`,
        author: "FLETËZA",
        published: true,
      },
      {
        slug: "si-te-ndertojme-rutine-te-shendetshme-leximi",
        title: "Si të ndërtojmë një rutinë të shëndetshme leximi",
        excerpt: "Këshilla praktike për të nxitur dashurinë ndaj leximit.",
        coverImage: "/images/blog-4.jpg",
        content: `<p>Një rutinë e qëndrueshme leximi ndihmon në zhvillimin e gjuhës dhe imagjinatës së fëmijës.</p>`,
        author: "FLETËZA",
        published: true,
      },
    ],
  });

  // -------- SITE SETTINGS --------
  await prisma.siteSetting.deleteMany();
  await prisma.siteSetting.createMany({
    data: [
      { key: "hero_title", value: "Zbuloni botën me Fletëza – udhëtimi magjik i fëmijës suaj nis këtu" },
      { key: "hero_subtitle", value: "Me Fletëza, çdo moment është mundësi për lojë dhe mësim me fëmijën tuaj." },
      { key: "mission_text", value: "Misioni ynë është që të fëmijët të brumosim dashurinë për mendimin kritik dhe të mësuarit përmes materialeve kreative, argëtuese dhe tërheqëse." },
      { key: "reviews_heading", value: "Mbi 5000 prindër dhe profesionistë kanë zgjedhur produktet tona" },
      { key: "contact_email", value: "info@fleteza.com" },
      { key: "shipping_kosovo", value: "0" },
      { key: "shipping_other", value: "3" },
    ],
  });

  console.log("🎉 Seed përfundoi me sukses!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
