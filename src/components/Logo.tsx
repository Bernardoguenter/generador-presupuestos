import { useLogo } from "@/pages/companies/hooks";

interface LogoProps {
  containerStyles: string;
  logoStyles: string;
}

export const Logo = ({ containerStyles, logoStyles }: LogoProps) => {
  const { logoUrl, logoAlt } = useLogo();

  return (
    <>
      {logoUrl ? (
        <div className={containerStyles}>
          <img
            className={logoStyles}
            src={logoUrl}
            alt={logoAlt}
            crossOrigin="anonymous"
          />
        </div>
      ) : (
        <h1>{logoAlt}</h1>
      )}
    </>
  );
};
