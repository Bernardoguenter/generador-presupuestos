import { useEffect, useState } from "react";
import { useCompanyContext } from "../common/context";
import { retriveFileFromBucket } from "../common/lib";

interface LogoProps {
  containerStyles: string;
  logoStyles: string;
}

export const Logo = ({ containerStyles, logoStyles }: LogoProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { company } = useCompanyContext();

  useEffect(() => {
    const fetchLogo = async () => {
      if (company && company.logo_url) {
        const { data } = await retriveFileFromBucket(
          "companies-logos",
          company.logo_url
        );
        if (data) setLogoUrl(data.publicUrl);
      }
    };
    fetchLogo();
  }, [company]);

  return (
    <>
      {logoUrl ? (
        <div className={containerStyles}>
          <img
            className={logoStyles}
            src={logoUrl}
            alt={company ? company.company_name : "Logo"}
          />
        </div>
      ) : (
        <h1>{company?.company_name}</h1>
      )}
    </>
  );
};
