export const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Dash",
    description: "Track signal, cadence, and recent proof.",
  },
  {
    href: "/entries",
    label: "Entries",
    shortLabel: "Entries",
    description: "Browse your accomplishment vault.",
  },
  {
    href: "/entries/new",
    label: "New Entry",
    shortLabel: "New",
    description: "Capture a win while details are fresh.",
  },
  {
    href: "/generator",
    label: "Generator",
    shortLabel: "Drafts",
    description: "Turn selected proof into editable review, promo, resume, or interview drafts.",
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Settings",
    description: "Control local backups, imports, and sample data.",
  },
] as const;
