import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AllowancesTab({ data }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Viáticos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Viáticos</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Viaje</th>
              </tr>
            </thead>
            <tbody>
              {data.details.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{item.date}</td>
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