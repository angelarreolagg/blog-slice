import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { domAnimation, LazyMotion } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import { SharePost } from "./share-post";

const URL = "https://blog-demo.vercel.app/blog/una-entrada";

function renderShare() {
  return render(
    <LazyMotion features={domAnimation}>
      <SharePost title="Una entrada" url={URL} />
    </LazyMotion>,
  );
}

describe("SharePost", () => {
  it("copies the permalink and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    renderShare();
    await user.click(screen.getByRole("button", { name: "Copiar enlace" }));

    expect(writeText).toHaveBeenCalledWith(URL);
    expect(
      await screen.findByRole("button", { name: "Enlace copiado" }),
    ).toBeInTheDocument();
  });

  it("opens each share target in a new tab safely", () => {
    renderShare();

    for (const name of ["Compartir en X", "Compartir en Bluesky"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")).toContain(encodeURIComponent(URL));
    }
  });
});
