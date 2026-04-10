import {
  Button,
  Form,
  TextInput,
  FileInput,
  GooglePlacesInput,
  HiddenInput,
  SubmittingOverlay,
} from "@/components";
import { createCompanySchema } from "../schema";
import { PDFAddressCheckbox } from "../PDFAddressCheckbox";
import { useCreateCompany } from "../hooks/useCreateCompany";

export default function CreateCompany() {
  const { handleSubmit, isSubmitting, defaultValues } = useCreateCompany();

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={createCompanySchema}
        defaultValues={defaultValues}>
        <h2 className="my-4 text-2xl font-medium">Crea una nueva empresa</h2>
        <div className="w-full flex flex-col lg:flex-row lg:gap-8">
          <div className="flex flex-col w-full">
            <TextInput
              label="Nombre de Empresa"
              name="company_name"
            />
            <FileInput
              label="Logo"
              name="file"
            />
          </div>
          <div className="flex flex-col w-full">
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
            <HiddenInput name="lng" />
            <HiddenInput name="lat" />
            <PDFAddressCheckbox />
          </div>
        </div>
        <div className="w-full flex justify-center">
          {" "}
          <Button
            type="submit"
            color="info"
            styles="mt-4"
            disabled={isSubmitting}>
            Crear empresa
          </Button>
        </div>
      </Form>
    </SubmittingOverlay>
  );
}
