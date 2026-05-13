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
};

type PedidoDashboard = {
  id: string;
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

// Compatibilidad con tu llamada actual del dashboard
export const exportarReporteDashboard = exportarReporteDashboardExcel;