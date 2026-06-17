import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function baseUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  return req.nextUrl.origin;
}

function absolutize(url: string | null | undefined, base: string): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  const base = baseUrl(req);
  const slug = req.nextUrl.searchParams.get("slug");

  try {
    const products = await prisma.product.findMany({
      where: { active: true, ...(slug ? { slug } : {}) },
      orderBy: { sortOrder: "asc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        bullets: { orderBy: { sortOrder: "asc" } },
      },
    });

    const data = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDesc,
      description: p.description,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      currency: "EUR",
      stock: p.stock,
      availability: p.stock > 0 ? "in_stock" : "out_of_stock",
      ageRange: p.ageRange,
      freeShipping: p.freeShipping,
      url: `${base}/produkti/${p.slug}`,
      image: absolutize(p.images[0]?.url, base),
      images: p.images.map((img) => absolutize(img.url, base)).filter(Boolean),
      features: p.bullets.map((b) => b.text),
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(
      { count: data.length, products: data },
      { headers: CORS }
    );
  } catch (e) {
    console.error("[api/products]", e);
    return NextResponse.json(
      { error: "Nuk u morën dot produktet" },
      { status: 500, headers: CORS }
    );
  }
}
