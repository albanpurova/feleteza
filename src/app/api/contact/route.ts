import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mail";

const schema = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email("Email i pavlefshëm"),
  phone: z.string().trim().max(40).optional().nullable(),
  message: z.string().trim().min(1, "Mesazhi është i zbrazët").max(5000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Kërkesë e pavlefshme" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Të dhëna të pavlefshme" },
      { status: 422 }
    );
  }

  const d = parsed.data;

  try {
    await prisma.contactMessage.create({
      data: {
        name: d.name ?? null,
        email: d.email,
        phone: d.phone ?? null,
        message: d.message,
      },
    });
  } catch (e) {
    console.error("[contact] gabim DB:", e);
    return NextResponse.json(
      { ok: false, error: "Nuk u ruajt mesazhi. Provoni sërish më vonë." },
      { status: 500 }
    );
  }

  // Dërgo email (mos e bllokon përgjigjen nëse dështon)
  sendContactEmail({
    name: d.name,
    email: d.email,
    phone: d.phone,
    message: d.message,
  }).catch((e) => console.error("[contact] email dështoi:", e));

  return NextResponse.json({ ok: true });
}
