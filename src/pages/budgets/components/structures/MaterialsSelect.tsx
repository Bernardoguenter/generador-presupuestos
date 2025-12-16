import { useFormContext, useWatch } from "react-hook-form";
import { SelectInput } from "@/components";
import torsionado from "@/assets/images/torsionado.png";
import perfilu from "@/assets/images/perfilu.png";
import almallena from "@/assets/images/almallena.png";

export const MaterialsSelect = () => {
  const { control } = useFormContext();

  const materials = {
    "Hierro torsionado": torsionado,
    "Perfil u Ángulo": perfilu,
    "Alma llena": almallena,
  } as const;

  type MaterialType = keyof typeof materials;
  const selectedMaterial = useWatch({
    control,
    name: "material",
  }) as MaterialType;

  return (
    <div className="flex flex-row items-end gap-2">
      <div className="w-7/8">
        <SelectInput
          name="material"
          label="Material">
          <option value="Hierro torsionado">Hierro Torsionado</option>
          <option value="Perfil u Ángulo">Perfil u Ángulo</option>
          <option value="Alma llena">Alma Llena</option>
        </SelectInput>
      </div>
      <div className="w-1/8 mb-1 bg-white rounded p-1">
        <img
          src={materials[selectedMaterial]}
          alt={materials[selectedMaterial]}
          className=" w-8 h-8"
        />
      </div>
    </div>
  );
};
