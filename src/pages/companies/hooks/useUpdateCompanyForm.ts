import { useNavigate } from "react-router";
import { updateCompany } from "@/common/lib";
import { UpdateCompanyToastError, UpdateCompanyToastSuccess } from "@/utils/alerts";
import { useIsSubmitting } from "@/common/hooks/useIsSubmitting";
import type { Company } from "@/types";
import type { CreateCompanyFormData } from "../schema";
import { useMemo } from "react";

export const useUpdateCompanyForm = (company: Company) => {
  const navigate = useNavigate();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const {
      address,
      email,
      company_name,
      phone,
      lat,
      lng,
      hasPdfAddress,
      pdfAddress,
    } = formData;
    try {
      setIsSubmitting(true);
      const dataToUpdate = {
        company_name,
        email,
        phone,
        address: {
          address,
          lat,
          lng,
        },
        hasPdfAddress,
        pdfAddress,
      };
      const { data, error } = await updateCompany(dataToUpdate, company.id);

      if (!error) {
        UpdateCompanyToastSuccess(data?.company_name);
        setTimeout(() => {
          navigate("/companies");
        }, 1000);
      } else {
        UpdateCompanyToastError(error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo<CreateCompanyFormData | undefined>(() => {
    if (!company) return undefined;
    return {
      company_name: company.company_name,
      email: company.email ?? "",
      phone: company.phone,
      address: company.address.address,
      lat: company.address.lat,
      lng: company.address.lng,
      hasPdfAddress: company.hasPdfAddress,
      pdfAddress: company.pdfAddress ?? "",
    };
  }, [company]);

  return { handleSubmit, isSubmitting, setIsSubmitting, defaultValues };
};
