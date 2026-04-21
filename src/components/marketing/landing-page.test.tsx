import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/components/marketing/landing-page";

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

describe("LandingPage", () => {
  it("renders the primary marketing sections and app CTAs", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: "Turn your best work into career leverage.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Proof to output examples")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "One evidence packet can become every career document you need next.",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Promotion packet").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Self-review").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Resume bullets").length).toBeGreaterThan(0);
    expect(screen.getAllByText("STAR interview stories").length).toBeGreaterThan(0);
    expect(screen.getByText("This browser")).toBeInTheDocument();
    expect(screen.getByText("Your JSON file")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Open BragBook" })).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "See proof-to-output examples" }),
    ).toBeInTheDocument();
  });
});
