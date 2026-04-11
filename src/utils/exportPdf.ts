import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportToPDF(element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
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
        el.style.width = `${element.scrollWidth}px`;
        el.style.height = `${element.scrollHeight}px`;
        el.style.zIndex = '-1';
        el.querySelectorAll('*').forEach((node) => {
          (node as HTMLElement).style.transition = 'none';
          (node as HTMLElement).style.animation = 'none';
        });
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight();  // 297 mm
    const imgWidth = pdfWidth;

    // Get the top padding of the template (e.g. "15mm" or "20mm") from its computed style
    const topPadding = parseFloat(getComputedStyle(element).paddingTop) || 0;

    // Convert pixel padding to mm using the same scale as the image
    const pxToMm = pdfWidth / element.scrollWidth;
    const topPaddingMm = topPadding * pxToMm;

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Page 1: show from the very top (includes the template's top padding)
    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Pages 2+: skip the template's top padding so content aligns to the page top
    if (heightLeft > 0) {
      position = -(pdfHeight - topPaddingMm);
    }

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
    }

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}
