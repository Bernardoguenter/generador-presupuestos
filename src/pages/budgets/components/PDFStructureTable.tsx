import { NumberInput, TextAreaInput } from "../../../components";
export const PDFStructureTable = () => {
  return (
    <div className="m-2.5">
      <table className="w-full border-collapse my-5 mx-0 text-sm text-left border table-fixed">
        <thead className="bg-gray-200">
          <tr className="">
            <th className="text-center mb-2.5 text-sm w-3-4">Descripción</th>
            <th className="text-center mb-2.5 text-sm w-1/4">Importe Total</th>
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
