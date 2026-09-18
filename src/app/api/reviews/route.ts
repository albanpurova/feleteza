import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReviewEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authorName = String(body.authorName || "").trim();
    const text = String(body.text || "").trim();
    const email = body.email ? String(body.email).trim() : null;
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (!authorName || !text) {
      return NextResponse.json({ ok: false, error: "Emri dhe komenti janë të detyrueshëm." }, { status: 400 });
    }

    await prisma.review.create({
      data: { authorName, text, email, imageUrl, rating, approved: false },
    });

    // Njofto adminin (nuk e bllokon përgjigjen nëse dështon)
    try {
      await sendReviewEmail({ authorName, email, rating, text, imageUrl });
    } catch (e) {
      console.error("[reviews] email failed", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/reviews]", e);
    return NextResponse.json({ ok: false, error: "Diçka shkoi keq." }, { status: 500 });
  }
}
