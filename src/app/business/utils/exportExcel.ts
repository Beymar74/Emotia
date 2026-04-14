import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface Pedido {
  id: string;
  cliente: string;
  producto: string;
  fecha: string;
  estado: string;
  total: string;
}

export const exportarReporteDashboard = async (pedidos: Pedido[]) => {
  const workbook = new ExcelJS.Workbook();
  // Al crear la hoja, quitamos las líneas de cuadrícula para que parezca un reporte limpio
  const worksheet = workbook.addWorksheet('Ventas y Pedidos', {
    views: [{ showGridLines: false }] 
  });

  // 1. PRIMERO definimos las columnas y sus anchos perfectos
  worksheet.columns = [
    { header: 'ID Pedido', key: 'id', width: 18 },
    { header: 'Cliente', key: 'cliente', width: 28 },
    { header: 'Producto', key: 'producto', width: 40 },
    { header: 'Fecha', key: 'fecha', width: 18 },
    { header: 'Estado', key: 'estado', width: 22 },
    { header: 'Total', key: 'total', width: 18 }
  ];

  // 2. Llenamos los datos (esto se escribe en las filas 2, 3, 4...)
  pedidos.forEach((pedido) => {
    worksheet.addRow(pedido);
  });

  // 3. EL TRUCO MAGISTRAL: Empujamos todo 5 filas hacia abajo para hacer espacio
  worksheet.spliceRows(1, 0, [], [], [], [], []);

  // 4. Agregar el Título (Ahora en la fila 4)
  worksheet.mergeCells('A4:F4');
  const titulo = worksheet.getCell('A4');
  titulo.value = 'REPORTE GENERAL DE PEDIDOS - EMOTIA BUSINESS';
  titulo.font = { size: 15, bold: true, color: { argb: 'FF3D0A1A' } }; // Bordó Negro
  titulo.alignment = { vertical: 'middle', horizontal: 'center' };

  // 5. Dar estilo a la Cabecera de la Tabla (que fue empujada a la fila 6)
  const headerRow = worksheet.getRow(6);
  headerRow.height = 30; // Hacemos la cabecera más alta
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF8E1B3A' } // Granate Emotia
    };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FFBC9968' } } // Borde inferior Dorado
    };
  });

  // 6. Dar estilo a las filas de los datos
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 6) { // Solo afectamos a los datos, no al título ni cabecera
      row.height = 22; // Separamos un poco las filas para que respiren
      row.eachCell((cell, colNumber) => {
        // Alineación: Todo centrado a la izquierda, excepto el Total (Derecha) y el Estado (Centro)
        cell.alignment = { 
          vertical: 'middle', 
          horizontal: colNumber === 6 ? 'right' : colNumber === 5 ? 'center' : 'left',
          indent: 1
        };
        // Borde gris súper sutil entre filas
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } } 
        };
        
        // Destacamos el ID del Pedido en Granate
        if (colNumber === 1) {
          cell.font = { bold: true, color: { argb: 'FF8E1B3A' } };
        }
        // Destacamos el Total en Negrita
        if (colNumber === 6) {
            cell.font = { bold: true };
        }
      });
    }
  });

  // 7. Insertar el Logo
  try {
    const response = await fetch('/logo/logo-business-expandido.png');
    const blob = await response.blob();
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const logoId = workbook.addImage({
      base64: base64data,
      extension: 'png',
    });

    // Colocamos el logo flotando cerca de A1
    worksheet.addImage(logoId, {
      tl: { col: 0.2, row: 0.5 }, // Ligero margen
      ext: { width: 180, height: 60 }
    });
  } catch (error) {
    console.warn("No se pudo cargar el logo", error);
  }

  // 8. Generar y Descargar
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'Reporte_Ventas_Emotia.xlsx');
};