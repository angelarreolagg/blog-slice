import { writeFile } from "node:fs/promises";
import path from "node:path";

const HANDLE = "angelarreolagg";
const SIZE = 160;
const DESTINATION = "public/author.jpg";

// The avatar is vendored rather than hotlinked: a prerendered page must not
// depend on a third party to render, and a remote avatar would report every
// reader to GitHub. Run `pnpm avatar` when the GitHub picture changes.
async function main() {
  const profile = await fetch(`https://api.github.com/users/${HANDLE}`);
  if (!profile.ok) {
    throw new Error(`GitHub returned ${profile.status} for ${HANDLE}`);
  }

  const { avatar_url: avatarUrl } = (await profile.json()) as {
    avatar_url: string;
  };
  const image = await fetch(`${avatarUrl}&s=${SIZE}`);
  if (!image.ok) {
    throw new Error(`Avatar download returned ${image.status}`);
  }

  const destination = path.join(process.cwd(), DESTINATION);
  await writeFile(destination, Buffer.from(await image.arrayBuffer()));
  console.warn(`Wrote ${DESTINATION} at ${SIZE}px`);
}

await main();
