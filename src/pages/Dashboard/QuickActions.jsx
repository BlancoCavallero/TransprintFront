import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function QuickActions({ actions }) {
  const colorClasses = {
    red: "bg-red-100 border border-red-300 text-red-800",
    yellow: "bg-yellow-100 border border-yellow-300 text-yellow-800",
    blue: "bg-blue-100 border border-blue-300 text-blue-800",
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <p className="text-sm text-muted-foreground">Tareas importantes pendientes</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((a) => (
          <div key={a.id} className={`rounded-md p-3 ${colorClasses[a.color]}`}>
            <p className="text-sm font-medium">{a.title}</p>
            <p className="text-xs">{a.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}