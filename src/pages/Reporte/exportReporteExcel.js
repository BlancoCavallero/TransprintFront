const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const currencyFormat = '"$"#,##0.00';

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getPeriodoLabel = (filtros) => {
  const anio = filtros?.anio || new Date().getFullYear();
  if (!filtros?.mes) return `Todos los meses - ${anio}`;
  return `${MESES[filtros.mes - 1]} ${anio}`;
};

const setRowBorders = (row) => {
  row.eachCell((cell) => {
    cell.border = {
      top: { style: "thin", color: { argb: "FFD3D3D3" } },
      left: { style: "thin", color: { argb: "FFD3D3D3" } },
      bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
      right: { style: "thin", color: { argb: "FFD3D3D3" } },
    };
  });
};

const addTitle = (worksheet, title, color, columnCount) => {
  worksheet.mergeCells(1, 1, 1, columnCount);
  const titleCell = worksheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: color },
  };
  worksheet.getRow(1).height = 26;
};

const addPeriodoRow = (worksheet, label, columnCount) => {
  worksheet.mergeCells(2, 1, 2, columnCount);
  const cell = worksheet.getCell(2, 1);
  cell.value = `Periodo: ${label}`;
  cell.font = { bold: true, color: { argb: "FF1F2937" } };
  cell.alignment = { vertical: "middle", horizontal: "left" };
};

const addSummaryRows = (worksheet, labels, values, color) => {
  const headerRow = worksheet.addRow(labels);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
  });
  setRowBorders(headerRow);

  const valueRow = worksheet.addRow(values);
  valueRow.font = { bold: true };
  valueRow.alignment = { vertical: "middle", horizontal: "center" };
  setRowBorders(valueRow);

  return { headerRow, valueRow };
};

const styleTableHeader = (row, color) => {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.alignment = { vertical: "middle", horizontal: "center" };
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
  });
  setRowBorders(row);
};

const setColumnWidths = (worksheet, widths) => {
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
};

const createGananciasSheet = (workbook, data, filtros) => {
  const worksheet = workbook.addWorksheet("Ganancias");
  const periodLabel = getPeriodoLabel(filtros);
  const totalizadores = data?.totalizadores || {};
  const viajes = data?.viajes || [];

  addTitle(worksheet, "Reporte de Ganancias", "FF0F766E", 6);
  addPeriodoRow(worksheet, periodLabel, 6);
  worksheet.addRow([]);

  const summary = addSummaryRows(
    worksheet,
    ["Ingresos", "Gastos", "Ganancia", "Margen"],
    [
      totalizadores.ingresos || 0,
      totalizadores.gastos || 0,
      totalizadores.ganancia || 0,
      (totalizadores.margenGanancia || 0) / 100,
    ],
    "FF0F766E"
  );
  summary.valueRow.getCell(1).numFmt = currencyFormat;
  summary.valueRow.getCell(2).numFmt = currencyFormat;
  summary.valueRow.getCell(3).numFmt = currencyFormat;
  summary.valueRow.getCell(4).numFmt = "0.00%";

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    "Fecha Inicio",
    "Fecha Fin",
    "Ruta",
    "Precio",
    "Gastos",
    "Ganancia",
  ]);
  styleTableHeader(headerRow, "FF0E7490");

  viajes.forEach((viaje) => {
    const row = worksheet.addRow([
      toDate(viaje.fechaInicio) || "-",
      toDate(viaje.fechaFin) || "-",
      `${viaje.localidadOrigen || "-"} -> ${viaje.localidadDestino || "-"}`,
      viaje.precio || 0,
      viaje.gastos || 0,
      viaje.ganancia || 0,
    ]);
    row.getCell(1).numFmt = "dd/mm/yyyy";
    row.getCell(2).numFmt = "dd/mm/yyyy";
    row.getCell(4).numFmt = currencyFormat;
    row.getCell(5).numFmt = currencyFormat;
    row.getCell(6).numFmt = currencyFormat;
    setRowBorders(row);
  });

  setColumnWidths(worksheet, [14, 14, 36, 14, 14, 14]);
  worksheet.views = [{ state: "frozen", ySplit: headerRow.number }];
};

const createGastosSheet = (workbook, data, filtros) => {
  const worksheet = workbook.addWorksheet("Gastos");
  const periodLabel = getPeriodoLabel(filtros);
  const totalizadores = data?.totalizadores || {};
  const gastos = data?.gastos || [];

  addTitle(worksheet, "Reporte de Gastos", "FF9A3412", 5);
  addPeriodoRow(worksheet, periodLabel, 5);
  worksheet.addRow([]);

  const summary = addSummaryRows(
    worksheet,
    ["Combustible", "Viatico", "Peaje", "Total"],
    [
      totalizadores.combustible || 0,
      totalizadores.viatico || 0,
      totalizadores.peaje || 0,
      totalizadores.total || 0,
    ],
    "FF9A3412"
  );
  summary.valueRow.eachCell((cell) => {
    cell.numFmt = currencyFormat;
  });

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    "Fecha",
    "Tipo",
    "Descripcion",
    "Monto",
    "Viaje",
  ]);
  styleTableHeader(headerRow, "FFB45309");

  gastos.forEach((gasto) => {
    const row = worksheet.addRow([
      toDate(gasto.fecha) || "-",
      gasto.tipo || "-",
      gasto.descripcion || gasto.detalle || "-",
      gasto.precio || gasto.monto || 0,
      gasto.viaje
        ? `${gasto.viaje.localidadOrigen || "-"} -> ${gasto.viaje.localidadDestino || "-"}`
        : "-",
    ]);
    row.getCell(1).numFmt = "dd/mm/yyyy";
    row.getCell(4).numFmt = currencyFormat;
    setRowBorders(row);
  });

  setColumnWidths(worksheet, [14, 16, 36, 14, 36]);
  worksheet.views = [{ state: "frozen", ySplit: headerRow.number }];
};

const createViaticosSheet = (workbook, data, filtros) => {
  const worksheet = workbook.addWorksheet("Viaticos");
  const periodLabel = getPeriodoLabel(filtros);
  const totalizadores = data?.totalizadores || {};
  const choferes = data?.choferes || [];

  addTitle(worksheet, "Reporte de Viaticos", "FF2563EB", 4);
  addPeriodoRow(worksheet, periodLabel, 4);
  worksheet.addRow([]);

  const summary = addSummaryRows(
    worksheet,
    ["Total Viaticos", "Choferes"],
    [totalizadores.totalViaticos || 0, totalizadores.cantidadChoferes || 0],
    "FF2563EB"
  );
  summary.valueRow.getCell(1).numFmt = currencyFormat;

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    "Chofer",
    "Cantidad Viajes",
    "Total Viaticos",
    "Promedio por Viaje",
  ]);
  styleTableHeader(headerRow, "FF1D4ED8");

  choferes.forEach((chofer) => {
    const promedio = chofer.cantidadViajes
      ? chofer.totalViaticos / chofer.cantidadViajes
      : 0;
    const row = worksheet.addRow([
      chofer.nombreCompleto || "-",
      chofer.cantidadViajes || 0,
      chofer.totalViaticos || 0,
      promedio,
    ]);
    row.getCell(3).numFmt = currencyFormat;
    row.getCell(4).numFmt = currencyFormat;
    setRowBorders(row);
  });

  setColumnWidths(worksheet, [28, 18, 18, 18]);
  worksheet.views = [{ state: "frozen", ySplit: headerRow.number }];
};

export const exportReporteExcel = async ({
  reporteGanancias,
  reporteGastos,
  reporteViaticos,
  filtros,
}) => {
  const ExcelJSModule = await import("exceljs");
  const ExcelJS = ExcelJSModule.default || ExcelJSModule;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Transprint";
  workbook.created = new Date();

  createGananciasSheet(workbook, reporteGanancias, filtros);
  createGastosSheet(workbook, reporteGastos, filtros);
  createViaticosSheet(workbook, reporteViaticos, filtros);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const periodo = getPeriodoLabel(filtros).replace(/\s+/g, "-");
  const filename = `reportes-${periodo}.xlsx`;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
