import { Button } from "@/components";
import { convertPDF } from "@/helpers";
import type { PDFImage } from "@/types";

interface Props {
  customer: string;
  images?: PDFImage[];
  disabled?: boolean;
}

export const DownloadBudgetButton = ({ customer, images, disabled }: Props) => {
  return (
    <Button
      color="info"
      type="button"
      disabled={disabled}
      onClick={() => convertPDF(customer, images)}>
      Descargar PDF y compartir
    </Button>
  );
};
