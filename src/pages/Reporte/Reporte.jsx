import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Loader2 } from "lucide-react";
import { ReportFilters } from "./ReportFilters";
import { EarningsTab } from "./EarningsTab";
import { ExpensesTab } from "./ExpensesTab";
import { AllowancesTab } from "./AllowancesTab";
import { useReporte } from "../../hooks/entities/useReporte";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Reporte() {
  const currentYear = new Date().getFullYear();
  const [filtros, setFiltros] = useState({ mes: null, anio: currentYear });
  const [activeTab, setActiveTab] = useState("earnings");

  const {
    reporteGanancias,
    reporteGastos,
    reporteViaticos,
    loadingGanancias,
    loadingGastos,
    loadingViaticos,
    errorGanancias,
    errorGastos,
    errorViaticos,
    fetchReporteGanancias,
    fetchReporteGastos,
    fetchReporteViaticos,
  } = useReporte();

  // Cargar reporte inicial
  useEffect(() => {    
    fetchReporteGanancias(filtros);
    fetchReporteGastos(filtros);
    fetchReporteViaticos(filtros);
  }, [filtros, fetchReporteGanancias, fetchReporteGastos, fetchReporteViaticos]);

  const handleApplyFilters = (newFiltros) => {
    console.log('\n🔄 [COMPONENTE-REPORTE] Aplicando nuevos filtros:', newFiltros);
    setFiltros(newFiltros);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Reportes</h1>
        </div>
      </div>

      <ReportFilters onApplyFilters={handleApplyFilters} initialFiltros={filtros} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="earnings">Ganancias</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="allowances">Viáticos</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          {loadingGanancias ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : errorGanancias ? (
            <Alert variant="destructive">
              <AlertDescription>{errorGanancias}</AlertDescription>
            </Alert>
          ) : (
            <EarningsTab data={reporteGanancias} filtros={filtros} />
          )}
        </TabsContent>

        <TabsContent value="expenses">
          {loadingGastos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : errorGastos ? (
            <Alert variant="destructive">
              <AlertDescription>{errorGastos}</AlertDescription>
            </Alert>
          ) : (
            <ExpensesTab data={reporteGastos} filtros={filtros} />
          )}
        </TabsContent>

        <TabsContent value="allowances">
          {loadingViaticos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : errorViaticos ? (
            <Alert variant="destructive">
              <AlertDescription>{errorViaticos}</AlertDescription>
            </Alert>
          ) : (
            <AllowancesTab data={reporteViaticos} filtros={filtros} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
