import { ProseProvider } from "@/app/providers/mdx-provider";
import { MotionProvider } from "@/app/providers/motion-provider";
import { PostDetailPage } from "@/pages/post-detail";

export { meta } from "@/pages/post-detail";

export default function PostRoute() {
  return (
    <MotionProvider>
      <ProseProvider>
        <PostDetailPage />
      </ProseProvider>
    </MotionProvider>
  );
}
