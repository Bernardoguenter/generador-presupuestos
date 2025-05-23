import { useNavigate } from "react-router";
import type { Company } from "../../../helpers/types";
import { provinciasArgentina } from "../../../helpers/fixedData";
import { createCompanySchema, type CreateCompanyFormData } from "../schema";
import { Button, TextInput, Form, SelectInput } from "../../../components";
import {
  DeleteUserToastError,
  UpdateCompanyToastError,
  UpdateCompanyToastSuccess,
} from "../../../utils/alerts";
import useSweetAlertModal from "../../../common/hooks";
import {
  deleteCompany,
  deleteFileInBucket,
  updateCompany,
} from "../../../common/lib";
import { useMemo } from "react";

interface Props {
  company: Company;
}

export default function CompanyDetailForm({ company }: Props) {
  const navigate = useNavigate();
  const { showAlert } = useSweetAlertModal();

  const handleSubmit = async (formData: CreateCompanyFormData) => {
    const { direccion, localidad, provincia, email, nombre, telefono } =
      formData;
    try {
      const formattedAddress = `${direccion}, ${localidad}, ${provincia}`;
      const dataToUpdate = {
        nombre,
        email,
        telefono,
        direccion: formattedAddress,
      };
      const { data, error } = await updateCompany(dataToUpdate, company.id);

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
          const { error } = await deleteCompany(id);

          if (!error) {
            if (company?.logo_url !== null && company?.logo_url !== undefined) {
              const { error: bucketError } = await deleteFileInBucket(
                "companies-logos",
                company?.logo_url
              );
              if (error) {
                console.error(bucketError);
              }
            }
            await showAlert({
              title: "¡Eliminado!",
              text: `La empresa ${nombre} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
            navigate("/companies");
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

  const defaultValues = useMemo<CreateCompanyFormData | undefined>(() => {
    if (!company) return undefined;
    const [direccion, localidad, provincia] = company.direccion.split(", ");
    return {
      nombre: company.nombre,
      email: company.email ?? "",
      telefono: company.telefono,
      direccion,
      localidad,
      provincia,
    };
  }, [company]);

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createCompanySchema}
      defaultValues={defaultValues}>
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
