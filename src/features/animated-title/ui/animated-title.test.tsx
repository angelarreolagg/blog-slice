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

  it("keeps the valo title as one text node under decorative overlays", () => {
    render(<AnimatedTitle title={TITLE} style="valo" />);
    const heading = screen.getByRole("heading", { level: 1, name: TITLE });

    expect(heading.querySelector(".valo-text")).toHaveTextContent(TITLE);
    // Two panels, two strips and three boxes of static, none of them readable.
    expect(heading.querySelectorAll("[aria-hidden]")).toHaveLength(7);
    expect(heading.querySelectorAll(".valo-block")).toHaveLength(2);
    expect(heading.querySelectorAll(".valo-strip")).toHaveLength(2);
    expect(heading.querySelectorAll(".valo-glitch")).toHaveLength(3);
  });

  it("hands an entry's tones to the valo card, and only those", () => {
    const { container } = render(
      <AnimatedTitle
        title={TITLE}
        style="valo"
        tones={{ primary: "#2323ce", text: "#fff" }}
      />,
    );
    const frame = container.querySelector<HTMLElement>(".valo-frame");

    expect(frame?.style.getPropertyValue("--valo-primary")).toBe("#2323ce");
    expect(frame?.style.getPropertyValue("--valo-text")).toBe("#fff");
    expect(frame?.style.getPropertyValue("--valo-secondary")).toBe("");
  });
});
