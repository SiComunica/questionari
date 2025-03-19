import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = async (questionario: any) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Questionario Operatore');

  // Stile intestazione
  const headerStyle = {
    font: { bold: true, size: 12 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } }
  };

  // Sezione A: Dati anagrafici
  worksheet.addRow(['SEZIONE A: DATI ANAGRAFICI E PROFESSIONALI']).font = { bold: true, size: 14 };
  worksheet.addRow(['']);
  worksheet.addRow(['Nome', questionario.nome]);
  worksheet.addRow(['Cognome', questionario.cognome]);
  worksheet.addRow(['Età', questionario.eta]);
  worksheet.addRow(['Genere', questionario.genere]);
  worksheet.addRow(['Titolo di studio', questionario.titolo_studio]);
  worksheet.addRow(['Anni di esperienza', questionario.anni_esperienza]);
  worksheet.addRow(['Tipo contratto', questionario.tipo_contratto]);
  worksheet.addRow(['Ruolo attuale', questionario.ruolo_attuale]);
  worksheet.addRow(['']);

  // Sezione B: Struttura e ruolo
  worksheet.addRow(['SEZIONE B: STRUTTURA E RUOLO']).font = { bold: true, size: 14 };
  worksheet.addRow(['']);
  worksheet.addRow(['ID Struttura', questionario.id_struttura]);
  worksheet.addRow(['Tipo struttura', questionario.tipo_struttura]);
  worksheet.addRow(['Professione', questionario.professione]);
  worksheet.addRow(['Mansioni principali', questionario.mansioni_principali.join(', ')]);
  worksheet.addRow(['Competenze specifiche', questionario.competenze_specifiche.join(', ')]);
  worksheet.addRow(['']);

  // ... Aggiungi altre sezioni ...

  // Genera il file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `questionario_${questionario.id}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (questionario: any) => {
  const doc = new jsPDF();
  
  // Funzione helper per aggiungere sezioni
  const addSection = (title: string, content: any[][], startY: number) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, startY);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    (doc as any).autoTable({
      startY: startY + 10,
      head: [],
      body: content,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
      margin: { left: 14, right: 14 },
    });
    
    return (doc as any).lastAutoTable.finalY;
  };

  // Intestazione
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Questionario Operatore', 14, 20);
  
  let currentY = 30;

  // Sezione A
  currentY = addSection('Dati anagrafici e professionali', [
    ['Nome', questionario.nome],
    ['Cognome', questionario.cognome],
    ['Età', questionario.eta],
    ['Genere', questionario.genere],
    ['Titolo di studio', questionario.titolo_studio],
    ['Anni di esperienza', questionario.anni_esperienza],
    ['Tipo contratto', questionario.tipo_contratto],
    ['Ruolo attuale', questionario.ruolo_attuale],
  ], currentY);

  // Sezione B
  currentY = addSection('Struttura e ruolo', [
    ['ID Struttura', questionario.id_struttura],
    ['Tipo struttura', questionario.tipo_struttura],
    ['Professione', questionario.professione],
    ['Mansioni principali', questionario.mansioni_principali.join(', ')],
    ['Competenze specifiche', questionario.competenze_specifiche.join(', ')],
  ], currentY + 10);

  // ... Aggiungi altre sezioni ...

  // Salva il PDF
  doc.save(`questionario_${questionario.id}.pdf`);
}; 