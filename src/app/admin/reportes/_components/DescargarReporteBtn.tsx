"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type KPI = { label: string; valor: string; color: string };

export type GraficoBarras = {
  tipo: "barras";
  titulo: string;
  datos: { nombre: string; valor: number; color?: string }[];
  color?: string;
};
export type GraficoBarrasH = {
  tipo: "barras-h";
  titulo: string;
  datos: { nombre: string; valor: number; color?: string }[];
  color?: string;
};
export type GraficoDona = {
  tipo: "dona";
  titulo: string;
  datos: { nombre: string; valor: number; color: string }[];
};
export type GraficoArea = {
  tipo: "area";
  titulo: string;
  datos: { x: string; y: number }[];
  color?: string;
};

export type Grafico = GraficoBarras | GraficoBarrasH | GraficoDona | GraficoArea;
export type Tabla = { nombre: string; columnas: string[]; filas: (string | number | null)[][] };

export type ReporteConfig = {
  filename: string;
  titulo: string;
  formatos: ("pdf" | "excel")[];
  kpis: KPI[];
  graficos?: Grafico[];
  tablas: Tabla[];
};

// ── Canvas chart helpers ───────────────────────────────────────────────────────

const S = 3; // px per mm

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function numFmt(n: number) {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}k`
    : String(Math.round(n));
}

function canvasBase(wMm: number, hMm: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(wMm * S);
  c.height = Math.round(hMm * S);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "#F0E8E4";
  ctx.lineWidth = 1.5;
  rrect(ctx, 0.5, 0.5, c.width - 1, c.height - 1, 8);
  ctx.stroke();
  return { c, ctx };
}

function chartTitle(ctx: CanvasRenderingContext2D, title: string, cw: number) {
  ctx.fillStyle = "#5A0F24";
  ctx.font = `bold ${13 * S / 3}px Georgia, serif`;
  ctx.textAlign = "left";
  ctx.fillText(title, 14, 18 * S / 3);
}

function gridLines(ctx: CanvasRenderingContext2D, area: { x: number; y: number; w: number; h: number }, max: number) {
  for (let i = 0; i <= 4; i++) {
    const lineY = area.y + area.h * (1 - i / 4);
    ctx.strokeStyle = "#F5EEE9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(area.x, lineY);
    ctx.lineTo(area.x + area.w, lineY);
    ctx.stroke();
    ctx.fillStyle = "#9A7282";
    ctx.font = `${8 * S / 3}px sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(numFmt(Math.round((max * i) / 4)), area.x - 4, lineY + 3);
  }
}

function drawBarChart(
  ctx: CanvasRenderingContext2D,
  datos: { nombre: string; valor: number; color?: string }[],
  area: { x: number; y: number; w: number; h: number },
  defaultColor: string
) {
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const pad = 6;
  const total = datos.length;
  const barW = Math.max(4, (area.w - pad * (total + 1)) / total);
  const chartH = area.h - 18;

  gridLines(ctx, { ...area, h: chartH }, max);

  datos.forEach((d, i) => {
    const barH = Math.max(2, (d.valor / max) * chartH);
    const bx = area.x + pad + i * (barW + pad);
    const by = area.y + chartH - barH;
    const [r, g, b] = hexToRgb(d.color || defaultColor);

    const grad = ctx.createLinearGradient(bx, by, bx, by + barH);
    grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0.6)`);
    ctx.fillStyle = grad;
    rrect(ctx, bx, by, barW, barH, 3);
    ctx.fill();

    if (d.valor > 0) {
      ctx.fillStyle = "#5A0F24";
      ctx.font = `bold ${7 * S / 3}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(numFmt(d.valor), bx + barW / 2, by - 3);
    }

    ctx.fillStyle = "#7A5260";
    ctx.font = `${7.5 * S / 3}px sans-serif`;
    ctx.textAlign = "center";
    const lbl = d.nombre.length > 9 ? d.nombre.slice(0, 8) + "…" : d.nombre;
    ctx.fillText(lbl, bx + barW / 2, area.y + chartH + 13);
  });
}

function drawBarChartH(
  ctx: CanvasRenderingContext2D,
  datos: { nombre: string; valor: number; color?: string }[],
  area: { x: number; y: number; w: number; h: number },
  defaultColor: string
) {
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const pad = 5;
  const total = datos.length;
  const barH = Math.max(4, (area.h - pad * (total + 1)) / total);
  const chartW = area.w - 80;
  const labelX = area.x + 80;

  datos.forEach((d, i) => {
    const barW = Math.max(2, (d.valor / max) * chartW);
    const bx = labelX;
    const by = area.y + pad + i * (barH + pad);
    const [r, g, b] = hexToRgb(d.color || defaultColor);

    // label
    ctx.fillStyle = "#2A0E18";
    ctx.font = `${8 * S / 3}px sans-serif`;
    ctx.textAlign = "right";
    const lbl = d.nombre.length > 14 ? d.nombre.slice(0, 13) + "…" : d.nombre;
    ctx.fillText(lbl, labelX - 6, by + barH / 2 + 3);

    // bar bg
    ctx.fillStyle = "#F5EEE9";
    rrect(ctx, bx, by, chartW, barH, 3);
    ctx.fill();

    // bar fill
    const grad = ctx.createLinearGradient(bx, by, bx + barW, by);
    grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0.5)`);
    ctx.fillStyle = grad;
    rrect(ctx, bx, by, barW, barH, 3);
    ctx.fill();

    // value
    ctx.fillStyle = "#5A0F24";
    ctx.font = `bold ${7.5 * S / 3}px sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(numFmt(d.valor), bx + barW + 4, by + barH / 2 + 3);
  });
}

function drawDonutChart(
  ctx: CanvasRenderingContext2D,
  datos: { nombre: string; valor: number; color: string }[],
  area: { x: number; y: number; w: number; h: number }
) {
  const total = datos.reduce((s, d) => s + d.valor, 0);
  if (total === 0) return;

  const legendW = Math.min(area.w * 0.38, 90);
  const cx = area.x + (area.w - legendW - 10) / 2;
  const cy = area.y + area.h / 2;
  const r = Math.min((area.w - legendW) / 2 - 10, area.h / 2 - 8);

  let startAngle = -Math.PI / 2;
  datos.forEach((d) => {
    const angle = (d.valor / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = d.color;
    ctx.fill();
    startAngle += angle;
  });

  // donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.54, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // center total
  ctx.fillStyle = "#5A0F24";
  ctx.font = `bold ${12 * S / 3}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.fillText(numFmt(total), cx, cy + 4);
  ctx.fillStyle = "#9A7282";
  ctx.font = `${7.5 * S / 3}px sans-serif`;
  ctx.fillText("total", cx, cy + 13);

  // legend
  const lx = area.x + area.w - legendW;
  let ly = area.y + 6;
  const lineH = area.h / datos.length;
  datos.forEach((d) => {
    const pct = total > 0 ? Math.round((d.valor / total) * 100) : 0;
    ctx.fillStyle = d.color;
    rrect(ctx, lx, ly + lineH / 2 - 5, 8, 8, 2);
    ctx.fill();
    ctx.fillStyle = "#2A0E18";
    ctx.font = `${8 * S / 3}px sans-serif`;
    ctx.textAlign = "left";
    const lbl = d.nombre.length > 16 ? d.nombre.slice(0, 15) + "…" : d.nombre;
    ctx.fillText(lbl, lx + 12, ly + lineH / 2 + 4);
    ctx.fillStyle = "#5A0F24";
    ctx.font = `bold ${8 * S / 3}px sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(`${pct}%`, area.x + area.w, ly + lineH / 2 + 4);
    ly += lineH;
  });
}

function drawAreaChart(
  ctx: CanvasRenderingContext2D,
  datos: { x: string; y: number }[],
  area: { x: number; y: number; w: number; h: number },
  color: string
) {
  if (datos.length < 2) return;
  const max = Math.max(...datos.map((d) => d.y), 1);
  const chartH = area.h - 18;

  gridLines(ctx, { ...area, h: chartH }, max);

  const pts = datos.map((d, i) => ({
    px: area.x + (i / (datos.length - 1)) * area.w,
    py: area.y + chartH - (d.y / max) * chartH,
  }));

  // Area fill
  const [r, g, b] = hexToRgb(color);
  const grad = ctx.createLinearGradient(0, area.y, 0, area.y + chartH);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
  ctx.beginPath();
  ctx.moveTo(pts[0].px, area.y + chartH);
  pts.forEach((p) => ctx.lineTo(p.px, p.py));
  ctx.lineTo(pts[pts.length - 1].px, area.y + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py)));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Dots + X labels
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.px, p.py, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.px, p.py, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = "#7A5260";
    ctx.font = `${7.5 * S / 3}px sans-serif`;
    ctx.textAlign = "center";
    const lbl = datos[i].x.length > 7 ? datos[i].x.slice(0, 6) + "…" : datos[i].x;
    ctx.fillText(lbl, p.px, area.y + chartH + 12);
  });
}

async function renderGrafico(g: Grafico, wMm: number, hMm: number): Promise<string> {
  const { c, ctx } = canvasBase(wMm, hMm);
  chartTitle(ctx, g.titulo, c.width);
  const area = { x: 40, y: 26, w: c.width - 50, h: c.height - 38 };

  switch (g.tipo) {
    case "barras":
      drawBarChart(ctx, g.datos, area, g.color || "#8E1B3A");
      break;
    case "barras-h":
      drawBarChartH(ctx, g.datos, area, g.color || "#8E1B3A");
      break;
    case "dona":
      drawDonutChart(ctx, g.datos, area);
      break;
    case "area":
      drawAreaChart(ctx, g.datos, area, g.color || "#8E1B3A");
      break;
  }

  return c.toDataURL("image/png");
}

// ── PDF generation ─────────────────────────────────────────────────────────────

async function generarPDF(config: ReporteConfig) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();  // 297
  const ph = doc.internal.pageSize.getHeight(); // 210
  const margin = 14;

  // ── Header ──
  doc.setFillColor(90, 15, 36);
  doc.rect(0, 0, pw, 28, "F");
  doc.setFillColor(188, 153, 104);
  doc.rect(0, 26, pw, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(245, 230, 208);
  doc.text(config.titulo, pw / 2, 13, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(188, 153, 104);
  const fecha = new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());
  doc.text(`Generado el ${fecha} · Sistema PREPE`, pw / 2, 22, { align: "center" });

  let y = 36;

  // ── KPIs ──
  const kpiW = (pw - margin * 2 - (config.kpis.length - 1) * 4) / config.kpis.length;
  config.kpis.forEach((k, i) => {
    const kx = margin + i * (kpiW + 4);
    const [r, g, b] = hexToRgb(k.color);
    doc.setFillColor(r, g, b);
    doc.roundedRect(kx, y, kpiW, 16, 2, 2, "F");
    doc.setFillColor(255, 255, 255, 0.15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(k.valor, kx + kpiW / 2, y + 7.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(k.label, kx + kpiW / 2, y + 13, { align: "center" });
  });
  y += 22;

  // ── Charts ──
  if (config.graficos && config.graficos.length > 0) {
    const chartH = 68; // mm
    const graficos = config.graficos;

    for (let i = 0; i < graficos.length; i += 2) {
      if (y + chartH + 4 > ph - 10) { doc.addPage(); y = 14; }

      const g1 = graficos[i];
      const g2 = graficos[i + 1];
      const w1 = g2 ? (pw - margin * 2 - 3) / 2 : pw - margin * 2;

      const img1 = await renderGrafico(g1, w1, chartH);
      doc.addImage(img1, "PNG", margin, y, w1, chartH, undefined, "FAST");

      if (g2) {
        const img2 = await renderGrafico(g2, w1, chartH);
        doc.addImage(img2, "PNG", margin + w1 + 3, y, w1, chartH, undefined, "FAST");
      }
      y += chartH + 4;
    }
    y += 2;
  }

  // ── Tables ──
  for (const tabla of config.tablas) {
    if (y + 25 > ph - 10) { doc.addPage(); y = 14; }

    if (config.tablas.length > 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(90, 15, 36);
      doc.text(tabla.nombre, margin, y + 5);
      y += 8;
    }

    autoTable(doc, {
      startY: y,
      head: [tabla.columnas],
      body: tabla.filas.map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c)))),
      styles: { fontSize: 8, cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 }, textColor: [42, 14, 24] },
      headStyles: { fillColor: [90, 15, 36], textColor: [245, 230, 208], fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: [250, 243, 236] },
      margin: { left: margin, right: margin },
      tableLineColor: [240, 232, 228],
      tableLineWidth: 0.2,
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // ── Footer ──
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFillColor(250, 243, 236);
    doc.rect(0, ph - 7, pw, 7, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(122, 82, 96);
    doc.text(`PREPE · Plataforma de Regalos Personalizados y Experiencias · Reporte confidencial`, margin, ph - 2.5);
    doc.text(`Página ${p} de ${pages}`, pw - margin, ph - 2.5, { align: "right" });
  }

  doc.save(`${config.filename}.pdf`);
}

// ── Excel generation ───────────────────────────────────────────────────────────

async function generarExcel(config: ReporteConfig) {
  const ExcelJS = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sistema PREPE";
  wb.created = new Date();

  const MAROON = "5A0F24";
  const GOLD = "BC9968";
  const CREAM = "FAF3EC";
  const HEAD_FONT = { color: { argb: "FFF5E6D0" }, bold: true, size: 10 };
  const HEAD_FILL = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF" + MAROON } };

  // ── Resumen sheet ──
  const ws = wb.addWorksheet("Resumen");
  ws.addRow(["", config.titulo]);
  ws.addRow(["", `Generado: ${new Intl.DateTimeFormat("es-BO", { dateStyle: "long" }).format(new Date())}`]);
  ws.addRow([]);
  ws.addRow(["KPI", "Valor"]);

  ws.getRow(1).getCell(2).font = { bold: true, size: 14, color: { argb: "FF" + MAROON } };
  ws.getRow(2).getCell(2).font = { size: 9, color: { argb: "FF7A5260" } };
  ws.getRow(4).eachCell((cell: any) => {
    cell.font = HEAD_FONT;
    cell.fill = HEAD_FILL;
    cell.border = { bottom: { style: "thin", color: { argb: "FFBC9968" } } };
  });

  config.kpis.forEach((k, i) => {
    const row = ws.addRow(["", k.label, k.valor]);
    const [r, g, b] = hexToRgb(k.color);
    const argb = `FF${k.color.replace("#", "")}`;
    row.getCell(2).font = { size: 10, color: { argb: "FF2A0E18" } };
    row.getCell(3).font = { bold: true, size: 12, color: { argb: argb } };
    if (i % 2 === 0) {
      row.eachCell((c: any) => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAF3EC" } };
      });
    }
  });

  ws.getColumn(1).width = 3;
  ws.getColumn(2).width = 32;
  ws.getColumn(3).width = 22;

  // ── Data sheets ──
  config.tablas.forEach((tabla) => {
    const sheet = wb.addWorksheet(tabla.nombre.slice(0, 31));

    // Header
    const headerRow = sheet.addRow(tabla.columnas);
    headerRow.eachCell((cell: any) => {
      cell.font = HEAD_FONT;
      cell.fill = HEAD_FILL;
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = { bottom: { style: "thin", color: { argb: "FF" + GOLD } } };
    });
    sheet.getRow(1).height = 20;

    // Data rows
    tabla.filas.forEach((fila, rowIdx) => {
      const row = sheet.addRow(fila.map((c) => (c === null || c === undefined ? "" : c)));
      if (rowIdx % 2 === 0) {
        row.eachCell((cell: any) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAF3EC" } };
        });
      }
      row.eachCell((cell: any) => {
        cell.font = { size: 9, color: { argb: "FF2A0E18" } };
        cell.border = { bottom: { style: "hair", color: { argb: "FFF0E8E4" } } };
      });
    });

    // Auto column widths
    tabla.columnas.forEach((_, idx) => {
      const col = sheet.getColumn(idx + 1);
      let maxLen = tabla.columnas[idx].length;
      tabla.filas.forEach((r) => {
        const v = r[idx];
        const len = v !== null && v !== undefined ? String(v).length : 0;
        if (len > maxLen) maxLen = len;
      });
      col.width = Math.min(Math.max(maxLen + 4, 10), 40);
    });
  });

  // Download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${config.filename}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props { config: ReporteConfig }

export default function DescargarReporteBtn({ config }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"pdf" | "excel" | null>(null);

  const run = async (tipo: "pdf" | "excel") => {
    setLoading(tipo);
    try {
      if (tipo === "pdf") await generarPDF(config);
      else await generarExcel(config);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  const single = config.formatos.length === 1;

  if (single) {
    const fmt = config.formatos[0];
    return (
      <button
        onClick={() => run(fmt)}
        disabled={!!loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A0F24] hover:bg-[#8E1B3A] text-[#F5E6D0] text-sm font-medium transition-all shadow-sm disabled:opacity-60"
      >
        <DownloadIcon />
        {loading ? "Generando…" : `Descargar ${fmt.toUpperCase()}`}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={!!loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A0F24] hover:bg-[#8E1B3A] text-[#F5E6D0] text-sm font-medium transition-all shadow-sm disabled:opacity-60"
      >
        <DownloadIcon />
        {loading ? "Generando…" : "Descargar"}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white border border-[#8E1B3A]/15 rounded-xl shadow-lg z-20 overflow-hidden">
            {config.formatos.includes("pdf") && (
              <>
                <button
                  onClick={() => run("pdf")}
                  disabled={!!loading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#2A0E18] hover:bg-[#FAF3EC] transition-colors disabled:opacity-50"
                >
                  <span className="text-[#A32D2D] font-bold text-xs w-8">PDF</span>
                  {loading === "pdf" ? "Generando…" : "Descargar PDF"}
                </button>
                {config.formatos.includes("excel") && <div className="h-px bg-[#8E1B3A]/8" />}
              </>
            )}
            {config.formatos.includes("excel") && (
              <button
                onClick={() => run("excel")}
                disabled={!!loading}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#2A0E18] hover:bg-[#FAF3EC] transition-colors disabled:opacity-50"
              >
                <span className="text-[#185FA5] font-bold text-xs w-8">XLS</span>
                {loading === "excel" ? "Generando…" : "Descargar Excel"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 10.5v1a1 1 0 001 1h9a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
