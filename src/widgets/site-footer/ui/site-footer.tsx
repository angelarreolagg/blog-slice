import { Link } from "react-router";
import { ThemeToggle } from "@/features/theme-toggle";
import { SITE, SOCIAL_LINKS } from "@/shared/config/site";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

export function SiteFooter() {
  return (
    <footer lang="en" className="text-meta mt-24">
      <div className="border-line max-w-wide mx-auto flex w-full flex-col gap-6 border-t px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link
          to="/"
          className="text-ink-faint hover:text-ink focus-visible:outline-accent rounded-sm transition-colors duration-(--duration-quick) ease-out focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span aria-hidden>← </span>
          {SITE.name}
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <ThemeToggle />

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-ink-faint hover:text-ink focus-visible:outline-accent relative inline-flex rounded-sm transition-colors duration-(--duration-quick) ease-out after:absolute after:-inset-3 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <SpriteIcon id={link.id} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
