import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import type { ZodSchema } from "zod";

type FormProps<TFormValues extends FieldValues> = {
  id?: string;
  name?: string;
  schema?: ZodSchema<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: ReactNode;
  defaultValues?: DefaultValues<TFormValues>;
  className?: string;
  styles?: CSSProperties;
};

export const Form = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFormValues extends Record<string, any> = Record<string, any>
>({
  schema,
  onSubmit,
  children,
  defaultValues,
  ...props
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    resolver: schema != null ? zodResolver(schema) : undefined,
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <FormProvider {...methods}>
      <form
        className="w-full flex flex-col "
        onSubmit={methods.handleSubmit(onSubmit)}
        {...props}>
        {children}
      </form>
    </FormProvider>
  );
};
