import InsightArticleClient from "./InsightArticleClient";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ||
  "https://backend.ravokstudios.com";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const all: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const res = await fetch(`${API_BASE}/api/public/posts?per_page=50&page=${page}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) break;
      const data = (await res.json()) as {
        data?: { slug: string }[];
        last_page?: number;
      };
      const posts = data.data ?? [];
      all.push(...posts.map((p) => ({ slug: p.slug })));
      hasMore = posts.length === 50 && (data.last_page ?? 1) > page;
      page += 1;
    }
    return all;
  } catch {
    return [];
  }
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <InsightArticleClient slug={slug} />;
}
