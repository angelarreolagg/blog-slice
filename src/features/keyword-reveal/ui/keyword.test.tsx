import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { Keyword } from "./keyword";

describe("Keyword", () => {
  it("renders as prose, not as a control", () => {
    render(<Keyword tone="define">hidratación</Keyword>);

    expect(screen.getByText("hidratación")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("exposes no focus stop and no interactive role", () => {
    render(<Keyword tone="reference">hidratación</Keyword>);
    const word = screen.getByText("hidratación").closest("span");

    expect(word).not.toHaveAttribute("tabindex");
    expect(word).not.toHaveAttribute("role");
  });

  it("hides the underline from assistive technology", () => {
    const { container } = render(<Keyword tone="note">hidratación</Keyword>);

    expect(container.querySelectorAll("[aria-hidden]")).toHaveLength(2);
  });

  it("renders revealed when the reader asks for less motion", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    render(<Keyword tone="define">hidratación</Keyword>);

    expect(screen.getByText("hidratación")).toBeVisible();
  });
});
