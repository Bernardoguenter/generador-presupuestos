import { Controller, useFormContext } from "react-hook-form";
import { getErrorByPath } from "./getErrorByPath";

interface Props {
  name: string;
  label: string;
}

export const CheckboxInput = ({ name, label }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = getErrorByPath(errors, name);

  return (
    <div className="flex items-center gap-4 mb-1">
      <label
        htmlFor={name}
        className="font-medium">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type="checkbox"
            className="bg-white px-2 py-2 rounded-xs appearance-none h-3 w-3 border border-gray-400  checked:bg-amber-500 checked:border-white checked:border-2 checked:text-white checked:rounded-xs checked:h-1 checked:w-1 cursor-pointer"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">{String(fieldError)}</span>
      )}
    </div>
  );
};
