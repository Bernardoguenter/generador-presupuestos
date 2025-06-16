import { useEffect } from "react";
import {
  Button,
  Logo,
  NumberInput,
  TextAreaInput,
} from "../../../../components";
import {
  useAuthContext,
  useCompanyContext,
  usePDFContext,
  usePreferencesContext,
} from "../../../../common/context";
import { useFormContext, useWatch } from "react-hook-form";

export const PDFFormContent = () => {
  const { authUser } = useAuthContext();
  const { company } = useCompanyContext();
  const { pdfInfo } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const { control, setValue } = useFormContext();
  const description = useWatch({ control, name: "description" });
  const details = useWatch({ control, name: "details" });
  const paymentMethods = useWatch({ control, name: "paymentMethods" });
  const total = useWatch({ control, name: "total" });

  useEffect(() => {
    setValue("total", total);
  }, [total]);

  useEffect(() => {
    setValue("paymentMethods", paymentMethods);
  }, [paymentMethods]);

  useEffect(() => {
    setValue("description", description);
  }, [description]);

  useEffect(() => {
    setValue("details", details);
  }, [details]);

  return (
    <div className="mt-16 bg-white  p-4 lg:p-8 w-full max-w-[20cm] text-black">
      <div className="flex justify-between items-start">
        <Logo
          containerStyles="t"
          logoStyles="pdf-logo max-w-[120px] aspect-square object-contain"
        />
        <aside className="text-right ">
          <p className="text-sm leading-3.5">{company?.company_name}</p>
          <p className="text-sm leading-3.5">{company?.address.address}</p>
          <p className="text-sm leading-3.5">Tel: {company?.phone}</p>
          <p className="text-sm leading-3.5">{company?.email}</p>
        </aside>
      </div>
      <div className="m-2.5">
        <p className="text-sm leading-4">Estimado {pdfInfo?.customer}:</p>
        <p className="text-sm leading-4">
          Le agradecemos su consulta y hacemos la siguiente oferta según nuestra
          comunicación previa.
        </p>
      </div>
      <div className="m-2.5">
        <table className="w-full border-collapse my-5 mx-0 text-sm text-left border table-fixed">
          <thead className="bg-gray-200">
            <tr className="">
              <th className="text-center mb-2.5 text-sm w-3-4">Descripción</th>
              <th className="text-center mb-2.5 text-sm w-1/4">
                Importe Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border ">
              <td className="text-sm p-1 w-3/4 border">
                <TextAreaInput
                  name="description"
                  inputStyles="text-left border-2 border-amber-600"
                />
              </td>
              <td className="text-center border w-1/4 r">
                <NumberInput
                  name="total"
                  label="total"
                  labelStyles="hidden"
                  inputStyles="text-center border-2 border-amber-600"
                />
              </td>
            </tr>
          </tbody>
          <caption className="caption-bottom text-sm  w-max mt-4 leading-3.5">
            <ul className="w-full text-left">
              <li className="w-full ">
                {pdfInfo?.includes_freight
                  ? "* El precio inlcuye el flete"
                  : "* El precio no inlcuye el flete"}
              </li>
              <li className="w-full">* Montaje incluído</li>
              <li className="w-full">
                {pdfInfo?.includes_taxes
                  ? `* Incluye IVA ${preferences.iva_percentage}%`
                  : `* No Incluye IVA ${preferences.iva_percentage}%`}
              </li>
            </ul>
          </caption>
        </table>
      </div>
      <div className="m-2.5">
        <h2 className="text-left mb-2.5 text-sm">
          Detalle de materiales (Para agregar una nueva línea separar con ";")
        </h2>
        <TextAreaInput
          name="details"
          containerStyles="p-0 m-0"
          inputStyles="min-h-[200px] p-0 m-0 text-left border-2 border-amber-600"
        />
      </div>
      <div className="m-2.5">
        <h2 className="text-left mb-2.5 text-sm">
          Formas de pago (Para agregar una nueva línea separar con ";")
        </h2>
        <TextAreaInput
          name="paymentMethods"
          containerStyles="p-0 m-0"
          inputStyles="min-h-[120px] p-0 m-0 text-left border-2 border-amber-600"
        />
      </div>
      <div className="m-2.5">
        <p className="text-left mb-2.5 text-sm">
          Esperamos con interés trabajar con usted.
        </p>
        <p className="text-left mb-2.5 text-sm">Le saluda atentamente:</p>
        <p className="text-left mb-2.5 text-sm">
          {authUser?.fullName} -{" "}
          <span className="text-sm">{company?.company_name}</span>
        </p>
      </div>
      <Button
        type="submit"
        color="info">
        Confirmar Presupuesto
      </Button>
    </div>
  );
};
