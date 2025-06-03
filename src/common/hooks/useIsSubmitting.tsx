import { useState } from "react";

export const useIsSubmitting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return { isSubmitting, setIsSubmitting };
};
