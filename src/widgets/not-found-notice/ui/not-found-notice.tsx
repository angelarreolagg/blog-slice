import { Link } from "react-router";

export function NotFoundNotice() {
  return (
    <div className="max-w-wide mx-auto w-full px-6 py-24 sm:px-8" lang="en">
      <h1 className="text-ink text-h1">Page not found</h1>
      <p className="text-ink-muted text-lead mt-4 max-w-(--container-prose)">
        The page you asked for does not exist, or the post behind it was never
        published.
      </p>
      <p className="mt-8">
        <Link
          to="/"
          className="text-ink decoration-line-strong hover:decoration-ink underline decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-(--duration-quick) ease-out"
        >
          Back to all notes
        </Link>
      </p>
    </div>
  );
}
