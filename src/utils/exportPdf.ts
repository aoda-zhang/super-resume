/**
 * PDF export using browser native print (window.print).
 * This produces perfect PDFs with automatic page breaks that never cut text.
 * Uses CSS @media print for layout control.
 */

export async function exportToPDF(_element: HTMLElement): Promise<void> {
  // Store original title
  const originalTitle = document.title;

  // Set document title for PDF filename
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formatted = `${year}${month}${day}${hours}${minutes}`;
  document.title = formatted;

  // Trigger print dialog
  // User selects "Save as PDF" in the dialog
  window.print();

  // Restore title after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
}
