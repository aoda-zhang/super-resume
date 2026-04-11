import html2canvas from 'html2canvas-pro';

export async function exportToImage(
  element: HTMLElement,
  fileName: string = 'resume.png',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
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

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL(
      format === 'jpeg' ? 'image/jpeg' : 'image/png',
      0.95
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Image export failed:', err);
    throw err;
  }
}
