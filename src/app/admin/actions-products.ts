"use server";

import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/guard";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";

function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? "").toString().trim();
}
function num(fd: FormData, key: string, def = 0): number {
  const v = parseFloat(str(fd, key).replace(",", "."));
  return isNaN(v) ? def : v;
}
function int(fd: FormData, key: string, def = 0): number {
  const v = parseInt(str(fd, key), 10);
  return isNaN(v) ? def : v;
}
function bool(fd: FormData, key: string): boolean {
  const v = str(fd, key);
  return v === "on" || v === "true" || v === "1";
}

/** Ndan rreshtat shumë-rreshtore: secili rresht = një element. */
function lines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function revalidateStore(slug?: string) {
  revalidatePath("/");
  revalidatePath("/produktet");
  if (slug) revalidatePath(`/produkti/${slug}`);
  revalidatePath("/admin/produktet");
}

// ============================================================
//  KRIJO / PËRDITËSO PRODUKT
// ============================================================
export async function saveProduct(formData: FormData) {
  await assertAdmin();

  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) throw new Error("Emri i produktit është i detyrueshëm");

  let slug = str(formData, "slug") || slugify(name);
  slug = slugify(slug);

  const data = {
    name,
    slug,
    shortDesc: str(formData, "shortDesc") || null,
    price: num(formData, "price"),
    compareAtPrice: str(formData, "compareAtPrice") ? num(formData, "compareAtPrice") : null,
    shippingNote: str(formData, "shippingNote") || null,
    description: str(formData, "description") || null,
    stock: int(formData, "stock"),
    sku: str(formData, "sku") || null,
    active: bool(formData, "active"),
    featured: bool(formData, "featured"),
    freeShipping: bool(formData, "freeShipping"),
    sortOrder: int(formData, "sortOrder"),
    ageRange: str(formData, "ageRange") || null,
  };

  // Imazhet: një URL për rresht
  const imageUrls = lines(str(formData, "images"));
  // Bullets: një tekst për rresht
  const bulletTexts = lines(str(formData, "bullets"));

  if (id) {
    await prisma.product.update({ where: { id }, data });
    // rifresko imazhet & bullets (fshi + rikrijo)
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productBullet.deleteMany({ where: { productId: id } });
    if (imageUrls.length) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({ productId: id, url, sortOrder: i })),
      });
    }
    if (bulletTexts.length) {
      await prisma.productBullet.createMany({
        data: bulletTexts.map((text, i) => ({ productId: id, text, sortOrder: i })),
      });
    }
  } else {
    await prisma.product.create({
      data: {
        ...data,
        images: { create: imageUrls.map((url, i) => ({ url, sortOrder: i })) },
        bullets: { create: bulletTexts.map((text, i) => ({ text, sortOrder: i })) },
      },
    });
  }

  revalidateStore(slug);
}

export async function deleteProduct(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.product.delete({ where: { id } });
  revalidateStore();
}

export async function toggleProductFlag(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const field = str(formData, "field"); // "active" | "featured"
  if (!id || !["active", "featured"].includes(field)) return;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  const data =
    field === "active" ? { active: !product.active } : { featured: !product.featured };
  await prisma.product.update({ where: { id }, data });
  revalidateStore(product.slug);
}

// ============================================================
//  FEATURES / INFO CARDS / FAQ specifike per produktin
// ============================================================
export async function addProductFeature(formData: FormData) {
  await assertAdmin();
  const productId = str(formData, "productId");
  if (!productId) return;
  await prisma.productFeature.create({
    data: {
      productId,
      title: str(formData, "title"),
      body: str(formData, "body") || null,
      imageUrl: str(formData, "imageUrl") || null,
      colorTag: str(formData, "colorTag") || null,
      sortOrder: int(formData, "sortOrder"),
    },
  });
  revalidatePath("/admin/produktet");
}

export async function deleteProductFeature(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.productFeature.delete({ where: { id } });
  revalidatePath("/admin/produktet");
}

export async function addProductInfoCard(formData: FormData) {
  await assertAdmin();
  const productId = str(formData, "productId");
  if (!productId) return;
  await prisma.productInfoCard.create({
    data: {
      productId,
      label: str(formData, "label"),
      imageUrl: str(formData, "imageUrl") || null,
      sortOrder: int(formData, "sortOrder"),
    },
  });
  revalidatePath("/admin/produktet");
}

export async function deleteProductInfoCard(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.productInfoCard.delete({ where: { id } });
  revalidatePath("/admin/produktet");
}

export async function addProductFaq(formData: FormData) {
  await assertAdmin();
  const productId = str(formData, "productId");
  if (!productId) return;
  await prisma.productFaq.create({
    data: {
      productId,
      question: str(formData, "question"),
      answer: str(formData, "answer"),
      sortOrder: int(formData, "sortOrder"),
    },
  });
  revalidatePath("/admin/produktet");
}

export async function deleteProductFaq(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.productFaq.delete({ where: { id } });
  revalidatePath("/admin/produktet");
}
