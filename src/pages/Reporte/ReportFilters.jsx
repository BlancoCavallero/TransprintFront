import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Download } from "lucide-react";

export function ReportFilters() {
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  const years = [2023, 2024, 2025];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select defaultValue="Noviembre">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="2025">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Exportar
      </Button>
    </div>
  );
}