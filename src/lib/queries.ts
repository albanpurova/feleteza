import { prisma } from "./prisma";

// Mbështjellës i sigurt: nëse DB s'është gati, kthen fallback pa e rrëzuar faqen.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[queries] gabim:", e);
    return fallback;
  }
}

export function getSetting(map: Record<string, string>, key: string, def = "") {
  return map[key] ?? def;
}

export async function getSettingsMap() {
  return safe(async () => {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
  }, {});
}

export async function getFeaturedProducts() {
  return safe(
    () =>
      prisma.product.findMany({
        where: { active: true, featured: true },
        orderBy: { sortOrder: "asc" },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      }),
    []
  );
}

export async function getAllProducts() {
  return safe(
    () =>
      prisma.product.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      }),
    []
  );
}

export async function getProductBySlug(slug: string) {
  return safe(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          bullets: { orderBy: { sortOrder: "asc" } },
          features: { orderBy: { sortOrder: "asc" } },
          infoCards: { orderBy: { sortOrder: "asc" } },
          faqs: { orderBy: { sortOrder: "asc" } },
        },
      }),
    null
  );
}

export async function getHomeReasons() {
  return safe(() => prisma.homeReason.findMany({ orderBy: { sortOrder: "asc" } }), []);
}
export async function getExperts() {
  return safe(() => prisma.expertCard.findMany({ orderBy: { sortOrder: "asc" } }), []);
}
export async function getReviews() {
  return safe(() => prisma.review.findMany({ orderBy: { sortOrder: "asc" } }), []);
}
export async function getMoments() {
  return safe(() => prisma.momentMedia.findMany({ orderBy: { sortOrder: "asc" } }), []);
}
export async function getBlogPosts(take?: number) {
  return safe(
    () =>
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take,
      }),
    []
  );
}
export async function getBlogPost(slug: string) {
  return safe(() => prisma.blogPost.findUnique({ where: { slug } }), null);
}
export async function getFaqs() {
  return safe(() => prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }), []);
}
