export const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    description: "Track signal, proof strength, and recent work.",
  },
  {
    href: "/entries",
    label: "Entries",
    shortLabel: "Entries",
    description: "Browse and filter saved accomplishments.",
  },
  {
    href: "/entries/new",
    label: "New Entry",
    shortLabel: "Capture",
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
    shortLabel: "Prefs",
    description: "Manage backups, imports, and demo entries.",
  },
] as const;
