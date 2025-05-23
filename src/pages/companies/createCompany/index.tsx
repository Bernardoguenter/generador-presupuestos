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
import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";
import {
  createCompany,
  setCompanyPreferences,
  updateCompany,
  uploadFileToBucket,
} from "../../../common/lib";
import { formatCompanyName, formatFileType } from "../../../helpers/formatData";
import type { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";

export default function CreateCompany() {
  const navigate = useNavigate();
  const { preferences } = usePreferencesContext();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const { direccion, localidad, provincia, email, nombre, telefono, file } =
      formData;

    try {
      const formattedAddress = `${direccion}, ${localidad}, ${provincia}`;

      const companyData = {
        nombre,
        email,
        telefono,
        direccion: formattedAddress,
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
              const companyName = formatCompanyName(nombre);
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
                    CreateCompanyToastSuccess(company_data.nombre);
                    setTimeout(() => {
                      navigate("/companies");
                    }, 1000);
                    UpdateCompanyLogoToastSuccess(company_data.nombre);
                  } else {
                    UpdateCompanyLogoToastError(company_data.nombre);
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
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      localidad: "",
      provincia: provinciasArgentina[0],
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
        name="nombre"
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
        name="telefono"
      />
      <TextInput
        label="Dirección"
        name="direccion"
      />
      <TextInput
        label="Localidad"
        name="localidad"
      />
      <SelectInput
        label="Provincia"
        name="provincia">
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
