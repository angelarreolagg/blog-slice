export const SITE = {
  name: "notes",
  title: "notes",
  description:
    "Apuntes sobre arquitectura, pruebas y diseño de componentes en aplicaciones de React.",
  url: "https://blog-demo.vercel.app",
  author: "Ángel Arreola",
  // Vendored from the GitHub profile; refresh with `pnpm avatar`.
  authorAvatar: "/author.jpg",
  language: "es",
} as const;

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export const SOCIAL_LINKS: Array<SocialLink> = [
  {
    id: "github-icon",
    label: "GitHub",
    href: "https://github.com/angelarreola",
  },
  {
    id: "bluesky-icon",
    label: "Bluesky",
    href: "https://bsky.app/profile/angelarreola.dev",
  },
  { id: "x-icon", label: "X", href: "https://x.com/angelarreola" },
  {
    id: "discord-icon",
    label: "Discord",
    href: "https://discord.com/users/angelarreola",
  },
  {
    id: "social-icon",
    label: "Elsewhere",
    href: "https://github.com/angelarreola?tab=repositories",
  },
  {
    id: "documentation-icon",
    label: "Documentation",
    href: "https://github.com/angelarreola/blog-demo#readme",
  },
];
