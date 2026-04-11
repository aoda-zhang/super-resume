import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export async function exportToPDF(element: HTMLElement, fileName: string = 'resume.pdf'): Promise<void> {
  try {
    // Use onclone to fix styles on the cloned element before rendering
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
        // Ensure the cloned element is visible and properly sized
        const el = clonedEl as HTMLElement;
        el.style.position = 'fixed';
        el.style.left = '0';
        el.style.top = '0';
        el.style.width = `${element.scrollWidth}px`;
        el.style.height = `${element.scrollHeight}px`;
        el.style.zIndex = '-1';
        // Remove any hover/transition effects that could mess up the render
        el.querySelectorAll('*').forEach((node) => {
          (node as HTMLElement).style.transition = 'none';
          (node as HTMLElement).style.animation = 'none';
        });
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}
