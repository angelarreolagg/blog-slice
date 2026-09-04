import { motion } from "motion/react";
import { useParams } from "react-router";
import { formatPostDate, getPost } from "@/entities/post";
import { useReducedMotion } from "@/shared/lib/use-reduced-motion";
import { Tag } from "@/shared/ui/tag";
import { NotFoundNotice } from "@/widgets/not-found-notice";

const ENTRANCE_EASE = [0.25, 1, 0.5, 1] as const;

export function PostDetailPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  const prefersReducedMotion = useReducedMotion();

  if (!post) return <NotFoundNotice />;

  const { Content } = post;

  return (
    <motion.article
      className="mx-auto w-full max-w-prose px-6 py-16 sm:px-8"
      initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.24,
        ease: ENTRANCE_EASE,
      }}
    >
      <header className="mb-12">
        <p className="text-ink-faint text-meta tabular-nums" lang="en">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {post.updated && `, updated ${formatPostDate(post.updated)}`}
        </p>
        <h1 className="text-ink text-h1 mt-4 text-balance">{post.title}</h1>
        <p className="text-ink-muted text-lead mt-4 text-balance">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="prose">
        <Content />
      </div>
    </motion.article>
  );
}
