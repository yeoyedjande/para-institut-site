import { render, screen } from "@testing-library/react";
import { Field, ProvenanceBadge, buttonClass, controlClass } from "./primitives";

describe("Field", () => {
  it("relie le libellé, l'aide et l'erreur au champ", () => {
    render(
      <Field label="Téléphone" hint="Avec l'indicatif" error="Numéro invalide" required>
        <input className={controlClass} />
      </Field>,
    );
    const input = screen.getByLabelText(/Téléphone/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(input.getAttribute("aria-describedby")?.split(" ")).toHaveLength(2);
    expect(screen.getByRole("alert")).toHaveTextContent("Numéro invalide");
  });
});

describe("ProvenanceBadge", () => {
  it("affiche un libellé français", () => {
    render(<ProvenanceBadge status="TO_CONFIRM" />);
    expect(screen.getByText("À confirmer")).toBeInTheDocument();
  });
});

describe("buttonClass", () => {
  it("compose les classes de variante", () => {
    expect(buttonClass("secondary", "lg", true).split(" ").length).toBe(4);
  });
});
