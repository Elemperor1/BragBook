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
        name: "Keep the proof behind the work that should advance your career.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Proof to draft examples")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "One evidence packet can become four serious career assets.",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Promotion packet").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Self-review").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Resume bullets").length).toBeGreaterThan(0);
    expect(screen.getAllByText("STAR interview stories").length).toBeGreaterThan(0);
    expect(screen.getByText("Stored in this browser")).toBeInTheDocument();
    expect(screen.getAllByText(/JSON backup/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Open the app" })).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "See proof-to-draft examples" }),
    ).toBeInTheDocument();
  });
});
