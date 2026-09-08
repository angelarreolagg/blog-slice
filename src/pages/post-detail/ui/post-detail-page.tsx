import { useParams } from "react-router";
import { AnimatedTitle } from "@/features/animated-title";
import { TableOfContents } from "@/features/table-of-contents";
import { formatPostDate, getPost } from "@/entities/post";
import { NotFoundNotice } from "@/widgets/not-found-notice";
import { PostMeta } from "@/widgets/post-rails";

export function PostDetailPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <NotFoundNotice />;

  const { Content } = post;

  return (
    // The rails live in the margins, so the prose column never moves.
    <div className="relative mx-auto w-full max-w-(--container-prose)">
      <article className="w-full px-6 py-16 sm:px-8">
        <header className="stagger-enter mb-10">
          <p className="text-ink-faint text-meta tabular-nums">
            <time dateTime={post.date} lang="en">
              {formatPostDate(post.date)}
            </time>
            {`, ${post.readingMinutes} min de lectura`}
          </p>
          <AnimatedTitle
            title={post.title}
            style={post.titleStyle}
            tones={post.titleTones}
            texture={post.titleTexture}
            className="text-ink text-h1 mt-4 text-balance"
          />
          <p className="text-ink-muted text-lead mt-4 text-balance">
            {post.description}
          </p>
        </header>

        <div className="mb-8 lg:mb-0">
          <TableOfContents headings={post.headings} label="Contenido" />
        </div>

        <div className="prose animate-article-enter [animation-delay:calc(var(--duration-micro)*3)]">
          <Content />
        </div>

        <PostMeta post={post} />
      </article>
    </div>
  );
}
