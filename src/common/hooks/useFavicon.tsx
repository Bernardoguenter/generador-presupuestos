import { useEffect } from "react";
import { getMimeTypeFromUrl } from "../../helpers/formatData";
import { useLogo } from "./useLogo";

export function useFavicon() {
  const { logoUrl } = useLogo();

  useEffect(() => {
    if (!logoUrl) return;

    const mimeType = getMimeTypeFromUrl(logoUrl);

    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");

    link.type = mimeType;
    link.rel = "shortcut icon";
    link.href = logoUrl;

    const head = document.getElementsByTagName("head")[0];
    const existingIcons = head.querySelectorAll("link[rel*='icon']");
    existingIcons.forEach((el) => head.removeChild(el));

    head.appendChild(link);
  }, [logoUrl]);
}
