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
    const { address, city, province, email, company_name, phone } = formData;
    try {
      const formattedAddress = `${address}, ${city}, ${province}`;
      const dataToUpdate = {
        company_name,
        email,
        phone,
        fullAddress: formattedAddress,
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
    }
  };

  const handleDeleteCompany = async (id: string, company_name: string) => {
    try {
      if (id && company_name) {
        const result = await showAlert({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará la empresa ${company_name} y no se puede deshacer`,
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
              text: `La empresa ${company_name} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
            navigate("/companies");
          }
        } else {
          DeleteUserToastError(company_name);
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(company_name);
    }
  };

  const defaultValues = useMemo<CreateCompanyFormData | undefined>(() => {
    if (!company) return undefined;
    const [address, city, province] = company.fullAddress.split(", ");
    return {
      company_name: company.company_name,
      email: company.email ?? "",
      phone: company.phone,
      address,
      city,
      province,
    };
  }, [company]);

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createCompanySchema}
      defaultValues={defaultValues}>
      <TextInput
        label="Nombre de Empresa"
        name="company_name"
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
        Editar empresa
      </Button>

      <Button
        type="button"
        color="danger"
        children="Eliminar empresa"
        styles="mt-4"
        onClick={() => handleDeleteCompany(company?.id, company?.company_name)}
      />
    </Form>
  );
}
