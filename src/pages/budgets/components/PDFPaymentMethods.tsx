import { TextAreaInput } from "../../../components";

export const PDFPaymentMethods = () => {
  return (
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
  );
};
