import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Fuel, Utensils, CreditCard } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function ExpensesTab({ data, filtros }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  const { totalizadores, gastos } = data;
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

  // Badge de tipo de gasto con color
  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case "Combustible":
        return "bg-orange-100 text-orange-700";
      case "Viatico":
        return "bg-blue-100 text-blue-700";
      case "Peaje":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Gastos por Tipo - {mesNombre} {anio}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-md border p-4 text-center bg-orange-50">
            <div className="flex justify-center mb-2">
              <Fuel className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              ${totalizadores?.combustible?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">Combustible</p>
          </div>

          <div className="rounded-md border p-4 text-center bg-blue-50">
            <div className="flex justify-center mb-2">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ${totalizadores?.viatico?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">Viático</p>
          </div>

          <div className="rounded-md border p-4 text-center bg-purple-50">
            <div className="flex justify-center mb-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ${totalizadores?.peaje?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">Peaje</p>
          </div>

          <div className="rounded-md border p-4 text-center bg-slate-50">
            <p className="text-2xl font-bold text-slate-700">
              ${totalizadores?.total?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">Total Gastos</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          {!gastos || gastos.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No hay gastos registrados en este período
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Fecha</th>
                    <th className="py-2 px-2">Tipo</th>
                    <th className="py-2 px-2">Descripción</th>
                    <th className="py-2 px-2 text-right">Monto</th>
                    <th className="py-2 px-2">Viaje</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((gasto) => (
                    <tr key={gasto.idGasto} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">{formatFecha(gasto.fecha)}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(gasto.tipo)}`}>
                          {gasto.tipo}
                        </span>
                      </td>
                      <td className="py-2 px-2">{gasto.descripcion || "-"}</td>
                      <td className="py-2 px-2 text-right font-medium">
                        ${gasto.precio?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
                      </td>
                      <td className="py-2 px-2 text-sm text-muted-foreground">
                        {gasto.viaje ? `${gasto.viaje.localidadOrigen} → ${gasto.viaje.localidadDestino}` : "-"}
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