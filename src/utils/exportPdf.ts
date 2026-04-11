import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportToPDF(element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
  try {
    // Capture the full template as a single tall canvas
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
    const MARGIN = 15; // 15 mm margin on all 4 sides

    // Template dimensions:
    // canvas.width  px → pdfWidth  mm  (794px → 210mm)
    // canvas.height px → imgHeight mm  (total template height in mm)
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Template content starts at y = MARGIN inside the template image (top padding)
    const templateContentStartMm = MARGIN;

    // Content that fits on one page = 297 - 15 - 15 = 267 mm
    const contentHeightPerPage = pdfHeight - MARGIN - MARGIN;

    // Total content height (excluding the top padding of the template)
    const totalContentHeight = imgHeight - templateContentStartMm;

    // Total pages needed
    const pageCount = Math.ceil(totalContentHeight / contentHeightPerPage) || 1;

    // ---------------------------------------------------------------------------
    // Helper: draw one page with guaranteed 15mm margins on all 4 sides
    //
    // canvas pixels per mm of the template image:
    //   canvas.height px represents imgHeight mm
    //   pxPerMm = canvas.height / imgHeight
    // ---------------------------------------------------------------------------
    const pxPerMm = canvas.height / imgHeight; // px/mm

    const drawPage = (pageNum: number, sliceTopMm: number, sliceHeightMm: number) => {
      if (pageNum > 1) pdf.addPage();

      // 1. White background — guarantees top/left/right margins are white
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      if (sliceHeightMm <= 0) return;

      // 2. Extract the content slice from the canvas
      //
      // Canvas pixel coordinates:
      //   sliceTopMm = 282mm into the template
      //   pxPerMm = canvas.height / imgHeight
      //   sliceTopPx = 282 * pxPerMm  (e.g. 282 * 3.79 ≈ 1069 px)
      //
      // Canvas drawImage(sourceCanvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight):
      //   sx, sy:        top-left of source rect in SOURCE canvas (canvas)
      //   sWidth, sHeight: size of source rect
      //   dx, dy:        top-left of destination rect in OUTPUT canvas (sliceCanvas)
      //   dWidth, dHeight: size of destination rect
      //
      const sliceTopPx = Math.round(sliceTopMm * pxPerMm);
      const sliceHeightPx = Math.round(sliceHeightMm * pxPerMm);

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;       // same width as source
      sliceCanvas.height = sliceHeightPx;      // height = number of pixel rows
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.drawImage(
        canvas,
        0, sliceTopPx,              // source top-left: (0, sliceTopPx)
        canvas.width, sliceHeightPx, // source size: full width, sliceHeightPx tall
        0, 0,                        // dest top-left: (0, 0)
        canvas.width, sliceHeightPx  // dest size: same as source
      );

      // 3. Add slice to PDF
      //    x=0, y=MARGIN: content starts at y=15mm (top margin white space above it)
      //    width=pdfWidth: full page width = 210mm (left+right margins handled by this)
      //    height=sliceHeightMm: content height
      pdf.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        0,               // x: left margin = 0 (content spans full width)
        MARGIN,          // y: leave MARGIN mm white at top
        imgWidth,        // width: 210mm = full page width (left/right margins ✅)
        sliceHeightMm    // height: content height
      );

      // 4. Bottom margin — fill white below content to guarantee MARGIN bottom
      const contentBottomY = MARGIN + sliceHeightMm;
      const bottomSpace = pdfHeight - contentBottomY;
      if (bottomSpace > 0) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, contentBottomY, pdfWidth, bottomSpace, 'F');
      }
    };

    // ---------------------------------------------------------------------------
    // Page 1: content from template y=MARGIN (15mm), clipped to contentHeightPerPage
    //   Top margin:   0–15mm white (template top padding shows as white) ✅
    //   Content:       15mm onward, clipped at 15+267=282mm on page
    //   Bottom margin: filled white if content doesn't reach 297mm ✅
    // ---------------------------------------------------------------------------
    const page1SliceHeight = Math.min(contentHeightPerPage, totalContentHeight);
    drawPage(1, templateContentStartMm, page1SliceHeight);

    // ---------------------------------------------------------------------------
    // Pages 2+: each page starts a fresh content slice
    //   Page 2: template y=282mm .. y=549mm (267mm content)
    //   Page 3: template y=549mm .. y=816mm (267mm content)
    //   Each has: top margin (15mm) + content (up to 267mm) + bottom margin ✅
    // ---------------------------------------------------------------------------
    for (let page = 2; page <= pageCount; page++) {
      const sliceTop = templateContentStartMm + (page - 1) * contentHeightPerPage;
      if (sliceTop >= imgHeight) break;
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
