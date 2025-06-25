import type { ReactNode } from "react";

interface SubmittingOverlayProps {
  isSubmitting: boolean;
  children: ReactNode;
}

export const SubmittingOverlay = ({
  isSubmitting,
  children,
}: SubmittingOverlayProps) => {
  if (!isSubmitting) return <>{children}</>;

  return (
    <div className="w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 flex justify-center items-center">
        <span className="sending"></span>
      </div>
      {children}
    </div>
  );
};
