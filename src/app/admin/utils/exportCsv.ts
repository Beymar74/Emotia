// Esta función acepta cualquier tipo de arreglo de objetos (T[])
export function exportarACSV<T extends object>(datos: T[], nombreArchivo: string) {
  if (!datos || !datos.length) {
    alert("No hay datos para exportar.");
    return;
  }

  // 1. Obtener las cabeceras (las llaves del primer objeto)
  const cabeceras = Object.keys(datos[0]);

  // 2. Mapear los datos a formato CSV
  const filasCsv = datos.map(fila => {
    return cabeceras.map(cabecera => {
      let valor = (fila as any)[cabecera];
      
      // Si el valor es null o undefined, lo dejamos en blanco
      if (valor === null || valor === undefined) valor = "";
      
      // Convertir a string y escapar comillas dobles para evitar errores en Excel
      const valorString = String(valor).replace(/"/g, '""');
      
      // Envolver cada valor en comillas dobles por si contienen comas
      return `"${valorString}"`;
    }).join(',');
  });

  // 3. Unir las cabeceras y las filas con saltos de línea
  const contenidoCsv = [cabeceras.join(','), ...filasCsv].join('\n');

  // 4. Crear el Blob (archivo) agregando BOM (\ufeff) para que Excel lea bien las tildes (UTF-8)
  const blob = new Blob(['\ufeff' + contenidoCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // 5. Crear un enlace temporal, hacer clic en él y eliminarlo
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${nombreArchivo}_${new Date().toLocaleDateString('es-BO')}.csv`); // Le añade la fecha actual
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}