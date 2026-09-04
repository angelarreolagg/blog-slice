import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { domAnimation, LazyMotion } from "motion/react";
import { describe, expect, it } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { Steps } from "./steps";

const STEPS = [
  { id: "publish", label: "Publicar", description: "El bundle sube al canal." },
  {
    id: "check",
    label: "Arrancar",
    description: "La app pregunta por un update.",
  },
  { id: "apply", label: "Aplicar", description: "Se aplica al reiniciar." },
];

function renderSteps() {
  return render(
    <LazyMotion features={domAnimation}>
      <Steps label="Ciclo de una OTA" steps={STEPS} />
    </LazyMotion>,
  );
}

describe("Steps", () => {
  it("starts on the first step with the previous button disabled", () => {
    renderSteps();

    expect(screen.getByText("Paso 1 de 3")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Paso anterior" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Paso siguiente" }),
    ).toBeEnabled();
  });

  it("advances and announces the next description", async () => {
    const user = userEvent.setup();
    renderSteps();

    await user.click(screen.getByRole("button", { name: "Paso siguiente" }));

    expect(screen.getByText("Paso 2 de 3")).toBeInTheDocument();
    expect(
      await screen.findByText("La app pregunta por un update."),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("listitem")
        .filter((item) => item.getAttribute("aria-current") === "step")[0],
    ).toHaveTextContent("Arrancar");
  });

  it("disables the next button on the last step", async () => {
    const user = userEvent.setup();
    renderSteps();
    const next = screen.getByRole("button", { name: "Paso siguiente" });

    await user.click(next);
    await user.click(next);

    expect(screen.getByText("Paso 3 de 3")).toBeInTheDocument();
    expect(next).toBeDisabled();
  });

  it("renders the description immediately when motion is reduced", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    renderSteps();

    expect(screen.getByText("El bundle sube al canal.")).toBeVisible();
  });
});
