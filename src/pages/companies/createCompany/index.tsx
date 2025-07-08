import { useNavigate } from "react-router";
import {
  Button,
  Form,
  TextInput,
  FileInput,
  GooglePlacesInput,
  HiddenInput,
  SubmittingOverlay,
} from "../../../components";
import {
  CreateCompanyToastError,
  CreateCompanyToastSuccess,
  UpdateCompanyLogoToastError,
  UpdateCompanyLogoToastSuccess,
} from "../../../utils/alerts";
import { createCompanySchema, type CreateCompanyFormData } from "../schema";
import {
  createCompany,
  setCompanyPreferences,
  updateCompany,
  uploadFileToBucket,
} from "../../../common/lib";
import { formatCompanyName, formatFileType } from "../../../helpers/formatData";
import type { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";
import { usePreferencesContext } from "../../../common/context";
import { useIsSubmitting } from "../../../common/hooks/useIsSubmitting";
import { PDFAddressCheckbox } from "../PDFAddressCheckbox";

export default function CreateCompany() {
  const navigate = useNavigate();
  const { preferences } = usePreferencesContext();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const {
      address,
      email,
      company_name,
      phone,
      file,
      lat,
      lng,
      hasPdfAddress,
      pdfAddress,
    } = formData;

    try {
      setIsSubmitting(true);
      const companyData = {
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

      const { data: company_data, error: createcompany_error } =
        await createCompany(companyData);

      if (!createcompany_error) {
        if (company_data) {
          const { error: company_settings_error } = await setCompanyPreferences(
            company_data.id,
            preferences
          );

          if (!company_settings_error) {
            if (file && company_data.id) {
              const companyName = formatCompanyName(company_name);
              const fileType = formatFileType(file);

              if (file) {
                const { data: bucketData, error: bucketError } =
                  await uploadFileToBucket(
                    file,
                    "companies-logos",
                    company_data.id,
                    `/${companyName}.${fileType}`
                  );

                if (!bucketError) {
                  const { error: updateLogoUrlError } = await updateCompany(
                    { logo_url: bucketData?.fullPath },
                    company_data.id
                  );
                  if (!updateLogoUrlError) {
                    CreateCompanyToastSuccess(company_data.company_name);
                    setTimeout(() => {
                      navigate("/companies");
                    }, 1000);
                    UpdateCompanyLogoToastSuccess(company_data.company_name);
                  } else {
                    UpdateCompanyLogoToastError(company_data.company_name);
                  }
                } else {
                  CreateCompanyToastError(company_settings_error.message);
                }
              }
            } else {
              CreateCompanyToastSuccess(company_data.company_name);
              setTimeout(() => {
                navigate("/companies");
              }, 1000);
            }
          } else {
            if (company_settings_error) {
              CreateCompanyToastError(company_settings_error.message);
            }
          }
        } else {
          if (createcompany_error) {
            const errorMessage =
              typeof createcompany_error === "object" &&
              createcompany_error !== null &&
              "message" in createcompany_error
                ? (createcompany_error as { message: string }).message
                : "Error al crear la empresa";
            CreateCompanyToastError(errorMessage);
          }
        }
        CreateCompanyToastSuccess(company_data.company_name);
        setTimeout(() => {
          navigate("/companies");
        }, 1000);
      }
    } catch (error) {
      const newError = error as PostgrestError;
      CreateCompanyToastError(newError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo(
    () => ({
      company_name: "",
      email: "",
      phone: "",
      address: "",
      lat: 0,
      lng: 0,
      hasPdfAddress: false,
      pdfAddress: "",
    }),
    []
  );

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
