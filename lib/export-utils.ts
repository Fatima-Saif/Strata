import { toast } from 'sonner';

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    toast.error('No data to export');
    return;
  }
  
  try {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Exported Successfully');
  } catch (error) {
    toast.error('Failed to export CSV');
  }
};

export const exportToExcel = (data: any[], filename: string) => {
  // For mock purposes, we generate an HTML table saved as .xls
  // In a real app, you would use a library like xlsx
  if (!data || !data.length) {
    toast.error('No data to export');
    return;
  }
  
  try {
    const headers = Object.keys(data[0]);
    let tableHtml = '<table><thead><tr>';
    headers.forEach(h => tableHtml += `<th>${h}</th>`);
    tableHtml += '</tr></thead><tbody>';
    
    data.forEach(row => {
      tableHtml += '<tr>';
      headers.forEach(h => tableHtml += `<td>${row[h] || ''}</td>`);
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Excel Exported Successfully');
  } catch (error) {
    toast.error('Failed to export Excel');
  }
};

export const exportToPDF = async (elementIdToPrint?: string) => {
  // Mock PDF Export
  // In a real application, you might use html2pdf.js, jsPDF, or a backend headless browser.
  // We will simulate a loading delay, then use window.print() if an element is provided, 
  // or just show a success toast.
  
  const loadingToast = toast.loading('Generating PDF...');
  
  await new Promise(r => setTimeout(r, 1500)); // Simulate generation time
  
  toast.dismiss(loadingToast);
  toast.success('PDF generated successfully');
  
  // Real world native fallback for single-page dashboard apps
  if (elementIdToPrint) {
    window.print();
  }
};
