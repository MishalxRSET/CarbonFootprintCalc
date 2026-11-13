import { jsPDF } from 'jspdf';
import { CalculationResult, ReductionStrategy } from '../types';
import { formatINR } from './currency';

export interface TrajectoryPoint {
  year: string;
  shortYear: string;
  bau: number;
  projected: number;
  abatedThisYear: number;
  cumulativeSaved: number;
}

export interface PdfExportOptions {
  calculation: CalculationResult;
  selectedStrategies: ReductionStrategy[];
  totalAbatedTonnes: number;
  netRemainingTonnes: number;
  percentAchieved: number;
  targetPercent: number;
  annualSavingsINR: number;
  projectionData: TrajectoryPoint[];
  chartImageBase64?: string | null;
}

/**
 * Compiles user emission metrics, Recharts trajectory visualization,
 * and active reduction strategies into a downloadable PDF report.
 */
export async function exportCarbonReductionPdf(options: PdfExportOptions): Promise<void> {
  const {
    calculation,
    selectedStrategies,
    totalAbatedTonnes,
    netRemainingTonnes,
    percentAchieved,
    targetPercent,
    annualSavingsINR,
    projectionData,
    chartImageBase64,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ==========================================
  // PAGE 1: EXECUTIVE SUMMARY & TRAJECTORY CHART
  // ==========================================

  // 1. Top Banner
  doc.setFillColor(29, 43, 23); // #1D2B17
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CARBONZERO • DECARBONIZATION AUDIT & ACTION REPORT', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(217, 228, 209); // #D9E4D1
  doc.text('Systematic Carbon Footprint Modeling & Emission Reduction Strategy', margin, 18);

  doc.setFontSize(8);
  doc.setTextColor(190, 205, 185);
  doc.text(`Generated: ${todayStr} | Framework: GHG Protocol (Scopes 1, 2, 3)`, pageWidth - margin, 18, { align: 'right' });

  let y = 34;

  // 2. Report Overview & Target Meta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(29, 43, 23);
  doc.text('EXECUTIVE EMISSION PROFILE & TARGET MILESTONE', margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(92, 102, 88);
  const baselineTonnesStr = calculation.totalAnnualTonnesCO2e.toFixed(2);
  doc.text(
    `This audit presents the current baseline inventory (${baselineTonnesStr} tCO2e/yr), evaluates a target reduction of -${targetPercent}%, ` +
    `and details an active action plan of ${selectedStrategies.length} verified decarbonization initiatives.`,
    margin,
    y,
    { maxWidth: contentWidth }
  );

  y += 10;

  // 3. Four KPI Metric Blocks
  const kpiWidth = (contentWidth - 9) / 4;
  const kpiHeight = 22;

  const kpis = [
    {
      title: 'CURRENT BASELINE',
      val: `${baselineTonnesStr} t`,
      sub: 'Annual Footprint',
      bg: [247, 249, 246],
      border: [224, 231, 222],
      titleColor: [140, 120, 81],
      valColor: [29, 43, 23],
    },
    {
      title: 'PLANNED ABATEMENT',
      val: `-${totalAbatedTonnes.toFixed(2)} t`,
      sub: `${selectedStrategies.length} active initiatives`,
      bg: [217, 228, 209],
      border: [204, 217, 195],
      titleColor: [74, 103, 65],
      valColor: [29, 43, 23],
    },
    {
      title: 'NET REMAINING',
      val: `${netRemainingTonnes.toFixed(2)} t`,
      sub: `${percentAchieved}% of target met`,
      bg: [241, 239, 236],
      border: [232, 228, 223],
      titleColor: [92, 102, 88],
      valColor: [29, 43, 23],
    },
    {
      title: 'EST. ANNUAL SAVINGS',
      val: formatINR(annualSavingsINR),
      sub: 'Utility & fuel savings',
      bg: [247, 249, 246],
      border: [224, 231, 222],
      titleColor: [140, 120, 81],
      valColor: [46, 125, 50],
    },
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = margin + idx * (kpiWidth + 3);
    doc.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    doc.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(kpiX, y, kpiWidth, kpiHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(kpi.titleColor[0], kpi.titleColor[1], kpi.titleColor[2]);
    doc.text(kpi.title, kpiX + 3, y + 5);

    doc.setFontSize(11);
    doc.setTextColor(kpi.valColor[0], kpi.valColor[1], kpi.valColor[2]);
    doc.text(kpi.val, kpiX + 3, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(115, 124, 112);
    doc.text(kpi.sub, kpiX + 3, y + 18);
  });

  y += kpiHeight + 8;

  // 4. Scope Breakdown Mini Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(29, 43, 23);
  doc.text('GREENHOUSE GAS PROTOCOL SCOPES BREAKDOWN', margin, y);

  y += 4;
  const s1 = (calculation.scopes.scope1 / 1000).toFixed(2);
  const s2 = (calculation.scopes.scope2 / 1000).toFixed(2);
  const s3 = (calculation.scopes.scope3 / 1000).toFixed(2);

  doc.setFillColor(247, 249, 246);
  doc.setDrawColor(224, 231, 222);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(29, 43, 23);
  doc.text(`Scope 1 (Direct Fuel & Vehicle): `, margin + 4, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${s1} tCO2e`, margin + 46, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.text(`Scope 2 (Electricity Grid): `, margin + 65, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${s2} tCO2e`, margin + 101, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.text(`Scope 3 (Travel, Diet & Waste): `, margin + 120, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${s3} tCO2e`, margin + 162, y + 7.5);

  y += 18;

  // 5. Dynamic Trajectory Visualization Section (The Recharts Graph)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(29, 43, 23);
  doc.text('EMISSION REDUCTION TRAJECTORY OVER TIME (RECHARTS VISUALIZATION)', margin, y);

  y += 4;

  if (chartImageBase64) {
    try {
      const chartWidth = contentWidth;
      const chartHeight = 72; // mm
      doc.addImage(chartImageBase64, 'PNG', margin, y, chartWidth, chartHeight);

      // Border around chart image
      doc.setDrawColor(224, 231, 222);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, chartWidth, chartHeight);

      y += chartHeight + 6;
    } catch (err) {
      console.warn('Could not render chart image into PDF, using fallback vector', err);
      y = renderFallbackChartVector(doc, margin, y, contentWidth, projectionData);
    }
  } else {
    y = renderFallbackChartVector(doc, margin, y, contentWidth, projectionData);
  }

  // 6. Trajectory Projections Data Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 103, 65);
  doc.text('Trajectory Data Points (tCO2e/year)', margin, y);
  y += 3;

  const colWidths = [32, 38, 38, 36, 38];
  const headers = ['Timeline', 'Business-As-Usual', 'With Plan', 'Annual Abatement', 'Cumulative Saved'];

  // Table Header
  doc.setFillColor(235, 240, 233);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(29, 43, 23);

  let currentX = margin;
  headers.forEach((h, idx) => {
    doc.text(h, currentX + 2, y + 4.2);
    currentX += colWidths[idx];
  });
  y += 6;

  // Table Rows (Take up to 6 key milestone points)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  const displayPoints = projectionData.length > 6
    ? [
        projectionData[0],
        projectionData[1],
        projectionData[2],
        projectionData[3],
        projectionData[Math.floor(projectionData.length / 2)],
        projectionData[projectionData.length - 1],
      ]
    : projectionData;

  displayPoints.forEach((pt, rowIdx) => {
    if (rowIdx % 2 === 0) {
      doc.setFillColor(252, 253, 251);
      doc.rect(margin, y, contentWidth, 5, 'F');
    }
    doc.setTextColor(45, 51, 43);

    let rowX = margin;
    doc.text(pt.shortYear, rowX + 2, y + 3.6);
    rowX += colWidths[0];

    doc.setTextColor(185, 28, 28); // BAU red
    doc.text(`${pt.bau.toFixed(2)} t`, rowX + 2, y + 3.6);
    rowX += colWidths[1];

    doc.setTextColor(46, 125, 50); // Projected green
    doc.text(`${pt.projected.toFixed(2)} t`, rowX + 2, y + 3.6);
    rowX += colWidths[2];

    doc.setTextColor(92, 102, 88);
    doc.text(`-${pt.abatedThisYear.toFixed(2)} t/yr`, rowX + 2, y + 3.6);
    rowX += colWidths[3];

    doc.setTextColor(29, 43, 23);
    doc.text(`${pt.cumulativeSaved.toFixed(2)} t total`, rowX + 2, y + 3.6);

    y += 5;
  });

  // Footer for Page 1
  drawPageFooter(doc, 1, 2, pageWidth, pageHeight, margin);

  // ==========================================
  // PAGE 2: DETAILED STRATEGIES & ROADMAP
  // ==========================================
  doc.addPage();

  // Top Banner Page 2
  doc.setFillColor(29, 43, 23);
  doc.rect(0, 0, pageWidth, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('CARBONZERO • ACTIVE DECARBONIZATION STRATEGIES & ROADMAP', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(217, 228, 209);
  doc.text(`Detailed Intervention Dossier | ${selectedStrategies.length} Selected Initiatives`, margin, 16.5);

  y = 28;

  // Selected Strategies Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(29, 43, 23);
  doc.text('PORTFOLIO OF SELECTED DECARBONIZATION INITIATIVES', margin, y);

  y += 5;

  const stratColWidths = [45, 28, 30, 24, 55];
  const stratHeaders = ['Strategy Title', 'Category', 'Annual CO2 Saved', 'Payback', 'Key Advantages & ROI'];

  doc.setFillColor(235, 240, 233);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(29, 43, 23);

  let stratX = margin;
  stratHeaders.forEach((h, idx) => {
    doc.text(h, stratX + 2, y + 4.2);
    stratX += stratColWidths[idx];
  });
  y += 6;

  selectedStrategies.forEach((strat, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 251, 248);
      doc.rect(margin, y, contentWidth, 14, 'F');
    }
    doc.setDrawColor(235, 240, 233);
    doc.setLineWidth(0.1);
    doc.line(margin, y + 14, margin + contentWidth, y + 14);

    let rowX = margin;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(29, 43, 23);
    doc.text(doc.splitTextToSize(strat.title, stratColWidths[0] - 3), rowX + 2, y + 4.5);
    rowX += stratColWidths[0];

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(92, 102, 88);
    doc.text(strat.category, rowX + 2, y + 5);
    rowX += stratColWidths[1];

    // CO2 Savings
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(46, 125, 50);
    doc.text(`-${(strat.potentialReductionKgCO2e / 1000).toFixed(2)} t/yr`, rowX + 2, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(115, 124, 112);
    doc.text(`${strat.potentialReductionKgCO2e.toLocaleString()} kg CO2e`, rowX + 2, y + 9);
    rowX += stratColWidths[2];

    // Payback
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(45, 51, 43);
    doc.text(strat.paybackPeriod, rowX + 2, y + 5);
    doc.setTextColor(140, 120, 81);
    doc.text(strat.costEstimate, rowX + 2, y + 9);
    rowX += stratColWidths[3];

    // Key Advantage
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(60, 68, 58);
    const advantageText = `${strat.pros.environmental} ${strat.pros.economic}`;
    doc.text(doc.splitTextToSize(advantageText, stratColWidths[4] - 3), rowX + 2, y + 3.8);

    y += 14;
  });

  y += 6;

  // 3-Phase Roadmap Timeline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(29, 43, 23);
  doc.text('3-PHASE STRATEGIC DECARBONIZATION ROADMAP', margin, y);

  y += 5;
  const phaseWidth = (contentWidth - 6) / 3;
  const phaseHeight = 36;

  const phases = [
    {
      title: 'PHASE 1: QUICK-WINS',
      period: 'Months 1–3',
      reduction: '12–18% Abatement',
      desc: 'LED retrofits, smart programmable thermostats, FIFO food inventory to eliminate spoilage, and active carpool pairings.',
      bg: [247, 249, 246],
      tagBg: [217, 228, 209],
    },
    {
      title: 'PHASE 2: EFFICIENCY UPGRADES',
      period: 'Months 4–12',
      reduction: '25–40% Abatement',
      desc: 'Heat pump space & water heating transition, plant-rich dietary defaults, public transit pass subsidies, and circular electronic repairs.',
      bg: [247, 249, 246],
      tagBg: [241, 239, 236],
    },
    {
      title: 'PHASE 3: DEEP DECARBONIZATION',
      period: 'Years 2–5',
      reduction: '60–85% Abatement',
      desc: 'Rooftop solar PV installation with net-metering, EV transition, on-site aerobic composting, and institutional microgrid storage.',
      bg: [247, 249, 246],
      tagBg: [217, 228, 209],
    },
  ];

  phases.forEach((p, idx) => {
    const px = margin + idx * (phaseWidth + 3);
    doc.setFillColor(p.bg[0], p.bg[1], p.bg[2]);
    doc.setDrawColor(224, 231, 222);
    doc.setLineWidth(0.3);
    doc.roundedRect(px, y, phaseWidth, phaseHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(29, 43, 23);
    doc.text(p.title, px + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(140, 120, 81);
    doc.text(p.period, px + 3, y + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(46, 125, 50);
    doc.text(p.reduction, px + 3, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(92, 102, 88);
    doc.text(doc.splitTextToSize(p.desc, phaseWidth - 6), px + 3, y + 18);
  });

  y += phaseHeight + 8;

  // Assurance & Sign-off Box
  doc.setFillColor(241, 239, 236);
  doc.setDrawColor(224, 231, 222);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(29, 43, 23);
  doc.text('METHODOLOGICAL ASSURANCE & VERIFICATION NOTE', margin + 4, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(92, 102, 88);
  doc.text(
    'Emissions are calculated using standardized emission factors from the GHG Protocol, Central Electricity Authority (CEA India: 0.716 kg CO2/kWh), ' +
    'and Bureau of Energy Efficiency (BEE India) guidelines. Trajectories assume phased adoption with steady-state efficiency gains.',
    margin + 4,
    y + 8.5,
    { maxWidth: contentWidth - 8 }
  );

  // Footer for Page 2
  drawPageFooter(doc, 2, 2, pageWidth, pageHeight, margin);

  // Trigger browser download
  const cleanFilename = `carbon-reduction-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(cleanFilename);
}

/**
 * Fallback vector drawing when SVG image capture is unavailable.
 */
function renderFallbackChartVector(
  doc: jsPDF,
  startX: number,
  startY: number,
  width: number,
  points: TrajectoryPoint[]
): number {
  const chartHeight = 55;
  doc.setFillColor(250, 251, 248);
  doc.setDrawColor(224, 231, 222);
  doc.setLineWidth(0.3);
  doc.roundedRect(startX, startY, width, chartHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(92, 102, 88);
  doc.text('Projected Carbon Trajectory (tCO2e/yr)', startX + 4, startY + 6);

  if (!points || points.length === 0) return startY + chartHeight + 6;

  const maxVal = Math.max(...points.map((p) => Math.max(p.bau, p.projected))) * 1.1 || 10;
  const graphLeft = startX + 15;
  const graphBottom = startY + chartHeight - 8;
  const graphWidth = width - 25;
  const graphHeight = chartHeight - 18;

  // Grid lines
  doc.setDrawColor(230, 235, 228);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= 3; i++) {
    const yVal = graphBottom - (i / 3) * graphHeight;
    doc.line(graphLeft, yVal, graphLeft + graphWidth, yVal);
    const tickVal = ((i / 3) * maxVal).toFixed(1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.text(`${tickVal} t`, graphLeft - 10, yVal + 1);
  }

  // Draw BAU Line (Red dashed)
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.5);
  points.forEach((p, idx) => {
    if (idx === 0) return;
    const prev = points[idx - 1];
    const x1 = graphLeft + ((idx - 1) / (points.length - 1)) * graphWidth;
    const y1 = graphBottom - (prev.bau / maxVal) * graphHeight;
    const x2 = graphLeft + (idx / (points.length - 1)) * graphWidth;
    const y2 = graphBottom - (p.bau / maxVal) * graphHeight;
    doc.line(x1, y1, x2, y2);
  });

  // Draw Projected Line (Green solid)
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.8);
  points.forEach((p, idx) => {
    if (idx === 0) return;
    const prev = points[idx - 1];
    const x1 = graphLeft + ((idx - 1) / (points.length - 1)) * graphWidth;
    const y1 = graphBottom - (prev.projected / maxVal) * graphHeight;
    const x2 = graphLeft + (idx / (points.length - 1)) * graphWidth;
    const y2 = graphBottom - (p.projected / maxVal) * graphHeight;
    doc.line(x1, y1, x2, y2);
  });

  // Legend
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(239, 68, 68);
  doc.text('--- Business As Usual (No Action)', startX + width - 65, startY + 6);
  doc.setTextColor(46, 125, 50);
  doc.text('— Projected with Selected Strategies', startX + width - 65, startY + 9.5);

  return startY + chartHeight + 6;
}

function drawPageFooter(
  doc: jsPDF,
  pageNumber: number,
  totalPages: number,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  doc.setDrawColor(224, 231, 222);
  doc.setLineWidth(0.2);
  doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(115, 124, 112);
  doc.text('CarbonZero Decarbonization Platform • Verified Climate Action Planning Report', margin, pageHeight - 6);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
}
