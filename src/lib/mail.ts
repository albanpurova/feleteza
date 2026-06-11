import "server-only";
import nodemailer from "nodemailer";

type OrderEmailData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  city: string;
  address: string;
  country: string;
  note?: string | null;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[mail] SMTP nuk është konfiguruar plotësisht — emailat nuk do dërgohen.");
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

const euro = (n: number) =>
  new Intl.NumberFormat("sq-AL", { style: "currency", currency: "EUR" }).format(n);

function itemsTable(items: OrderEmailData["items"]) {
  const rows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${euro(i.price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${euro(i.price * i.quantity)}</td>
        </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">
    <thead><tr style="background:#fcf5ea">
      <th style="padding:8px 12px;text-align:left">Produkti</th>
      <th style="padding:8px 12px">Sasia</th>
      <th style="padding:8px 12px;text-align:right">Çmimi</th>
      <th style="padding:8px 12px;text-align:right">Totali</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function baseLayout(title: string, inner: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#34495e">
    <div style="background:#1f9d63;padding:24px;text-align:center">
      <span style="color:#fff;font-size:26px;font-weight:bold;letter-spacing:1px">FLETËZA</span>
    </div>
    <div style="padding:24px;background:#fff">
      <h2 style="color:#34495e">${title}</h2>
      ${inner}
    </div>
    <div style="padding:16px;text-align:center;font-size:12px;color:#999;background:#f4f7f6">
      © ${new Date().getFullYear()} FLETËZA · info@fleteza.com
    </div>
  </div>`;
}

export async function sendOrderEmails(data: OrderEmailData) {
  const transporter = getTransporter();
  if (!transporter) return;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER!;

  const summary = `
    <p>Numri i porosisë: <strong>${data.orderNumber}</strong></p>
    ${itemsTable(data.items)}
    <table style="width:100%;margin-top:16px;font-size:14px">
      <tr><td>Nëntotali</td><td style="text-align:right">${euro(data.subtotal)}</td></tr>
      <tr><td>Transporti</td><td style="text-align:right">${data.shipping === 0 ? "Falas" : euro(data.shipping)}</td></tr>
      <tr><td style="font-weight:bold;padding-top:6px">TOTALI</td><td style="text-align:right;font-weight:bold;padding-top:6px">${euro(data.total)}</td></tr>
    </table>
    <p style="margin-top:16px"><strong>Mënyra e pagesës:</strong> Para në dorë (Cash on Delivery)</p>`;

  const customerInfo = `
    <h3 style="color:#34495e">Të dhënat e dërgesës</h3>
    <p style="font-size:14px;line-height:1.6">
      ${data.firstName} ${data.lastName}<br/>
      Tel: ${data.phone}<br/>
      ${data.address}, ${data.city}, ${data.country}<br/>
      ${data.email ? `Email: ${data.email}<br/>` : ""}
      ${data.note ? `Shënim: ${data.note}` : ""}
    </p>`;

  // Email te klienti
  const tasks: Promise<unknown>[] = [];
  if (data.email) {
    tasks.push(
      transporter.sendMail({
        from,
        to: data.email,
        subject: `Porosia juaj #${data.orderNumber} u pranua — FLETËZA`,
        html: baseLayout(
          "Faleminderit për porosinë!",
          `<p>Përshëndetje ${data.firstName},</p>
           <p>Porosia juaj u pranua me sukses. Porositë për Kosovë dorëzohen brenda 1–2 ditëve pune, ndërsa për Shqipëri dhe Maqedoni të Veriut brenda 3–5 ditëve pune.</p>
           ${summary}
           ${customerInfo}`
        ),
      })
    );
  }

  // Email te admini
  tasks.push(
    transporter.sendMail({
      from,
      to: adminEmail,
      subject: `🛒 Porosi e re #${data.orderNumber}`,
      html: baseLayout(
        "Porosi e re ka mbërritur",
        `${customerInfo}${summary}`
      ),
    })
  );

  await Promise.allSettled(tasks);
}

export async function sendContactEmail(d: {
  name?: string | null;
  email: string;
  phone?: string | null;
  message: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER!;

  await transporter.sendMail({
    from,
    to: adminEmail,
    replyTo: d.email,
    subject: `📩 Mesazh i ri nga kontakti — ${d.name || d.email}`,
    html: baseLayout(
      "Mesazh i ri nga forma e kontaktit",
      `<p><strong>Emri:</strong> ${d.name || "-"}</p>
       <p><strong>Email:</strong> ${d.email}</p>
       <p><strong>Telefoni:</strong> ${d.phone || "-"}</p>
       <p><strong>Mesazhi:</strong></p>
       <p style="background:#f4f7f6;padding:12px;border-radius:8px">${d.message}</p>`
    ),
  });
}
