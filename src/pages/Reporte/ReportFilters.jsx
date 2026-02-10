import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export function ReportFilters({ onApplyFilters, initialFiltros }) {
  const [selectedMes, setSelectedMes] = useState(
    initialFiltros?.mes ? initialFiltros.mes.toString() : "todos"
  );
  const [selectedAnio, setSelectedAnio] = useState(
    initialFiltros?.anio ? initialFiltros.anio.toString() : new Date().getFullYear().toString()
  );

  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleApplyFilters = () => {
    const filtros = {
      mes: selectedMes === "todos" ? null : parseInt(selectedMes),
      anio: parseInt(selectedAnio),
    };
    onApplyFilters(filtros);
  };

  const handleClearFilters = () => {
    setSelectedMes("todos");
    setSelectedAnio(currentYear.toString());
    onApplyFilters({ mes: null, anio: currentYear });
  };

  // Estilo base para los triggers de los Select
  const selectTriggerStyle = {
    height: '40px',
    border: '1px solid #cbd5e1',
    display: 'flex',
    justifyContent: 'center', // Centra el contenido horizontalmente
    textAlign: 'center'
  };

  return (
    <div style={{ padding: '0 20px' }} className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-gray-600">Filtros:</span>
          </div>
          
          <Select value={selectedMes} onValueChange={setSelectedMes}>
            <SelectTrigger 
              className="w-[160px]" 
              style={selectTriggerStyle}
            >
              {/* SelectValue hereda el centrado del padre */}
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los meses</SelectItem>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAnio} onValueChange={setSelectedAnio}>
            <SelectTrigger 
              className="w-[110px]" 
              style={selectTriggerStyle}
            >
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleApplyFilters} 
            size="sm"
            style={{ height: '40px', padding: '0 20px', backgroundColor: '#592673', color: 'white', border: 'none' }}
          >
            Aplicar
          </Button>

          <Button 
            onClick={handleClearFilters} 
            variant="outline" 
            size="sm"
            style={{ height: '40px', padding: '0 15px', border: '1px solid #cbd5e1' }}
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}