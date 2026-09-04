import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Compare, CompareItem } from "./compare";

function renderCompare(defaultItem?: string) {
  return render(
    <Compare label="Perfiles" defaultItem={defaultItem}>
      <CompareItem id="development" label="development">
        <p>Cliente de desarrollo</p>
      </CompareItem>
      <CompareItem id="production" label="production">
        <p>Tienda</p>
      </CompareItem>
    </Compare>,
  );
}

describe("Compare", () => {
  it("shows the first item until another tab is chosen", async () => {
    const user = userEvent.setup();
    renderCompare();

    expect(
      screen.getByRole("tablist", { name: "Perfiles" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cliente de desarrollo")).toBeVisible();
    expect(screen.queryByText("Tienda")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "production" }));

    expect(screen.getByText("Tienda")).toBeVisible();
    expect(screen.getByRole("tab", { name: "production" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("honours the default item", () => {
    renderCompare("production");

    expect(screen.getByText("Tienda")).toBeVisible();
  });
});
