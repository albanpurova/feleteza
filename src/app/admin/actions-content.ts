"use server";

import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/guard";
import { slugify } from "@/lib/format";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/generated/prisma";

function str(fd: FormData, key: string): string {
  return (fd.get(key) ?? "").toString().trim();
}
function int(fd: FormData, key: string, def = 0): number {
  const v = parseInt(str(fd, key), 10);
  return isNaN(v) ? def : v;
}
function bool(fd: FormData, key: string): boolean {
  const v = str(fd, key);
  return v === "on" || v === "true" || v === "1";
}

// ============================================================
//  POROSITË — ndrysho statusin
// ============================================================
const VALID_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function updateOrderStatus(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !VALID_STATUSES.includes(status)) return;
  await prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
  });
  revalidatePath("/admin/porosite");
  revalidatePath("/admin");
}

export async function deleteOrder(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/porosite");
  revalidatePath("/admin");
}

// ============================================================
//  BLOGU
// ============================================================
export async function saveBlogPost(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  if (!title) throw new Error("Titulli është i detyrueshëm");

  let slug = str(formData, "slug") || slugify(title);
  slug = slugify(slug);

  const publishedAtRaw = str(formData, "publishedAt");
  const data = {
    title,
    slug,
    excerpt: str(formData, "excerpt") || null,
    coverImage: str(formData, "coverImage") || null,
    content: str(formData, "content"),
    author: str(formData, "author") || "FLETËZA",
    published: bool(formData, "published"),
    ...(publishedAtRaw ? { publishedAt: new Date(publishedAtRaw) } : {}),
  };

  if (id) {
    await prisma.blogPost.update({ where: { id }, data });
  } else {
    await prisma.blogPost.create({ data });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

// ============================================================
//  KONTENTI I HOMEPAGE
// ============================================================
function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/admin/kontenti");
}

// ---- Pse FLETËZA? (HomeReason) ----
export async function saveReason(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const data = {
    title: str(formData, "title"),
    body: str(formData, "body"),
    imageUrl: str(formData, "imageUrl") || null,
    sortOrder: int(formData, "sortOrder"),
  };
  if (id) await prisma.homeReason.update({ where: { id }, data });
  else await prisma.homeReason.create({ data });
  revalidateHome();
}
export async function deleteReason(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.homeReason.delete({ where: { id } });
  revalidateHome();
}

// ---- Ekspertët (ExpertCard) ----
export async function saveExpert(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const data = {
    label: str(formData, "label"),
    imageUrl: str(formData, "imageUrl") || null,
    sortOrder: int(formData, "sortOrder"),
  };
  if (id) await prisma.expertCard.update({ where: { id }, data });
  else await prisma.expertCard.create({ data });
  revalidateHome();
}
export async function deleteExpert(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.expertCard.delete({ where: { id } });
  revalidateHome();
}

// ---- Reviews ----
export async function saveReview(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const data = {
    authorName: str(formData, "authorName"),
    text: str(formData, "text"),
    rating: int(formData, "rating", 5),
    imageUrl: str(formData, "imageUrl") || null,
    sortOrder: int(formData, "sortOrder"),
  };
  if (id) await prisma.review.update({ where: { id }, data });
  else await prisma.review.create({ data });
  revalidateHome();
}
export async function deleteReview(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.review.delete({ where: { id } });
  revalidateHome();
}

// ---- Momente të ndara (MomentMedia) ----
export async function saveMoment(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const data = {
    imageUrl: str(formData, "imageUrl"),
    sortOrder: int(formData, "sortOrder"),
  };
  if (id) await prisma.momentMedia.update({ where: { id }, data });
  else await prisma.momentMedia.create({ data });
  revalidateHome();
}
export async function deleteMoment(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.momentMedia.delete({ where: { id } });
  revalidateHome();
}

// ---- FAQ global ----
export async function saveFaq(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const data = {
    question: str(formData, "question"),
    answer: str(formData, "answer"),
    sortOrder: int(formData, "sortOrder"),
  };
  if (id) await prisma.faq.update({ where: { id }, data });
  else await prisma.faq.create({ data });
  revalidateHome();
}
export async function deleteFaq(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.faq.delete({ where: { id } });
  revalidateHome();
}

// ============================================================
//  CILËSIMET (SiteSetting key/value)
// ============================================================
export async function saveSettings(formData: FormData) {
  await assertAdmin();
  // Çdo çift key__<name> ruhet
  const entries: { key: string; value: string }[] = [];
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("setting__")) {
      entries.push({ key: k.replace("setting__", ""), value: v.toString() });
    }
  }
  for (const e of entries) {
    await prisma.siteSetting.upsert({
      where: { key: e.key },
      update: { value: e.value },
      create: { key: e.key, value: e.value },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/kontenti");
}

// ============================================================
//  MESAZHET E KONTAKTIT
// ============================================================
export async function toggleContactHandled(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (!id) return;
  const m = await prisma.contactMessage.findUnique({ where: { id } });
  if (!m) return;
  await prisma.contactMessage.update({ where: { id }, data: { handled: !m.handled } });
  revalidatePath("/admin/mesazhet");
}
export async function deleteContactMessage(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (id) await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mesazhet");
}
