import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportToPDF(element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (_clonedDoc, clonedEl) => {
        (clonedEl as HTMLElement).style.position = 'fixed';
        (clonedEl as HTMLElement).style.left = '0';
        (clonedEl as HTMLElement).style.top = '0';
        (clonedEl as HTMLElement).style.zIndex = '-1';
        clonedEl.querySelectorAll('*').forEach((node) => {
          (node as HTMLElement).style.transition = 'none';
          (node as HTMLElement).style.animation = 'none';
        });
      },
    });

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight();  // 297 mm

    // Template image dimensions in mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Detect actual top padding by scanning canvas pixels (first non-white row)
    // This auto-adapts to any template padding value
    const ctx = canvas.getContext('2d')!;
    let topPaddingPx = 0;
    for (let y = 0; y < canvas.height; y++) {
      const rowData = ctx.getImageData(0, y, canvas.width, 1).data;
      let hasContent = false;
      for (let i = 0; i < rowData.length; i += 4) {
        // Not white (threshold 250 to handle anti-aliasing)
        if (rowData[i] < 250 || rowData[i + 1] < 250 || rowData[i + 2] < 250) {
          hasContent = true;
          break;
        }
      }
      if (hasContent) {
        topPaddingPx = y;
        break;
      }
    }

    // Similarly detect bottom padding (last non-white row)
    let bottomPaddingPx = 0;
    for (let y = canvas.height - 1; y >= 0; y--) {
      const rowData = ctx.getImageData(0, y, canvas.width, 1).data;
      let hasContent = false;
      for (let i = 0; i < rowData.length; i += 4) {
        if (rowData[i] < 250 || rowData[i + 1] < 250 || rowData[i + 2] < 250) {
          hasContent = true;
          break;
        }
      }
      if (hasContent) {
        bottomPaddingPx = canvas.height - 1 - y;
        break;
      }
    }

    // Convert padding to mm
    const pxPerMm = canvas.width / imgWidth;
    const topPaddingMm = topPaddingPx / pxPerMm;
    const bottomPaddingMm = bottomPaddingPx / pxPerMm;

    // Use the larger of template padding or 15mm as margin
    const MARGIN = 15;
    const effectiveTopMargin = Math.max(topPaddingMm, MARGIN);
    const effectiveBottomMargin = Math.max(bottomPaddingMm, MARGIN);

    // Buffer at page bottom to prevent text from being cut at boundary
    // When a line of text sits exactly on the page break, slicing through it
    // produces a "pressed/overlapped" look. Leaving a small gap avoids this.
    const PAGE_BOTTOM_BUFFER = 3; // mm

    // Content area per page (reduced by buffer to keep text safe)
    const contentHeightPerPage = pdfHeight - effectiveTopMargin - effectiveBottomMargin - PAGE_BOTTOM_BUFFER;

    if (contentHeightPerPage <= 0) {
      pdf.save(fileName);
      return;
    }

    // The content slice starts at topPaddingMm in the template image
    // (skip the template's own top padding since it's covered by PDF margin)
    const contentStartMm = topPaddingMm;
    const totalContentMm = imgHeight - contentStartMm - bottomPaddingMm;

    const pageCount = Math.ceil(totalContentMm / contentHeightPerPage) || 1;

    for (let i = 0; i < pageCount; i++) {
      if (i > 0) pdf.addPage();

      // Add a small overlap (1mm) at the top of each page after the first,
      // so that a line clipped at the bottom of the previous page is fully
      // visible at the top of the next page.
      const OVERLAP = i > 0 ? 1 : 0; // mm

      const sliceStartMm = contentStartMm + i * contentHeightPerPage - OVERLAP;
      const sliceEndMm = Math.min(contentStartMm + (i + 1) * contentHeightPerPage, contentStartMm + totalContentMm);
      const sliceHeightMm = sliceEndMm - sliceStartMm;

      if (sliceHeightMm <= 0) continue;

      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Extract slice from canvas
      const sliceTopPx = Math.round(sliceStartMm * pxPerMm);
      const sliceHeightPx = Math.round(sliceHeightMm * pxPerMm);

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      const sCtx = sliceCanvas.getContext('2d')!;
      sCtx.drawImage(
        canvas,
        0, sliceTopPx,
        canvas.width, sliceHeightPx,
        0, 0,
        canvas.width, sliceHeightPx
      );

      // Place slice on PDF with margins
      // For pages after the first, shift up by OVERLAP so the repeated top line
      // sits right at the effectiveTopMargin boundary (underneath the previous page's bottom)
      const placeY = i === 0 ? effectiveTopMargin : effectiveTopMargin - OVERLAP;
      pdf.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        0,
        placeY,
        imgWidth,
        sliceHeightMm
      );

      // Fill bottom margin white
      const contentBottomY = effectiveTopMargin + sliceHeightMm;
      const bottomSpace = pdfHeight - contentBottomY;
      if (bottomSpace > 0) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, contentBottomY, pdfWidth, bottomSpace, 'F');
      }
    }

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}
