import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { mockMatchMedia } from "./match-media";

// jsdom implements neither of these; motion reads both while mounting.
mockMatchMedia();

vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  },
);

afterEach(() => {
  cleanup();
  mockMatchMedia();
});
