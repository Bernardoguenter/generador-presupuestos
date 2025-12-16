import { TextAreaInput } from "@/components";

export const PDFEstimatedDelivery = () => {
  return (
    <div className="m-2.5">
      <h2 className="text-left mb-2.5 text-sm">Tiempo de entrega estimado</h2>
      <TextAreaInput
        name="estimatedDelivery"
        containerStyles="p-0 m-0"
        inputStyles="min-h-[50px] p-0 m-0 text-left border-2 border-amber-600"
      />
    </div>
  );
};
