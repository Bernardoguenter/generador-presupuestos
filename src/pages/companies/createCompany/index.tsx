import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { SelectInput } from "../../../components/SelectInput";
import { TextInput } from "../../../components/TextInput";
import { provinciasArgentina } from "../../../helpers/fixedData";
import {
  CreateCompanyToastError,
  CreateCompanyToastSuccess,
} from "../../../utils/alerts";
import { supabase } from "../../../utils/supabase";
import { createCompanySchema, type CreateCompanyFormData } from "../schema";
import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";

export default function CreateCompany() {
  const navigate = useNavigate();
  const { preferences } = usePreferencesContext();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const { direccion, localidad, provincia, email, nombre, telefono } =
      formData;
    try {
      const formattedAddress = `${direccion}, ${localidad}, ${provincia}`;

      const { data: company_data, error: createcompany_error } = await supabase
        .from("companies")
        .insert([
          {
            nombre,
            email,
            telefono,
            direccion: formattedAddress,
          },
        ])
        .select()
        .single();

      if (!createcompany_error) {
        if (company_data) {
          const { error: company_settings_error } =
            await supabase.functions.invoke("set-preferences", {
              body: { company_id: company_data.id, preferences },
            });

          if (!company_settings_error) {
            CreateCompanyToastSuccess(company_data.nombre);
            setTimeout(() => {
              navigate("/companies");
            }, 1000);
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
      console.error(error);
    }
  };
  return (
    <Form
      onSubmit={handleSubmit}
      schema={createCompanySchema}
      defaultValues={{
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        localidad: "",
        provincia: provinciasArgentina[0],
      }}>
      <h2 className="my-4 text-2xl font-medium">Crea una nueva empresa</h2>
      <TextInput
        label="Nombre de Empresa"
        name="nombre"
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
