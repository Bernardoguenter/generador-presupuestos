import { Controller, useFormContext } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface Props {
  name: string;
  label: string; // label general del grupo
  options: Option[]; // opciones individuales
}

export const RadioInput = ({ name, label, options }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name]?.message;

  return (
    <div className="flex flex-col gap-2 mb-2">
      {/* Label general */}
      <span className="font-semibold">{label}</span>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-row gap-2">
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${name}-${option.value}`}
                className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="h-4 w-4 accent-amber-500 cursor-pointer"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      />

      {fieldError && (
        <span className="text-red-500 text-sm">{String(fieldError)}</span>
      )}
    </div>
  );
};
