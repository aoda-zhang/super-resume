/**
 * Shared style constants for templates.
 * Unified: 16px base font, single color, bold titles.
 */

export const fontSize = "16px";
export const fontColor = "text-slate-900";

export const defaultFontSizes = {
  name: "30px",
  title: "24px",
  sectionTitle: "19px",
  body: "16px",
  caption: "14px",
  xs: "13px",
} as const;

// ---------------------------------------------------------------------------
// Single-column template
// ---------------------------------------------------------------------------
export const singleColumnStyles = {
  padding: "64px 80px",
  name: { fontSize: "30px", fontWeight: "bold" as const },
  title: { fontSize: "24px", fontWeight: "bold" as const },
  sectionTitle: { fontSize: "19px", fontWeight: "bold" as const },
  body: { fontSize: "16px", fontWeight: "normal" as const },
  label: "font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3",
};

// ---------------------------------------------------------------------------
// Two-column template
// ---------------------------------------------------------------------------
export const twoColumnStyles = {
  sidebarWidth: "30%",
  mainWidth: "70%",
  sidebarPadding: "48px 28px",
  mainPadding: "48px 36px",
  photoSize: 110,
  name: { fontSize: "30px", fontWeight: "bold" as const },
  title: { fontSize: "24px", fontWeight: "bold" as const },
  sectionTitle: { fontSize: "19px", fontWeight: "bold" as const },
  body: { fontSize: "16px", fontWeight: "normal" as const },
  label: "font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 block",
};
