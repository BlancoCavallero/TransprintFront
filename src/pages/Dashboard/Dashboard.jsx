import { useState, useEffect } from "react";
import { DashboardCards } from "./DashboardCards";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { getDashboard } from "../../services/dashboardService";
import { mapDashboard } from "../../utils/dashboardMapper";
//import { mockDashboard as mockDashboardData } from "../../services/mock/mockDashboard"; 

export function Dashboard() {
  //const data = mockDashboardData;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setData(mapDashboard(response.data));
        console.log("Dashboard data:", response.data);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Cargando dashboard...</p>;
  if (!data) return <p>Error al cargar dashboard</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido, Administrador</p>
      </div>

      <DashboardCards
        clients={data.clients}
        vehiclesAvailable={data.vehiclesAvailable}
        totalVehicles={data.totalVehicles}
        driversAvailable={data.driversAvailable}
        totalDrivers={data.totalDrivers}
        tripsInProgress={data.tripsInProgress}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={data.recentActivity} />
        <QuickActions actions={data.quickActions} />
      </div>
    </div>
  );
}
