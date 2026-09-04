import type { MetaDescriptor } from "react-router";
import { SITE } from "@/shared/config/site";

export function meta(): Array<MetaDescriptor> {
  return [
    { title: SITE.title },
    { name: "description", content: SITE.description },
    { property: "og:type", content: "website" },
    { property: "og:title", content: SITE.title },
    { property: "og:description", content: SITE.description },
    { property: "og:url", content: `${SITE.url}/` },
    { tagName: "link", rel: "canonical", href: `${SITE.url}/` },
  ];
}
