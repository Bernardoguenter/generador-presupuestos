import { useEffect, useState } from "react";
import type { Role } from "../../../helpers/types";
import { SelectInput } from "../../../components";
import { getUserRoles } from "../../../common/lib";

export const RolesSelect = () => {
  const [roles, setRoles] = useState<Role[] | null>(null);

  useEffect(() => {
    const getRoles = async () => {
      const { data, error } = await getUserRoles();
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
            title={role.description}
            defaultChecked={role.id === "usuario"}>
            {role.label}
          </option>
        ))}
    </SelectInput>
  );
};
