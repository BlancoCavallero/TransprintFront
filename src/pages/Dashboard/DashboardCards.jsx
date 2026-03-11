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
    { title: "Clientes Activos", value: clients, subtitle: "Total de clientes registrados", icon: <Users className="w-6 h-6 text-blue-600" />, iconBg: "bg-blue-100" },
    { title: "Vehículos Disponibles", value: `${vehiclesAvailable}/${totalVehicles}`, subtitle: "Vehículos listos para viajes", icon: <Car className="w-6 h-6 text-green-600" />, iconBg: "bg-green-100" },
    { title: "Choferes Disponibles", value: `${driversAvailable}/${totalDrivers}`, subtitle: "Choferes listos para viajes", icon: <UserCheck className="w-6 h-6 text-purple-600" />, iconBg: "bg-purple-100" },
    { title: "Viajes en Curso", value: tripsInProgress, subtitle: "Viajes actualmente en progreso", icon: <Route className="w-6 h-6 text-orange-600" />, iconBg: "bg-orange-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {cards.map((card) => (
        <Card key={card.title}>
          {/* Al usar p-0 en la definición del componente, los 20px del padre ahora sí respiran */}
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}>
              {card.icon}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}