import { getPDFBase64 } from "../../../helpers/generatePDF";
import { Button } from "../../../components";
import { useAuthContext, useCompanyContext } from "../../../common/context";
import { sendBudget } from "../../../common/lib";
import Swal from "sweetalert2";

interface Props {
  customer: string;
}

export const SendBudgetButton = ({ customer }: Props) => {
  const { authUser } = useAuthContext();
  const { company } = useCompanyContext();

  const sendEmailWithBudget = async (customer: string) => {
    Swal.fire({
      title: "Enviar presupuesto",
      inputLabel: "Ingresa la dirección de e-mail",
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Enviar e-mail",
      confirmButtonColor: "#FF8303",
      cancelButtonColor: "#ff3503",
      showLoaderOnConfirm: true,
      preConfirm: async (customerEmail: string) => {
        try {
          const base64Pdf = await getPDFBase64();
          if (!base64Pdf) return;

          const payload = {
            pdf: [
              {
                filename: `presupuesto_${customer}.pdf`,
                content: base64Pdf,
              },
            ],
            custsomerEmail: customerEmail,
            customerName: customer,
            companyName: company?.company_name,
            companyEmail: company?.email,
            userEmail: authUser?.email,
            userName: authUser?.fullName,
          };
          await sendBudget(payload);
        } catch (error) {
          Swal.showValidationMessage(`
        Request failed: ${error}
      `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: `Se ha enviado el presupuesto a ${result.value}`,
          confirmButtonColor: "#FF8303",
        });
      }
    });
  };
  return (
    <Button
      color="info"
      type="button"
      onClick={() => sendEmailWithBudget(customer)}>
      Enviar por e-mail
    </Button>
  );
};
