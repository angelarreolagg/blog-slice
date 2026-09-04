import { getPosts } from "@/entities/post";
import { PostCard } from "@/entities/post";

export function PostListPage() {
  const posts = getPosts();

  return (
    <div className="max-w-wide mx-auto w-full px-6 py-16 sm:px-8">
      <header className="stagger-enter mb-12">
        <h1 className="text-ink text-display">Notes</h1>
        <p className="text-ink-muted text-lead mt-4 max-w-prose text-balance">
          Apuntes sobre arquitectura, pruebas y diseño de componentes en
          aplicaciones de React.
        </p>
      </header>

      <ul className="row-stagger -mx-4 sm:-mx-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </div>
  );
}
