import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import type { ZodSchema } from "zod";

type FormProps<TFormValues extends FieldValues> = {
  id?: string;
  name?: string;
  schema?: ZodSchema<TFormValues>;
  onWatch?: (values: TFormValues) => void; // Nuevo callback opcional
  children: ReactNode;
  defaultValues?: DefaultValues<TFormValues>;
  className?: string;
  styles?: CSSProperties;
};

export const FormWatch = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormValues extends Record<string, any> = Record<string, any>
>({
  schema,
  onWatch,
  children,
  defaultValues,
  ...props
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    resolver: schema != null ? zodResolver(schema) : undefined,
    defaultValues,
    mode: "onChange",
  });

  const values = methods.watch();

  useEffect(() => {
    if (defaultValues) {
      const currentValues = methods.getValues();
      const isDifferent = Object.keys(defaultValues).some(
        (key) => currentValues[key] !== defaultValues[key]
      );
      if (isDifferent) {
        methods.reset(defaultValues);
      }
    }
  }, [defaultValues, methods]);

  useEffect(() => {
    if (onWatch) {
      onWatch(values);
    }
  }, [values, onWatch]);

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col"
        // Sin onSubmit
        {...props}>
        {children}
      </form>
    </FormProvider>
  );
};
