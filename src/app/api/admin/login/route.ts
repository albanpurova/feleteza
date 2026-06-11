import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyCredentials, createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
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
    return NextResponse.json({ ok: false, error: "Plotësoni email dhe fjalëkalimin" }, { status: 422 });
  }

  let creds;
  try {
    creds = await verifyCredentials(parsed.data.email, parsed.data.password);
  } catch (e) {
    console.error("[login] gabim:", e);
    return NextResponse.json(
      { ok: false, error: "Gabim i brendshëm. A është konfiguruar baza e të dhënave?" },
      { status: 500 }
    );
  }

  if (!creds) {
    return NextResponse.json({ ok: false, error: "Kredenciale të pasakta" }, { status: 401 });
  }

  await createSession(creds);
  return NextResponse.json({ ok: true });
}
