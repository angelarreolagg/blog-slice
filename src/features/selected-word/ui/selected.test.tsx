import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Selected } from "./selected";

describe("Selected", () => {
  it("renders the word as ordinary prose", () => {
    render(<Selected>interfaz</Selected>);

    expect(screen.getByText("interfaz")).toBeInTheDocument();
  });

  it("promises no interaction it cannot keep", () => {
    render(<Selected>interfaz</Selected>);
    const word = screen.getByText("interfaz");

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(word.closest("[tabindex]")).toBeNull();
    expect(word.closest("[role]")).toBeNull();
  });

  it("hides the selection chrome from assistive technology", () => {
    const { container } = render(<Selected>interfaz</Selected>);
    const chrome = container.querySelectorAll("[aria-hidden]");

    expect(chrome.length).toBeGreaterThan(0);
    for (const node of chrome) {
      expect(node).not.toHaveTextContent("interfaz");
    }
  });
});
