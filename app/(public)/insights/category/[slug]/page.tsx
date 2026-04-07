import InsightsCategoryClient from "./InsightsCategoryClient";

const CATEGORY_SLUGS = [
  "ravok-insights",
  "latest-analysis",
  "creator-stories",
  "data-research",
];

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export default async function InsightsCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <InsightsCategoryClient slug={slug} />;
}
