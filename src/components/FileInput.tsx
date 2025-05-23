import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  defaultPreviewUrl?: string;
}

export const FileInput = ({ name, label, defaultPreviewUrl }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultPreviewUrl ?? null
  );
  const [fileName, setFileName] = useState<string | null>(null);

  const fieldError = errors?.[name]?.message;

  useEffect(() => {
    if (defaultPreviewUrl) {
      setPreviewUrl(defaultPreviewUrl);
    }
  }, [defaultPreviewUrl]);

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
        render={({ field: { onChange, ref, name, onBlur } }) => (
          <div className="relative flex items-center gap-4 w-fit">
            <input
              id={name}
              type="file"
              name={name}
              ref={ref}
              onBlur={onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                  setFileName(file.name);
                  onChange(file);
                } else {
                  setPreviewUrl(null);
                  setFileName(null);
                  onChange(null);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            />
            <div className="w-20 aspect-square relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div className="rounded-full bg-gray-300 w-full h-full flex justify-center items-center">
                  <p className="text-red-500 text-sm text-center px-2">
                    Carga tu foto
                  </p>
                </div>
              )}
            </div>
            {fileName && (
              <p className="text-sm text-gray-600 break-all max-w-[150px]">
                {fileName}
              </p>
            )}
          </div>
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm mt-1">{String(fieldError)}</span>
      )}
    </div>
  );
};
