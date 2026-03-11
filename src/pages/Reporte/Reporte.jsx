import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Download, Loader2 } from "lucide-react";
import { ReportFilters } from "./ReportFilters";
import { EarningsTab } from "./EarningsTab";
import { ExpensesTab } from "./ExpensesTab";
import { AllowancesTab } from "./AllowancesTab";
import { useReporte } from "../../hooks/entities/useReporte";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportReporteExcel } from "./exportReporteExcel";

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

  useEffect(() => {    
    fetchReporteGanancias(filtros);
    fetchReporteGastos(filtros);
    fetchReporteViaticos(filtros);
  }, [filtros, fetchReporteGanancias, fetchReporteGastos, fetchReporteViaticos]);

  const handleApplyFilters = (newFiltros) => {
    setFiltros(newFiltros);
  };
  
  const isLoadingAny = loadingGanancias || loadingGastos || loadingViaticos;

  const handleExport = async () => {
    await exportReporteExcel({
      reporteGanancias,
      reporteGastos,
      reporteViaticos,
      filtros,
    });
  };

  return (
    <div style={{ padding: '20px 30px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
            <p className="text-muted-foreground">Analiza el rendimiento y finanzas del sistema</p>
          </div>
        </div>
        
        <Button 
          onClick={handleExport} 
          disabled={isLoadingAny}
          style={{ 
            backgroundColor: 'oklch(62.7% 0.194 149.214)', 
            color: 'white', 
            height: '40px', 
            padding: '0 20px', 
            border: 'none',
            transition: 'opacity 0.2s'
          }}
          className="hover:opacity-90"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      <div className="w-full">
        <ReportFilters onApplyFilters={handleApplyFilters} initialFiltros={filtros} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} style={{ marginTop: '10px' }}>
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="earnings">Ganancias</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="allowances">Viáticos</TabsTrigger>
        </TabsList>

        <div style={{ marginTop: '20px' }}>
          <TabsContent value="earnings">
            {loadingGanancias ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : errorViaticos ? (
              <Alert variant="destructive">
                <AlertDescription>{errorViaticos}</AlertDescription>
              </Alert>
            ) : (
              <AllowancesTab data={reporteViaticos} filtros={filtros} />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}