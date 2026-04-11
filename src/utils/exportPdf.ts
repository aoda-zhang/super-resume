import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportToPDF(element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
  try {
    // Capture the FULL template as one canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (_clonedDoc, clonedEl) => {
        const el = clonedEl as HTMLElement;
        el.style.position = 'fixed';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '-1';
        clonedEl.querySelectorAll('*').forEach((node) => {
          (node as HTMLElement).style.transition = 'none';
          (node as HTMLElement).style.animation = 'none';
        });
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    // Template dimensions
    const imgWidth = pdfWidth;                            // 210 mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width; // total template height in mm

    // Canvas pixels per mm of the image
    const pxPerMm = canvas.height / imgHeight; // px/mm

    // 15 mm top margin for every page
    const PAGE_MARGIN_TOP = 15;

    // Effective content height per page = PDF height minus margins top+bottom
    const contentHeightPerPage = pdfHeight - PAGE_MARGIN_TOP - PAGE_MARGIN_TOP; // 267 mm

    // Template content starts at y = PAGE_MARGIN_TOP inside the image
    // (the 15 mm padding sits above the first piece of content)
    const templateContentStartMm = PAGE_MARGIN_TOP;

    // Total content height (excluding the top padding that only page 1 needs)
    const totalContentHeight = imgHeight - templateContentStartMm; // mm

    const pageCount = Math.ceil(totalContentHeight / contentHeightPerPage);

    // ===================================================================
    // Page 1: render the full template, clipped at pdfHeight
    //   → top padding (0–15mm) + content (15–297mm) appear on the page
    // ===================================================================
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // ===================================================================
    // Pages 2+: add top margin (white block), then the correct content slice
    // ===================================================================
    for (let page = 2; page <= pageCount; page++) {
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // How much content (in mm) to show on this page
      const contentSliceTop = templateContentStartMm + (page - 2) * contentHeightPerPage;
      const contentSliceBottom = Math.min(
        templateContentStartMm + (page - 1) * contentHeightPerPage,
        imgHeight
      );
      const contentSliceHeight = contentSliceBottom - contentSliceTop;

      // Canvas pixel range for this content slice
      const sliceTopPx = Math.round(contentSliceTop * pxPerMm);
      const sliceHeightPx = Math.round(contentSliceHeight * pxPerMm);

      // Draw white margin block at top (PAGE_MARGIN_TOP mm)
      // (already done by the white background rect above)

      // Extract canvas slice
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.drawImage(
        canvas,
        0, sliceTopPx, canvas.width, sliceHeightPx,
        0, 0, canvas.width, sliceHeightPx
      );

      // Render at PDF y = PAGE_MARGIN_TOP (right below the top margin)
      // imgWidth: keep full width
      // height: use the content slice height (will be clipped at bottom of page)
      pdf.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        0,
        PAGE_MARGIN_TOP,   // <-- top margin, always 15 mm
        imgWidth,
        contentSliceHeight
      );
    }

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}
