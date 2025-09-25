import { useCompanyContext } from "../../../common/context";
import { Logo } from "../../../components";

export const BudgetHeader = ({ customer }: { customer: string }) => {
  const { company } = useCompanyContext();
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <Logo
          containerStyles="t"
          logoStyles="pdf-logo max-w-[120px] aspect-square object-contain"
        />
        <aside className="text-right leading-3.5">
          <p className="font-bold">{company?.company_name}</p>
          <p>
            {company?.hasPdfAddress
              ? company.pdfAddress
              : company?.address.address}
          </p>
          <p>Tel: {company?.phone}</p>
          <p>{company?.email}</p>
        </aside>
      </div>
      <div className="m-2.5 mb-8  leading-4">
        <p className="font-bold">Estimado {customer}:</p>
        <p>
          Le agradecemos su consulta y hacemos la siguiente oferta según nuestra
          comunicación previa.
        </p>
      </div>
    </>
  );
};
