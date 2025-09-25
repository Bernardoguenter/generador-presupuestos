import { Controller, useFormContext } from "react-hook-form";
import { getErrorByPath } from "./getErrorByPath";

interface Props {
  name: string;
  label: string;
  type?: "email" | "text";
  ref?: React.RefObject<HTMLInputElement | null>;
  containerStyles?: string;
  labelStyles?: string;
  inputStyles?: string;
  placeholder?: string;
}

export const TextInput = ({
  name,
  label,
  type = "text",
  ref,
  containerStyles,
  inputStyles,
  labelStyles,
  placeholder,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = getErrorByPath(errors, name);

  return (
    <div
      className={`flex flex-col mb-1 ${
        containerStyles ? containerStyles : ""
      }`}>
      <label
        htmlFor={name}
        className={`mb-1 font-medium ${labelStyles ? labelStyles : ""}`}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            className={`bg-white placeholder:text-gray-400 text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100 ${
              inputStyles ? inputStyles : ""
            }`}
            id={name}
            type={type}
            {...field}
            ref={ref}
            placeholder={placeholder}
          />
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">{String(fieldError)}</span>
      )}
    </div>
  );
};
