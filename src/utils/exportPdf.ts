/**
 * PDF export using browser native print (window.print).
 * This produces perfect PDFs with automatic page breaks that never cut text.
 * Uses CSS @media print for layout control.
 */

export async function exportToPDF(_element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
  // Store original title
  const originalTitle = document.title;
  
  // Set document title for PDF filename
  document.title = fileName.replace('.pdf', '');
  
  // Trigger print dialog
  // User selects "Save as PDF" in the dialog
  window.print();
  
  // Restore title after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
}
