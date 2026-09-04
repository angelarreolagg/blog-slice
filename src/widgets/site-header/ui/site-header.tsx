import { Link, useLocation } from "react-router";
import { SITE } from "@/shared/config/site";

const LINK_CLASS =
  "text-ink-faint hover:text-ink transition-colors duration-120 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm";

export function SiteHeader() {
  const { pathname } = useLocation();
  const isIndex = pathname === "/";

  return (
    <header lang="en" className="text-meta">
      <div className="max-w-wide mx-auto flex w-full items-center justify-between gap-4 px-6 py-6 sm:px-8">
        <Link
          to="/"
          aria-current={isIndex ? "page" : undefined}
          className={LINK_CLASS}
        >
          <span className={isIndex ? "text-ink font-medium" : "font-medium"}>
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Site">
          <ul className="flex items-center gap-5">
            <li>
              <a href="/rss.xml" className={LINK_CLASS}>
                RSS
              </a>
            </li>
            <li>
              <a
                href="https://github.com/angelarreola/blog-demo"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                GitHub
              </a>
              <span
                aria-hidden
                className="text-ink-faint ml-0.5 align-super text-[0.7em]"
              >
                ↗
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
