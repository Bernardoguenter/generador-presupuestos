import { Button } from "../../../components";
import { convertPDF } from "../../../helpers/generatePDF";

interface Props {
  customer: string;
}

export const DownloadBudgetButton = ({ customer }: Props) => {
  return (
    <Button
      color="info"
      type="button"
      onClick={() => convertPDF(customer)}>
      Descargar PDF y compartir
    </Button>
  );
};
