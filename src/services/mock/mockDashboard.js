export const mockDashboard = {
  clients: 24,
  vehiclesAvailable: 8,
  totalVehicles: 12,
  drivers: 15,
  tripsInProgress: 3,
  recentActivity: [
    {
      id: 1,
      title: "Viaje a Ciudad B completado",
      time: "Hace 2 horas",
      color: "green",
    },
    {
      id: 2,
      title: "Mantenimiento programado para ABC-123",
      time: "Hace 4 horas",
      color: "yellow",
    },
    {
      id: 3,
      title: "Nuevo cliente registrado: María García",
      time: "Hace 6 horas",
      color: "blue",
    },
  ],
  quickActions: [
    {
      id: 1,
      title: "2 vehículos requieren mantenimiento",
      description: "Revisar programación",
      color: "red",
    },
    {
      id: 2,
      title: "3 licencias vencen este mes",
      description: "Renovar documentos",
      color: "yellow",
    },
    {
      id: 3,
      title: "Generar reporte mensual",
      description: "Datos disponibles",
      color: "blue",
    },
  ],
};
