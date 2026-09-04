import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog/:slug", "routes/post.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
