import Throwaway, { frontmatter } from "@/content/posts/__throwaway.mdx";

export default function HomeRoute() {
  return (
    <main>
      <h1>{frontmatter.title}</h1>
      <Throwaway />
    </main>
  );
}
