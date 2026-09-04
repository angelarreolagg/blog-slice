import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("shows at most two initials", () => {
    const { container } = render(<Avatar name="Ángel Arreola" />);

    expect(container.textContent).toBe("ÁA");
  });

  it("is hidden from assistive technology, since the name is beside it", () => {
    const { container } = render(<Avatar name="Ángel Arreola" />);

    expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
  });
});
