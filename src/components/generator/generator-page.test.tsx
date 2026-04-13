import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GeneratorPage } from "@/components/generator/generator-page";
import { sampleEntries } from "@/test/fixtures/entries";

let mockEntries = sampleEntries;
const writeText = vi.fn();

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/use-entry", () => ({
  useEntries: () => mockEntries,
}));

describe("GeneratorPage", () => {
  beforeEach(() => {
    mockEntries = sampleEntries;
    writeText.mockReset();
    writeText.mockResolvedValue(undefined);

    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });

  it("filters, selects, generates, preserves edits until regenerate, and copies", async () => {
    const user = userEvent.setup();

    render(<GeneratorPage />);

    await user.type(screen.getByLabelText("Search"), "support");

    expect(
      screen.getByLabelText("Select Turned support escalations into product diagnostics"),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Select Stabilized the CI lane for monorepo builds"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Select visible" }));
    expect(
      screen.getByLabelText(
        "Select Turned support escalations into product diagnostics",
      ),
    ).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    await user.click(
      screen.getByLabelText("Select Stabilized the CI lane for monorepo builds"),
    );
    expect(
      screen.getByLabelText("Select Stabilized the CI lane for monorepo builds"),
    ).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Generate" }));

    const textarea = screen.getByLabelText("Editable output") as HTMLTextAreaElement;
    expect(textarea.value).toContain("Summary of the period");

    fireEvent.change(textarea, { target: { value: "Edited draft" } });
    expect(
      screen.getByLabelText("Editable output"),
    ).toHaveValue("Edited draft");

    await user.selectOptions(screen.getByLabelText("Tone"), "technical");
    expect(
      screen.getByText(
        "The draft is out of date with the current filters, selection, or output settings. Your edits are preserved until you generate again.",
      ),
    ).toBeInTheDocument();
    expect(textarea).toHaveValue("Edited draft");

    await user.click(screen.getByRole("button", { name: "Generate" }));
    const refreshedDraft = (screen.getByLabelText("Editable output") as HTMLTextAreaElement)
      .value;
    expect(refreshedDraft).not.toBe("Edited draft");

    await user.click(screen.getByRole("button", { name: "Regenerate" }));
    const regeneratedDraft = (
      screen.getByLabelText("Editable output") as HTMLTextAreaElement
    ).value;
    expect(regeneratedDraft).not.toBe(refreshedDraft);

    await user.click(screen.getByRole("button", { name: "Copy" }));
    await screen.findByText("Draft copied to the clipboard.");
  });
});
