/**
 * Shared style constants for templates.
 * Unified: 16px base font, single color, bold titles.
 */

export const fontSize = "16px";
export const fontColor = "text-slate-900";

// ---------------------------------------------------------------------------
// Single-column template
// ---------------------------------------------------------------------------
export const singleColumnStyles = {
  padding: "14px 10px",
  name: { fontSize: "30px", fontWeight: "bold" as const },
  title: { fontSize: "24px", fontWeight: "bold" as const },
  sectionTitle: { fontSize: "20px", fontWeight: "bold" as const },
  body: { fontSize: "16px", fontWeight: "normal" as const },
  label: "font-bold text-slate-900 border-b border-slate-900 pb-1 block mb-3",
};
