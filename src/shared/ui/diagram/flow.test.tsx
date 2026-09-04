import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flow } from "./flow";

const STEPS = [
  { id: "code", label: "Código" },
  { id: "build", label: "eas build" },
  { id: "store", label: "Tienda" },
];

describe("Flow", () => {
  it("renders one list item per step under the given name", () => {
    render(<Flow label="Del código a la tienda" steps={STEPS} />);

    expect(
      screen.getByRole("list", { name: "Del código a la tienda" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks exactly one step as current when an active id is given", () => {
    render(<Flow label="Flujo" steps={STEPS} activeId="build" />);

    const current = screen
      .getAllByRole("listitem")
      .filter((item) => item.getAttribute("aria-current") === "step");

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("eas build");
  });
});
