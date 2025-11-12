import { ReportSummary } from "./ReportSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar } from "lucide-react";

export function EarningsTab({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportSummary title="Ingresos Totales" value={`$${data.totalIncome}`} color="text-green-600" icon={<TrendingUp />} />
        <ReportSummary title="Gastos Totales" value={`$${data.totalExpenses}`} color="text-red-600" icon={<TrendingDown />} />
        <ReportSummary title="Ganancia Total" value={`$${data.totalProfit}`} color="text-green-600" icon={<DollarSign />} />
        <ReportSummary title="Margen" value={`${data.margin}%`} color="text-green-600" icon={<PieChart />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporte Mensual - Noviembre 2025</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">${data.monthly.income}</p>
            <p className="text-sm text-muted-foreground">Ingresos del Mes</p>
            <span className="text-xs bg-green-100 px-2 py-1 rounded-md">{data.monthly.trips} viajes</span>
          </div>
          <div className="bg-red-50 rounded-md p-4 text-center">
            <p className="text-2xl font-bold text-red-600">${data.monthly.expenses}</p>
            <p className="text-sm text-muted-foreground">Gastos del Mes</p>
          </div>
          <div className="bg-blue-50 rounded-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">${data.monthly.profit}</p>
            <p className="text-sm text-muted-foreground">Ganancia del Mes</p>
            <span className="text-xs bg-green-100 px-2 py-1 rounded-md">{data.monthly.margin}% margen</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Viajes Completados - Noviembre 2025</CardTitle>
        </CardHeader>
        <CardContent>
          {data.trips.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">
              No hay viajes completados en este período
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Fecha</th>
                  <th>Ruta</th>
                  <th>Precio</th>
                  <th>Gastos</th>
                  <th>Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {data.trips.map((trip, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{trip.date}</td>
                    <td>{trip.route}</td>
                    <td>${trip.price}</td>
                    <td>${trip.expenses}</td>
                    <td>${trip.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}