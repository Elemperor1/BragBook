import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntriesPage } from "@/components/entries/entries-page";
import { sampleEntries } from "@/test/fixtures/entries";

let mockEntries = sampleEntries;

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

describe("EntriesPage", () => {
  beforeEach(() => {
    mockEntries = sampleEntries;
  });

  it("keeps entry filtering working after extracting the shared filter panel", async () => {
    const user = userEvent.setup();

    render(<EntriesPage />);

    expect(
      screen.getByText("Stabilized the CI lane for monorepo builds"),
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 4 of 4 entries.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search"), "request IDs");

    expect(
      screen.getByText("Turned support escalations into product diagnostics"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Stabilized the CI lane for monorepo builds"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 4 entries.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByText("Showing 4 of 4 entries.")).toBeInTheDocument();
  });
});
