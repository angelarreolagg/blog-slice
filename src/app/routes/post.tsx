import { ProseProvider } from "@/app/providers/mdx-provider";
import { PostDetailPage } from "@/pages/post-detail";

export default function PostRoute() {
  return (
    <ProseProvider>
      <PostDetailPage />
    </ProseProvider>
  );
}
