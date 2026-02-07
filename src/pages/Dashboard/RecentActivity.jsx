import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentActivity({ activities }) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Mantenimientos</CardTitle>
        <p className="text-sm text-muted-foreground">Últimas actividades del sistema</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center space-x-3">
            <span
              className={`w-3 h-3 rounded-full ${
                a.color === "green"
                  ? "bg-green-500"
                  : a.color === "yellow"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            />
            <div>
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}