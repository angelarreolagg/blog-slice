import { Link } from "react-router";

type ProseLinkProps = React.ComponentProps<"a">;

const LINK_CLASS =
  "text-ink decoration-line-strong hover:decoration-ink underline decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-120 ease-soft";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function ProseLink({ href = "", children, ...props }: ProseLinkProps) {
  if (!isExternal(href)) {
    return (
      <Link to={href} className={LINK_CLASS} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
        {...props}
      >
        {children}
      </a>
      <span
        aria-hidden
        className="text-ink-faint ml-0.5 align-super text-[0.7em]"
      >
        ↗
      </span>
    </>
  );
}
