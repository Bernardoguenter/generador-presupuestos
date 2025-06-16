import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  containerStyles?: string;
  inputStyles?: string;
  placeholder?: string;
}

export const TextAreaInput = ({
  name,
  containerStyles,
  inputStyles,
  placeholder,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name]?.message;

  return (
    <div
      className={`flex flex-col mb-1 ${
        containerStyles ? containerStyles : ""
      }`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            className={`bg-white placeholder:text-gray-400 text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100 ${
              inputStyles ?? ""
            }`}
            id={name}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">{String(fieldError)}</span>
      )}
    </div>
  );
};
