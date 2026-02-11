export const mapDashboard = (backendData) => {
  // Construir alertas dinámicamente, solo mostrando mantenimientos
  const quickActionsArray = [];

  // Mantenimientos
  const enCurso = parseInt(backendData.mantenimientosInfo.enCurso) || 0;
  const pendientes = parseInt(backendData.mantenimientosInfo.pendientes) || 0;
  const finalizados = parseInt(backendData.mantenimientosInfo.finalizados) || 0;
  const totalMant = parseInt(backendData.mantenimientosInfo.total) || 0;

  if (enCurso > 0) {
    quickActionsArray.push({
      id: `mant-en-curso`,
      title: `${enCurso} mantenimiento${enCurso !== 1 ? 's' : ''} en curso`,
      description: "En desarrollo",
      color: "blue",
    });
  }

  if (pendientes > 0) {
    quickActionsArray.push({
      id: `mant-pendientes`,
      title: `${pendientes} mantenimiento${pendientes !== 1 ? 's' : ''} pendiente${pendientes !== 1 ? 's' : ''}`,
      description: "Sin iniciar",
      color: "yellow",
    });
  }

  if (finalizados > 0) {
    quickActionsArray.push({
      id: `mant-finalizados`,
      title: `${finalizados} mantenimiento${finalizados !== 1 ? 's' : ''} finalizado${finalizados !== 1 ? 's' : ''}`,
      description: "Completados",
      color: "green",
    });
  }

  if (totalMant > 0) {
    quickActionsArray.push({
      id: `mant-total`,
      title: `Total: ${totalMant} mantenimiento${totalMant !== 1 ? 's' : ''}`,
      description: "Total registrados",
      color: "gray",
    });
  }

  // Construir alertas de choferes y vehículos sin repetir
  const alertasArray = [];
  const choferesVistos = new Set();
  const vehiculosVistos = new Set();

  // Procesar choferes con licencias vencidas
  const choferesVencidas = backendData.alertas.choferes.vencidasPertenecenA || [];
  const choferesPorVencer = backendData.alertas.choferes.porVencerPertenecenA || [];

  // Combinar ambos arrays de choferes
  const todosChoferes = [...choferesVencidas, ...choferesPorVencer];

  todosChoferes.forEach((chofer) => {
    if (!choferesVistos.has(chofer.idChofer)) {
      choferesVistos.add(chofer.idChofer);
      
      const vencidas = parseInt(chofer.licenciasVencidas) || 0;
      const porVencer = parseInt(chofer.licenciasPorVencer) || 0;
      
      let status = "";
      let color = "blue";
      
      if (vencidas > 0 && porVencer > 0) {
        status = `${vencidas} vencida(s), ${porVencer} por vencer`;
        color = "red";
      } else if (vencidas > 0) {
        status = `${vencidas} vencida(s)`;
        color = "red";
      } else if (porVencer > 0) {
        status = `${porVencer} por vencer`;
        color = "yellow";
      }

      alertasArray.push({
        id: `chofer-${chofer.idChofer}`,
        tipo: "chofer",
        title: `${chofer.nombre} ${chofer.apellido}`,
        description: status,
        color: color,
      });
    }
  });

  // Procesar vehículos con documentación vencida o por vencer
  const vehiculosVencidos = backendData.alertas.vehiculos.vencidasPertenecenAl || [];
  const vehiculosPorVencer = backendData.alertas.vehiculos.porVencerPertenecenAl || [];

  // Combinar ambos arrays de vehículos
  const todosVehiculos = [...vehiculosVencidos, ...vehiculosPorVencer];

  todosVehiculos.forEach((vehiculo) => {
    if (!vehiculosVistos.has(vehiculo.idVehiculo)) {
      vehiculosVistos.add(vehiculo.idVehiculo);
      
      const vencidas = parseInt(vehiculo.documentacionVencida) || 0;
      const porVencer = parseInt(vehiculo.documentacionPorVencer) || 0;
      
      let status = "";
      let color = "blue";
      
      if (vencidas > 0 && porVencer > 0) {
        status = `${vencidas} vencida(s), ${porVencer} por vencer`;
        color = "red";
      } else if (vencidas > 0) {
        status = `${vencidas} vencida(s)`;
        color = "red";
      } else if (porVencer > 0) {
        status = `${porVencer} por vencer`;
        color = "yellow";
      }

      alertasArray.push({
        id: `vehiculo-${vehiculo.idVehiculo}`,
        tipo: "vehiculo",
        title: `Vehículo ${vehiculo.patente}`,
        description: status,
        color: color,
      });
    }
  });

  // Datos de mantenimientos para la card
  const mantenimientosData = {
    enCurso: parseInt(backendData.mantenimientosInfo.enCurso) || 0,
    pendientes: parseInt(backendData.mantenimientosInfo.pendientes) || 0,
    finalizados: parseInt(backendData.mantenimientosInfo.finalizados) || 0,
    total: parseInt(backendData.mantenimientosInfo.total) || 0,
  };

  // Obtener choferes disponibles, con fallback si no existe
  const driversAvailable = backendData.totalChoferes.disponibles ?? backendData.totalChoferes.habilitados ?? 0;

  return {
    clients: backendData.totalClientes,

    vehiclesAvailable: backendData.totalVehiculos.habilitados,
    totalVehicles: backendData.totalVehiculos.total,

    driversAvailable: driversAvailable,
    totalDrivers: backendData.totalChoferes.total,

    tripsInProgress: backendData.viajesEnCurso,

    alertas: alertasArray.length > 0 ? alertasArray : [
      {
        id: 0,
        tipo: "info",
        title: "Sin alertas pendientes",
        description: "Todo en orden",
        color: "blue",
      },
    ],

    mantenimientos: mantenimientosData,

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

