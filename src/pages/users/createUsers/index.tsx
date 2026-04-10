import { Button, Form, SubmittingOverlay, TextInput } from "@/components";
import { createUserSchema } from "../schema";
import { RolesSelect } from "../components/RolesSelect";
import { CompanySelect } from "../components/CompanySelect";
import { useCreateUserForm } from "../hooks";

export default function CreateUsers() {
  const { handleSubmit, isSubmitting, defaultValues } = useCreateUserForm();

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={createUserSchema}
        defaultValues={defaultValues}>
        <h2 className="my-4 text-2xl font-medium">Crea un nuevo usuario</h2>
        <TextInput
          label="Nombre completo"
          name="fullName"
          type="text"
        />
        <TextInput
          label="E-mail"
          name="email"
          type="email"
        />
        <RolesSelect />
        <CompanySelect />
        <div className="w-full flex flex-col items-center justify-center">
          <Button
            type="submit"
            color="info"
            children={isSubmitting ? "Creando Usuario..." : "Crear Usuario"}
            styles="mt-4"
            disabled={isSubmitting}
          />
        </div>
      </Form>
    </SubmittingOverlay>
  );
}
