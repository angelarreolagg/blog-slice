import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { AnimatedParagraph } from "./animated-paragraph";

describe("AnimatedParagraph", () => {
  it("staggers on coarse pointers instead of waiting for hover", () => {
    mockMatchMedia({ "(hover: hover) and (pointer: fine)": false });
    const { container } = render(<AnimatedParagraph>texto</AnimatedParagraph>);

    expect(container.querySelector("p")).toHaveAttribute(
      "data-reveal",
      "stagger",
    );
  });

  it("waits for hover when the device has a fine pointer", () => {
    mockMatchMedia({ "(hover: hover) and (pointer: fine)": true });
    const { container } = render(<AnimatedParagraph>texto</AnimatedParagraph>);

    expect(container.querySelector("p")).toHaveAttribute(
      "data-reveal",
      "hover",
    );
  });

  it("does not stagger when the reader asks for less motion", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const { container } = render(<AnimatedParagraph>texto</AnimatedParagraph>);

    expect(container.querySelector("p")).toHaveAttribute(
      "data-reveal",
      "hover",
    );
  });
});
