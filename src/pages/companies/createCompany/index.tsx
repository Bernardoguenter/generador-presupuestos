import { useNavigate } from "react-router";
import { provinciasArgentina } from "../../../helpers/fixedData";
import {
  Button,
  Form,
  SelectInput,
  TextInput,
  FileInput,
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

export default function CreateCompany() {
  const navigate = useNavigate();
  const { preferences } = usePreferencesContext();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const { address, city, province, email, company_name, phone, file } =
      formData;

    try {
      const formattedAddress = `${address}, ${city}, ${province}`;

      const companyData = {
        company_name,
        email,
        phone,
        fullAddress: formattedAddress,
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
      }
    } catch (error) {
      const newError = error as PostgrestError;
      CreateCompanyToastError(newError.message);
    }
  };

  const defaultValues = useMemo(
    () => ({
      company_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: provinciasArgentina[0],
    }),
    []
  );

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createCompanySchema}
      defaultValues={defaultValues}>
      <h2 className="my-4 text-2xl font-medium">Crea una nueva empresa</h2>
      <TextInput
        label="Nombre de Empresa"
        name="company_name"
      />
      <FileInput
        label="Logo"
        name="file"
      />
      <TextInput
        label="E-mail de Empresa"
        name="email"
        type="email"
      />
      <TextInput
        label="Teléfono"
        name="phone"
      />
      <TextInput
        label="Dirección"
        name="address"
      />
      <TextInput
        label="Localidad"
        name="city"
      />
      <SelectInput
        label="Provincia"
        name="province">
        {provinciasArgentina.map((prov) => (
          <option
            key={prov}
            value={prov}>
            {prov}
          </option>
        ))}
      </SelectInput>
      <Button
        type="submit"
        color="info"
        styles="mt-4">
        Crear empresa
      </Button>
    </Form>
  );
}
