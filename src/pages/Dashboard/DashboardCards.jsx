import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Car, UserCheck, Route } from "lucide-react";

export function DashboardCards({
  clients,
  vehiclesAvailable,
  totalVehicles,
  driversAvailable,
  totalDrivers,
  tripsInProgress,
}) {
  const cards = [
    {
      title: "Clientes Activos",
      value: clients,
      subtitle: "Total de clientes registrados",
      icon: <Users className="w-5 h-5 text-muted-foreground" />,
    },
    {
      title: "Vehículos Disponibles",
      value: `${vehiclesAvailable}/${totalVehicles}`,
      subtitle: "Vehículos listos para viajes",
      icon: <Car className="w-5 h-5 text-muted-foreground" />,
    },
    {
      title: "Choferes Disponibles",
      value: `${driversAvailable}/${totalDrivers}`,
      subtitle: "Choferes listos para viajes",
      icon: <UserCheck className="w-5 h-5 text-muted-foreground" />,
    },
    {
      title: "Viajes en Curso",
      value: tripsInProgress,
      subtitle: "Viajes actualmente en progreso",
      icon: <Route className="w-5 h-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}