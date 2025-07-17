import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  labelStyles?: string;
  inputStyles?: string;
}

export const NumberInput = ({
  name,
  label,
  inputStyles,
  labelStyles,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name]?.message;

  return (
    <div className="flex flex-col mb-1">
      <label
        htmlFor={name}
        className={`mb-1 font-medium ${labelStyles && labelStyles}`}>
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            className={`bg-white placeholder:text-gray-400 text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100  ${
              inputStyles ?? ""
            }`}
            id={name}
            type="number"
            step="any"
            {...field}
          />
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">{String(fieldError)}</span>
      )}
    </div>
  );
};
