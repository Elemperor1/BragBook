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
        name: "Your career wins are too valuable to forget.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Value proposition")).toBeInTheDocument();
    expect(screen.getByText("Pain point")).toBeInTheDocument();
    expect(screen.getByText("Feature highlights")).toBeInTheDocument();
    expect(screen.getByText("Example outputs")).toBeInTheDocument();
    expect(screen.getByText("Privacy and trust")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Open the app|Start in the app/ })).toHaveLength(2);
    expect(screen.getByText("Self-review")).toBeInTheDocument();
    expect(screen.getByText("Resume bullets")).toBeInTheDocument();
    expect(screen.getByText("STAR story")).toBeInTheDocument();
  });
});
