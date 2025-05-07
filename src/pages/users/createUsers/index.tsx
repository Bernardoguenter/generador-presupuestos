import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { TextInput } from "../../../components/TextInput";
import { supabase } from "../../../utils/supabase";
import { createUserSchema, type CreateUserFormData } from "../schema";

export default function CreateUsers() {
  const handleSubmit = async (formData: CreateUserFormData) => {
    console.log(formData);
    try {
      if (formData) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: "unpassword",
        });

        console.log(data, error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createUserSchema}>
      <TextInput
        label="E-mail"
        name="email"
        type="email"
      />
      <Button
        type="submit"
        color="info"
        children="Crear Usuario"
      />
    </Form>
  );
}
