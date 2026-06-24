import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export a DOM element as PDF.
 * @param elementId The id of the element to capture.
 * @param filename Desired filename for download.
 */
export async function exportElementToPDF(elementId: string, filename: string = 'document.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export:', elementId);
    return;
  }
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}
