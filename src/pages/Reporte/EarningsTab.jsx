import { ReportSummary } from "./ReportSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function EarningsTab({ data, filtros }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  const { totalizadores, viajes } = data;
  const mesNombre = filtros?.mes ? MESES[filtros.mes - 1] : "Todos los meses";
  const anio = filtros?.anio || new Date().getFullYear();

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportSummary
          title="Ingresos Totales"
          value={`$${totalizadores?.ingresos?.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
          color="text-green-600"
          icon={<TrendingUp />}
        />
        <ReportSummary
          title="Gastos Totales"
          value={`$${totalizadores?.gastos?.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
          color="text-red-600"
          icon={<TrendingDown />}
        />
        <ReportSummary
          title="Ganancia Total"
          value={`$${totalizadores?.ganancia?.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
          color={totalizadores?.ganancia >= 0 ? "text-green-600" : "text-red-600"}
          icon={<DollarSign />}
        />
        <ReportSummary
          title="Margen"
          value={`${totalizadores?.margenGanancia?.toFixed(2) || "0.00"}%`}
          color={totalizadores?.margenGanancia >= 0 ? "text-green-600" : "text-red-600"}
          icon={<PieChart />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Reporte {filtros?.mes ? "Mensual" : "Anual"} - {mesNombre} {anio}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              ${totalizadores?.ingresos?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">
              Ingresos {filtros?.mes ? "del Mes" : "del Año"}
            </p>
            <span className="text-xs bg-green-100 px-2 py-1 rounded-md">
              {viajes?.length || 0} viajes
            </span>
          </div>
          <div className="bg-red-50 rounded-md p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              ${totalizadores?.gastos?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">
              Gastos {filtros?.mes ? "del Mes" : "del Año"}
            </p>
          </div>
          <div className="bg-blue-50 rounded-md p-4 text-center">
            <p className={`text-2xl font-bold ${totalizadores?.ganancia >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalizadores?.ganancia?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">
              Ganancia {filtros?.mes ? "del Mes" : "del Año"}
            </p>
            <span className="text-xs bg-green-100 px-2 py-1 rounded-md">
              {totalizadores?.margenGanancia?.toFixed(2) || "0.00"}% margen
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Viajes Completados - {mesNombre} {anio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!viajes || viajes.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No hay viajes completados en este período
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Fecha Inicio</th>
                    <th className="py-2 px-2">Fecha Fin</th>
                    <th className="py-2 px-2">Ruta</th>
                    <th className="py-2 px-2 text-right">Precio</th>
                    <th className="py-2 px-2 text-right">Gastos</th>
                    <th className="py-2 px-2 text-right">Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {viajes.map((viaje) => (
                    <tr key={viaje.idViaje} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">{formatFecha(viaje.fechaInicio)}</td>
                      <td className="py-2 px-2">{formatFecha(viaje.fechaFin)}</td>
                      <td className="py-2 px-2">
                        {viaje.localidadOrigen} → {viaje.localidadDestino}
                      </td>
                      <td className="py-2 px-2 text-right text-green-600 font-medium">
                        ${viaje.precio?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
                      </td>
                      <td className="py-2 px-2 text-right text-red-600">
                        ${viaje.gastos?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
                      </td>
                      <td className={`py-2 px-2 text-right font-medium ${viaje.ganancia >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${viaje.ganancia?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}