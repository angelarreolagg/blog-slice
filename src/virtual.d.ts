declare module "virtual:published-posts" {
  import type { PostModule } from "@/entities/post";

  // Published only, newest first; drafts never enter the module graph.
  export const posts: Array<{
    slug: string;
    readingMinutes: number;
    module: PostModule;
  }>;
}
