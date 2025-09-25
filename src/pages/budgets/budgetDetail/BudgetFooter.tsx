import { useAuthContext, useCompanyContext } from "../../../common/context";

export const BudgetFooter = () => {
  const { company } = useCompanyContext();
  const { authUser } = useAuthContext();

  return (
    <div className="m-2.5 mt-8 text-left  ">
      <p>Esperamos con interés trabajar con usted.</p>
      <p>Le saluda atentamente:</p>
      <p className="mt-4">
        {authUser?.fullName} - <span>{company?.company_name}</span>
      </p>
    </div>
  );
};
