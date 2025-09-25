import { StringToList } from "../../../components/StringToList";

interface Props {
  caption: string;
  details?: string;
  paymentMethods: string;
}

export const BudgetBody = ({ paymentMethods, caption, details }: Props) => {
  return (
    <>
      <div className=" w-max mt-2 leading-3.5 m-2.5">
        {caption === "" || !caption ? (
          ""
        ) : (
          <StringToList
            inputString={caption}
            textSize="text-base"
          />
        )}
      </div>
      <div className="m-2.5 text-left text-base ">
        <h2 className=" mb-1 font-bold">Detalle de materiales:</h2>
        {details && <StringToList inputString={details} />}
      </div>
      <div className="m-2.5 text-left text-base ">
        <h2 className=" mb-1 font-bold">Formas de pago:</h2>
        <StringToList inputString={paymentMethods} />
      </div>
    </>
  );
};
