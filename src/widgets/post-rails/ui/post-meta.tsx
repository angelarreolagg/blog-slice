import { SharePost } from "@/features/share-post";
import { formatPostDate, type PostSummary } from "@/entities/post";
import { useHoverFalloff } from "@/shared/lib/use-hover-falloff";
import { SITE } from "@/shared/config/site";
import { Avatar } from "@/shared/ui/avatar";
import { Tag } from "@/shared/ui/tag";

type PostMetaProps = {
  post: PostSummary;
};

export function PostMeta({ post }: PostMetaProps) {
  const author = post.author ?? SITE.author;
  const tagRow = useHoverFalloff();

  return (
    <aside
      aria-label="Sobre esta entrada"
      className="border-line mt-16 border-t pt-8 xl:absolute xl:inset-y-0 xl:left-full xl:mt-0 xl:border-t-0 xl:pt-0 xl:pl-10"
    >
      <div className="flex flex-col gap-6 xl:sticky xl:top-24 xl:w-48">
        <div className="flex items-center gap-3">
          <Avatar name={author} />
          <div className="min-w-0">
            <p className="text-meta text-ink font-medium">{author}</p>
            <p className="text-caption text-ink-faint tabular-nums">
              {post.readingMinutes} min de lectura
            </p>
          </div>
        </div>

        <dl className="text-caption flex flex-col gap-1">
          <div className="flex gap-2">
            <dt className="text-ink-faint">Publicado</dt>
            <dd className="text-ink-muted tabular-nums" lang="en">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </dd>
          </div>
          {post.updated && (
            <div className="flex gap-2">
              <dt className="text-ink-faint">Actualizado</dt>
              <dd className="text-ink-muted tabular-nums" lang="en">
                <time dateTime={post.updated}>
                  {formatPostDate(post.updated)}
                </time>
              </dd>
            </div>
          )}
        </dl>

        {post.tags.length > 0 && (
          <ul
            className="flex flex-wrap items-center gap-2"
            onPointerOver={tagRow.onPointerOver}
            onPointerLeave={tagRow.onPointerLeave}
          >
            {post.tags.map((tag) => (
              <li key={tag} className="t-avatar">
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}

        <SharePost title={post.title} url={`${SITE.url}/blog/${post.slug}`} />
      </div>
    </aside>
  );
}
