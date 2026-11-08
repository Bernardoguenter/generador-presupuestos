import { Button } from "@/components";
import { convertPDF } from "@/helpers";
import type { PDFImage } from "@/types";

interface Props {
  customer: string;
  images?: PDFImage[];
  disabled?: boolean;
  /** Si se pasa, reemplaza la descarga común (PDF de Remeco con fotos) */
  onDownload?: () => void;
}

export const DownloadBudgetButton = ({
  customer,
  images,
  disabled,
  onDownload,
}: Props) => {
  return (
    <Button
      color="info"
      type="button"
      disabled={disabled}
      onClick={() => (onDownload ? onDownload() : convertPDF(customer, images))}>
      Descargar PDF y compartir
    </Button>
  );
};
