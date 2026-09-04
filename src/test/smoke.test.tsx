import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/shared/ui/button";

describe("test environment", () => {
  it("renders a component and exposes it by role", () => {
    render(<Button>Publish</Button>);

    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  it("provides a matchMedia stub", () => {
    expect(window.matchMedia("(hover: hover)").matches).toBe(false);
  });
});
