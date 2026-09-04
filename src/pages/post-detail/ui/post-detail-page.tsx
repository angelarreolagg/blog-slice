import { useParams } from "react-router";
import { formatPostDate, getPost } from "@/entities/post";
import { Tag } from "@/shared/ui/tag";
import { NotFoundNotice } from "@/widgets/not-found-notice";

export function PostDetailPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <NotFoundNotice />;

  const { Content } = post;

  return (
    // CSS entrances keep the prose visible when the interaction layer never loads.
    <article className="mx-auto w-full max-w-prose px-6 py-16 sm:px-8">
      <header className="stagger-enter mb-12">
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

      <div className="prose animate-article-enter [animation-delay:200ms]">
        <Content />
      </div>
    </article>
  );
}
