import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("is a real button that reports clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Publish</Button>);

    await user.click(screen.getByRole("button", { name: "Publish" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("ignores clicks while disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Publish
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Publish" }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
