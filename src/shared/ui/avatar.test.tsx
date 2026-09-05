import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("shows at most two initials when there is no picture", () => {
    const { container } = render(<Avatar name="Ángel Arreola" />);

    expect(container.textContent).toBe("ÁA");
    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("renders the picture with fixed dimensions when one is given", () => {
    render(<Avatar name="Ángel Arreola" src="/author.jpg" />);
    const image = screen.getByRole("presentation");

    expect(image).toHaveAttribute("src", "/author.jpg");
    expect(image).toHaveAttribute("width", "160");
    expect(image).toHaveAttribute("height", "160");
  });

  it("keeps the picture out of the accessibility tree, since the name is beside it", () => {
    render(<Avatar name="Ángel Arreola" src="/author.jpg" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
