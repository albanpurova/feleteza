import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Ngarkim PUBLIK vetëm për median e vlerësimeve (imazh ose video, max ~4MB).
const ALLOWED = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/ogg", "video/quicktime",
];
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Asnjë skedar" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Format i palejuar" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Skedari është shumë i madh (max 4MB)" }, { status: 413 });
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `reviews/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
      return NextResponse.json({ ok: true, url: blob.url });
    } catch (e) {
      console.error("[reviews/upload] Blob:", e);
      return NextResponse.json({ ok: false, error: "Ngarkimi dështoi" }, { status: 500 });
    }
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", "reviews");
    await mkdir(dir, { recursive: true });
    const localName = name.split("/").pop()!;
    await writeFile(path.join(dir, localName), bytes);
    return NextResponse.json({ ok: true, url: `/uploads/reviews/${localName}` });
  } catch (e) {
    console.error("[reviews/upload] lokal:", e);
    return NextResponse.json({ ok: false, error: "Ngarkimi dështoi" }, { status: 500 });
  }
}
