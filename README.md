# FLETËZA — Dyqani online

Dyqan e-commerce për karta edukative për fëmijë, i ndërtuar me **Next.js 16 (App Router)**, **Prisma 7**, **PostgreSQL** dhe **Tailwind CSS v4**.

> ⚠️ **E rëndësishme:** Ky kod është shkruar dhe është gati për t'u ekzekutuar lokalisht, por **nuk është testuar në një mjedis me bazë të dhënash aktive** (mjedisi i gjenerimit nuk kishte akses në internet apo PostgreSQL). Para se ta nxirrni online, ndiqni hapat e mëposhtëm dhe testojeni lokalisht. Mund të hasni rregullime të vogla gjatë instalimit të parë.

---

## Çfarë përmban

**Pjesa publike (storefront)**
- Faqja kryesore: hero slider, 3 produktet kryesore, "Pse FLETËZA?", ekspertët, vlerësimet, banderola e misionit, "Momente të ndara nga prindërit", blogu.
- Faqe produkti të detajuara (galeri, karakteristika, "Çka mësojmë", info-kartela, FAQ, produkte të ngjashme).
- Listë produktesh, blog (listë + shkrim i vetëm), faqe kontakti.
- Shportë (në `localStorage`) + checkout si vizitor (guest), vetëm **Para në dorëzim (Cash on Delivery)**.
- Faqe falënderimi pas porosisë me afatet e dërgesës.

**Paneli i administrimit (`/admin`)**
- Kyçje e sigurt (cookie JWT).
- Panel me raporte shitjesh dhe stoku.
- Menaxhim i porosive (ndryshim statusi, fshirje).
- CRUD i produkteve + seksionet e ndërlidhura (imazhe, bullets, kategori, info-kartela, FAQ).
- CRUD i blogut.
- Menaxhim i kontentit: arsyet "Pse FLETËZA?", ekspertët, vlerësimet, momentet, FAQ, cilësimet e përgjithshme.
- Mesazhet e kontaktit.
- Ngarkim imazhesh (ruhen në `public/uploads`).

**Email (Gmail SMTP)**
- Në çdo porosi dërgohet email te klienti (nëse jep email) **dhe** te administratori.
- Mesazhet e kontaktit i dërgohen administratorit.

---

## Kërkesat

- **Node.js 20+** (rekomandohet 22)
- **PostgreSQL 14+** (lokal ose në cloud, p.sh. Neon, Supabase, Railway)
- Një llogari **Gmail** me *App Password* (për dërgimin e emailave)

---

## Instalimi hap-pas-hapi

### 1. Instaloni paketat
```bash
npm install
```

### 2. Konfiguroni variablat e mjedisit
Kopjoni shabllonin dhe plotësojeni:
```bash
cp .env.example .env
```
Hapni `.env` dhe vendosni:
- `DATABASE_URL` — lidhja me PostgreSQL-në tuaj.
- `AUTH_SECRET` — një string i gjatë i rastësishëm (p.sh. `openssl rand -base64 32`).
- `SMTP_USER`, `SMTP_PASS` — emaili Gmail dhe *App Password* (16 shkronja). Udhëzues: https://myaccount.google.com/apppasswords
- `ADMIN_EMAIL` — ku do mbërrijnë njoftimet e porosive.

> Konfigurimi i Prisma 7 lexon `DATABASE_URL` përmes `prisma.config.ts` (jo brenda `schema.prisma`).

### 3. Krijoni tabelat (migrimi)
```bash
npm run db:migrate
```
(Kjo ekzekuton `prisma migrate dev` dhe gjeneron klientin Prisma.)

### 4. Mbushni të dhënat fillestare (seed)
```bash
npm run db:seed
```
Kjo krijon: adminin, 3 produktet, arsyet, ekspertët, vlerësimet, momentet, cilësimet dhe disa shkrime blogu.

### 5. Nisni serverin
```bash
npm run dev
```
Faqja: http://localhost:3000
Paneli: http://localhost:3000/admin

---

## Kredencialet e adminit (nga seed)

| | |
|---|---|
| Email | `admin@fleteza.com` |
| Fjalëkalimi | `Fleteza123!` |

> Ndryshojini menjëherë në prodhim (mund t'i ndryshoni te `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` para seed-it, ose krijoni një përdorues të ri).

---

## Komandat e dobishme

| Komanda | Përshkrim |
|---|---|
| `npm run dev` | Serveri i zhvillimit |
| `npm run build` | Ndërtimi për prodhim (gjeneron Prisma + Next build) |
| `npm start` | Nis versionin e prodhimit |
| `npm run db:migrate` | Krijon/aplikon migrimet (dev) |
| `npm run db:deploy` | Aplikon migrimet (prodhim) |
| `npm run db:seed` | Mbush të dhënat fillestare |
| `npm run db:studio` | Hap Prisma Studio (shfletues i DB) |
| `npm run db:reset` | Fshin dhe rikrijon DB-në (kujdes!) |

---

## Imazhet

Imazhet provizore ndodhen te `public/images/` (kuti produktesh, blog, momente) — **zëvendësojini me imazhet tuaja reale**.
Imazhet e ngarkuara nga paneli ruhen te `public/uploads/`.

> Në një mjedis si Vercel, sistemi i skedarëve është *read-only* / i përkohshëm. Për ngarkim imazhesh në prodhim përdorni një shërbim si **Vercel Blob**, **S3** ose **Cloudinary** (zëvendësoni logjikën te `src/app/api/admin/upload/route.ts`).

---

## Struktura

```
src/
  app/
    (faqet publike)        page.tsx, produktet/, produkti/[slug]/, shporta/, blog/, kontakti/ ...
    admin/
      login/               kyçja
      (panel)/             paneli i mbrojtur (layout me sidebar + guard)
        page.tsx           dashboard + raporte
        porosite/ produktet/ blog/ kontenti/ mesazhet/
      actions-*.ts         server actions për CRUD
    api/
      orders/ contact/ admin/{login,logout,upload}/
  components/              komponentët UI
  lib/                     prisma, auth, mail, queries, format, guard
prisma/                    schema.prisma, seed.ts
prisma.config.ts           konfigurimi i Prisma 7 (DATABASE_URL)
```

---

## Shënime teknike

- **Çmimet & stoku** verifikohen gjithmonë në server gjatë checkout-it (klienti dërgon vetëm `productId` + sasinë), për siguri.
- **Transporti** është i konfigurueshëm te paneli (Kontenti → Cilësimet: `shipping_kosovo`, `shipping_other`). Si parazgjedhje 0 (i përfshirë në çmim).
- Nëse hapni panelin para se të bëni migrim/seed, faqet do shfaqin një mesazh që baza e të dhënave nuk është gati — kjo është normale.

---

Powered by **TROKIT**
