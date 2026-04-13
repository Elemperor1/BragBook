"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  confirmDisabled?: boolean;
  isBusy?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  onConfirm?: () => void;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  confirmDisabled = false,
  isBusy = false,
  children,
  footer,
  onConfirm,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120f0b]/45 px-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <Card
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/85"
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        {children ? <CardContent className="space-y-4 pt-0">{children}</CardContent> : null}
        {footer ? (
          <CardContent className="flex flex-wrap justify-end gap-3 pt-0">
            {footer}
          </CardContent>
        ) : (
          <CardContent className="flex justify-end gap-3 pt-0">
            <Button variant="ghost" disabled={isBusy} onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              variant={confirmVariant}
              disabled={isBusy || confirmDisabled || !onConfirm}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>,
    document.body,
  );
}
