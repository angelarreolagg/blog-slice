import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Layers } from "./layers";

const ITEMS = [
  { id: "app", label: "app", reaches: ["shared"] },
  { id: "shared", label: "shared" },
];

describe("Layers", () => {
  it("exposes every band as an unpressed toggle in a named group", () => {
    render(<Layers label="Capas" items={ITEMS} />);

    expect(screen.getByRole("group", { name: "Capas" })).toBeInTheDocument();
    for (const band of screen.getAllByRole("button")) {
      expect(band).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("presses one band on tap and releases it on a second tap", async () => {
    const user = userEvent.setup();
    render(<Layers label="Capas" items={ITEMS} />);
    const app = screen.getByRole("button", { name: "app" });

    await user.click(app);
    expect(app).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "shared" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(app);
    expect(app).toHaveAttribute("aria-pressed", "false");
  });
});
