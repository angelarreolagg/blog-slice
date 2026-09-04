import { useId } from "react";
import { Link } from "react-router";
import { formatPostDate } from "../lib/format-date";
import type { PostSummary } from "../model/types";

type PostCardProps = {
  post: PostSummary;
};

export function PostCard({ post }: PostCardProps) {
  const titleId = useId();

  return (
    <li className="border-line hover:bg-surface has-focus-visible:bg-surface border-b transition-[background-color,border-color] duration-(--duration-quick) ease-out hover:rounded-lg hover:border-transparent has-focus-visible:rounded-lg has-focus-visible:border-transparent">
      <Link
        to={`/blog/${post.slug}`}
        aria-labelledby={titleId}
        className="focus-visible:outline-accent block rounded-lg px-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-5"
      >
        <h3 id={titleId} className="text-ink text-h3">
          {post.title}
        </h3>
        <p className="text-ink-muted text-meta mt-1 max-w-prose">
          {post.description}
        </p>
        <p className="text-ink-faint text-meta mt-3 tabular-nums" lang="en">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {post.tags.length > 0 && <span>{`, ${post.tags.join(", ")}`}</span>}
        </p>
      </Link>
    </li>
  );
}
