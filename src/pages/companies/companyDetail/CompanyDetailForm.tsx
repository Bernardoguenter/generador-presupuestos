import { type Company } from "@/types";
import { createCompanySchema } from "../schema";
import {
  Button,
  TextInput,
  Form,
  GooglePlacesInput,
  HiddenInput,
  SubmittingOverlay,
} from "@/components";
import { useUpdateCompanyForm } from "../hooks/useUpdateCompanyForm";
import { DeleteCompanyButton } from "./DeleteCompanyButton";
import { PDFAddressCheckbox } from "../PDFAddressCheckbox";

interface Props {
  company: Company;
}

export default function CompanyDetailForm({ company }: Props) {
  const { handleSubmit, isSubmitting, setIsSubmitting, defaultValues } =
    useUpdateCompanyForm(company);

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
        <PDFAddressCheckbox />
        <div className="w-full flex flex-col items-center justify-center">
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
        </div>
      </Form>
    </SubmittingOverlay>
  );
}
