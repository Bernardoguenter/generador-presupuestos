import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Company } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";
import { Button } from "../../../components/Button";
import { SelectInput } from "../../../components/SelectInput";
import { TextInput } from "../../../components/TextInput";
import { provinciasArgentina } from "../../../helpers/fixedData";
import { createCompanySchema, type CreateCompanyFormData } from "../schema";
import { Form } from "../../../components/FormProvider";
import {
  DeleteUserToastError,
  UpdateCompanyToastError,
  UpdateCompanyToastSuccess,
} from "../../../utils/alerts";
import useSweetAlertModal from "../../../common/hooks";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const navigate = useNavigate();
  const { showAlert } = useSweetAlertModal();

  useEffect(() => {
    if (id) {
      const getCompany = async (id: string) => {
        try {
          const { data, error } = await supabase
            .from("companies")
            .select("*")
            .eq("id", id)
            .single();

          if (!error) {
            setCompany(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getCompany(id);
    }
  }, [id]);

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const { direccion, localidad, provincia, email, nombre, telefono } =
      formData;
    try {
      const formattedAddress = `${direccion}, ${localidad}, ${provincia}`;
      const { data, error } = await supabase
        .from("companies")
        .update({
          nombre,
          email,
          telefono,
          direccion: formattedAddress,
        })
        .eq("id", id)
        .select()
        .single();

      if (!error) {
        UpdateCompanyToastSuccess(data?.nombre);
        setTimeout(() => {
          navigate("/companies");
        }, 1000);
      } else {
        UpdateCompanyToastError(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCompany = async (id: string, nombre: string) => {
    try {
      if (id && nombre) {
        const result = await showAlert({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará la empresa ${nombre} y no se puede deshacer`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FF8303",
          cancelButtonColor: "#ff3503",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const { error } = await supabase
            .from("companies")
            .delete()
            .eq("id", id);

          if (!error) {
            await showAlert({
              title: "¡Eliminado!",
              text: `La empresa ${nombre} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
          }
        } else {
          DeleteUserToastError(nombre);
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(nombre);
    }
  };

  const defaultValues: CreateCompanyFormData | undefined = company
    ? (() => {
        const [direccion, localidad, provincia] = company.direccion.split(", ");
        return {
          nombre: company.nombre,
          email: company.email ?? "",
          telefono: company.telefono,
          direccion,
          localidad,
          provincia,
        };
      })()
    : undefined;

  if (!company) return <h2>No se encontró información para esta empresa</h2>;

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createCompanySchema}
      defaultValues={defaultValues}>
      <h2 className="my-4 text-2xl font-medium">{company?.nombre}</h2>
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
        Editar empresa
      </Button>

      <Button
        type="button"
        color="danger"
        children="Eliminar empresa"
        styles="mt-4"
        onClick={() => handleDeleteCompany(company?.id, company?.nombre)}
      />
    </Form>
  );
}
