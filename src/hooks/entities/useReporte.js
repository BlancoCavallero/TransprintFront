import { useState, useCallback } from "react";
import {
  getReporteGanancias,
  getReporteGastos,
  getReporteViaticos,
} from "../../services/reporteService";

/**
 * Hook para manejar los reportes financieros
 * Proporciona funciones para obtener reportes de ganancias, gastos y viáticos
 */
export const useReporte = () => {
  const [reporteGanancias, setReporteGanancias] = useState(null);
  const [reporteGastos, setReporteGastos] = useState(null);
  const [reporteViaticos, setReporteViaticos] = useState(null);

  const [loadingGanancias, setLoadingGanancias] = useState(false);
  const [loadingGastos, setLoadingGastos] = useState(false);
  const [loadingViaticos, setLoadingViaticos] = useState(false);

  const [errorGanancias, setErrorGanancias] = useState(null);
  const [errorGastos, setErrorGastos] = useState(null);
  const [errorViaticos, setErrorViaticos] = useState(null);

  /**
   * Obtiene el reporte de ganancias
   * @param {Object} filtros - Filtros para el reporte
   * @param {number} filtros.mes - Mes (1-12) opcional
   * @param {number} filtros.anio - Año opcional
   */
  const fetchReporteGanancias = useCallback(async (filtros = {}) => {
    console.log('\n🔵 [FRONTEND-HOOK] fetchReporteGanancias - INICIO');
    console.log('📥 [FRONTEND-HOOK] Filtros:', filtros);
    
    setLoadingGanancias(true);
    setErrorGanancias(null);

    try {
      console.log('🌐 [FRONTEND-HOOK] Llamando a getReporteGanancias...');
      const response = await getReporteGanancias(filtros);
      
      console.log('📦 [FRONTEND-HOOK] Response recibida:', response);

      // Extraer data del response
      const data = response?.data || response;
      
      console.log('✅ [FRONTEND-HOOK] Data extraída:', data);
      console.log('📊 [FRONTEND-HOOK] Viajes:', data?.viajes?.length);
      console.log('💰 [FRONTEND-HOOK] Totalizadores:', data?.totalizadores);

      setReporteGanancias(data);
      console.log('🔵 [FRONTEND-HOOK] fetchReporteGanancias - FIN\n');
      return { success: true, data };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error al cargar reporte de ganancias";

      console.error('❌ [FRONTEND-HOOK] ERROR en fetchReporteGanancias:', err);
      console.error('❌ [FRONTEND-HOOK] Error message:', errorMsg);
      console.error('❌ [FRONTEND-HOOK] Full error:', err?.response);
      
      setErrorGanancias(errorMsg);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingGanancias(false);
    }
  }, []);

  /**
   * Obtiene el reporte de gastos
   * @param {Object} filtros - Filtros para el reporte
   * @param {number} filtros.mes - Mes (1-12) opcional
   * @param {number} filtros.anio - Año opcional
   */
  const fetchReporteGastos = useCallback(async (filtros = {}) => {
    console.log('\n🟢 [FRONTEND-HOOK] fetchReporteGastos - INICIO');
    console.log('📥 [FRONTEND-HOOK] Filtros:', filtros);
    
    setLoadingGastos(true);
    setErrorGastos(null);

    try {
      const response = await getReporteGastos(filtros);
      console.log('📦 [FRONTEND-HOOK] Response gastos:', response);

      // Extraer data del response
      const data = response?.data || response;

      console.log('✅ [FRONTEND-HOOK] Data gastos extraída:', data);
      console.log('📊 [FRONTEND-HOOK] Gastos count:', data?.gastos?.length);
      
      setReporteGastos(data);
      console.log('🟢 [FRONTEND-HOOK] fetchReporteGastos - FIN\n');
      return { success: true, data };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error al cargar reporte de gastos";

      console.error('❌ [FRONTEND-HOOK] ERROR en fetchReporteGastos:', err);
      console.error('❌ [FRONTEND-HOOK] Error message:', errorMsg);
      
      setErrorGastos(errorMsg);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingGastos(false);
    }
  }, []);

  /**
   * Obtiene el reporte de viáticos
   * @param {Object} filtros - Filtros para el reporte
   * @param {number} filtros.mes - Mes (1-12) opcional
   * @param {number} filtros.anio - Año opcional
   */
  const fetchReporteViaticos = useCallback(async (filtros = {}) => {
    console.log('\n🟡 [FRONTEND-HOOK] fetchReporteViaticos - INICIO');
    console.log('📥 [FRONTEND-HOOK] Filtros:', filtros);
    
    setLoadingViaticos(true);
    setErrorViaticos(null);

    try {
      const response = await getReporteViaticos(filtros);
      console.log('📦 [FRONTEND-HOOK] Response viáticos:', response);

      // Extraer data del response
      const data = response?.data || response;

      console.log('✅ [FRONTEND-HOOK] Data viáticos extraída:', data);
      console.log('👥 [FRONTEND-HOOK] Choferes count:', data?.choferes?.length);
      
      setReporteViaticos(data);
      console.log('🟡 [FRONTEND-HOOK] fetchReporteViaticos - FIN\n');
      return { success: true, data };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error al cargar reporte de viáticos";

      console.error('❌ [FRONTEND-HOOK] ERROR en fetchReporteViaticos:', err);
      console.error('❌ [FRONTEND-HOOK] Error message:', errorMsg);
      
      setErrorViaticos(errorMsg);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingViaticos(false);
    }
  }, []);

  return {
    // Reportes
    reporteGanancias,
    reporteGastos,
    reporteViaticos,

    // Estados de carga
    loadingGanancias,
    loadingGastos,
    loadingViaticos,

    // Errores
    errorGanancias,
    errorGastos,
    errorViaticos,

    // Funciones
    fetchReporteGanancias,
    fetchReporteGastos,
    fetchReporteViaticos,
  };
};
