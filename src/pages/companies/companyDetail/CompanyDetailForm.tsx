import { useNavigate } from "react-router";
import type { Company } from "../../../helpers/types";
import { createCompanySchema, type CreateCompanyFormData } from "../schema";
import {
  Button,
  TextInput,
  Form,
  GooglePlacesInput,
  HiddenInput,
  SubmittingOverlay,
} from "../../../components";
import {
  UpdateCompanyToastError,
  UpdateCompanyToastSuccess,
} from "../../../utils/alerts";
import { updateCompany } from "../../../common/lib";
import { useMemo } from "react";
import { DeleteCompanyButton } from "./DeleteCompanyButton";
import { useIsSubmitting } from "../../../common/hooks/useIsSubmitting";

interface Props {
  company: Company;
}

export default function CompanyDetailForm({ company }: Props) {
  const navigate = useNavigate();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const { address, email, company_name, phone, lat, lng } = formData;
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
    };
  }, [company]);

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={createCompanySchema}
        defaultValues={defaultValues}>
        <TextInput
          label="Nombre de Empresa"
          name="company_name"
        />
        <HiddenInput name="lat" />
        <HiddenInput name="lng" />
        <TextInput
          label="E-mail de Empresa"
          name="email"
          type="email"
        />
        <TextInput
          label="Teléfono"
          name="phone"
        />
        <GooglePlacesInput
          name="address"
          label="Dirección"
        />
        <HiddenInput name="lat" />
        <HiddenInput name="lng" />
        <Button
          type="submit"
          color="info"
          styles="mt-4"
          disabled={isSubmitting}>
          Editar empresa
        </Button>

        <DeleteCompanyButton
          logo_url={company.logo_url}
          id={company.id}
          company_name={company.company_name}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </Form>
    </SubmittingOverlay>
  );
}
