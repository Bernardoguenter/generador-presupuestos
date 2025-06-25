import { useEffect, useState } from "react";
import { useCompanyContext } from "../context";
import { retriveFileFromBucket } from "../lib";

export const useLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoAlt, setLogoAlt] = useState<string | undefined>(undefined);
  const { company } = useCompanyContext();

  useEffect(() => {
    const fetchLogo = async () => {
      if (company?.logo_url) {
        const { data } = await retriveFileFromBucket(
          "companies-logos",
          company.logo_url
        );
        if (data) {
          setLogoUrl(data.publicUrl);
          setLogoAlt(company ? company.company_name : "Logo");
        }
      }
    };
    fetchLogo();
  }, [company]);

  return { logoUrl, logoAlt };
};
