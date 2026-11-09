import { type SiloBudget, type StructureBudget } from "@/types";
import { PDFViewComponent } from "./pdf/PDFViewComponent";
import { Button, CustomLink } from "@/components";
import { DownloadBudgetButton } from "./DownloadBudgetButton";
import { BudgetEditForm } from "./pdf/structure/BudgetEditForm";
import { SiloBudgetEditForm } from "./pdf/silo/SiloBudgetEditForm";
import { useBudgetDetail } from "./hooks/useBudgetDetail";
import { useStructureRenders } from "./hooks/useStructureRenders";
import { StructureRendersSection } from "./StructureRendersSection";
import { useCompanyContext, usePreferencesContext } from "@/common/context";
import { companyHasRenders, downloadRemecoStructurePDF } from "@/helpers";
import { useEffect, useState } from "react";
import { getBudgetNumber } from "@/common/lib";

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
  const { company } = useCompanyContext();
  const { preferences } = usePreferencesContext();
  const [isDownloading, setIsDownloading] = useState(false);
  // Opciones del PDF (no se guardan con el presupuesto)
  const [roofSlopes, setRoofSlopes] = useState<1 | 2>(2);
  const [includeRenders, setIncludeRenders] = useState(true);

  const isStructure = pathName.includes("/structures/");
  const isSilo = pathName.includes("/silos/");
  const showRenders =
    isStructure && !!budget && companyHasRenders(company?.company_name);
  const { renders, isLoading: rendersLoading } = useStructureRenders(
    showRenders && includeRenders ? (budget as StructureBudget) : null,
    roofSlopes,
  );

  // N° de presupuesto para el PDF de Remeco
  const [budgetNumber, setBudgetNumber] = useState<number | null>(null);
  const budgetCreatedAt = budget?.created_at;
  useEffect(() => {
    if (!showRenders || !budgetCreatedAt) return;
    let active = true;
    getBudgetNumber(company?.id, budgetCreatedAt).then((n) => {
      if (active) setBudgetNumber(n);
    });
    return () => {
      active = false;
    };
  }, [showRenders, budgetCreatedAt, company?.id]);

  if (isLoading) return <p className="p-4">Cargando presupuesto...</p>;
  if (error) return <p className="p-4 text-danger">{error}</p>;
  if (!budget) return <p className="p-4">No se ha obtenido un Presupuesto</p>;

  // Remeco: PDF propio (presupuesto con un solo precio + hoja de fotos con medidas)
  const handleRemecoDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadRemecoStructurePDF(
        budget as StructureBudget,
        {
          dollarQuote: preferences.dollar_quote,
          ivaPercentage: preferences.iva_percentage,
          company,
          roofSlopes,
          includeRenders,
          budgetNumber,
        },
        includeRenders ? renders : null,
      );
    } finally {
      setIsDownloading(false);
    }
  };

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

      {!viewDetail && showRenders && (
        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center lg:w-1/2">
          <label className="flex items-center gap-2 font-medium">
            Techo
            <select
              className="bg-white text-black px-2 py-2 rounded"
              value={roofSlopes}
              onChange={(e) => setRoofSlopes(e.target.value === "1" ? 1 : 2)}>
              <option value={2}>Dos aguas</option>
              <option value={1}>Un agua</option>
            </select>
          </label>
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={includeRenders}
              onChange={(e) => setIncludeRenders(e.target.checked)}
            />
            Agregar fotos 3D y medidas al PDF
          </label>
        </div>
      )}

      {!viewDetail && showRenders && includeRenders && (
        <StructureRendersSection
          renders={renders}
          isLoading={rendersLoading}
        />
      )}

      {!viewDetail && (
        <div className="mt-4 flex flex-col gap-2 lg:w-2/5">
          <DownloadBudgetButton
            customer={budget.customer}
            disabled={showRenders && ((includeRenders && rendersLoading) || isDownloading)}
            onDownload={showRenders ? handleRemecoDownload : undefined}
          />
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
