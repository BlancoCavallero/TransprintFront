import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, DollarSign, MapPin } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function AllowancesTab({ data, filtros }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  const { totalizadores, choferes } = data;
  const mesNombre = filtros?.mes ? MESES[filtros.mes - 1] : "Todos los meses";
  const anio = filtros?.anio || new Date().getFullYear();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Resumen de Viáticos - {mesNombre} {anio}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md border p-4 text-center bg-blue-50">
            <div className="flex justify-center mb-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ${totalizadores?.totalViaticos?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total en Viáticos</p>
          </div>

          <div className="rounded-md border p-4 text-center bg-green-50">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {totalizadores?.cantidadChoferes || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Choferes con Viáticos</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Viáticos por Chofer</CardTitle>
        </CardHeader>
        <CardContent>
          {!choferes || choferes.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No hay viáticos registrados en este período
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Chofer</th>
                    <th className="py-2 px-2 text-center">Cantidad de Viajes</th>
                    <th className="py-2 px-2 text-right">Total Viáticos</th>
                    <th className="py-2 px-2 text-right">Promedio por Viaje</th>
                  </tr>
                </thead>
                <tbody>
                  {choferes.map((chofer) => {
                    const promedio = chofer.cantidadViajes > 0
                      ? chofer.totalViaticos / chofer.cantidadViajes
                      : 0;

                    return (
                      <tr key={chofer.idChofer} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-semibold text-blue-600">
                                {chofer.nombre?.charAt(0)}{chofer.apellido?.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{chofer.nombreCompleto}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            {chofer.cantidadViajes} viaje{chofer.cantidadViajes !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-blue-600">
                          ${chofer.totalViaticos?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
                        </td>
                        <td className="py-3 px-2 text-right text-muted-foreground">
                          ${promedio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td className="py-3 px-2">Total General</td>
                    <td className="py-3 px-2 text-center">
                      {choferes.reduce((sum, c) => sum + c.cantidadViajes, 0)} viajes
                    </td>
                    <td className="py-3 px-2 text-right text-blue-600">
                      ${totalizadores?.totalViaticos?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) || "0.00"}
                    </td>
                    <td className="py-3 px-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}