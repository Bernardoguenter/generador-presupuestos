import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
}

export const CheckboxInput = ({ name, label }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name]?.message;

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
            className="bg-white placeholder:text-gray-400 text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100"
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
