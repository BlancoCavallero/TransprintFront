export const mapDashboard = (backendData) => {
  return {
    clients: backendData.totalClientes,

    vehiclesAvailable: backendData.totalVehiculos.habilitados,
    totalVehicles: backendData.totalVehiculos.total,

    drivers: backendData.totalChoferes.total,

    tripsInProgress: backendData.viajesEnCurso,

    recentActivity: [
      {
        id: 1,
        title: `Mantenimientos finalizados: ${backendData.mantenimientosInfo.finalizados}`,
        time: "Actualizado recientemente",
        color: "green",
      },
    ],

    quickActions: [
      {
        id: 1,
        title: `${backendData.alertas.vehiculos.documentacionPorVencer} vehículos con documentación por vencer`,
        description: "Revisar documentación",
        color: "yellow",
      },
      {
        id: 2,
        title: `${backendData.alertas.choferes.licenciasVencidas} licencias vencidas`,
        description: "Renovar licencias",
        color: "red",
      },
    ],
  };
};

