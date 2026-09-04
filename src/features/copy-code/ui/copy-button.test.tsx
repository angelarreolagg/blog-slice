import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { domAnimation, LazyMotion } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
  it("reports success after copying the code", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(
      <LazyMotion features={domAnimation}>
        <CopyButton value="pnpm build" />
      </LazyMotion>,
    );
    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(writeText).toHaveBeenCalledWith("pnpm build");
    expect(
      await screen.findByRole("button", { name: "Copied" }),
    ).toBeInTheDocument();
  });
});
