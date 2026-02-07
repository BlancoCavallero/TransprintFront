export const mapDashboard = (backendData) => {
  // Construir alertas dinámicamente, solo mostrando si son > 0
  const quickActionsArray = [];

  // Alertas de choferes
  if (backendData.alertas.choferes.licenciasVencidas > 0) {
    quickActionsArray.push({
      id: `chofer-lic-vencidas`,
      title: `${backendData.alertas.choferes.licenciasVencidas} licencias vencidas`,
      description: "Renovar licencias",
      color: "red",
    });
  }

  if (backendData.alertas.choferes.licenciasPorVencer > 0) {
    quickActionsArray.push({
      id: `chofer-lic-por-vencer`,
      title: `${backendData.alertas.choferes.licenciasPorVencer} licencias por vencer`,
      description: "Proximamente serán renovadas",
      color: "yellow",
    });
  }

  // Alertas de vehículos
  if (backendData.alertas.vehiculos.documentacionVencida > 0) {
    quickActionsArray.push({
      id: `vehiculo-doc-vencida`,
      title: `${backendData.alertas.vehiculos.documentacionVencida} vehículos con documentación vencida`,
      description: "Actualizar documentación",
      color: "red",
    });
  }

  if (backendData.alertas.vehiculos.documentacionPorVencer > 0) {
    quickActionsArray.push({
      id: `vehiculo-doc-por-vencer`,
      title: `${backendData.alertas.vehiculos.documentacionPorVencer} vehículos con documentación por vencer`,
      description: "Revisar documentación",
      color: "yellow",
    });
  }

  // Construir actividad reciente de mantenimientos
  const recentActivityArray = [];

  if (backendData.mantenimientosInfo.finalizados > 0) {
    recentActivityArray.push({
      id: 1,
      title: `Mantenimientos finalizados: ${backendData.mantenimientosInfo.finalizados}`,
      time: "Actualizado recientemente",
      color: "green",
    });
  }

  if (backendData.mantenimientosInfo.enProgreso > 0) {
    recentActivityArray.push({
      id: 2,
      title: `Mantenimientos en progreso: ${backendData.mantenimientosInfo.enProgreso}`,
      time: "En desarrollo",
      color: "blue",
    });
  }

  if (backendData.mantenimientosInfo.pendientes > 0) {
    recentActivityArray.push({
      id: 3,
      title: `Mantenimientos pendientes: ${backendData.mantenimientosInfo.pendientes}`,
      time: "Sin iniciar",
      color: "yellow",
    });
  }

  if (backendData.mantenimientosInfo.cancelados > 0) {
    recentActivityArray.push({
      id: 4,
      title: `Mantenimientos cancelados: ${backendData.mantenimientosInfo.cancelados}`,
      time: "Cancelado",
      color: "red",
    });
  }

  // Obtener choferes disponibles, con fallback si no existe
  const driversAvailable = backendData.totalChoferes.disponibles ?? backendData.totalChoferes.habilitados ?? 0;

  return {
    clients: backendData.totalClientes,

    vehiclesAvailable: backendData.totalVehiculos.habilitados,
    totalVehicles: backendData.totalVehiculos.total,

    driversAvailable: driversAvailable,
    totalDrivers: backendData.totalChoferes.total,

    tripsInProgress: backendData.viajesEnCurso,

    recentActivity: recentActivityArray.length > 0 ? recentActivityArray : [
      {
        id: 0,
        title: "Sin mantenimientos registrados",
        time: "-",
        color: "blue",
      },
    ],

    quickActions: quickActionsArray.length > 0 ? quickActionsArray : [
      {
        id: 0,
        title: "Sin alertas pendientes",
        description: "Todo en orden",
        color: "blue",
      },
    ],
  };
};

