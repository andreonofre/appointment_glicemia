/**
 * GERADOR DE RELATÓRIOS PDF
 * 
 * Gera relatórios em PDF com estatísticas e tabelas de glicemia
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Gera relatório PDF completo
 */
export const gerarRelatorioPDF = async ({ glicemias, stats, dataInicio, dataFim }) => {
  const doc = new jsPDF();
  
  // Configurações
  const primaryColor = [123, 204, 196]; // #7BCCC4
  const accentColor = [232, 168, 184]; // #E8A8B8
  const darkColor = [74, 74, 74]; // #4A4A4A
  
  let yPos = 20;

  // ==========================================
  // CABEÇALHO
  // ==========================================
  
  // Logo/Nome da Doutora
  doc.setFontSize(16);
  doc.setTextColor(...accentColor);
  doc.text('Dra. Ysis Mota', 105, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text('Médica da Família', 105, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Título do relatório
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text('Relatório de Glicemia', 105, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Período
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  const periodoTexto = `Período: ${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`;
  doc.text(periodoTexto, 105, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Linha separadora
  doc.setDrawColor(...primaryColor);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;

  // ==========================================
  // RESUMO ESTATÍSTICO
  // ==========================================
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Resumo Estatístico', 20, yPos);
  
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  
  const resumoData = [
    ['Total de Medições', stats.total.toString()],
    ['Média Geral', `${stats.media} mg/dL`],
    ['GMI Estimado', `${stats.gmi}%`],
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [],
    body: resumoData,
    theme: 'plain',
    styles: { 
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 40 },
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;

  // ==========================================
  // TEMPO NOS INTERVALOS
  // ==========================================
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Tempo nos Intervalos', 20, yPos);
  
  yPos += 8;
  
  const intervalosData = [
    ['No Alvo (70-180 mg/dL)', `${stats.noAlvo} (${stats.percentualNoAlvo}%)`],
    ['Alto (181-250 mg/dL)', `${stats.alto} (${stats.percentualAlto}%)`],
    ['Muito Alto (>250 mg/dL)', `${stats.muitoAlto} (${stats.percentualMuitoAlto}%)`],
    ['Baixo (<70 mg/dL)', `${stats.baixo} (${stats.percentualBaixo}%)`],
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [],
    body: intervalosData,
    theme: 'plain',
    styles: { 
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 40 },
    },
    didParseCell: (data) => {
      // Colorir células baseado no intervalo
      if (data.section === 'body' && data.column.index === 0) {
        if (data.row.index === 0) {
          data.cell.styles.textColor = [123, 204, 196]; // Verde
        } else if (data.row.index === 1) {
          data.cell.styles.textColor = [245, 168, 98]; // Laranja
        } else {
          data.cell.styles.textColor = [232, 168, 184]; // Rosa
        }
      }
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;

  // ==========================================
  // META
  // ==========================================
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Meta: ≥70% no alvo (70-180 mg/dL)', 20, yPos);
  
  yPos += 10;

  // ==========================================
  // TABELA DE MEDIÇÕES
  // ==========================================
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Histórico de Medições', 20, yPos);
  
  yPos += 8;
  
  // Preparar dados da tabela
  const tableData = glicemias.map(g => {
    const data = new Date(g.data_hora);
    return [
      data.toLocaleDateString('pt-BR'),
      data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      `${g.valor} mg/dL`,
      g.categoria || '-',
      g.medicamentos || '-',
    ];
  });
  
  doc.autoTable({
    startY: yPos,
    head: [['Data', 'Hora', 'Valor', 'Categoria', 'Medicamento']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 60 },
    },
    didParseCell: (data) => {
      // Colorir valores baseado no nível
      if (data.section === 'body' && data.column.index === 2) {
        const valor = parseInt(data.cell.text[0]);
        if (valor < 70) {
          data.cell.styles.textColor = [232, 168, 184]; // Rosa - baixo
          data.cell.styles.fontStyle = 'bold';
        } else if (valor > 250) {
          data.cell.styles.textColor = [232, 168, 184]; // Rosa - muito alto
          data.cell.styles.fontStyle = 'bold';
        } else if (valor > 180) {
          data.cell.styles.textColor = [245, 168, 98]; // Laranja - alto
        } else {
          data.cell.styles.textColor = [123, 204, 196]; // Verde - normal
        }
      }
    },
    margin: { top: 10 },
  });

  // ==========================================
  // RODAPÉ
  // ==========================================
  
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      105,
      287,
      { align: 'center' }
    );
    doc.text(`Página ${i} de ${pageCount}`, 105, 292, { align: 'center' });
  }

  // ==========================================
  // SALVAR PDF
  // ==========================================
  
  const nomeArquivo = `relatorio-glicemia-${dataInicio}-${dataFim}.pdf`;
  doc.save(nomeArquivo);
};
