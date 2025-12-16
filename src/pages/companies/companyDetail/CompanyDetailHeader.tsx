import { useMemo } from "react";
import { Button, FileInput, Form, SubmittingOverlay } from "@/components";
import type { Company } from "@/helpers/types";
import { companyLogoSchema } from "../schema";
import { useUpdateLogo } from "@/common/hooks/useUpdateLogo";
import { useFetchLogo } from "@/common/hooks/useFetchLogo";

interface Props {
  company: Company;
}

export const CompanyDetailHeader = ({ company }: Props) => {
  const logoUrl = useFetchLogo({ company });
  const { handleSubmit, isSubmitting } = useUpdateLogo({ company });

  const defaultValues = useMemo(() => ({ file: undefined }), []);

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={companyLogoSchema}
        defaultValues={defaultValues}>
        <h2 className="my-4 text-2xl font-medium">{company?.company_name}</h2>
        <div className="flex flex-col items-start justify-start py-4">
          <FileInput
            label="Logo"
            name="file"
            defaultPreviewUrl={logoUrl ?? undefined}
          />
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              children="Actualizar Logo"
              color="danger"
              styles="mt-4"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </Form>
    </SubmittingOverlay>
  );
};
