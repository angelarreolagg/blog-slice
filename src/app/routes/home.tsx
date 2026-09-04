import { getPosts } from "@/entities/post";

export default function HomeRoute() {
  return (
    <main>
      <ul>
        {getPosts().map((post) => (
          <li key={post.slug}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
