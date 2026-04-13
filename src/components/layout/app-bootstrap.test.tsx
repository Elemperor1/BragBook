import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppBootstrap } from "@/components/layout/app-bootstrap";

const push = vi.fn();
const seedDemoData = vi.fn();
let mockSummary: {
  entryCount: number;
  imageCount: number;
  lastUpdatedAt: string | null;
} | null = {
  entryCount: 0,
  imageCount: 0,
  lastUpdatedAt: null,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/hooks/use-storage-summary", () => ({
  useStorageSummary: () => mockSummary,
}));

vi.mock("@/lib/storage/entries", () => ({
  seedDemoData: (...args: unknown[]) => seedDemoData(...args),
}));

describe("AppBootstrap", () => {
  beforeEach(() => {
    mockSummary = {
      entryCount: 0,
      imageCount: 0,
      lastUpdatedAt: null,
    };
    push.mockReset();
    seedDemoData.mockReset();
    seedDemoData.mockResolvedValue(true);
    window.localStorage.clear();
  });

  it("opens welcome guidance on first launch with an empty vault", () => {
    render(<AppBootstrap />);

    expect(screen.getByText("Welcome to BragBook")).toBeInTheDocument();
    expect(screen.getByText("Load sample entries")).toBeInTheDocument();
  });

  it("hides onboarding after choosing start blank", async () => {
    const user = userEvent.setup();

    render(<AppBootstrap />);
    await user.click(screen.getByRole("button", { name: "Start blank" }));

    await waitFor(() => {
      expect(screen.queryByText("Welcome to BragBook")).not.toBeInTheDocument();
    });

    expect(window.localStorage.getItem("bragbook-onboarding-dismissed-v1")).toBe("true");
    expect(window.localStorage.getItem("bragbook-onboarding-choice-v1")).toBe("blank");
  });

  it("loads sample entries and records the onboarding choice", async () => {
    const user = userEvent.setup();

    render(<AppBootstrap />);
    await user.click(screen.getByRole("button", { name: "Load sample entries" }));

    await waitFor(() => {
      expect(seedDemoData).toHaveBeenCalledTimes(1);
    });

    expect(window.localStorage.getItem("bragbook-onboarding-choice-v1")).toBe("sample");
  });

  it("does not reopen once onboarding was previously dismissed", () => {
    window.localStorage.setItem("bragbook-onboarding-dismissed-v1", "true");

    render(<AppBootstrap />);

    expect(screen.queryByText("Welcome to BragBook")).not.toBeInTheDocument();
  });

  it("routes to entry capture from onboarding", async () => {
    const user = userEvent.setup();

    render(<AppBootstrap />);
    await user.click(screen.getByRole("button", { name: "Capture first win" }));

    expect(push).toHaveBeenCalledWith("/entries/new");
    expect(window.localStorage.getItem("bragbook-onboarding-choice-v1")).toBe("capture");
  });
});
