import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart } from "lucide-react";
import { ReportFilters } from "./ReportFilters";
import { EarningsTab } from "./EarningsTab";
import { ExpensesTab } from "./ExpensesTab";
import { AllowancesTab } from "./AllowancesTab";
import { mockReportsData } from "../../services/mock/mockReports";

export function Reporte() {
  const { earnings, expenses, allowances } = mockReportsData;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Reportes</h1>
        </div>
      </div>

      <ReportFilters />

      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="earnings">Ganancias</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="allowances">Viáticos</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <EarningsTab data={earnings} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTab data={expenses} />
        </TabsContent>

        <TabsContent value="allowances">
          <AllowancesTab data={allowances} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
