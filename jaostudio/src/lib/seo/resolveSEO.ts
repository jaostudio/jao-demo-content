import { getTranslations } from "next-intl/server";
import { buildOG } from "./og";
import type { RouteIntent } from "@/lib/seo-config";

export type SEOProps = {
  titleKey: string;
  descriptionKey: string;
  image?: string;
  intent?: RouteIntent;
};

export async function resolveSEO(page: SEOProps) {
  const t = await getTranslations();

  const title = t(page.titleKey);
  const description = t(page.descriptionKey);

  if (!title || !description) {
    throw new Error(
      `Missing SEO key: ${page.titleKey} / ${page.descriptionKey}`
    );
  }

  const isIndexable = !page.intent || page.intent === 'indexable'

  return {
    title,
    description,
    robots: isIndexable ? "index,follow" : "noindex,nofollow",
    openGraph: buildOG({
      title,
      description,
      image: page.image,
    }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
