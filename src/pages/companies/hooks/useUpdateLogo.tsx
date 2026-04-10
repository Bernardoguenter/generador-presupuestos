import { useIsSubmitting } from "@/common/hooks";
import { useMemo } from "react";
import {
  uploadFileToBucket,
  updateCompany,
  replaceFileInBucket,
} from "@/common/lib";
import { formatCompanyName, formatFileType } from "@/helpers";
import type { Company } from "@/types";
import {
  UpdateCompanyLogoToastSuccess,
  UpdateCompanyToastSuccess,
  UpdateCompanyToastError,
  UpdateCompanyLogoToastError,
} from "@/utils/alerts";
import type { CompanyLogoFormData } from "@/pages/companies/schema";

interface Props {
  company: Company;
}

export const useUpdateLogo = ({ company }: Props) => {
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();
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
                `/${companyName}.${fileType}`,
              );

            if (!bucketError) {
              UpdateCompanyLogoToastSuccess(company.company_name);
              const { error: updateLogoUrlError } = await updateCompany(
                { logo_url: bucketData?.fullPath },
                company.id,
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
              `/${companyName}.${fileType}`,
            );
          if (!bucketError) {
            UpdateCompanyLogoToastSuccess(company.company_name);
            const { error: updateLogoUrlError } = await updateCompany(
              { logo_url: bucketData?.fullPath },
              company.id,
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

  return { isSubmitting, handleSubmit, defaultValues };
};
