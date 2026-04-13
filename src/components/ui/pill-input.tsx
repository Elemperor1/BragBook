"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export function PillInput({
  label,
  hint,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function commitValue(rawValue: string) {
    const normalized = rawValue.trim();

    if (!normalized || values.includes(normalized)) {
      setDraft("");
      return;
    }

    onChange([...values, normalized]);
    setDraft("");
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="field-surface rounded-[1.5rem] px-3 py-3">
        {values.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {values.map((value) => (
              <button
                key={value}
                type="button"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent-soft/80",
                )}
                onClick={() => onChange(values.filter((item) => item !== value))}
              >
                <Badge>{value}</Badge>
                <span className="text-muted-foreground">Remove</span>
              </button>
            ))}
          </div>
        ) : null}
        <Input
          value={draft}
          placeholder={placeholder}
          className="border-0 bg-transparent px-1 shadow-none ring-0 focus:ring-0"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => commitValue(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commitValue(draft);
            }
          }}
        />
      </div>
    </div>
  );
}
