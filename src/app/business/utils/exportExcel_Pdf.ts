import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = {
  bordoNegro: "FF3D0A1A",
  granate: "FF8E1B3A",
  dorado: "FFBC9968",
  beige: "FFF5E6D0",
  blanco: "FFFFFFFF",
  grisClaro: "FFEEEEEE",
  negro: "FF1A1A1A",
  choco: "FF5C3A2E",
};

type PedidoDashboard = {
  id: string;
  pedidoId?: string;
  cliente: string;
  producto: string;
  fecha?: string;
  estado: string;
  total: string | number;
};

type PedidoProveedor = {
  id: number;
  codigo: string;
  cliente: string;
  producto: string;
  productos?: {
    nombre: string;
    total: number;
    personalizacion: string | null;
  }[];
  direccion: string;
  estado: string;
  total: number;
  fecha: string;
};
export type ReporteDashboardEjecutivo = {
  empresa: string;
  filtro: string;
  rango: string;
  generadoEn: string;
  kpis: {
    ingresosTotales: number;
    totalPedidos: number;
    ticketPromedio: number;
    productosVendidos: number;
    entregados: number;
    pendientes: number;
    enProceso: number;
    cancelados: number;
    productosActivos: number;
    stockBajo: number;
  };
  ventasPorMes: {
    mes: string;
    ingresos: number;
    pedidos: number;
  }[];
  pedidosPorEstado: {
    estado: string;
    cantidad: number;
  }[];
  topProductos: {
    producto: string;
    categoria: string;
    ingresos: number;
    cantidad: number;
  }[];
  stockBajo: {
    id: number;
    nombre: string;
    stock: number;
    imagen: string | null;
    porcentaje: number;
  }[];
  insights: {
    estadoPredominante: string;
    mejorProducto: string;
    estadoOperacion: string;
    textoOperacion: string;
    crecimientoIngresos: number;
    crecimientoEntregados: number;
  };
  pedidos: PedidoDashboard[];
};

function formatBs(value: number) {
  return `Bs. ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function cargarLogoBase64() {
  const response = await fetch("/logo/logo-business-expandido.png");
  const blob = await response.blob();

  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
function formatearEstadoPedido(estado: string) {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    en_preparacion: "En preparación",
    preparacion: "En preparación",
    listo: "Listo",
    en_camino: "En camino",
    entregado: "Entregado",
    completado: "Entregado",
    cancelado: "Cancelado",
  };

  return labels[estado] || estado;
}
function formatearFecha(fecha?: string) {
  if (!fecha) return "-";

  try {
    return new Intl.DateTimeFormat("es-BO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(fecha));
  } catch {
    return fecha;
  }
}

function normalizarProductosPedido(pedido: PedidoProveedor) {
  if (pedido.productos && pedido.productos.length > 0) {
    return pedido.productos.map((producto) => producto.nombre).join(" · ");
  }

  return pedido.producto;
}

function aplicarHeaderTabla(worksheet: ExcelJS.Worksheet, rowNumber: number) {
  const headerRow = worksheet.getRow(rowNumber);
  headerRow.height = 30;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.granate },
    };
    cell.font = { color: { argb: COLORS.blanco }, bold: true, size: 12 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "medium", color: { argb: COLORS.dorado } },
    };
  });
}

function aplicarEstiloDatos(
  worksheet: ExcelJS.Worksheet,
  inicioDatos: number,
  totalColNumber: number
) {
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= inicioDatos) {
      row.height = 24;

      row.eachCell((cell, colNumber) => {
        cell.alignment = {
          vertical: "middle",
          horizontal:
            colNumber === totalColNumber
              ? "right"
              : colNumber === totalColNumber - 1
                ? "center"
                : "left",
          indent: 1,
          wrapText: true,
        };

        cell.border = {
          bottom: { style: "thin", color: { argb: COLORS.grisClaro } },
        };

        if (colNumber === 1) {
          cell.font = { bold: true, color: { argb: COLORS.granate } };
        }

        if (colNumber === totalColNumber) {
          cell.font = { bold: true };
        }
      });
    }
  });
}

async function agregarLogoExcel(workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet) {
  try {
    const base64data = await cargarLogoBase64();

    const logoId = workbook.addImage({
      base64: base64data,
      extension: "png",
    });

    worksheet.addImage(logoId, {
      tl: { col: 0.2, row: 0.5 },
      ext: { width: 180, height: 60 },
    });
  } catch (error) {
    console.warn("No se pudo cargar el logo", error);
  }
}

async function agregarHeaderPDF(doc: jsPDF, titulo: string, subtitulo?: string) {
  try {
    const logo = await cargarLogoBase64();
    doc.addImage(logo, "PNG", 14, 10, 55, 18);
  } catch (error) {
    console.warn("No se pudo cargar el logo PDF", error);
  }

  doc.setFillColor(61, 10, 26);
  doc.rect(0, 0, 297, 7, "F");

  doc.setTextColor(61, 10, 26);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 148, 22, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleString("es-BO")}`, 148, 28, {
    align: "center",
  });

  if (subtitulo) {
    doc.text(subtitulo, 148, 33, { align: "center" });
  }
}

export const exportarReporteDashboardExcel = async (
  pedidos: PedidoDashboard[]
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Ventas y Pedidos", {
    views: [{ showGridLines: false }],
  });

  worksheet.columns = [
    { header: "ID Pedido", key: "id", width: 18 },
    { header: "Cliente", key: "cliente", width: 28 },
    { header: "Producto", key: "producto", width: 40 },
    { header: "Fecha", key: "fecha", width: 22 },
    { header: "Estado", key: "estado", width: 22 },
    { header: "Total", key: "total", width: 18 },
  ];

  pedidos.forEach((pedido) => {
    worksheet.addRow({
      ...pedido,
      fecha: formatearFecha(pedido.fecha),
      total:
        typeof pedido.total === "number" ? `Bs. ${pedido.total}` : pedido.total,
    });
  });

  worksheet.spliceRows(1, 0, [], [], [], [], []);

  worksheet.mergeCells("A4:F4");
  const titulo = worksheet.getCell("A4");
  titulo.value = "REPORTE GENERAL DE PEDIDOS - EMOTIA BUSINESS";
  titulo.font = { size: 15, bold: true, color: { argb: COLORS.bordoNegro } };
  titulo.alignment = { vertical: "middle", horizontal: "center" };

  aplicarHeaderTabla(worksheet, 6);
  aplicarEstiloDatos(worksheet, 7, 6);

  await agregarLogoExcel(workbook, worksheet);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Reporte_Ventas_Emotia.xlsx");
};

export const exportarReporteDashboardPDF = async (
  pedidos: PedidoDashboard[]
) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  await agregarHeaderPDF(doc, "REPORTE GENERAL DE PEDIDOS - EMOTIA BUSINESS");

  autoTable(doc, {
    startY: 42,
    head: [["ID Pedido", "Cliente", "Producto", "Fecha", "Estado", "Total"]],
    body: pedidos.map((pedido) => [
      pedido.id,
      pedido.cliente,
      pedido.producto,
      formatearFecha(pedido.fecha),
      pedido.estado,
      typeof pedido.total === "number" ? `Bs. ${pedido.total}` : pedido.total,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [142, 27, 58],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [250, 247, 243],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [142, 27, 58] },
      2: { cellWidth: 75 },
      5: { halign: "right", fontStyle: "bold" },
    },
  });

  doc.save("Reporte_Ventas_Emotia.pdf");
};

export const exportarPedidosProveedorExcel = async (
  pedidos: PedidoProveedor[],
  filtros?: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Pedidos Proveedor", {
    views: [{ showGridLines: false }],
  });

  worksheet.columns = [
    { header: "Pedido", key: "codigo", width: 18 },
    { header: "Cliente", key: "cliente", width: 28 },
    { header: "Productos", key: "productos", width: 55 },
    { header: "Dirección", key: "direccion", width: 45 },
    { header: "Estado", key: "estado", width: 22 },
    { header: "Fecha", key: "fecha", width: 22 },
    { header: "Total", key: "total", width: 18 },
  ];

  pedidos.forEach((pedido) => {
    worksheet.addRow({
      codigo: pedido.codigo,
      cliente: pedido.cliente,
      productos: normalizarProductosPedido(pedido),
      direccion: pedido.direccion,
      estado: formatearEstadoPedido(pedido.estado),
      fecha: formatearFecha(pedido.fecha),
      total: `Bs. ${pedido.total}`,
    });
  });

  worksheet.spliceRows(1, 0, [], [], [], [], []);

  worksheet.mergeCells("A4:G4");
  const titulo = worksheet.getCell("A4");
  titulo.value = "LISTA DE PEDIDOS - EMOTIA BUSINESS";
  titulo.font = { size: 15, bold: true, color: { argb: COLORS.bordoNegro } };
  titulo.alignment = { vertical: "middle", horizontal: "center" };

  if (filtros) {
    worksheet.mergeCells("A5:G5");
    const filtroCell = worksheet.getCell("A5");
    filtroCell.value = `Filtros aplicados: ${filtros}`;
    filtroCell.font = { size: 10, italic: true, color: { argb: "FF666666" } };
    filtroCell.alignment = { horizontal: "center" };
  }

  aplicarHeaderTabla(worksheet, 6);
  aplicarEstiloDatos(worksheet, 7, 7);

  await agregarLogoExcel(workbook, worksheet);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Lista_Pedidos_Proveedor_Emotia.xlsx");
};

export const exportarPedidosProveedorPDF = async (
  pedidos: PedidoProveedor[],
  filtros?: string
) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  await agregarHeaderPDF(doc, "LISTA DE PEDIDOS - EMOTIA BUSINESS", filtros);

  autoTable(doc, {
    startY: 42,
    head: [["Pedido", "Cliente", "Productos", "Dirección", "Estado", "Fecha", "Total"]],
    body: pedidos.map((pedido) => [
      pedido.codigo,
      pedido.cliente,
      normalizarProductosPedido(pedido),
      pedido.direccion,
      formatearEstadoPedido(pedido.estado),
      formatearFecha(pedido.fecha),
      `Bs. ${pedido.total}`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [142, 27, 58],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [250, 247, 243],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [142, 27, 58], cellWidth: 22 },
      2: { cellWidth: 65 },
      3: { cellWidth: 65 },
      6: { halign: "right", fontStyle: "bold" },
    },
  });

  doc.save("Lista_Pedidos_Proveedor_Emotia.pdf");
};

export const exportarReporteDashboardEjecutivoExcel = async (
  reporte: ReporteDashboardEjecutivo
) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Emotia Business";
  workbook.created = new Date();

  const resumen = workbook.addWorksheet("Resumen Ejecutivo", {
    views: [{ showGridLines: false }],
  });

  resumen.columns = [
    { width: 28 },
    { width: 20 },
    { width: 24 },
    { width: 20 },
    { width: 24 },
    { width: 20 },
  ];

  await agregarLogoExcel(workbook, resumen);

  resumen.mergeCells("A4:F4");
  resumen.getCell("A4").value = "REPORTE EJECUTIVO — EMOTIA BUSINESS";
  resumen.getCell("A4").font = {
    size: 16,
    bold: true,
    color: { argb: COLORS.bordoNegro },
  };
  resumen.getCell("A4").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  resumen.mergeCells("A5:F5");
  resumen.getCell("A5").value = `${reporte.empresa} · ${reporte.rango} · Generado ${formatearFecha(reporte.generadoEn)}`;
  resumen.getCell("A5").font = {
    size: 10,
    italic: true,
    color: { argb: "FF666666" },
  };
  resumen.getCell("A5").alignment = { horizontal: "center" };

  const kpis = [
    ["Ingresos totales", formatBs(reporte.kpis.ingresosTotales)],
    ["Total pedidos", reporte.kpis.totalPedidos],
    ["Ticket promedio", formatBs(reporte.kpis.ticketPromedio)],
    ["Productos vendidos", reporte.kpis.productosVendidos],
    ["Entregados", reporte.kpis.entregados],
    ["Pendientes", reporte.kpis.pendientes],
    ["En proceso", reporte.kpis.enProceso],
    ["Cancelados", reporte.kpis.cancelados],
    ["Productos activos", reporte.kpis.productosActivos],
    ["Stock bajo", reporte.kpis.stockBajo],
  ];

  resumen.mergeCells("A7:F7");
  resumen.getCell("A7").value = "Indicadores principales";
  resumen.getCell("A7").font = {
    bold: true,
    size: 13,
    color: { argb: COLORS.granate },
  };

  let row = 9;
  kpis.forEach(([label, value], index) => {
    const col = index % 2 === 0 ? 1 : 4;
    const currentRow = row + Math.floor(index / 2) * 2;

    resumen.getCell(currentRow, col).value = label;
    resumen.getCell(currentRow, col).font = {
      bold: true,
      size: 10,
      color: { argb: "FF7A5260" },
    };

    resumen.getCell(currentRow + 1, col).value = value;
    resumen.getCell(currentRow + 1, col).font = {
      bold: true,
      size: 16,
      color: { argb: COLORS.bordoNegro },
    };

    resumen.mergeCells(currentRow, col, currentRow, col + 1);
    resumen.mergeCells(currentRow + 1, col, currentRow + 1, col + 1);
  });

  resumen.mergeCells("A21:F21");
  resumen.getCell("A21").value = "Resumen ejecutivo";
  resumen.getCell("A21").font = {
    bold: true,
    size: 13,
    color: { argb: COLORS.granate },
  };

  const insights = [
    `Estado predominante: ${reporte.insights.estadoPredominante}`,
    `Producto con mejor rendimiento: ${reporte.insights.mejorProducto}`,
    `Operación: ${reporte.insights.estadoOperacion} (${reporte.insights.textoOperacion})`,
    `Crecimiento de ingresos: ${reporte.insights.crecimientoIngresos.toFixed(1)}%`,
    `Crecimiento de entregados: ${reporte.insights.crecimientoEntregados.toFixed(1)}%`,
  ];

  insights.forEach((insight, index) => {
    resumen.mergeCells(22 + index, 1, 22 + index, 6);
    resumen.getCell(22 + index, 1).value = `• ${insight}`;
    resumen.getCell(22 + index, 1).font = {
      size: 10,
      color: { argb: COLORS.choco },
    };
  });

  const ventasMes = workbook.addWorksheet("Ventas por Mes", {
    views: [{ showGridLines: false }],
  });

  ventasMes.columns = [
    { header: "Mes", key: "mes", width: 22 },
    { header: "Ingresos", key: "ingresos", width: 20 },
    { header: "Pedidos", key: "pedidos", width: 18 },
    { header: "Ticket promedio", key: "ticket", width: 22 },
  ];

  reporte.ventasPorMes.forEach((item) => {
    ventasMes.addRow({
      mes: item.mes,
      ingresos: item.ingresos,
      pedidos: item.pedidos,
      ticket: item.pedidos > 0 ? item.ingresos / item.pedidos : 0,
    });
  });

  aplicarHeaderTabla(ventasMes, 1);
  aplicarEstiloDatos(ventasMes, 2, 4);

  ventasMes.getColumn("ingresos").numFmt = '"Bs." #,##0.00';
  ventasMes.getColumn("ticket").numFmt = '"Bs." #,##0.00';

  const chartDataStart = 2;
  const chartDataEnd = Math.max(2, reporte.ventasPorMes.length + 1);

  ventasMes.addTable({
    name: "TablaVentasPorMes",
    ref: "A1",
    headerRow: true,
    style: {
      theme: "TableStyleMedium4",
      showRowStripes: true,
    },
    columns: [
      { name: "Mes" },
      { name: "Ingresos" },
      { name: "Pedidos" },
      { name: "Ticket promedio" },
    ],
    rows: reporte.ventasPorMes.map((item) => [
      item.mes,
      item.ingresos,
      item.pedidos,
      item.pedidos > 0 ? item.ingresos / item.pedidos : 0,
    ]),
  });

  const productos = workbook.addWorksheet("Top Productos", {
    views: [{ showGridLines: false }],
  });

  productos.columns = [
    { header: "Producto", key: "producto", width: 42 },
    { header: "Categoría", key: "categoria", width: 24 },
    { header: "Cantidad", key: "cantidad", width: 16 },
    { header: "Ingresos", key: "ingresos", width: 20 },
  ];

  reporte.topProductos.forEach((item) => {
    productos.addRow(item);
  });

  aplicarHeaderTabla(productos, 1);
  aplicarEstiloDatos(productos, 2, 4);
  productos.getColumn("ingresos").numFmt = '"Bs." #,##0.00';

  const estados = workbook.addWorksheet("Estados", {
    views: [{ showGridLines: false }],
  });

  estados.columns = [
    { header: "Estado", key: "estado", width: 24 },
    { header: "Cantidad", key: "cantidad", width: 18 },
  ];

  reporte.pedidosPorEstado.forEach((item) => {
    estados.addRow(item);
  });

  aplicarHeaderTabla(estados, 1);
  aplicarEstiloDatos(estados, 2, 2);

  const detalle = workbook.addWorksheet("Detalle Pedidos", {
    views: [{ showGridLines: false }],
  });

  detalle.columns = [
    { header: "Pedido", key: "pedidoId", width: 18 },
    { header: "Cliente", key: "cliente", width: 28 },
    { header: "Producto", key: "producto", width: 42 },
    { header: "Fecha", key: "fecha", width: 22 },
    { header: "Estado", key: "estado", width: 18 },
    { header: "Total", key: "total", width: 18 },
  ];

  reporte.pedidos.forEach((pedido) => {
    detalle.addRow({
      pedidoId: pedido.pedidoId || pedido.id,
      cliente: pedido.cliente,
      producto: pedido.producto,
      fecha: formatearFecha(pedido.fecha),
      estado: pedido.estado,
      total: Number(pedido.total || 0),
    });
  });

  aplicarHeaderTabla(detalle, 1);
  aplicarEstiloDatos(detalle, 2, 6);
  detalle.getColumn("total").numFmt = '"Bs." #,##0.00';

  [resumen, ventasMes, productos, estados, detalle].forEach((sheet) => {
    sheet.eachRow((r) => {
      r.eachCell((cell) => {
        cell.alignment = {
          ...cell.alignment,
          vertical: "middle",
          wrapText: true,
        };
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `Reporte_Ejecutivo_Emotia_${reporte.rango.replace(/\s+/g, "_")}.xlsx`
  );
};

export const exportarReporteDashboardEjecutivoPDF = async (
  reporte: ReporteDashboardEjecutivo
) => {
  const doc = new jsPDF("landscape", "mm", "a4");

  await agregarHeaderPDF(
    doc,
    "REPORTE EJECUTIVO — EMOTIA BUSINESS",
    `${reporte.empresa} · ${reporte.rango}`
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(61, 10, 26);
  doc.text("Indicadores principales", 14, 45);

  const kpiCards = [
    ["Ingresos", formatBs(reporte.kpis.ingresosTotales)],
    ["Pedidos", String(reporte.kpis.totalPedidos)],
    ["Ticket promedio", formatBs(reporte.kpis.ticketPromedio)],
    ["Vendidos", String(reporte.kpis.productosVendidos)],
    ["Entregados", String(reporte.kpis.entregados)],
    ["Stock bajo", String(reporte.kpis.stockBajo)],
  ];

  const cardW = 43;
  const cardH = 18;
  const startX = 14;
  const startY = 50;

  kpiCards.forEach(([label, value], index) => {
    const x = startX + index * 46;

    doc.setFillColor(250, 247, 243);
    doc.setDrawColor(230, 220, 214);
    doc.roundedRect(x, startY, cardW, cardH, 3, 3, "FD");

    doc.setFontSize(7);
    doc.setTextColor(122, 82, 96);
    doc.text(label.toUpperCase(), x + 3, startY + 6);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(61, 10, 26);
    doc.text(value, x + 3, startY + 13);
  });

  doc.setFontSize(11);
  doc.setTextColor(61, 10, 26);
  doc.text("Resumen ejecutivo", 14, 82);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);

  const insights = [
    `Estado predominante: ${reporte.insights.estadoPredominante}`,
    `Producto con mejor rendimiento: ${reporte.insights.mejorProducto}`,
    `Operación: ${reporte.insights.estadoOperacion} (${reporte.insights.textoOperacion})`,
    `Crecimiento de ingresos: ${reporte.insights.crecimientoIngresos.toFixed(1)}%`,
    `Crecimiento de entregados: ${reporte.insights.crecimientoEntregados.toFixed(1)}%`,
  ];

  insights.forEach((line, index) => {
    doc.text(`• ${line}`, 16, 89 + index * 5);
  });

  autoTable(doc, {
    startY: 118,
    margin: { left: 14, right: 154 },
    head: [["Mes", "Ingresos", "Pedidos"]],
    body: reporte.ventasPorMes.map((item) => [
      item.mes,
      formatBs(item.ingresos),
      item.pedidos,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [142, 27, 58],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.3,
    },
    alternateRowStyles: {
      fillColor: [250, 247, 243],
    },
  });

  autoTable(doc, {
    startY: 118,
    margin: { left: 154, right: 14 },
    head: [["Producto", "Cant.", "Ingresos"]],
    body: reporte.topProductos.slice(0, 6).map((item) => [
      item.producto,
      item.cantidad,
      formatBs(item.ingresos),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [92, 58, 46],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 7,
      cellPadding: 2.3,
    },
    alternateRowStyles: {
      fillColor: [250, 247, 243],
    },
    columnStyles: {
      0: { cellWidth: 58 },
      1: { halign: "center" },
      2: { halign: "right", fontStyle: "bold" },
    },
  });

  doc.addPage();

  await agregarHeaderPDF(
    doc,
    "DETALLE OPERATIVO — EMOTIA BUSINESS",
    `${reporte.empresa} · ${reporte.rango}`
  );

  autoTable(doc, {
    startY: 42,
    head: [["Pedido", "Cliente", "Producto", "Fecha", "Estado", "Total"]],
    body: reporte.pedidos.map((pedido) => [
      pedido.pedidoId || pedido.id,
      pedido.cliente,
      pedido.producto,
      formatearFecha(pedido.fecha),
      pedido.estado,
      formatBs(Number(pedido.total || 0)),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [142, 27, 58],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [250, 247, 243],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [142, 27, 58] },
      2: { cellWidth: 75 },
      5: { halign: "right", fontStyle: "bold" },
    },
  });

  if (reporte.stockBajo.length > 0) {
    const finalY = (doc as any).lastAutoTable?.finalY || 120;

    autoTable(doc, {
      startY: finalY + 10,
      head: [["Alertas de stock bajo", "Stock"]],
      body: reporte.stockBajo.map((item) => [item.nombre, item.stock]),
      theme: "grid",
      headStyles: {
        fillColor: [188, 153, 104],
        textColor: [61, 10, 26],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      columnStyles: {
        1: { halign: "center", fontStyle: "bold" },
      },
    });
  }

  doc.save(
    `Reporte_Ejecutivo_Emotia_${reporte.rango.replace(/\s+/g, "_")}.pdf`
  );
};

// Compatibilidad con tu llamada actual del dashboard
export const exportarReporteDashboard = exportarReporteDashboardExcel;