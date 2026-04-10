import { type SiloBudget, type StructureBudget } from "@/types";
import { PDFViewComponent } from "./pdf/PDFViewComponent";
import { Button, CustomLink } from "@/components";
import { DownloadBudgetButton } from "./DownloadBudgetButton";
import { BudgetEditForm } from "./pdf/structure/BudgetEditForm";
import { SiloBudgetEditForm } from "./pdf/silo/SiloBudgetEditForm";
import { useBudgetDetail } from "./hooks/useBudgetDetail";

export default function BudgetDetail() {
  const {
    budget,
    budgetType,
    viewDetail,
    isLoading,
    error,
    handleViewToggle,
    fetchBudget,
    pathName,
  } = useBudgetDetail();

  if (isLoading) return <p className="p-4">Cargando presupuesto...</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (!budget) return <p className="p-4">No se ha obtenido un Presupuesto</p>;

  const isStructure = pathName.includes("/structures/");
  const isSilo = pathName.includes("/silos/");

  return (
    <section>
      <div className="w-full lg:w-1/2">
        <Button
          color="danger"
          styles="mt-4 w-1/2"
          onClick={handleViewToggle}>
          {viewDetail ? "Cancelar" : "Editar Formulario"}
        </Button>
      </div>
      
      <div className="w-full flex flex-col lg:flex-row justify-between gap-4 mt-4">
        {viewDetail ? (
          <>
            {isStructure && (
              <BudgetEditForm
                budget={budget as StructureBudget}
                getBudget={fetchBudget}
                handleView={handleViewToggle}
                viewDetail={viewDetail}
              />
            )}
            {isSilo && (
              <SiloBudgetEditForm
                budget={budget as SiloBudget}
                getBudget={fetchBudget}
                handleView={handleViewToggle}
                viewDetail={viewDetail}
              />
            )}
          </>
        ) : (
          <PDFViewComponent
            budget={budget as StructureBudget | SiloBudget}
            type={budgetType}
          />
        )}
      </div>

      {!viewDetail && (
        <div className="mt-4 flex flex-col gap-2 lg:w-2/5">
          <DownloadBudgetButton customer={budget.customer} />
          <CustomLink
            href="/budgets/calculator"
            color="danger"
            styles="text-center font-bold">
            Nuevo Presupuesto
          </CustomLink>
        </div>
      )}
    </section>
  );
}
