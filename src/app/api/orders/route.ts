import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendOrderEmails } from "@/lib/mail";
import { genOrderNumber } from "@/lib/format";
import { calcShipping } from "@/lib/shipping";

const schema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(3),
    city: z.string().min(1),
    address: z.string().min(1),
    country: z.string().min(1),
    note: z.string().optional().or(z.literal("")),
  }),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Kërkesë e pavlefshme" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Të dhënat nuk janë të plota ose të vlefshme" }, { status: 400 });
  }
  const { customer, items } = parsed.data;

  // Marrim çmimet REALE nga DB (nuk i besojmë klientit)
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length === 0) {
    return NextResponse.json({ error: "Produktet nuk u gjetën" }, { status: 400 });
  }

  const lineItems = items.map((i) => {
    const p = products.find((pr) => pr.id === i.productId);
    if (!p) throw new Error("Produkt i panjohur");
    return {
      product: p,
      quantity: i.quantity,
      price: parseFloat(p.price.toString()),
    };
  });

  // Kontroll stoku
  for (const li of lineItems) {
    if (li.product.stock < li.quantity) {
      return NextResponse.json(
        { error: `Stoku i pamjaftueshëm për "${li.product.name}"` },
        { status: 409 }
      );
    }
  }

  const subtotal = lineItems.reduce((s, li) => s + li.price * li.quantity, 0);
  // Transporti llogaritet në server sipas shtetit + produkteve (autoritativ)
  const shipping = calcShipping(
    customer.country,
    lineItems.map((li) => ({ freeShipping: li.product.freeShipping }))
  );
  const total = subtotal + shipping;
  const orderNumber = genOrderNumber();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email || null,
          phone: customer.phone,
          city: customer.city,
          address: customer.address,
          country: customer.country,
          note: customer.note || null,
          paymentMethod: "COD",
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2),
          items: {
            create: lineItems.map((li) => ({
              productId: li.product.id,
              name: li.product.name,
              price: li.price.toFixed(2),
              quantity: li.quantity,
            })),
          },
        },
      });

      // Zbresim stokun
      for (const li of lineItems) {
        await tx.product.update({
          where: { id: li.product.id },
          data: { stock: { decrement: li.quantity } },
        });
      }
      return created;
    });

    // Dërgojmë email-et (pa e bllokuar përgjigjen nëse dështon SMTP)
    sendOrderEmails({
      orderNumber,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || null,
      phone: customer.phone,
      city: customer.city,
      address: customer.address,
      country: customer.country,
      note: customer.note || null,
      items: lineItems.map((li) => ({ name: li.product.name, price: li.price, quantity: li.quantity })),
      subtotal,
      shipping,
      total,
    }).catch((e) => console.error("[orders] email error:", e));

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (e) {
    console.error("[orders] error:", e);
    return NextResponse.json({ error: "Porosia dështoi. Provoni përsëri." }, { status: 500 });
  }
}
