import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserX, TruckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentActivity({ alertas }) {
  const navigate = useNavigate();

  const handleClick = (tipo) => {
    if (tipo === "chofer") {
      navigate("/chofer");
    } else if (tipo === "vehiculo") {
      navigate("/vehiculo");
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Alertas de Documentación
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choferes y vehículos con documentación vencida o por vencer
        </p>
      </CardHeader>

      <CardContent className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: "0.4rem" }}>
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            onClick={() => handleClick(alerta.tipo)}
            className="
              flex items-center gap-3
              cursor-pointer
              rounded-md
              bg-muted/40
              p-3
              transition
              hover:bg-muted/60
            "
          >
            {/* Icono según tipo */}
            <div className="mt-0.5">
              {alerta.tipo === "chofer" ? (
                <UserX className="h-5 w-5 text-muted-foreground" />
              ) : alerta.tipo === "vehiculo" ? (
                <TruckIcon className="h-5 w-5 text-muted-foreground" />
              ) : null}
            </div>

            {/* Indicador de color */}
            <span
              className={`
                mt-1
                h-2.5 w-2.5
                rounded-full
                flex-shrink-0
                ${
                  alerta.color === "red"
                    ? "bg-red-500"
                    : alerta.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }
              `}
            />

            {/* Texto */}
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-tight">
                {alerta.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {alerta.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
