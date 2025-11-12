import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ExpensesTab({ data }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md border p-4 text-center">
            <p className="text-2xl font-bold">${data.fuel}</p>
            <p className="text-sm text-muted-foreground">Combustible</p>
          </div>
          <div className="rounded-md border p-4 text-center">
            <p className="text-2xl font-bold">${data.allowance}</p>
            <p className="text-sm text-muted-foreground">Viático</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Fecha</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Viaje</th>
              </tr>
            </thead>
            <tbody>
              {data.details.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{item.date}</td>
                  <td>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {item.type}
                    </span>
                  </td>
                  <td>{item.description}</td>
                  <td>${item.amount}</td>
                  <td>{item.trip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}