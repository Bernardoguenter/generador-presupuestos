import { usePDFContext } from "../../../common/context";
import { Button } from "../../../components";

interface Props {
  setBudgetType: React.Dispatch<React.SetStateAction<"structure" | "silo">>;
  budgetType: "structure" | "silo";
}

export const BudgetViewButtons = ({ budgetType, setBudgetType }: Props) => {
  const { setPdfInfo } = usePDFContext();

  const handlChangeView = (budgetType: "structure" | "silo") => {
    if (budgetType === "silo") {
      setBudgetType("silo");
    }

    if (budgetType === "structure") {
      setBudgetType("structure");
    }

    setPdfInfo(null);
  };

  return (
    <aside className="flex gap-1 md:flex-row flex-col">
      <Button
        color={budgetType === "structure" ? "info" : "danger"}
        onClick={() => handlChangeView("structure")}>
        Estructuras
      </Button>
      <Button
        color={budgetType === "silo" ? "info" : "danger"}
        onClick={() => handlChangeView("silo")}>
        Silos
      </Button>
    </aside>
  );
};
