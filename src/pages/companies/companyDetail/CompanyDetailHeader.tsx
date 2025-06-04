import { useEffect, useMemo, useState } from "react";
import {
  replaceFileInBucket,
  retriveFileFromBucket,
  updateCompany,
  uploadFileToBucket,
} from "../../../common/lib";
import { Button, FileInput, Form } from "../../../components";
import { formatCompanyName, formatFileType } from "../../../helpers/formatData";
import type { Company } from "../../../helpers/types";
import {
  UpdateCompanyLogoToastError,
  UpdateCompanyLogoToastSuccess,
  UpdateCompanyToastError,
  UpdateCompanyToastSuccess,
} from "../../../utils/alerts";
import { companyLogoSchema, type CompanyLogoFormData } from "../schema";
import SubmittingOverlay from "../../../components/SubmittingOverlay";
import { useIsSubmitting } from "../../../common/hooks/useIsSubmitting";

interface Props {
  company: Company;
}

export const CompanyDetailHeader = ({ company }: Props) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  useEffect(() => {
    const fetchLogo = async () => {
      if (company.logo_url) {
        const { data } = await retriveFileFromBucket(
          "companies-logos",
          company.logo_url
        );
        if (data) setLogoUrl(data.publicUrl);
      }
    };
    fetchLogo();
  }, [company.logo_url]);

  const handleSubmit = async (data: CompanyLogoFormData) => {
    const { file } = data;
    try {
      setIsSubmitting(true);
      if (file) {
        const companyName = formatCompanyName(company.company_name);
        const fileType = formatFileType(file);
        if (company.logo_url === null) {
          if (file) {
            const { data: bucketData, error: bucketError } =
              await uploadFileToBucket(
                file,
                "companies-logos",
                company.id,
                `/${companyName}.${fileType}`
              );

            if (!bucketError) {
              UpdateCompanyLogoToastSuccess(company.company_name);
              const { error: updateLogoUrlError } = await updateCompany(
                { logo_url: bucketData?.fullPath },
                company.id
              );
              if (!updateLogoUrlError) {
                UpdateCompanyToastSuccess(company.company_name);
              } else {
                UpdateCompanyToastError(company.company_name);
              }
            } else {
              UpdateCompanyLogoToastError(company.company_name);
            }
          }
        } else {
          const { data: bucketData, error: bucketError } =
            await replaceFileInBucket(
              file,
              "companies-logos",
              company.id,
              `/${companyName}.${fileType}`
            );
          if (!bucketError) {
            UpdateCompanyLogoToastSuccess(company.company_name);
            const { error: updateLogoUrlError } = await updateCompany(
              { logo_url: bucketData?.fullPath },
              company.id
            );
            if (!updateLogoUrlError) {
              UpdateCompanyToastSuccess(company.company_name);
            } else {
              UpdateCompanyToastError(company.company_name);
            }
          } else {
            UpdateCompanyLogoToastError(company.company_name);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Button
            type="submit"
            children="Actualizar Logo"
            color="danger"
            styles="mt-4"
            disabled={isSubmitting}
          />
        </div>
      </Form>
    </SubmittingOverlay>
  );
};
