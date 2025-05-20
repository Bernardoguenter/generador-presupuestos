import { useEffect, useState } from "react";
import type { Role } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";
import { SelectInput } from "../../../components/SelectInput";

export const RolesSelect = () => {
  const [roles, setRoles] = useState<Role[] | null>(null);

  useEffect(() => {
    const getRoles = async () => {
      const { data, error } = await supabase.from("roles").select("*");
      if (!error) {
        setRoles(data);
      }
    };
    getRoles();
  }, []);
  return (
    <SelectInput
      name="role"
      label="Selecciona un rol">
      {roles &&
        roles.map((role) => (
          <option
            key={role.id}
            value={role.id}
            title={role.description}>
            {role.label}
          </option>
        ))}
    </SelectInput>
  );
};
