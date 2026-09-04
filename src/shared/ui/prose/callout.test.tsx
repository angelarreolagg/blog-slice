import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "./callout";

describe("Callout", () => {
  it("renders as a note with the tone as its name", () => {
    render(
      <Callout tone="warning">
        <p>Una OTA nunca cambia código nativo.</p>
      </Callout>,
    );

    expect(screen.getByRole("note", { name: "Aviso" })).toBeInTheDocument();
    expect(
      screen.getByText("Una OTA nunca cambia código nativo."),
    ).toBeInTheDocument();
  });

  it("defaults to the note tone", () => {
    render(<Callout>texto</Callout>);

    expect(screen.getByRole("note", { name: "Nota" })).toBeInTheDocument();
  });
});
