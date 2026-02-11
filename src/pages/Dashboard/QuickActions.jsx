import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function QuickActions({ actions }) {
  const colorClasses = {
    red: "bg-red-50 border border-red-300 text-red-800",
    yellow: "bg-yellow-50 border border-yellow-300 text-yellow-800",
    blue: "bg-blue-50 border border-blue-300 text-blue-800",
    green: "bg-green-50 border border-green-300 text-green-800",
    gray: "bg-gray-50 border border-gray-400 text-gray-900 font-bold",
  };

  return (
    <Card className="flex-1">
      {/* Forzamos el padding directamente con style para que nada lo sobreescriba */}
      <CardHeader style={{ padding: '20px', paddingBottom: '10px' }} className="border-none shadow-none">
        <div className="flex justify-between items-baseline w-full">
          <CardTitle className="text-base font-bold">
            Mantenimientos
          </CardTitle>
          <span className="text-xs text-muted-foreground italic">
           Listado de mantenimientos
          </span>
        </div>
      </CardHeader>

      <CardContent style={{ padding: '20px', paddingTop: '0px' }}>
        <div className="flex flex-col gap-4">
          {actions.map((a) => (
            <div
              key={a.id}
              style={{ padding: '20px' }} // TUS 20PX DE PADDING AQUÍ
              className={`
                rounded-lg
                min-h-[72px]
                flex
                flex-col
                justify-center
                ${colorClasses[a.color]}
              `}
            >
              <p className="text-sm font-bold leading-tight">
                {a.title}
              </p>
              <p className="text-xs mt-1 opacity-90">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}