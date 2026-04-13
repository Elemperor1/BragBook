import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

function DialogHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm replacement"
        description="This replaces the current data in this browser."
        confirmLabel="Replace data"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

describe("Dialog", () => {
  it("moves focus into the dialog and restores it after escape", async () => {
    const user = userEvent.setup();

    render(<DialogHarness />);

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    trigger.focus();

    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Confirm replacement" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    });

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("wires the dialog title and description for accessibility", async () => {
    const user = userEvent.setup();

    render(<DialogHarness />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    const dialog = screen.getByRole("dialog", { name: "Confirm replacement" });
    const title = screen.getByText("Confirm replacement");
    const description = screen.getByText("This replaces the current data in this browser.");

    expect(dialog).toHaveAttribute("aria-labelledby", title.id);
    expect(dialog).toHaveAttribute("aria-describedby", description.id);
  });
});
