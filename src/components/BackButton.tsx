import { useNavigate } from "react-router-dom";
import { BackArrow } from "@/assets/svg";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-1 flex gap-1 items-center bg-amber-600 rounded justify-center">
      <BackArrow />
      <span>Volver</span>
    </button>
  );
};
