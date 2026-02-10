import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentActivity({ activities }) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Mantenimientos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          
        </p>
      </CardHeader>

      <CardContent className="space-y-2">
        {activities.map((a) => (
          <div
            key={a.id}
            className="
              flex items-start gap-3
              rounded-md
              bg-muted/40
              p-3
              transition
              hover:bg-muted/60
            "
          >
            {/* Indicador */}
            <span
              className={`
                mt-1
                h-2.5 w-2.5
                rounded-full
                flex-shrink-0
                ${
                  a.color === "green"
                    ? "bg-green-500"
                    : a.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }
              `}
            />

            {/* Texto */}
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-tight">
                {a.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {a.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
