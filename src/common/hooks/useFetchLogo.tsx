import { useEffect, useState } from "react";
import { retriveFileFromBucket } from "@/common/lib";
import type { Company } from "@/helpers/types";

interface Props {
  company: Company;
}

export const useFetchLogo = ({ company }: Props) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      if (company.logo_url) {
        const { data } = await retriveFileFromBucket(
          "companies-logos",
          company.logo_url
        );
        if (data) setLogoUrl(data.publicUrl);
      }
    };
    fetchLogo();
  }, [company.logo_url]);

  return logoUrl;
};
