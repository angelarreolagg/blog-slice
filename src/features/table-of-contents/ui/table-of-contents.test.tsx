import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "./table-of-contents";

const HEADINGS = [
  { depth: 2, id: "las-capas", text: "Las capas" },
  { depth: 3, id: "el-corte", text: "Cómo se ve el corte" },
  { depth: 2, id: "que-cuesta", text: "Lo que cuesta" },
];

describe("TableOfContents", () => {
  it("links to every heading under a named landmark", () => {
    render(<TableOfContents headings={HEADINGS} label="Contenido" />);

    const nav = screen.getByRole("navigation", { name: "Contenido" });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Las capas" })).toHaveAttribute(
      "href",
      "#las-capas",
    );
  });

  it("renders nothing when a post has no headings", () => {
    const { container } = render(
      <TableOfContents headings={[]} label="Contenido" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("expands and collapses the disclosure", async () => {
    const user = userEvent.setup();
    render(<TableOfContents headings={HEADINGS} label="Contenido" />);
    const toggle = screen.getByRole("button", { name: "Contenido" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("marks no entry as current until one is being read", () => {
    render(<TableOfContents headings={HEADINGS} label="Contenido" />);

    expect(
      screen.queryByRole("link", { current: "location" }),
    ).not.toBeInTheDocument();
  });
});
