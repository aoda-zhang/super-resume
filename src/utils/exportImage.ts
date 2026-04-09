import html2canvas from 'html2canvas';

export async function exportToImage(
  element: HTMLElement,
  fileName: string = 'resume.png',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
  link.click();
}
