import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

/**
 * Obtiene el reporte de ganancias con filtros opcionales
 * @param {Object} params - Parámetros de filtro
 * @param {number} params.mes - Mes (1-12) opcional
 * @param {number} params.anio - Año opcional
 * @returns {Promise} Reporte de ganancias con totalizadores y viajes
 */
export const getReporteGanancias = async (params = {}) => {
  console.log('🌐 [SERVICE] getReporteGanancias llamado con params:', params);
  const result = await getGeneric("/reportes/ganancias", params);
  console.log('📡 [SERVICE] getReporteGanancias resultado:', result);
  return result;
};

/**
 * Obtiene el reporte de gastos agrupados por tipo
 * @param {Object} params - Parámetros de filtro
 * @param {number} params.mes - Mes (1-12) opcional
 * @param {number} params.anio - Año opcional
 * @returns {Promise} Reporte de gastos con totalizadores y detalle
 */
export const getReporteGastos = async (params = {}) => {
  console.log('🌐 [SERVICE] getReporteGastos llamado con params:', params);
  const result = await getGeneric("/reportes/gastos", params);
  console.log('📡 [SERVICE] getReporteGastos resultado:', result);
  return result;
};

/**
 * Obtiene el reporte de viáticos por chofer
 * @param {Object} params - Parámetros de filtro
 * @param {number} params.mes - Mes (1-12) opcional
 * @param {number} params.anio - Año opcional
 * @returns {Promise} Reporte de viáticos agrupados por chofer
 */
export const getReporteViaticos = async (params = {}) => {
  console.log('🌐 [SERVICE] getReporteViaticos llamado con params:', params);
  const result = await getGeneric("/reportes/viaticos", params);
  console.log('📡 [SERVICE] getReporteViaticos resultado:', result);
  return result;
};
