import { DashboardCards } from "./DashboardCards";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { mockDashboard as mockDashboardData } from "../../services/mock/mockDashboard"; 

export function Dashboard() {
  const data = mockDashboardData;

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
        drivers={data.drivers}
        tripsInProgress={data.tripsInProgress}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={data.recentActivity} />
        <QuickActions actions={data.quickActions} />
      </div>
    </div>
  );
}
