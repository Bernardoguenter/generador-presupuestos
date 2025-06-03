import type { ReactNode } from "react";

interface SubmittingOverlayProps {
  isSubmitting: boolean;
  children: ReactNode;
}

const SubmittingOverlay: React.FC<SubmittingOverlayProps> = ({
  isSubmitting,
  children,
}) => {
  if (!isSubmitting) return <>{children}</>;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-75 flex justify-center items-center">
      <div className="text-2xl text-black font-bold">Enviado...</div>
    </div>
  );
};

export default SubmittingOverlay;
