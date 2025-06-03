import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
}

export const HiddenInput = ({ name }: Props) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col mb-1">
      {/*  <label
        htmlFor={name}
        className="mb-1 font-medium">
        {label}
      </label> */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            className="bg-white placeholder:text-gray-400 text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100 appearance-none "
            id={name}
            type="hidden"
            {...field}
          />
        )}
      />
    </div>
  );
};
