import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/newsreader/wght-italic.css";
import "./styles/index.css";
import { THEME_STORAGE_KEY } from "@/features/theme-toggle";
import { SITE } from "@/shared/config/site";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";

// The HTML is prerendered, so without this the page paints the wrong palette first.
const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE.title}
          href="/rss.xml"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          lang="en"
          className="focus-visible:border-line focus-visible:bg-bg focus-visible:text-ink focus-visible:outline-accent sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-10 focus-visible:rounded-md focus-visible:border focus-visible:px-4 focus-visible:py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="max-w-wide mx-auto w-full px-6 py-24 sm:px-8" lang="en">
      <h1 className="text-ink text-h1">
        {isNotFound ? "Page not found" : "Something went wrong"}
      </h1>
      <p className="text-ink-muted text-lead mt-4 max-w-prose">
        {isNotFound
          ? "The page you asked for does not exist."
          : "This page failed to render. Reloading may be enough; if not, the error is on our side."}
      </p>
    </div>
  );
}
