import { useLocation, useNavigate } from "react-router-dom";
import { BackArrow } from "../assets/svg";

export const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getParentPath = (pathname: string) => {
    if (
      pathname.includes("/budgets/structure") ||
      pathname.includes("/budgets/silo")
    ) {
      return "/budgets";
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    segments.pop();
    return "/" + segments.join("/");
  };

  const parentPath = getParentPath(location.pathname);

  const handleClick = () => {
    if (parentPath !== null) {
      navigate(parentPath);
    }
  };

  return parentPath ? (
    <button
      onClick={handleClick}
      className="p-1 flex gap-1 items-center bg-amber-600 rounded justify-center">
      <BackArrow />
      <span>Volver</span>
    </button>
  ) : null;
};
