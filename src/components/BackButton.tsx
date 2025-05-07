import { useLocation, useNavigate } from "react-router-dom";
import { BackArrow } from "../assets/svg/BackArrow";

const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getParentPath = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean); // quita vacíos
    if (segments.length === 0) return null;
    segments.pop(); // quita el último segmento
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

export default BackButton;
