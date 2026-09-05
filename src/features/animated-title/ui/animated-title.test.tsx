import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimatedTitle } from "./animated-title";

const TITLE = "React Native y Expo: el entorno de EAS";

describe("AnimatedTitle", () => {
  it("renders a plain heading by default", () => {
    render(<AnimatedTitle title={TITLE} style="plain" />);

    expect(
      screen.getByRole("heading", { level: 1, name: TITLE }),
    ).toBeInTheDocument();
  });

  it("keeps the accessible name intact when the title is split up", () => {
    render(<AnimatedTitle title={TITLE} style="matrix" />);
    const heading = screen.getByRole("heading", { level: 1, name: TITLE });

    expect(heading).toBeInTheDocument();
    // The split copy is decorative; the readable one is the single text node.
    expect(heading.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("splits into one glyph per character, grouped by word", () => {
    const { container } = render(
      <AnimatedTitle title="dos palabras" style="matrix" />,
    );

    expect(container.querySelectorAll(".matrix-word")).toHaveLength(2);
    expect(container.querySelectorAll(".matrix-char")).toHaveLength(11);
  });
});
