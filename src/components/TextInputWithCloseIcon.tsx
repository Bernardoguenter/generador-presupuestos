import { Controller, useFormContext } from "react-hook-form";
import { CloseIcon } from "../assets/svg";

interface Props {
  name: string;
  label: string;
  type?: "email" | "text";
  containerStyles?: string;
  labelStyles?: string;
  inputStyles?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onCloseIcon: () => void;
}

export const TextInputWithCloseIcon = ({
  name,
  label,
  type = "text",
  containerStyles,
  inputStyles,
  labelStyles,
  placeholder,
  value,
  onChange,
  onCloseIcon,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name]?.message;

  return (
    <div className={`flex flex-col mb-1 ${containerStyles || ""}`}>
      <label
        htmlFor={name}
        className={`mb-1 font-medium ${labelStyles || ""}`}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              id={name}
              type={type}
              placeholder={placeholder}
              className={`bg-white placeholder:text-gray-400 w-full text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100 ${
                inputStyles || ""
              }`}
              {...field}
              value={value ?? field.value}
              onInput={onChange ?? field.onChange}
            />
            <span
              className="absolute right-2 top-2"
              onClick={onCloseIcon}>
              <CloseIcon />
            </span>
          </div>
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">{String(fieldError)}</span>
      )}
    </div>
  );
};
