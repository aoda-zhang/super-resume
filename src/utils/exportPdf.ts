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
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const MARGIN = 15; // 4 margins = 15 mm each

    // Template dimensions in mm
    const imgWidth = pdfWidth;                            // 210 mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width; // total height in mm

    // Canvas pixels per mm of the image
    const pxPerMm = canvas.height / imgHeight; // px/mm

    // Content starts at y = MARGIN inside the image (top padding of the template)
    const templateContentStartMm = MARGIN;

    // Content height per page = 297 - 15 - 15 = 267 mm
    const contentHeightPerPage = pdfHeight - MARGIN - MARGIN;

    // Total content height (excluding the top padding that only page 1 needs)
    const totalContentHeight = imgHeight - templateContentStartMm;

    // Total pages needed
    const pageCount = Math.ceil(totalContentHeight / contentHeightPerPage) || 1;

    // ===================================================================
    // Draw a single page with:
    //   - White background
    //   - Content slice starting at template y = templateYStart (in mm)
    //   - Content slice height = sliceHeight (in mm, may be smaller for last page)
    //   - Top margin: always MARGIN (15mm) white space above content
    //   - Bottom margin: always MARGIN (15mm) white space below content
    // ===================================================================
    const drawPage = (pageNum: number, templateYStart: number, sliceHeight: number) => {
      if (pageNum > 1) pdf.addPage();

      // 1. Fill entire page white (clears any previous content)
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // 2. Top margin white block (guaranteed 15mm)
      //    Already covered by white rect, but we explicitly draw it
      //    Content will start at y = MARGIN, so the top MARGIN mm is already white.

      // 3. Extract the canvas slice
      const sliceTopPx = Math.round(templateYStart * pxPerMm);
      const sliceHeightPx = Math.round(sliceHeight * pxPerMm);

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.drawImage(
        canvas,
        0, sliceTopPx, canvas.width, sliceHeightPx,
        0, 0, canvas.width, sliceHeightPx
      );

      // 4. Render content at PDF y = MARGIN (leaves top margin white)
      pdf.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        0,
        MARGIN,          // top: starts at 15mm, top margin already white ✅
        imgWidth,
        sliceHeight
      );

      // 5. Bottom margin: draw white rect from bottom of content to bottom of page
      const contentBottomY = MARGIN + sliceHeight;           // where content ends on PDF
      const bottomMarginHeight = pdfHeight - contentBottomY; // remaining space
      if (bottomMarginHeight > 0) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, contentBottomY, pdfWidth, bottomMarginHeight, 'F');
      }
      // If content fills exactly to the bottom, bottomMarginHeight = 0, no rect needed.

      // 6. Left and right margins are guaranteed by imgWidth = pdfWidth = 210mm
      //    The image spans the full page width, leaving no gap on left/right.
    };

    // ===================================================================
    // Page 1: content from template y=15mm to the end of page 1
    //   Top margin: 0–15mm (white via white bg) ✅
    //   Content:   15mm onward (clipped at 297mm)
    //   Bottom margin: whatever remains below clipped content (may be < 15mm or 0)
    // ===================================================================
    const page1SliceHeight = Math.min(contentHeightPerPage, totalContentHeight);
    drawPage(1, templateContentStartMm, page1SliceHeight);

    // ===================================================================
    // Pages 2+: each page gets a fresh MARGIN top margin
    // ===================================================================
    for (let page = 2; page <= pageCount; page++) {
      const sliceTop = templateContentStartMm + (page - 1) * contentHeightPerPage;
      if (sliceTop >= imgHeight) break; // no more content

      const remaining = imgHeight - sliceTop;
      const sliceHeight = Math.min(contentHeightPerPage, remaining);

      drawPage(page, sliceTop, sliceHeight);
    }

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}
