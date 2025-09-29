import { usePDFContext } from "../../../common/context";
import { NumberInput, TextAreaInput } from "../../../components";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import type { SiloBudget } from "../../../helpers/types";

export const PDFSiloTable = () => {
  const { pdfInfo } = usePDFContext();
  const { control, setValue } = useFormContext();
  const description = useWatch({ control, name: "description" });
  const silosPrices = useWatch({ control, name: "silosPrices" }) as
    | number[]
    | undefined;
  const freightPrice = useWatch({ control, name: "freight_price" }) as
    | number
    | undefined;
  const total = useWatch({ control, name: "total" }) as number | undefined;

  useEffect(() => {
    const sumSilos = Array.isArray(silosPrices)
      ? silosPrices.reduce((acc, v) => acc + Number(v || 0), 0)
      : 0;
    const freight = Number(freightPrice || 0);
    const newTotal = sumSilos + freight;

    if (typeof newTotal === "number" && newTotal !== total) {
      setValue("total", newTotal);
    }
  }, [silosPrices, freightPrice, setValue, total]);

  return (
    <div className="m-2.5">
      <table className="w-full border-collapse my-5 mx-0 text-sm text-left border table-fixed">
        <thead className="bg-gray-200">
          <tr className="">
            <th className="text-center mb-2.5 text-sm w-3-4">Descripción</th>
            <th className="text-center mb-2.5 text-sm w-1/4">Importe</th>
          </tr>
        </thead>
        <tbody>
          {pdfInfo?.dataToSubmit &&
            "silos" in pdfInfo.dataToSubmit &&
            Array.isArray(
              (pdfInfo.dataToSubmit as Omit<SiloBudget, "created_at" | "id">)
                .silos
            ) &&
            Array.isArray(description) && (
              <>
                {description.map((siloDesc: string, idx: number) => (
                  <tr
                    className="border"
                    key={idx}>
                    <td className="text-sm p-1 w-3/4 border">
                      <TextAreaInput
                        name={`description.${idx}`}
                        inputStyles="text-left border-2 border-amber-600"
                        placeholder={siloDesc}
                      />
                    </td>
                    <td className="text-center border w-1/4 r">
                      <NumberInput
                        name={`silosPrices.${idx}`}
                        label={`price-${idx}`}
                        labelStyles="hidden"
                        inputStyles="text-center border-2 border-amber-600"
                      />
                    </td>
                  </tr>
                ))}
                {pdfInfo.includes_freight && (
                  <tr>
                    <td className="p-2">Flete</td>
                    <td className="p-2 text-center">
                      {Math.floor(freightPrice ?? 0)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="p-2">Total</td>
                  <td className="p-2 text-center">{total ?? pdfInfo.total}</td>
                </tr>
              </>
            )}
        </tbody>
      </table>
      <div className="caption-bottom text-sm  mt-4 leading-3.5 ">
        <h2 className="text-left mb-2.5 text-sm">
          Detalles adicionales (Para agregar una nueva línea separar con ";")
        </h2>
        <TextAreaInput
          name="caption"
          containerStyles="p-0 m-0"
          inputStyles="min-h-[50px] w-full p-0 m-0 text-left border-2 border-amber-600"
        />
      </div>
    </div>
  );
};
