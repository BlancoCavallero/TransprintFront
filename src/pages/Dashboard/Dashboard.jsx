import { useState, useEffect } from "react";
import { DashboardCards } from "./DashboardCards";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { getDashboard } from "../../services/dashboardService";
import { mapDashboard } from "../../utils/dashboardMapper";

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setData(mapDashboard(response.data));
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-8">Cargando dashboard...</p>;
  if (!data) return <p className="p-8">Error al cargar dashboard</p>;

  return (
    /* He añadido: flex flex-col gap-[20px] p-[10px] */
    /* Nota: He mantenido px-10 y py-8 pero p-[10px] los sobrescribirá si no hay espacio */
    <div className="w-full px-10 py-8 space-y-10 flex flex-col gap-[20px] p-[10px]">
      
      {/* Header - HE QUITADO EL pb-48 que causaba el vacío enorme en tu imagen */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Bienvenido
        </p>
      </div>

      {/* Cards principales */}
      <DashboardCards
        clients={data.clients}
        vehiclesAvailable={data.vehiclesAvailable}
        totalVehicles={data.totalVehicles}
        driversAvailable={data.driversAvailable}
        totalDrivers={data.totalDrivers}
        tripsInProgress={data.tripsInProgress}
      />

      {/* Sección inferior */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <QuickActions actions={data.quickActions} />
        <RecentActivity alertas={data.alertas} />
      </div>
    </div>
  );
}