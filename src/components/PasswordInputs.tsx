import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { VisibilityIcon, VisibilityOffIcon } from "../assets/svg";

interface Props {
  name: string;
  label: string;
}

export const PasswordInput = ({ name, label }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [showText, setShowText] = useState<boolean>(false);

  const fieldError = errors?.[name]?.message;

  return (
    <div className="flex flex-col mb-1">
      <label
        htmlFor={name}
        className="mb-1 font-medium">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              className="bg-white placeholder:text-gray-400 text-black px-2 py-2 rounded focus:outline-2 focus:outline-gray-100  w-full "
              id={name}
              type={showText ? "text" : "password"}
              {...field}></input>
            <span
              onClick={() => setShowText(!showText)}
              className="absolute right-2 top-2">
              {showText ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
