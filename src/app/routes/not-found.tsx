import { NotFoundPage } from "@/pages/not-found";
import { SITE } from "@/shared/config/site";

export function meta() {
  return [
    { title: `Page not found — ${SITE.title}` },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
